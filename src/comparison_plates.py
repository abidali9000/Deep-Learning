"""Generate side-by-side Grad-CAM comparison plates for each intervention.

For a curated set of test images, produces one PNG per sample with five panels:
original | background blur | background mask | background patch shuffle | foreground mask
Each panel shows the Grad-CAM overlay for the model's predicted class under
that condition, with the predicted label and confidence in the panel title.

Run after training:
    python -m src.comparison_plates --config config.yaml \
        --checkpoint outputs/checkpoints/best_model.pt \
        --out outputs/comparisons --indices 20,24,102,105,10,101

The output PNGs can be copied into website/public/comparisons/ for display
in the website's interventions page.
"""
import argparse
from pathlib import Path
from typing import List

import matplotlib.pyplot as plt
import numpy as np
import torch
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from tqdm import tqdm

from .dataset import load_waterbirds_dataset, make_torch_dataset
from .gradcam_analysis import saliency_ratios
from .interventions import apply_intervention, normalize_np_to_tensor
from .model import build_model
from .utils import (
    GROUP_NAMES,
    LABEL_NAMES,
    denormalize_tensor,
    ensure_dirs,
    get_device,
    load_checkpoint,
    load_config,
    set_seed,
)


def plate(
    rgb: np.ndarray,
    cam_map: np.ndarray,
    title: str,
    ax,
):
    overlay = show_cam_on_image(rgb, cam_map, use_rgb=True)
    ax.imshow(overlay)
    ax.set_title(title, fontsize=9)
    ax.axis("off")


def make_plate(
    rgbs: List[np.ndarray],
    cams: List[np.ndarray],
    titles: List[str],
    out_path: Path,
    suptitle: str,
) -> None:
    n = len(rgbs)
    fig, axes = plt.subplots(1, n, figsize=(3.4 * n, 3.6))
    if n == 1:
        axes = [axes]
    for i in range(n):
        plate(rgbs[i], cams[i], titles[i], axes[i])
    fig.suptitle(suptitle, fontsize=11)
    fig.tight_layout()
    fig.savefig(out_path, dpi=160, bbox_inches="tight")
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="config.yaml")
    parser.add_argument(
        "--checkpoint", default="outputs/checkpoints/best_model.pt"
    )
    parser.add_argument(
        "--out", default="outputs/comparisons", help="Output directory"
    )
    parser.add_argument(
        "--indices",
        default="20,24,102,105,10,101,0,100",
        help="Comma-separated test indices to render",
    )
    parser.add_argument(
        "--split",
        default="test",
        choices=["train", "validation", "test"],
    )
    args = parser.parse_args()

    cfg = load_config(args.config)
    set_seed(cfg["project"].get("seed", 42))
    device = get_device()
    ensure_dirs(cfg["project"].get("output_dir", "outputs"))
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    ds = load_waterbirds_dataset(cfg["data"]["hf_dataset"])
    torch_ds = make_torch_dataset(ds[args.split], cfg["data"]["image_size"], train=False)

    model = build_model(
        cfg["model"]["architecture"],
        cfg["model"].get("pretrained", True),
        cfg["model"]["num_classes"],
    )
    model.to(device)
    load_checkpoint(args.checkpoint, model, device)
    model.eval()
    target_layers = [model.layer4[-1]]

    ratio = float(cfg["interventions"].get("foreground_ratio", 0.6))
    blur_kernel = int(cfg["interventions"].get("blur_kernel", 31))
    kinds = [
        "original",
        "background_blur",
        "background_mask",
        "background_patch_shuffle",
        "foreground_mask",
    ]

    indices = [int(x) for x in args.indices.split(",") if x.strip()]
    with GradCAM(model=model, target_layers=target_layers) as cam:
        for idx in tqdm(indices, desc="Comparison plates"):
            item = torch_ds[idx]
            rgb = denormalize_tensor(item["image"])
            true = int(item["label"])
            gid = int(item["group"])

            rgbs = []
            cams = []
            titles = []
            for kind in kinds:
                modified_rgb = apply_intervention(
                    rgb, kind, ratio=ratio, blur_kernel=blur_kernel
                )
                inp = normalize_np_to_tensor(modified_rgb, device=device).unsqueeze(0)
                with torch.no_grad():
                    logits = model(inp)
                    probs = torch.softmax(logits, dim=1)
                    pred = int(probs.argmax(dim=1).item())
                    conf = float(probs.max(dim=1).values.item())
                targets = [ClassifierOutputTarget(pred)]
                cam_map = cam(input_tensor=inp, targets=targets)[0]
                ratios = saliency_ratios(cam_map, ratio)
                rgbs.append(modified_rgb)
                cams.append(cam_map)
                titles.append(
                    f"{kind}\npred={LABEL_NAMES[pred]} ({conf:.2f}) "
                    f"· bg={ratios['background_ratio']:.2f}"
                )

            suptitle = (
                f"idx={idx} · group={GROUP_NAMES[gid]} · true={LABEL_NAMES[true]}"
            )
            out_path = out_dir / f"comparison_idx{idx}_group-{GROUP_NAMES[gid]}.png"
            make_plate(rgbs, cams, titles, out_path, suptitle)

    print(f"Saved {len(indices)} comparison plates to {out_dir}")


if __name__ == "__main__":
    main()
