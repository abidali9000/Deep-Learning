/**
 * Build-time loader for experiment outputs (server-only).
 *
 * Reads JSON + CSV directly from outputs/ so the website always reflects
 * the latest run of the pipeline. Re-exports types and constants from
 * ./display so server pages can use a single import.
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

import type {
  GradCamGroupRow,
  InterventionOverallRow,
  InterventionSubgroupRow,
  TestMetrics,
  TrainEpochRow,
} from "./display";

export * from "./display";

const OUTPUTS_DIR = path.join(process.cwd(), "..", "outputs");

function readJson<T = unknown>(rel: string): T {
  const p = path.join(OUTPUTS_DIR, rel);
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
}

function readCsv<T extends Record<string, string>>(rel: string): T[] {
  const p = path.join(OUTPUTS_DIR, rel);
  const raw = fs.readFileSync(p, "utf-8");
  return parse(raw, { columns: true, skip_empty_lines: true }) as T[];
}

// ---------- Test metrics ----------
export const testMetrics: TestMetrics = readJson<TestMetrics>(
  "metrics/test_metrics.json",
);

// ---------- Training history ----------
const rawTrain = readCsv<Record<string, string>>("metrics/train_history.csv");
export const trainHistory: TrainEpochRow[] = rawTrain.map((r) => ({
  epoch: Number(r.epoch),
  train_loss: Number(r.train_loss),
  train_acc: Number(r.train_acc),
  val_acc: Number(r.val_acc),
  val_worst_group_acc: Number(r.val_worst_group_acc),
  val_acc_waterbird_water: Number(r["val_acc_waterbird-water"]),
  val_acc_waterbird_land: Number(r["val_acc_waterbird-land"]),
  val_acc_landbird_land: Number(r["val_acc_landbird-land"]),
  val_acc_landbird_water: Number(r["val_acc_landbird-water"]),
}));

// ---------- Grad-CAM group summary ----------
const rawGradCamGroup = readCsv<Record<string, string>>(
  "gradcam/gradcam_group_summary.csv",
);
export const gradCamGroupSummary: GradCamGroupRow[] = rawGradCamGroup.map(
  (r) => ({
    group_name: r.group_name,
    foreground_ratio: Number(r.foreground_ratio),
    background_ratio: Number(r.background_ratio),
    attention_bias_score: Number(r.attention_bias_score),
    correct: Number(r.correct),
  }),
);

// ---------- Intervention overall metrics ----------
const rawInterv = readCsv<Record<string, string>>(
  "interventions/intervention_overall_metrics.csv",
);
export const interventionOverall: InterventionOverallRow[] = rawInterv.map(
  (r) => ({
    condition: r.condition,
    accuracy: Number(r.accuracy),
    prediction_flip_rate: Number(r.prediction_flip_rate),
    avg_background_ratio: Number(r.avg_background_ratio),
  }),
);

// ---------- Intervention subgroup metrics ----------
const rawIntervSub = readCsv<Record<string, string>>(
  "interventions/intervention_metrics.csv",
);
export const interventionSubgroup: InterventionSubgroupRow[] = rawIntervSub.map(
  (r) => ({
    condition: r.condition,
    group_name: r.group_name,
    count: Number(r.count),
    accuracy: Number(r.accuracy),
    avg_confidence: Number(r.avg_confidence),
    avg_true_class_confidence: Number(r.avg_true_class_confidence),
    prediction_flip_rate: Number(r.prediction_flip_rate),
    avg_confidence_drop: Number(r.avg_confidence_drop),
    avg_foreground_ratio: Number(r.avg_foreground_ratio),
    avg_background_ratio: Number(r.avg_background_ratio),
    avg_attention_bias_score: Number(r.avg_attention_bias_score),
  }),
);
