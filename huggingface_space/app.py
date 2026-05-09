"""Gradio demo for the Waterbirds shortcut-learning model.

Loads outputs/checkpoints/best_model.pt (uploaded alongside this app via
git-lfs) and runs:
  - prediction (landbird vs. waterbird) with confidence
  - Grad-CAM overlay for the predicted class
  - 60% center-crop foreground heuristic (white box)
  - foreground / background saliency split
"""
from __future__ import annotations

from pathlib import Path
from typing import Tuple

import cv2
import gradio as gr
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from torchvision import models, transforms

LABEL_NAMES = {0: "landbird", 1: "waterbird"}
IMAGE_SIZE = 224
FOREGROUND_RATIO = 0.60
CKPT_PATH = Path("best_model.pt")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def build_resnet18(num_classes: int = 2) -> nn.Module:
    weights = models.ResNet18_Weights.IMAGENET1K_V1
    model = models.resnet18(weights=weights)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model


def load_model() -> nn.Module:
    model = build_resnet18()
    if CKPT_PATH.exists():
        state = torch.load(CKPT_PATH, map_location=DEVICE)
        # Accept both raw state_dict and the wrapped checkpoint format used in src/train.py
        if isinstance(state, dict) and "model_state_dict" in state:
            model.load_state_dict(state["model_state_dict"])
        else:
            model.load_state_dict(state)
        print(f"Loaded checkpoint from {CKPT_PATH}")
    else:
        print(
            f"WARNING: {CKPT_PATH} not found. Using ImageNet-only weights "
            "(predictions will be meaningless)."
        )
    model.to(DEVICE).eval()
    return model


MODEL = load_model()
TARGET_LAYERS = [MODEL.layer4[-1]]
CAM = GradCAM(model=MODEL, target_layers=TARGET_LAYERS)

PREPROCESS = transforms.Compose(
    [
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
        ),
    ]
)


def center_mask(h: int, w: int, ratio: float = FOREGROUND_RATIO) -> np.ndarray:
    mask = np.zeros((h, w), dtype=np.uint8)
    bh, bw = int(h * ratio), int(w * ratio)
    y1 = (h - bh) // 2
    x1 = (w - bw) // 2
    mask[y1 : y1 + bh, x1 : x1 + bw] = 1
    return mask


def saliency_split(cam_map: np.ndarray) -> Tuple[float, float]:
    cam_map = np.maximum(cam_map, 0)
    total = float(cam_map.sum()) + 1e-8
    mask = center_mask(*cam_map.shape)
    fg = float(cam_map[mask == 1].sum()) / total
    return fg, 1.0 - fg


def draw_box(rgb01: np.ndarray, ratio: float = FOREGROUND_RATIO) -> np.ndarray:
    out = (rgb01 * 255).astype(np.uint8).copy()
    h, w = out.shape[:2]
    bh, bw = int(h * ratio), int(w * ratio)
    y1 = (h - bh) // 2
    x1 = (w - bw) // 2
    cv2.rectangle(out, (x1, y1), (x1 + bw, y1 + bh), (255, 255, 255), 2)
    return out


def predict(image: Image.Image):
    if image is None:
        return None, None, None, "Upload an image to start.", None

    image = image.convert("RGB")
    tensor = PREPROCESS(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = MODEL(tensor)
        probs = torch.softmax(logits, dim=1)[0].cpu().numpy()

    pred = int(probs.argmax())
    label = LABEL_NAMES[pred]
    label_probs = {LABEL_NAMES[i]: float(probs[i]) for i in range(2)}

    targets = [ClassifierOutputTarget(pred)]
    grayscale_cam = CAM(input_tensor=tensor, targets=targets)[0]

    # rgb in [0,1] for show_cam_on_image
    rgb01 = tensor[0].cpu().numpy().transpose(1, 2, 0)
    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])
    rgb01 = np.clip(rgb01 * std + mean, 0.0, 1.0).astype(np.float32)

    overlay = show_cam_on_image(rgb01, grayscale_cam, use_rgb=True)
    boxed = draw_box(rgb01)
    fg_share, bg_share = saliency_split(grayscale_cam)

    summary = (
        f"**Prediction:** {label} ({label_probs[label]:.1%} confidence)\n\n"
        f"**Foreground saliency:** {fg_share:.1%} of total Grad-CAM mass.\n\n"
        f"**Background saliency (attention-bias score):** {bg_share:.1%}.\n\n"
        f"A high background share suggests the model is using the background "
        f"as a shortcut. On the test set, the model averages 35–48% background "
        f"share even when correct — see the website's Grad-CAM section for "
        f"context."
    )

    return overlay, boxed, label_probs, summary, label


with gr.Blocks(theme=gr.themes.Soft(primary_hue="indigo")) as demo:
    gr.Markdown(
        """
        # Waterbirds shortcut-learning demo

        This is the live demo for **Project 18 · Saliency-based Analysis of
        Shortcut Learning in CNNs**. Upload an image of a bird and the model
        will predict landbird vs. waterbird, show its Grad-CAM, and report the
        foreground / background attention-bias score.

        Try uploading a *waterbird on a forest background* or a *landbird on
        water* — those are the cases where the shortcut bites.
        """
    )
    with gr.Row():
        with gr.Column(scale=1):
            inp = gr.Image(type="pil", label="Upload a bird photo")
            btn = gr.Button("Run", variant="primary")
        with gr.Column(scale=1):
            label_out = gr.Label(num_top_classes=2, label="Prediction")
            summary_out = gr.Markdown()
    with gr.Row():
        cam_out = gr.Image(label="Grad-CAM overlay (predicted class)")
        box_out = gr.Image(label="60% center-crop foreground heuristic")

    state = gr.State()

    btn.click(
        predict,
        inputs=[inp],
        outputs=[cam_out, box_out, label_out, summary_out, state],
    )

if __name__ == "__main__":
    demo.queue().launch()
