from pathlib import Path

import pandas as pd


def md_table_from_csv(path: Path, max_rows: int = 20) -> str:
    if not path.exists():
        return f"_Missing file: `{path}`_\n"
    df = pd.read_csv(path)
    if len(df) > max_rows:
        df = df.head(max_rows)
    return df.to_markdown(index=False)


def json_metrics_summary(path: Path) -> str:
    import json
    if not path.exists():
        return f"_Missing file: `{path}`_\n"
    with open(path, "r", encoding="utf-8") as f:
        m = json.load(f)
    lines = []
    lines.append(f"- Overall accuracy: **{m.get('overall_accuracy', 0):.4f}**")
    lines.append(f"- Macro precision: **{m.get('precision_macro', 0):.4f}**")
    lines.append(f"- Macro recall: **{m.get('recall_macro', 0):.4f}**")
    lines.append(f"- Macro F1: **{m.get('f1_macro', 0):.4f}**")
    lines.append(f"- Worst-group accuracy: **{m.get('worst_group_accuracy', 0):.4f}**")
    lines.append("\n### Subgroup metrics\n")
    rows = []
    for group, vals in m.get("subgroup_metrics", {}).items():
        rows.append({"group": group, **vals})
    if rows:
        lines.append(pd.DataFrame(rows).to_markdown(index=False))
    return "\n".join(lines)


def main():
    out = Path("outputs")
    summary = []
    summary.append("# Waterbirds Shortcut Learning Results Summary\n")
    summary.append("This file is generated after running the project scripts. Use these tables and figures in your final report/presentation.\n")

    summary.append("## Test classification metrics\n")
    summary.append(json_metrics_summary(out / "metrics" / "test_metrics.json"))

    summary.append("\n## Training history\n")
    summary.append(md_table_from_csv(out / "metrics" / "train_history.csv"))

    summary.append("\n## Grad-CAM group summary\n")
    summary.append(md_table_from_csv(out / "gradcam" / "gradcam_group_summary.csv"))

    summary.append("\n## Intervention overall metrics\n")
    summary.append(md_table_from_csv(out / "interventions" / "intervention_overall_metrics.csv"))

    summary.append("\n## Intervention subgroup metrics\n")
    summary.append(md_table_from_csv(out / "interventions" / "intervention_metrics.csv", max_rows=50))

    summary.append("\n## Figures to include\n")
    summary.append("- `outputs/figures/test_confusion_matrix.png`")
    summary.append("- `outputs/figures/intervention_accuracy.png`")
    summary.append("- `outputs/figures/intervention_background_saliency.png`")
    summary.append("- representative images from `outputs/gradcam/`\n")

    summary.append("## Suggested discussion points\n")
    summary.append("1. Compare overall accuracy with worst-group accuracy.")
    summary.append("2. Identify which subgroup is weakest: usually one of the shortcut-conflict groups.")
    summary.append("3. Discuss whether Grad-CAM attention is more concentrated inside the center foreground or outside in the background.")
    summary.append("4. Compare original performance with background-blur/background-mask performance.")
    summary.append("5. Compare original performance with foreground-mask performance.")
    summary.append("6. Use prediction flip rate and confidence drop to support your conclusion about shortcut learning.\n")

    path = out / "PROJECT_RESULTS_SUMMARY.md"
    path.write_text("\n".join(summary), encoding="utf-8")
    print(f"Wrote {path}")


if __name__ == "__main__":
    main()
