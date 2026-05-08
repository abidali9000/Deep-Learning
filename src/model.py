import torch.nn as nn
from torchvision import models


def build_model(architecture: str = "resnet18", pretrained: bool = True, num_classes: int = 2):
    architecture = architecture.lower()
    if architecture == "resnet18":
        weights = models.ResNet18_Weights.IMAGENET1K_V1 if pretrained else None
        model = models.resnet18(weights=weights)
    elif architecture == "resnet50":
        weights = models.ResNet50_Weights.IMAGENET1K_V2 if pretrained else None
        model = models.resnet50(weights=weights)
    else:
        raise ValueError("Unsupported architecture. Use resnet18 or resnet50.")

    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model
