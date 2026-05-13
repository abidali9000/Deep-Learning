---
title: Waterbirds Shortcut Demo
emoji: 🦆
colorFrom: indigo
colorTo: pink
sdk: gradio
sdk_version: 5.34.0
python_version: "3.11"
app_file: app.py
pinned: false
short_description: Saliency analysis of CNN shortcut learning on Waterbirds.
---

# Waterbirds shortcut-learning demo

This Hugging Face Space hosts the trained ResNet18 from
[abidali9000/Deep-Learning](https://github.com/abidali9000/Deep-Learning) and
exposes a Gradio interface that runs prediction + Grad-CAM + the
foreground/background attention-bias score on any uploaded image.

The static project website (Vercel) embeds this Space in its `/demo` page.

## Files

- `app.py` — Gradio app: model load, preprocessing, Grad-CAM overlay, bias score.
- `requirements.txt` — pinned versions known to work on free Spaces hardware.
- `best_model.pt` — the trained checkpoint (must be added via Git LFS — too large for normal GitHub).

## Local sanity check

```bash
pip install -r requirements.txt
# place best_model.pt in this directory
python app.py
```

## Deploy

1. Create a new Space at <https://huggingface.co/new-space> (SDK: Gradio, free CPU is fine).
2. Clone the Space repo locally.
3. Copy `app.py`, `requirements.txt`, and this `README.md` into the cloned repo.
4. Add the trained checkpoint via Git LFS:
   ```bash
   git lfs install
   git lfs track "*.pt"
   cp /path/to/Deep-Learning/outputs/checkpoints/best_model.pt .
   git add .gitattributes best_model.pt app.py requirements.txt README.md
   git commit -m "Initial Waterbirds shortcut demo"
   git push
   ```
5. Wait ~3 minutes for the Space to build.
6. Set `NEXT_PUBLIC_HF_SPACE_URL` to the Space URL on Vercel and redeploy the website — it will embed the Space automatically.

## Notes

- The checkpoint is intentionally **not** in the GitHub repo — it exceeds GitHub's regular file-size limit. The Space (with Git LFS) is the canonical home for the model.
- Use `best_model.pt`, not `last_model.pt`. The checkpoint criterion is validation worst-group accuracy.
