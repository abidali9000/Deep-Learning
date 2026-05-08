import argparse
from pathlib import Path
from typing import Dict, List

import cv2
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from torch.utils.data import Subset
from tqdm import tqdm

from .dataset import load_waterbirds_dataset, make_torch_dataset
from .gradcam_analysis import center_mask, saliency_ratios
from .model import build_model
from .utils import GROUP_NAMES, denormalize_tensor, ensure_dirs, get_device, load_checkpoint, load_config, set_seed


def normalize_np_to_tensor(rgb: np.ndarray, device=None) -> torch.Tensor:
    mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
    std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
    x = torch.tensor(rgb).permute(2, 0, 1).float()
    x = (x - mean) / std
    if device is not None:
        x = x.to(device)
    return x


def apply_intervention(rgb: np.ndarray, kind: str, ratio: float = 0.6, blur_kernel: int = 31) -> np.ndarray:
    """rgb is HWC float in [0,1]."""
    h, w = rgb.shape[:2]
    mask = center_mask(h, w, ratio).astype(bool)
    out = rgb.copy()

    if kind == "original":
        return out

    if kind == "background_blur":
        k = blur_kernel if blur_kernel % 2 == 1 else blur_kernel + 1
        blurred = cv2.GaussianBlur((rgb * 255).astype(np.uint8), (k, k), 0).astype(np.float32) / 255.0
        out[~mask] = blurred[~mask]
        return out

    if kind == "background_mask":
        out[~mask] = 0.5
        return out

    if kind == "foreground_mask":
        out[mask] = 0.5
        return out

    if kind == "background_patch_shuffle":
        patch = 16
        img = out.copy()
        patches = []
        coords = []
        for y in range(0, h - patch + 1, patch):
            for x in range(0, w - patch + 1, patch):
                patch_mask = mask[y:y+patch, x:x+patch]
                if patch_mask.mean() < 0.25:  # mostly background
                    patches.append(img[y:y+patch, x:x+patch].copy())
                    coords.append((y, x))
        if len(patches) > 1:
            perm = np.random.permutation(len(patches))
            for dst_i, src_i in enumerate(perm):
                y, x = coords[dst_i]
                img[y:y+patch, x:x+patch] = patches[src_i]
        return img

    raise ValueError(f"Unknown intervention kind: {kind}")


def run_interventions(config_path: str, checkpoint: str, max_samples: int = 1000) -> pd.DataFrame:
    cfg = load_config(config_path)
    set_seed(cfg["project"].get("seed", 42))
    out_dir = cfg["project"].get("output_dir", "outputs")
    ensure_dirs(out_dir)
    device = get_device()

    ds = load_waterbirds_dataset(cfg["data"]["hf_dataset"])
    split = cfg["interventions"].get("split", "test")
    torch_ds = make_torch_dataset(ds[split], cfg["data"]["image_size"], train=False)

    n = len(torch_ds) if max_samples is None or max_samples <= 0 else min(max_samples, len(torch_ds))
    indices = list(range(n))

    model = build_model(cfg["model"]["architecture"], cfg["model"].get("pretrained", True), cfg["model"]["num_classes"])
    model.to(device)
    load_checkpoint(checkpoint, model, device)
    model.eval()
    target_layers = [model.layer4[-1]]

    ratio = float(cfg["interventions"].get("foreground_ratio", 0.6))
    blur_kernel = int(cfg["interventions"].get("blur_kernel", 31))
    kinds = ["original", "background_blur", "background_mask", "foreground_mask", "background_patch_shuffle"]
    rows: List[Dict] = []
    original_preds: Dict[int, int] = {}
    original_conf: Dict[int, float] = {}

    with GradCAM(model=model, target_layers=target_layers) as cam:
        for idx in tqdm(indices, desc="Interventions"):
            item = torch_ds[idx]
            rgb = denormalize_tensor(item["image"])
            true = int(item["label"])
            gid = int(item["group"])
            for kind in kinds:
                modified_rgb = apply_intervention(rgb, kind, ratio=ratio, blur_kernel=blur_kernel)
                input_tensor = normalize_np_to_tensor(modified_rgb, device=device).unsqueeze(0)
                with torch.no_grad():
                    logits = model(input_tensor)
                    probs = torch.softmax(logits, dim=1)
                    pred = int(probs.argmax(dim=1).item())
                    conf = float(probs.max(dim=1).values.item())
                    true_conf = float(probs[0, true].item())
                targets = [ClassifierOutputTarget(pred)]
                cam_map = cam(input_tensor=input_tensor, targets=targets)[0]
                ratios = saliency_ratios(cam_map, ratio)

                if kind == "original":
                    original_preds[idx] = pred
                    original_conf[idx] = conf
                    flip = 0
                    conf_drop = 0.0
                else:
                    flip = int(pred != original_preds[idx])
                    conf_drop = float(original_conf[idx] - conf)

                rows.append({
                    "idx": idx,
                    "condition": kind,
                    "true_label": true,
                    "pred_label": pred,
                    "confidence": conf,
                    "true_class_confidence": true_conf,
                    "confidence_drop_from_original": conf_drop,
                    "prediction_flip_from_original": flip,
                    "place": int(item["place"]),
                    "group": gid,
                    "group_name": GROUP_NAMES[gid],
                    "correct": int(pred == true),
                    **ratios,
                })

    df = pd.DataFrame(rows)
    out_path = Path(out_dir, "interventions", "intervention_predictions.csv")
    df.to_csv(out_path, index=False)

    metrics = df.groupby(["condition", "group_name"]).agg(
        count=("correct", "count"),
        accuracy=("correct", "mean"),
        avg_confidence=("confidence", "mean"),
        avg_true_class_confidence=("true_class_confidence", "mean"),
        prediction_flip_rate=("prediction_flip_from_original", "mean"),
        avg_confidence_drop=("confidence_drop_from_original", "mean"),
        avg_foreground_ratio=("foreground_ratio", "mean"),
        avg_background_ratio=("background_ratio", "mean"),
        avg_attention_bias_score=("attention_bias_score", "mean"),
    ).reset_index()
    metrics_path = Path(out_dir, "interventions", "intervention_metrics.csv")
    metrics.to_csv(metrics_path, index=False)

    overall = df.groupby("condition").agg(
        accuracy=("correct", "mean"),
        prediction_flip_rate=("prediction_flip_from_original", "mean"),
        avg_background_ratio=("background_ratio", "mean"),
    ).reset_index()
    overall.to_csv(Path(out_dir, "interventions", "intervention_overall_metrics.csv"), index=False)

    plot_intervention_figures(overall, out_dir)
    print(f"Saved intervention predictions to {out_path}")
    print(f"Saved intervention metrics to {metrics_path}")
    return df


def plot_intervention_figures(overall: pd.DataFrame, out_dir: str) -> None:
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(overall["condition"], overall["accuracy"])
    ax.set_ylim(0, 1)
    ax.set_ylabel("Accuracy")
    ax.set_title("Accuracy by intervention")
    ax.tick_params(axis="x", rotation=30)
    fig.tight_layout()
    fig.savefig(Path(out_dir, "figures", "intervention_accuracy.png"), dpi=160)
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(overall["condition"], overall["avg_background_ratio"])
    ax.set_ylim(0, 1)
    ax.set_ylabel("Avg background saliency ratio")
    ax.set_title("Background saliency by intervention")
    ax.tick_params(axis="x", rotation=30)
    fig.tight_layout()
    fig.savefig(Path(out_dir, "figures", "intervention_background_saliency.png"), dpi=160)
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="config.yaml")
    parser.add_argument("--checkpoint", default="outputs/checkpoints/best_model.pt")
    parser.add_argument("--max-samples", type=int, default=1000, help="0 means full split")
    args = parser.parse_args()
    run_interventions(args.config, args.checkpoint, args.max_samples)


if __name__ == "__main__":
    main()
