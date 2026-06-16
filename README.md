# Architecture Playground

A production-quality visual learning platform for **SOLID Principles**, **Design Patterns**, and **System Design**.

## Features

- **SOLID Principles** — 6-section interactive lessons with animations, sandbox, and code comparison
- **Design Patterns** — Creational, Structural, and Behavioral patterns with visual simulations
- **Architecture Playground** — Drag-and-drop system architecture builder with React Flow
- **Real World Case Studies** — Instagram, Netflix, Uber, WhatsApp, Amazon
- **Pattern Comparison Lab** — Side-by-side pattern analysis
- **Quiz Engine** — Easy, Medium, Hard questions with explanations
- **Code Playground** — Monaco Editor with pattern templates
- **Gamification** — XP, levels, badges, and achievements
- **AI Tutor** — RAG + OpenAI LLM assistant for architecture and patterns

## Deploy to Render (Frontend + Backend)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Padmamma123/architecture-playground)

**Prerequisites:** Push this repo to GitHub first (see below).

1. Create repo: [github.com/new](https://github.com/new) → name: `architecture-playground`
2. Push code:
   ```bash
   git remote add origin https://github.com/Padmamma123/architecture-playground.git
   git push -u origin main
   ```
3. Click **Deploy to Render** above, or go to [Render Blueprints](https://dashboard.render.com/blueprints) → **New Blueprint Instance** → select your repo
4. Set **GROQ_API_KEY** when prompted → **Apply**

| Service | URL |
|---------|-----|
| Frontend | `https://padmamma123-playground-ui.onrender.com` |
| API | `https://padmamma123-playground-api.onrender.com` |

See [DEPLOY.md](./DEPLOY.md) for full details.

## Tech Stack

- React + TypeScript + Vite
- Material UI (dark theme, glassmorphism)
- Framer Motion (animations)
- React Flow (architecture diagrams)
- Monaco Editor (code playground)
- Zustand (state management)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```
