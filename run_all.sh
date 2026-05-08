#!/usr/bin/env bash
set -e

python -m src.train --config config.yaml
python -m src.evaluate --config config.yaml --checkpoint outputs/checkpoints/best_model.pt --split test
python -m src.gradcam_analysis --config config.yaml --checkpoint outputs/checkpoints/best_model.pt
python -m src.interventions --config config.yaml --checkpoint outputs/checkpoints/best_model.pt --max-samples 1000
python -m src.report_summary

echo "Done. Check outputs/PROJECT_RESULTS_SUMMARY.md and the outputs folders."
