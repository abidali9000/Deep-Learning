export type Section = {
  href: string;
  number?: string;
  title: string;
  shortTitle: string;
  blurb: string;
};

export const SECTIONS: Section[] = [
  {
    href: "/problem",
    number: "01",
    title: "Problem & motivation",
    shortTitle: "Problem",
    blurb: "Why shortcut learning matters and how it manifests in CNNs.",
  },
  {
    href: "/dataset",
    number: "02",
    title: "Waterbirds dataset bias",
    shortTitle: "Dataset",
    blurb: "How the 95/5 train vs. 50/50 test split engineers a known shortcut.",
  },
  {
    href: "/methodology",
    number: "03",
    title: "Methodology pipeline",
    shortTitle: "Methodology",
    blurb: "End-to-end view of training, evaluation, Grad-CAM, interventions.",
  },
  {
    href: "/training",
    number: "04",
    title: "CNN training",
    shortTitle: "Training",
    blurb: "ResNet18 fine-tune with worst-group accuracy as model selector.",
  },
  {
    href: "/evaluation",
    number: "05",
    title: "Subgroup evaluation",
    shortTitle: "Evaluation",
    blurb: "Overall vs. worst-group metrics, confusion matrix, four subgroups.",
  },
  {
    href: "/gradcam",
    number: "06",
    title: "Grad-CAM saliency analysis",
    shortTitle: "Grad-CAM",
    blurb: "Class-conditional saliency maps over a balanced test sample.",
  },
  {
    href: "/interventions",
    number: "07",
    title: "Foreground / background score & interventions",
    shortTitle: "Interventions",
    blurb:
      "Center-crop attention bias score and four inference-time interventions.",
  },
  {
    href: "/results",
    number: "08",
    title: "Results dashboard",
    shortTitle: "Results",
    blurb: "All numbers in one place.",
  },
  {
    href: "/conclusion",
    number: "09",
    title: "Conclusion",
    shortTitle: "Conclusion",
    blurb: "What the experiments collectively prove.",
  },
  {
    href: "/limitations",
    number: "10",
    title: "Limitations & future work",
    shortTitle: "Limitations",
    blurb: "What this study doesn't claim and what would strengthen it.",
  },
  {
    href: "/code-walkthrough",
    title: "Code walkthrough",
    shortTitle: "Code",
    blurb: "Each step mapped to the responsible source file.",
  },
  {
    href: "/demo",
    title: "Live demo",
    shortTitle: "Demo",
    blurb: "Upload an image and watch the model + Grad-CAM in real time.",
  },
  {
    href: "/references",
    title: "References",
    shortTitle: "References",
    blurb: "Papers cited and prior work.",
  },
];
