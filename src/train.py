import argparse
from pathlib import Path

import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from tqdm import tqdm

from .dataset import load_waterbirds_dataset, make_torch_dataset
from .evaluate import collect_predictions, compute_metrics
from .model import build_model
from .utils import ensure_dirs, get_device, load_config, set_seed


def train_one_epoch(model, loader, criterion, optimizer, device):
    model.train()
    total_loss = 0.0
    total = 0
    correct = 0
    for batch in tqdm(loader, desc="Training"):
        images = batch["image"].to(device)
        labels = batch["label"].to(device)
        optimizer.zero_grad(set_to_none=True)
        logits = model(images)
        loss = criterion(logits, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item() * images.size(0)
        total += images.size(0)
        correct += (logits.argmax(1) == labels).sum().item()
    return total_loss / total, correct / total


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="config.yaml")
    args = parser.parse_args()

    cfg = load_config(args.config)
    set_seed(cfg["project"].get("seed", 42))
    out_dir = cfg["project"].get("output_dir", "outputs")
    ensure_dirs(out_dir)
    device = get_device()
    print(f"Using device: {device}")

    ds = load_waterbirds_dataset(cfg["data"]["hf_dataset"])
    train_ds = make_torch_dataset(ds["train"], cfg["data"]["image_size"], train=True)
    val_ds = make_torch_dataset(ds["validation"], cfg["data"]["image_size"], train=False)

    train_loader = DataLoader(
        train_ds,
        batch_size=cfg["training"]["batch_size"],
        shuffle=True,
        num_workers=cfg["data"].get("num_workers", 2),
        pin_memory=torch.cuda.is_available(),
    )
    val_loader = DataLoader(
        val_ds,
        batch_size=cfg["evaluation"]["batch_size"],
        shuffle=False,
        num_workers=cfg["data"].get("num_workers", 2),
        pin_memory=torch.cuda.is_available(),
    )

    model = build_model(cfg["model"]["architecture"], cfg["model"].get("pretrained", True), cfg["model"]["num_classes"])
    model.to(device)

    criterion = nn.CrossEntropyLoss()
    if cfg["training"].get("optimizer", "adam").lower() == "sgd":
        optimizer = torch.optim.SGD(model.parameters(), lr=cfg["training"]["lr"], momentum=0.9, weight_decay=cfg["training"].get("weight_decay", 0.0))
    else:
        optimizer = torch.optim.Adam(model.parameters(), lr=cfg["training"]["lr"], weight_decay=cfg["training"].get("weight_decay", 0.0))

    history = []
    best_score = -1.0
    ckpt_path = Path(out_dir, "checkpoints", "best_model.pt")
    last_path = Path(out_dir, "checkpoints", "last_model.pt")

    for epoch in range(1, cfg["training"]["epochs"] + 1):
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, device)
        val_df = collect_predictions(model, val_loader, device)
        val_metrics = compute_metrics(val_df)
        val_acc = val_metrics["overall_accuracy"]
        val_worst = val_metrics["worst_group_accuracy"]
        save_by = cfg["training"].get("save_best_by", "val_worst_group_acc")
        score = val_worst if save_by == "val_worst_group_acc" else val_acc

        row = {
            "epoch": epoch,
            "train_loss": train_loss,
            "train_acc": train_acc,
            "val_acc": val_acc,
            "val_worst_group_acc": val_worst,
        }
        for group_name, values in val_metrics["subgroup_metrics"].items():
            row[f"val_acc_{group_name}"] = values["accuracy"]
        history.append(row)
        print(row)

        state = {
            "epoch": epoch,
            "model_state_dict": model.state_dict(),
            "optimizer_state_dict": optimizer.state_dict(),
            "config": cfg,
            "val_metrics": val_metrics,
        }
        torch.save(state, last_path)
        if score > best_score:
            best_score = score
            torch.save(state, ckpt_path)
            print(f"Saved best model to {ckpt_path} with score={best_score:.4f}")

    hist_df = pd.DataFrame(history)
    hist_path = Path(out_dir, "metrics", "train_history.csv")
    hist_df.to_csv(hist_path, index=False)
    print(f"Training complete. History saved to {hist_path}")


if __name__ == "__main__":
    main()
