from typing import Callable, Dict, Optional

import torch
from datasets import load_dataset
from PIL import Image
from torch.utils.data import Dataset
from torchvision import transforms

from .utils import get_group_id


class WaterbirdsTorchDataset(Dataset):
    def __init__(self, hf_split, transform: Optional[Callable] = None):
        self.data = hf_split
        self.transform = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        row = self.data[idx]
        image = row["image"]
        if not isinstance(image, Image.Image):
            image = Image.open(image)
        image = image.convert("RGB")

        label = int(row["label"])
        place = int(row["place"])
        group = get_group_id(label, place)
        bird = int(row.get("bird", -1)) if "bird" in row else -1

        if self.transform:
            image_tensor = self.transform(image)
        else:
            image_tensor = transforms.ToTensor()(image)

        return {
            "image": image_tensor,
            "label": torch.tensor(label, dtype=torch.long),
            "place": torch.tensor(place, dtype=torch.long),
            "group": torch.tensor(group, dtype=torch.long),
            "bird": torch.tensor(bird, dtype=torch.long),
            "idx": torch.tensor(idx, dtype=torch.long),
        }


def get_transforms(image_size: int = 224):
    train_tfms = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    eval_tfms = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return train_tfms, eval_tfms


def load_waterbirds_dataset(dataset_name: str = "grodino/waterbirds"):
    ds = load_dataset(dataset_name)
    return ds


def make_torch_dataset(split, image_size: int, train: bool):
    train_tfms, eval_tfms = get_transforms(image_size)
    return WaterbirdsTorchDataset(split, transform=train_tfms if train else eval_tfms)
