# Deploy to Render (Frontend + Backend)

Deploy **Architecture Playground** to [Render](https://render.com) with one Blueprint — React frontend + RAG API backend.

## Prerequisites

1. GitHub account: [Padmamma123](https://github.com/Padmamma123)
2. [Render](https://render.com) account (free tier works)
3. Groq API key (recommended) or OpenAI API key (for LLM answers in chatbot)

---

## Step 1 — Push code to GitHub

```bash
cd c:\Naresh\designpatterns

git init
git add .
git commit -m "Initial commit: Architecture Playground with RAG API"

# Create repo on GitHub: https://github.com/new
# Name it: architecture-playground

git branch -M main
git remote add origin https://github.com/Padmamma123/architecture-playground.git
git push -u origin main
```

---

## Step 2 — Deploy on Render (Blueprint)

1. Go to [https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
2. Click **New Blueprint Instance**
3. Connect GitHub → select `Padmamma123/architecture-playground`
4. Render reads `render.yaml` and creates **2 services**:
   - `padmamma123-playground-api` — Node.js RAG backend
   - `padmamma123-playground-ui` — React static frontend
5. Add environment variable when prompted (on the **API** service):
   - **GROQ_API_KEY** = your `gsk_...` key
   - **LLM_MODEL** = `llama-3.3-70b-versatile` (optional — default in blueprint)
6. Click **Apply** (~5–10 min)

---

## Step 3 — Verify

| Service | URL |
|---------|-----|
| Frontend | `https://padmamma123-playground-ui.onrender.com` |
| Backend | `https://padmamma123-playground-api.onrender.com/api/rag/status` |

Open frontend → AI Tutor → badge should show **RAG + LLM**.

---

## Manual deploy (without Blueprint)

### Backend (Web Service)

- **Build:** `npm install`
- **Start:** `npm run start:server`
- **Health check:** `/api/rag/status`
- **Env:** `OPENAI_API_KEY`, `OPENAI_MODEL=gpt-4o-mini`, `NODE_ENV=production`, `FRONTEND_URL`

### Frontend (Static Site)

- **Build:** `npm install --include=dev && npm run build` (dev deps required for `tsc` + `vite`)
- **Publish:** `dist`
- **Env:** `VITE_RAG_API_URL=https://your-api.onrender.com`
- **Rewrite:** `/*` → `/index.html`

---

## Free tier notes

- Services spin down after idle — first load may take ~30 seconds
- Re-deploy frontend if you change `VITE_RAG_API_URL`

---

## Local dev

```bash
npm run dev:all
```
