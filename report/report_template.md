# Saliency-based Analysis of Shortcut Learning in CNNs

## 1. Introduction

This project investigates shortcut learning in convolutional neural networks using the Waterbirds dataset. The dataset contains a spurious correlation between bird type and background in the training split: waterbirds are mostly shown on water backgrounds, while landbirds are mostly shown on land backgrounds. This can cause a CNN to rely on background cues instead of bird features.

## 2. Dataset

Dataset: `grodino/waterbirds`

Classes:

- landbird
- waterbird

Background/place labels:

- land
- water

Subgroups:

- waterbird-water
- waterbird-land
- landbird-land
- landbird-water

The main subgroup-conflict cases are `waterbird-land` and `landbird-water`.

## 3. Methodology

### 3.1 Model

A pretrained ResNet model was fine-tuned for binary classification.

### 3.2 Evaluation

The model was evaluated using:

- overall accuracy
- precision
- recall
- F1-score
- confusion matrix
- subgroup accuracy
- worst-group accuracy

### 3.3 Grad-CAM saliency analysis

Grad-CAM was applied to the final convolutional layer of the CNN. For ResNet18/ResNet50, the selected layer was:

```python
target_layers = [model.layer4[-1]]
```

A center-crop heuristic was used to approximate foreground and background regions. Saliency mass inside the center crop was treated as foreground attention, while saliency mass outside was treated as background attention.

### 3.4 Attention-bias score

The attention-bias score was defined as:

```text
attention_bias_score = background_saliency / total_saliency
```

Higher values indicate stronger attention to the background.

### 3.5 Intervention experiments

The following interventions were applied at inference time:

1. Background blur
2. Background mask
3. Foreground mask
4. Background patch shuffle

The aim was to test whether changing the background or foreground changes prediction behavior.

## 4. Results

Replace this section with results from:

```text
outputs/PROJECT_RESULTS_SUMMARY.md
```

Include:

- test classification metrics
- subgroup accuracy table
- Grad-CAM visual examples
- saliency-ratio table
- intervention metrics

## 5. Discussion

Discuss:

- whether average accuracy hides subgroup failures
- whether minority groups perform worse
- whether Grad-CAM shows attention on background regions
- whether background intervention changes predictions
- whether foreground masking confirms or rejects reliance on bird features

## 6. Conclusion

Write your conclusion after running the experiments. Do not claim shortcut learning unless your subgroup metrics, Grad-CAM results, and interventions support it.

