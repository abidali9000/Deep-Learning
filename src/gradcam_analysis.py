import argparse
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Optional

import cv2
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from torch.utils.data import DataLoader
from tqdm import tqdm

from .dataset import load_waterbirds_dataset, make_torch_dataset
from .model import build_model
from .utils import GROUP_NAMES, LABEL_NAMES, denormalize_tensor, ensure_dirs, get_device, load_checkpoint, load_config, set_seed


def center_mask(h: int, w: int, ratio: float = 0.6) -> np.ndarray:
    mask = np.zeros((h, w), dtype=np.uint8)
    box_h, box_w = int(h * ratio), int(w * ratio)
    y1 = (h - box_h) // 2
    x1 = (w - box_w) // 2
    mask[y1:y1 + box_h, x1:x1 + box_w] = 1
    return mask


def saliency_ratios(cam_map: np.ndarray, ratio: float = 0.6) -> Dict[str, float]:
    cam_map = np.maximum(cam_map, 0)
    total = float(cam_map.sum()) + 1e-8
    mask = center_mask(cam_map.shape[0], cam_map.shape[1], ratio)
    fg = float(cam_map[mask == 1].sum()) / total
    bg = float(cam_map[mask == 0].sum()) / total
    return {"foreground_ratio": fg, "background_ratio": bg, "attention_bias_score": bg}


def draw_center_box(rgb: np.ndarray, ratio: float = 0.6) -> np.ndarray:
    out = (rgb * 255).astype(np.uint8).copy()
    h, w = out.shape[:2]
    box_h, box_w = int(h * ratio), int(w * ratio)
    y1 = (h - box_h) // 2
    x1 = (w - box_w) // 2
    cv2.rectangle(out, (x1, y1), (x1 + box_w, y1 + box_h), (255, 255, 255), 2)
    return out


def make_visualization(rgb: np.ndarray, cam_map: np.ndarray, title: str, out_path: str, ratio: float = 0.6) -> None:
    overlay = show_cam_on_image(rgb, cam_map, use_rgb=True)
    boxed = draw_center_box(rgb, ratio)
    fig, axes = plt.subplots(1, 3, figsize=(12, 4))
    axes[0].imshow(rgb)
    axes[0].set_title("Original")
    axes[1].imshow(overlay)
    axes[1].set_title("Grad-CAM")
    axes[2].imshow(boxed)
    axes[2].set_title("Center foreground heuristic")
    for ax in axes:
        ax.axis("off")
    fig.suptitle(title, fontsize=10)
    fig.tight_layout()
    fig.savefig(out_path, dpi=160)
    plt.close(fig)


def choose_indices_by_group(dataset, max_per_group: int) -> List[int]:
    counts = defaultdict(int)
    selected = []
    for i in range(len(dataset)):
        item = dataset[i]
        gid = int(item["group"])
        if counts[gid] < max_per_group:
            selected.append(i)
            counts[gid] += 1
        if all(counts[g] >= max_per_group for g in GROUP_NAMES):
            break
    return selected


def run_gradcam(config_path: str, checkpoint: str) -> pd.DataFrame:
    cfg = load_config(config_path)
    set_seed(cfg["project"].get("seed", 42))
    out_dir = cfg["project"].get("output_dir", "outputs")
    ensure_dirs(out_dir)
    device = get_device()

    ds = load_waterbirds_dataset(cfg["data"]["hf_dataset"])
    split = cfg["gradcam"].get("split", "test")
    torch_ds = make_torch_dataset(ds[split], cfg["data"]["image_size"], train=False)

    model = build_model(cfg["model"]["architecture"], cfg["model"].get("pretrained", True), cfg["model"]["num_classes"])
    model.to(device)
    load_checkpoint(checkpoint, model, device)
    model.eval()

    target_layers = [model.layer4[-1]]
    max_per_group = int(cfg["gradcam"].get("max_per_group", 30))
    fg_ratio = float(cfg["gradcam"].get("foreground_ratio", 0.6))
    target_mode = cfg["gradcam"].get("target", "predicted")
    indices = choose_indices_by_group(torch_ds, max_per_group)

    rows = []
    gradcam_dir = Path(out_dir, "gradcam")
    gradcam_dir.mkdir(parents=True, exist_ok=True)

    with GradCAM(model=model, target_layers=target_layers) as cam:
        for local_i in tqdm(indices, desc="Grad-CAM"):
            item = torch_ds[local_i]
            input_tensor = item["image"].unsqueeze(0).to(device)
            with torch.no_grad():
                logits = model(input_tensor)
                probs = torch.softmax(logits, dim=1)
                pred = int(probs.argmax(dim=1).item())
                conf = float(probs.max(dim=1).values.item())
            true = int(item["label"])
            target_class = true if target_mode == "true" else pred
            targets = [ClassifierOutputTarget(target_class)]
            grayscale_cam = cam(input_tensor=input_tensor, targets=targets)[0]
            rgb = denormalize_tensor(item["image"])
            ratios = saliency_ratios(grayscale_cam, fg_ratio)
            gid = int(item["group"])
            filename = f"idx{local_i}_group-{GROUP_NAMES[gid]}_true-{LABEL_NAMES[true]}_pred-{LABEL_NAMES[pred]}.png"
            title = f"idx={local_i} | group={GROUP_NAMES[gid]} | true={LABEL_NAMES[true]} | pred={LABEL_NAMES[pred]} | conf={conf:.3f}"
            make_visualization(rgb, grayscale_cam, title, str(gradcam_dir / filename), fg_ratio)
            rows.append({
                "idx": local_i,
                "true_label": true,
                "pred_label": pred,
                "confidence": conf,
                "place": int(item["place"]),
                "group": gid,
                "group_name": GROUP_NAMES[gid],
                "correct": int(true == pred),
                "target_for_cam": target_class,
                "image_file": filename,
                **ratios,
            })

    df = pd.DataFrame(rows)
    csv_path = gradcam_dir / "gradcam_results.csv"
    df.to_csv(csv_path, index=False)

    summary = df.groupby("group_name")[["foreground_ratio", "background_ratio", "attention_bias_score", "correct"]].mean().reset_index()
    summary.to_csv(gradcam_dir / "gradcam_group_summary.csv", index=False)
    print(f"Saved Grad-CAM results to {csv_path}")
    return df


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="config.yaml")
    parser.add_argument("--checkpoint", default="outputs/checkpoints/best_model.pt")
    args = parser.parse_args()
    run_gradcam(args.config, args.checkpoint)


if __name__ == "__main__":
    main()
