import json
import os
import random
from pathlib import Path
from typing import Any, Dict

import numpy as np
import torch
import yaml


LABEL_NAMES = {0: "landbird", 1: "waterbird"}
PLACE_NAMES = {0: "land", 1: "water"}
GROUP_NAMES = {
    0: "waterbird-water",
    1: "waterbird-land",
    2: "landbird-land",
    3: "landbird-water",
}


def load_config(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def set_seed(seed: int = 42) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = False
    torch.backends.cudnn.benchmark = True


def get_device() -> torch.device:
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")


def ensure_dirs(base_output_dir: str = "outputs") -> None:
    for sub in ["checkpoints", "metrics", "gradcam", "interventions", "figures"]:
        Path(base_output_dir, sub).mkdir(parents=True, exist_ok=True)


def get_group_id(label: int, place: int) -> int:
    # label: 0 landbird, 1 waterbird; place: 0 land, 1 water
    if label == 1 and place == 1:
        return 0  # waterbird-water
    if label == 1 and place == 0:
        return 1  # waterbird-land
    if label == 0 and place == 0:
        return 2  # landbird-land
    if label == 0 and place == 1:
        return 3  # landbird-water
    raise ValueError(f"Unknown group for label={label}, place={place}")


def save_json(obj: Dict[str, Any], path: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2)


def load_checkpoint(path: str, model: torch.nn.Module, device: torch.device) -> Dict[str, Any]:
    ckpt = torch.load(path, map_location=device)
    model.load_state_dict(ckpt["model_state_dict"])
    return ckpt


def denormalize_tensor(img_tensor: torch.Tensor) -> np.ndarray:
    """Return HWC float RGB image in [0, 1] from normalized CHW tensor."""
    mean = torch.tensor([0.485, 0.456, 0.406], device=img_tensor.device).view(3, 1, 1)
    std = torch.tensor([0.229, 0.224, 0.225], device=img_tensor.device).view(3, 1, 1)
    x = img_tensor * std + mean
    x = x.clamp(0, 1)
    return x.detach().cpu().permute(1, 2, 0).numpy()
