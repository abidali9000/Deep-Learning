/**
 * Curated Grad-CAM gallery — 12 images chosen to span the four subgroups
 * and to surface the shortcut-failure cases for the discussion.
 */
export type GalleryItem = {
  file: string;
  group: "waterbird-water" | "waterbird-land" | "landbird-land" | "landbird-water";
  truth: "waterbird" | "landbird";
  prediction: "waterbird" | "landbird";
  correct: boolean;
  idx: number;
  caption: string;
};

export const GALLERY: GalleryItem[] = [
  {
    file: "idx0_group-waterbird-water_true-waterbird_pred-waterbird.png",
    group: "waterbird-water",
    truth: "waterbird",
    prediction: "waterbird",
    correct: true,
    idx: 0,
    caption:
      "Majority case: waterbird on water. Saliency overlaps the bird; background and foreground both look 'consistent'.",
  },
  {
    file: "idx11_group-waterbird-water_true-waterbird_pred-waterbird.png",
    group: "waterbird-water",
    truth: "waterbird",
    prediction: "waterbird",
    correct: true,
    idx: 11,
    caption: "Majority case — model is confident and attention spans bird + water.",
  },
  {
    file: "idx12_group-waterbird-water_true-waterbird_pred-waterbird.png",
    group: "waterbird-water",
    truth: "waterbird",
    prediction: "waterbird",
    correct: true,
    idx: 12,
    caption: "Another majority example, same pattern.",
  },
  {
    file: "idx10_group-waterbird-land_true-waterbird_pred-waterbird.png",
    group: "waterbird-land",
    truth: "waterbird",
    prediction: "waterbird",
    correct: true,
    idx: 10,
    caption:
      "Conflict group success: a waterbird on land where the model still found the bird.",
  },
  {
    file: "idx20_group-waterbird-land_true-waterbird_pred-landbird.png",
    group: "waterbird-land",
    truth: "waterbird",
    prediction: "landbird",
    correct: false,
    idx: 20,
    caption:
      "Shortcut failure: a waterbird placed on land. The model misclassifies it as landbird — saliency leaks onto the land background.",
  },
  {
    file: "idx24_group-waterbird-land_true-waterbird_pred-landbird.png",
    group: "waterbird-land",
    truth: "waterbird",
    prediction: "landbird",
    correct: false,
    idx: 24,
    caption: "Another waterbird-on-land failure — strong evidence the background is steering the prediction.",
  },
  {
    file: "idx100_group-landbird-land_true-landbird_pred-landbird.png",
    group: "landbird-land",
    truth: "landbird",
    prediction: "landbird",
    correct: true,
    idx: 100,
    caption: "Easy majority case for landbirds.",
  },
  {
    file: "idx103_group-landbird-land_true-landbird_pred-landbird.png",
    group: "landbird-land",
    truth: "landbird",
    prediction: "landbird",
    correct: true,
    idx: 103,
    caption: "Landbird on land — accurate prediction.",
  },
  {
    file: "idx104_group-landbird-land_true-landbird_pred-landbird.png",
    group: "landbird-land",
    truth: "landbird",
    prediction: "landbird",
    correct: true,
    idx: 104,
    caption: "Landbird majority case.",
  },
  {
    file: "idx101_group-landbird-water_true-landbird_pred-landbird.png",
    group: "landbird-water",
    truth: "landbird",
    prediction: "landbird",
    correct: true,
    idx: 101,
    caption: "Conflict success: landbird placed on water but still classified correctly.",
  },
  {
    file: "idx102_group-landbird-water_true-landbird_pred-waterbird.png",
    group: "landbird-water",
    truth: "landbird",
    prediction: "waterbird",
    correct: false,
    idx: 102,
    caption:
      "Shortcut failure: landbird on water becomes 'waterbird'. Saliency drifts toward the water background.",
  },
  {
    file: "idx105_group-landbird-water_true-landbird_pred-waterbird.png",
    group: "landbird-water",
    truth: "landbird",
    prediction: "waterbird",
    correct: false,
    idx: 105,
    caption: "Another landbird-on-water failure — the background pattern dominates.",
  },
];
