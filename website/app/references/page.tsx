import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";

const REFS = [
  {
    key: "sagawa2019",
    cite: "Sagawa, S., Koh, P. W., Hashimoto, T. B., & Liang, P. (2019). Distributionally Robust Neural Networks for Group Shifts: On the Importance of Regularization for Worst-Case Generalization. ICLR 2020.",
    url: "https://arxiv.org/abs/1911.08731",
    bibtex: `@inproceedings{sagawa2019distributionally,
  title={Distributionally Robust Neural Networks for Group Shifts: On the Importance of Regularization for Worst-Case Generalization},
  author={Sagawa, Shiori and Koh, Pang Wei and Hashimoto, Tatsunori B and Liang, Percy},
  booktitle={International Conference on Learning Representations},
  year={2020}
}`,
  },
  {
    key: "geirhos2020",
    cite: "Geirhos, R., Jacobsen, J.-H., Michaelis, C., Zemel, R., Brendel, W., Bethge, M., & Wichmann, F. A. (2020). Shortcut Learning in Deep Neural Networks. Nature Machine Intelligence.",
    url: "https://arxiv.org/abs/2004.07780",
    bibtex: `@article{geirhos2020shortcut,
  title={Shortcut learning in deep neural networks},
  author={Geirhos, Robert and Jacobsen, J{\\"o}rn-Henrik and Michaelis, Claudio and Zemel, Richard and Brendel, Wieland and Bethge, Matthias and Wichmann, Felix A},
  journal={Nature Machine Intelligence},
  volume={2},
  number={11},
  pages={665--673},
  year={2020}
}`,
  },
  {
    key: "selvaraju2017",
    cite: "Selvaraju, R. R., Cogswell, M., Das, A., Vedantam, R., Parikh, D., & Batra, D. (2017). Grad-CAM: Visual Explanations from Deep Networks via Gradient-based Localization. ICCV 2017.",
    url: "https://arxiv.org/abs/1610.02391",
    bibtex: `@inproceedings{selvaraju2017gradcam,
  title={Grad-CAM: Visual Explanations from Deep Networks via Gradient-based Localization},
  author={Selvaraju, Ramprasaath R and Cogswell, Michael and Das, Abhishek and Vedantam, Ramakrishna and Parikh, Devi and Batra, Dhruv},
  booktitle={Proceedings of the IEEE international conference on computer vision},
  pages={618--626},
  year={2017}
}`,
  },
  {
    key: "wah2011cub",
    cite: "Wah, C., Branson, S., Welinder, P., Perona, P., & Belongie, S. (2011). The Caltech-UCSD Birds-200-2011 Dataset. Caltech Technical Report CNS-TR-2011-001.",
    url: "https://www.vision.caltech.edu/datasets/cub_200_2011/",
    bibtex: `@techreport{wah2011caltech,
  title={The Caltech-UCSD Birds-200-2011 Dataset},
  author={Wah, Catherine and Branson, Steve and Welinder, Peter and Perona, Pietro and Belongie, Serge},
  institution={California Institute of Technology},
  year={2011},
  number={CNS-TR-2011-001}
}`,
  },
  {
    key: "zhou2017places",
    cite: "Zhou, B., Lapedriza, A., Khosla, A., Oliva, A., & Torralba, A. (2017). Places: A 10 Million Image Database for Scene Recognition. IEEE PAMI.",
    url: "https://arxiv.org/abs/1610.02055",
    bibtex: `@article{zhou2017places,
  title={Places: A 10 Million Image Database for Scene Recognition},
  author={Zhou, Bolei and Lapedriza, Agata and Khosla, Aditya and Oliva, Aude and Torralba, Antonio},
  journal={IEEE Transactions on Pattern Analysis and Machine Intelligence},
  year={2017}
}`,
  },
  {
    key: "gildenblat2021",
    cite: "Gildenblat, J. and contributors. (2021). PyTorch library for CAM methods.",
    url: "https://github.com/jacobgil/pytorch-grad-cam",
    bibtex: `@misc{jacobgilpytorchcam,
  title={PyTorch library for CAM methods},
  author={Jacob Gildenblat and contributors},
  year={2021},
  publisher={GitHub},
  howpublished={\\url{https://github.com/jacobgil/pytorch-grad-cam}}
}`,
  },
];

export default function ReferencesPage() {
  return (
    <article className="section prose-academic">
      <SectionHeader
        eyebrow="References"
        title="Cited works"
        lead="Papers and tools that frame and enable this project."
      />

      <ol className="space-y-5">
        {REFS.map((r) => (
          <li key={r.key} className="card">
            <p className="text-ink-100">{r.cite}</p>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline text-sm break-all"
            >
              {r.url}
            </a>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-ink-400 hover:text-ink-200">
                BibTeX
              </summary>
              <pre className="mt-2 rounded-lg bg-ink-950 p-3 text-xs overflow-x-auto text-ink-100">
                {r.bibtex}
              </pre>
            </details>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex justify-between text-sm">
        <Link href="/demo" className="text-ink-400 hover:text-ink-100">
          ← Live demo
        </Link>
        <Link href="/" className="text-accent hover:underline">
          Back to home →
        </Link>
      </div>
    </article>
  );
}
