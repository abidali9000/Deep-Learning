/**
 * Client-safe constants, types, and formatting helpers.
 * Must NOT import any Node-only APIs (fs, path, etc.) — this file is
 * imported by 'use client' components.
 */

export type SubgroupMetric = {
  count: number;
  accuracy: number;
  avg_confidence: number;
};

export type TestMetrics = {
  overall_accuracy: number;
  precision_macro: number;
  recall_macro: number;
  f1_macro: number;
  confusion_matrix: number[][];
  label_names: Record<string, string>;
  subgroup_metrics: Record<string, SubgroupMetric>;
  worst_group_accuracy: number;
};

export type TrainEpochRow = {
  epoch: number;
  train_loss: number;
  train_acc: number;
  val_acc: number;
  val_worst_group_acc: number;
  val_acc_waterbird_water: number;
  val_acc_waterbird_land: number;
  val_acc_landbird_land: number;
  val_acc_landbird_water: number;
};

export type GradCamGroupRow = {
  group_name: string;
  foreground_ratio: number;
  background_ratio: number;
  attention_bias_score: number;
  correct: number;
};

export type InterventionOverallRow = {
  condition: string;
  accuracy: number;
  prediction_flip_rate: number;
  avg_background_ratio: number;
};

export type InterventionSubgroupRow = {
  condition: string;
  group_name: string;
  count: number;
  accuracy: number;
  avg_confidence: number;
  avg_true_class_confidence: number;
  prediction_flip_rate: number;
  avg_confidence_drop: number;
  avg_foreground_ratio: number;
  avg_background_ratio: number;
  avg_attention_bias_score: number;
};

export const GROUP_LABEL: Record<string, string> = {
  "waterbird-water": "Waterbird on water (majority)",
  "waterbird-land": "Waterbird on land (conflict)",
  "landbird-land": "Landbird on land (majority)",
  "landbird-water": "Landbird on water (conflict)",
};

export const CONDITION_LABEL: Record<string, string> = {
  original: "Original",
  background_blur: "Background blur",
  background_mask: "Background mask",
  background_patch_shuffle: "Background patch shuffle",
  foreground_mask: "Foreground mask",
};

export function pct(x: number, digits = 1): string {
  return `${(x * 100).toFixed(digits)}%`;
}
