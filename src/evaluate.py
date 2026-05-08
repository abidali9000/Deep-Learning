import argparse
from pathlib import Path
from typing import Dict, List, Tuple

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score
from torch.utils.data import DataLoader
from tqdm import tqdm

from .dataset import load_waterbirds_dataset, make_torch_dataset
from .model import build_model
from .utils import GROUP_NAMES, LABEL_NAMES, ensure_dirs, get_device, load_checkpoint, load_config, save_json, set_seed


@torch.no_grad()
def collect_predictions(model, loader, device) -> pd.DataFrame:
    model.eval()
    rows: List[Dict] = []
    for batch in tqdm(loader, desc="Evaluating"):
        images = batch["image"].to(device)
        labels = batch["label"].to(device)
        logits = model(images)
        probs = torch.softmax(logits, dim=1)
        preds = probs.argmax(dim=1)
        confs = probs.max(dim=1).values

        for i in range(images.size(0)):
            rows.append({
                "idx": int(batch["idx"][i]),
                "true_label": int(labels[i].cpu()),
                "pred_label": int(preds[i].cpu()),
                "confidence": float(confs[i].cpu()),
                "place": int(batch["place"][i]),
                "group": int(batch["group"][i]),
                "group_name": GROUP_NAMES[int(batch["group"][i])],
                "correct": int(preds[i].cpu() == labels[i].cpu()),
            })
    return pd.DataFrame(rows)


def compute_metrics(df: pd.DataFrame) -> Dict:
    y_true = df["true_label"].values
    y_pred = df["pred_label"].values
    metrics = {
        "overall_accuracy": float(accuracy_score(y_true, y_pred)),
        "precision_macro": float(precision_score(y_true, y_pred, average="macro", zero_division=0)),
        "recall_macro": float(recall_score(y_true, y_pred, average="macro", zero_division=0)),
        "f1_macro": float(f1_score(y_true, y_pred, average="macro", zero_division=0)),
        "confusion_matrix": confusion_matrix(y_true, y_pred, labels=[0, 1]).tolist(),
        "label_names": LABEL_NAMES,
    }

    subgroup = {}
    for gid, name in GROUP_NAMES.items():
        sub = df[df["group"] == gid]
        subgroup[name] = {
            "count": int(len(sub)),
            "accuracy": float(sub["correct"].mean()) if len(sub) else None,
            "avg_confidence": float(sub["confidence"].mean()) if len(sub) else None,
        }
    metrics["subgroup_metrics"] = subgroup
    valid_accs = [v["accuracy"] for v in subgroup.values() if v["accuracy"] is not None]
    metrics["worst_group_accuracy"] = float(min(valid_accs)) if valid_accs else None
    return metrics


def save_confusion_matrix(df: pd.DataFrame, out_path: str) -> None:
    cm = confusion_matrix(df["true_label"], df["pred_label"], labels=[0, 1])
    fig, ax = plt.subplots(figsize=(5, 4))
    im = ax.imshow(cm)
    ax.set_xticks([0, 1], [LABEL_NAMES[0], LABEL_NAMES[1]])
    ax.set_yticks([0, 1], [LABEL_NAMES[0], LABEL_NAMES[1]])
    ax.set_xlabel("Predicted")
    ax.set_ylabel("True")
    ax.set_title("Confusion Matrix")
    for i in range(2):
        for j in range(2):
            ax.text(j, i, str(cm[i, j]), ha="center", va="center")
    fig.colorbar(im, ax=ax)
    fig.tight_layout()
    fig.savefig(out_path, dpi=160)
    plt.close(fig)


def evaluate_from_config(config_path: str, checkpoint: str, split: str = "test") -> Tuple[pd.DataFrame, Dict]:
    cfg = load_config(config_path)
    set_seed(cfg["project"].get("seed", 42))
    out_dir = cfg["project"].get("output_dir", "outputs")
    ensure_dirs(out_dir)

    device = get_device()
    ds = load_waterbirds_dataset(cfg["data"]["hf_dataset"])
    torch_ds = make_torch_dataset(ds[split], cfg["data"]["image_size"], train=False)
    loader = DataLoader(
        torch_ds,
        batch_size=cfg["evaluation"]["batch_size"],
        shuffle=False,
        num_workers=cfg["data"].get("num_workers", 2),
    )

    model = build_model(cfg["model"]["architecture"], cfg["model"].get("pretrained", True), cfg["model"]["num_classes"])
    model.to(device)
    load_checkpoint(checkpoint, model, device)

    df = collect_predictions(model, loader, device)
    metrics = compute_metrics(df)

    pred_path = Path(out_dir, "metrics", f"{split}_predictions.csv")
    metrics_path = Path(out_dir, "metrics", f"{split}_metrics.json")
    cm_path = Path(out_dir, "figures", f"{split}_confusion_matrix.png")
    df.to_csv(pred_path, index=False)
    save_json(metrics, str(metrics_path))
    save_confusion_matrix(df, str(cm_path))
    print(f"Saved predictions to {pred_path}")
    print(f"Saved metrics to {metrics_path}")
    print(metrics)
    return df, metrics


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="config.yaml")
    parser.add_argument("--checkpoint", default="outputs/checkpoints/best_model.pt")
    parser.add_argument("--split", default="test", choices=["train", "validation", "test"])
    args = parser.parse_args()
    evaluate_from_config(args.config, args.checkpoint, args.split)


if __name__ == "__main__":
    main()
