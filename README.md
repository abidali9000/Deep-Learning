# Saliency-based Analysis of Shortcut Learning in CNNs

> **Online presentation:** the full project is published as an interactive site under [`website/`](./website) (Next.js, deployable to Vercel). It includes pipeline diagrams, the Grad-CAM gallery, intervention dashboards, a code walkthrough, a printable PDF report, and an embeddable live demo.
>
> **Live model demo:** the trained checkpoint is too large for GitHub, so it's hosted on a Hugging Face Space (see [`huggingface_space/`](./huggingface_space)) and embedded into the website's `/demo` page.

This project implements the Advanced Deep Learning Project 18 instructions:

**Goal:** investigate whether a CNN trained on the biased Waterbirds dataset relies on background cues instead of object/bird features.

The pipeline includes:

1. Loading the Hugging Face `grodino/waterbirds` dataset.
2. Training a CNN baseline, ResNet18 or ResNet50.
3. Computing overall and subgroup classification metrics.
4. Applying Grad-CAM to representative test samples.
5. Computing foreground/background saliency ratios using a center-crop heuristic.
6. Running inference-time interventions:
   - background blur
   - background mask
   - foreground mask
   - background patch shuffle
7. Comparing classification and saliency-based bias metrics before and after interventions.

---

## Project idea

Waterbirds contains two target labels:

- `landbird`
- `waterbird`

and two background/place labels:

- `land`
- `water`

The training set is biased: most waterbirds are on water backgrounds, and most landbirds are on land backgrounds. A CNN may therefore learn this shortcut:

```text
water background -> waterbird
land background  -> landbird
```

The test set is more balanced, so subgroup analysis can reveal failures on shortcut-conflict groups:

- waterbird on land
- landbird on water

---

## Folder structure

```text
waterbirds_shortcut_project/
├── config.yaml
├── requirements.txt
├── run_all.sh
├── src/
│   ├── dataset.py
│   ├── model.py
│   ├── train.py
│   ├── evaluate.py
│   ├── gradcam_analysis.py
│   ├── interventions.py
│   ├── report_summary.py
│   └── utils.py
├── outputs/
│   ├── checkpoints/
│   ├── metrics/
│   ├── gradcam/
│   ├── interventions/
│   └── figures/
└── report/
    └── report_template.md
```

---

## Setup

Create an environment:

```bash
conda create -n waterbirds python=3.10 -y
conda activate waterbirds
pip install -r requirements.txt
```

For GPU, install the correct PyTorch version for your CUDA setup from the official PyTorch website if needed.

---

## Run the full project

```bash
bash run_all.sh
```

This will train the model, evaluate it, run Grad-CAM, run interventions, and generate a summary markdown file.

---

## Run step by step

### 1. Train

```bash
python -m src.train --config config.yaml
```

Output:

```text
outputs/checkpoints/best_model.pt
outputs/metrics/train_history.csv
```

### 2. Evaluate

```bash
python -m src.evaluate --config config.yaml --checkpoint outputs/checkpoints/best_model.pt --split test
```

Output:

```text
outputs/metrics/test_metrics.json
outputs/metrics/test_predictions.csv
outputs/figures/test_confusion_matrix.png
```

### 3. Grad-CAM analysis

```bash
python -m src.gradcam_analysis --config config.yaml --checkpoint outputs/checkpoints/best_model.pt
```

Output:

```text
outputs/gradcam/gradcam_results.csv
outputs/gradcam/*.png
```

### 4. Intervention experiments

```bash
python -m src.interventions --config config.yaml --checkpoint outputs/checkpoints/best_model.pt --max-samples 1000
```

Output:

```text
outputs/interventions/intervention_metrics.csv
outputs/interventions/intervention_predictions.csv
outputs/figures/intervention_accuracy.png
outputs/figures/intervention_background_saliency.png
```

### 5. Generate project summary

```bash
python -m src.report_summary
```

Output:

```text
outputs/PROJECT_RESULTS_SUMMARY.md
```

---

## Main metrics to discuss

Classification metrics:

- overall accuracy
- precision
- recall
- F1-score
- confusion matrix
- subgroup accuracy
- worst-group accuracy

Saliency metrics:

- foreground saliency ratio
- background saliency ratio
- attention-bias score = background saliency ratio

Intervention metrics:

- accuracy after background blur
- accuracy after background mask
- accuracy after foreground mask
- prediction flip rate
- confidence drop
- change in foreground/background saliency

---

## Expected final conclusion style

A strong final conclusion should look like this:

> The CNN achieved reasonable overall accuracy, but subgroup analysis revealed lower performance on shortcut-conflict groups. Grad-CAM visualizations and saliency-ratio measurements showed that the model frequently attended to background regions. Background and foreground intervention experiments further confirmed that background cues influenced predictions, providing evidence of shortcut learning.

Do not write this exact conclusion until you run the project and have your real numbers.

