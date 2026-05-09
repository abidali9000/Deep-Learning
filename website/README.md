# Project website

Next.js 15 + Tailwind static site presenting **Project 18 · Saliency-based
Analysis of Shortcut Learning in CNNs**. Reads metrics directly from
`../outputs/` at build time, so re-running the pipeline keeps the site in
sync without manual edits.

## Local development

```bash
cd website
npm install
npm run dev          # http://localhost:3000
```

## Production build

```bash
npm run build        # static export to website/out/
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. On Vercel, "New Project" → import the repo.
3. **Root Directory:** `website`
4. **Framework preset:** Next.js (autodetected)
5. (Optional) Set `NEXT_PUBLIC_HF_SPACE_URL` to your Hugging Face Space URL so the `/demo` page embeds it.
6. Deploy.

The build command (`next build`) does a static export. No serverless runtime
needed.

## Adding the live demo

The PyTorch model can't run on Vercel — see `huggingface_space/` in the repo
root for the Gradio Space that hosts the model. After deploying the Space,
set `NEXT_PUBLIC_HF_SPACE_URL` and redeploy.

## Adding side-by-side intervention plates

After running the pipeline locally:

```bash
python -m src.comparison_plates \
  --config config.yaml \
  --checkpoint outputs/checkpoints/best_model.pt \
  --out outputs/comparisons
cp outputs/comparisons/*.png website/public/comparisons/
```

The `/interventions` page picks them up automatically.
