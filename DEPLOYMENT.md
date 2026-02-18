# Deployment (Free)

This repo is a monorepo:
- `api/` = Node/Express API (calls LeakOSINT)
- `web/` = Vite/React frontend

## 1) Deploy API on Render (free)

1. Push your code to GitHub.
2. Render → **New +** → **Web Service** → connect your repo.
3. Settings:
   - **Root Directory:** `api`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `LEAKOSINT_TOKEN` = your token
   - `LEAKOSINT_API_URL` = `https://leakosintapi.com/` (optional)
   - `CORS_ORIGINS` = `http://localhost:3000` (for local) + your Pages URL once you deploy the web
     - Example: `http://localhost:3000,https://YOUR_PROJECT.pages.dev`

After deploy, note the Render service URL:
- Example: `https://ghostinthehash-api.onrender.com`

## 2) Deploy Web on Cloudflare Pages (free)

1. Cloudflare Dashboard → **Pages** → **Create a project** → connect your GitHub repo.
2. Build settings:
   - **Root directory:** `web`
   - **Build command:** `npm install && npm run build`
   - **Build output directory:** `dist`
3. Add environment variable (Pages → Settings → Environment variables):
   - `VITE_API_URL` = `https://YOUR_RENDER_SERVICE_URL`

Deploy.

## 3) Rotate/change your API token anytime

- Render → your API service → **Environment** → change `LEAKOSINT_TOKEN` → **Deploy latest** / restart.
- No frontend rebuild required.

## Local run

- API: `npm --prefix api run dev`
- Web: `npm --prefix web run dev`
- Full stack: `npm run dev`
