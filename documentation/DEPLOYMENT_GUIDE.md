# Employee Management System (EMS) — Production Deployment Guide

This guide provides end-to-end instructions for deploying the full-stack Employee Management System across multiple cloud infrastructures and container environments.

---

## Table of Contents
1. [Deployment Architectures Overview](#1-deployment-architectures-overview)
2. [Option A: One-Click Render Deployment (Recommended)](#2-option-a-one-click-render-deployment-recommended)
3. [Option B: Decoupled Cloud (Vercel Frontend + Render Backend)](#3-option-b-decoupled-cloud-vercel-frontend--render-backend)
4. [Option C: Decoupled Cloud (Netlify Frontend + Render Backend)](#4-option-c-decoupled-cloud-netlify-frontend--render-backend)
5. [Option D: Production Docker & Docker Compose](#5-option-d-production-docker--docker-compose)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Post-Deployment Health Verification](#7-post-deployment-health-verification)

---

## 1. Deployment Architectures Overview

| Deployment Mode | Backend Host | Frontend Host | Best For | Setup Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Unified Render Blueprint** | Render Web Service | Render Static Site | Full automation from a single blueprint | Low (1 click) |
| **Vercel + Render** | Render Web Service | Vercel Edge SPA | Edge-accelerated global frontend delivery | Low |
| **Netlify + Render** | Render Web Service | Netlify SPA | Fast global CDN with automated previews | Low |
| **Docker Compose** | Linux Container (Gunicorn) | Nginx Container | Self-hosted VPS / On-prem / AWS EC2 | Medium |

---

## 2. Option A: One-Click Render Deployment (Recommended)

Render deploys both the backend API and frontend static site automatically using [`render.yaml`](file:///c:/Users/Dead%20Eye/Documents/activ/render.yaml).

### Steps:
1. Click the **Deploy to Render** button in the README or visit:
   `https://render.com/deploy?repo=https://github.com/Festus12lo/Employee-Management-System`
2. Sign in to your Render account.
3. Render parses `render.yaml` and provisions two connected services:
   - **`ems-backend`**: Python 3.12 Web Service running Gunicorn. Automatically runs migrations, seeds 8 initial employees, and collects static files.
   - **`ems-frontend`**: React 19 + Vite Static Site with SPA catch-all rewrite rules. Render automatically binds `VITE_API_URL` to `ems-backend`.
4. Click **Apply**. Once build steps complete (typically 2–3 minutes), Render provides live HTTPS URLs for both services.

---

## 3. Option B: Decoupled Cloud (Vercel Frontend + Render Backend)

### Step 1: Deploy Backend to Render or Railway
1. Create a Web Service pointing to `backend/`.
2. Set Build Command:
   ```bash
   pip install -r requirements.txt && python manage.py migrate && python manage.py seed_employees && python manage.py collectstatic --noinput
   ```
3. Set Start Command:
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
   ```
4. Note your backend URL (e.g., `https://ems-backend.onrender.com`).

### Step 2: Deploy Frontend to Vercel
1. Click the **Deploy with Vercel** button or import your repository on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://ems-backend.onrender.com/api`
4. Click **Deploy**. Vercel detects Vite and builds the production bundle with client-side routing rewrites from [`frontend/vercel.json`](file:///c:/Users/Dead%20Eye/Documents/activ/frontend/vercel.json).

---

## 4. Option C: Decoupled Cloud (Netlify Frontend + Render Backend)

### Steps:
1. Import the repository on [netlify.com](https://www.netlify.com).
2. Netlify detects the repository configuration:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. In **Site Configuration > Environment Variables**, add:
   - `VITE_API_URL`: `https://ems-backend.onrender.com/api`
4. Click **Deploy Site**. The pre-configured [`frontend/public/_redirects`](file:///c:/Users/Dead%20Eye/Documents/activ/frontend/public/_redirects) and [`netlify.toml`](file:///c:/Users/Dead%20Eye/Documents/activ/netlify.toml) ensure proper SPA route handling without 404 errors on page reloads.

---

## 5. Option D: Production Docker & Docker Compose

Deploy the complete multi-tier application anywhere Docker is installed with a single command.

### Single Command Launch:
```bash
docker compose up --build -d
```

### What happens:
1. **`ems-backend` container**:
   - Built on `python:3.12-slim`.
   - Compiles requirements, executes database migrations, seeds demonstration workforce records, collects static files via WhiteNoise, and launches multi-worker Gunicorn on port `8000`.
2. **`ems-frontend` container**:
   - Built via multi-stage Dockerfile (Node 22 compiles TypeScript/Vite, Nginx Alpine serves static production build).
   - Listens on port `3000` and proxies SPA routes.

### Access:
- Frontend Dashboard: `http://localhost:3000`
- Backend REST API: `http://localhost:8000/api/employees/`
- API Health Status: `http://localhost:8000/api/health/`

### Stopping the stack:
```bash
docker compose down
```

---

## 6. Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Default (Local) | Production Example | Description |
| :--- | :--- | :--- | :--- |
| `SECRET_KEY` | Development key | *(Cryptographically secure random string)* | Django security signing key |
| `DEBUG` | `True` | `False` | Disables debug stacktraces in production |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | `*` or `.onrender.com,.vercel.app` | Comma-separated allowed HTTP Host headers |
| `CORS_ALLOW_ALL_ORIGINS` | `True` | `True` or `False` | Permits cross-origin requests from frontend hosts |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | `https://your-frontend.vercel.app` | Specific permitted client origins |
| `CSRF_TRUSTED_ORIGINS` | `http://localhost:5173` | `https://*.onrender.com,https://*.vercel.app` | Allowed origins for secure CSRF form validation |
| `PORT` | `8000` | Render/Railway dynamically assigns `$PORT` | Application server listening port |

### Frontend (`frontend/.env`)

| Variable | Default (Local) | Production Example | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | `http://127.0.0.1:8000/api` | `https://ems-backend.onrender.com/api` | Endpoint for backend REST service (auto-normalizes missing protocol or path) |

---

## 7. Post-Deployment Health Verification

After deploying, verify that all services are operational:

1. **REST API Health Check**:
   ```bash
   curl -I https://<your-backend-host>/api/health/
   # Expected: HTTP/1.1 200 OK
   ```

2. **Employee Listing Endpoint**:
   ```bash
   curl https://<your-backend-host>/api/employees/
   # Expected: JSON array of 8 seeded employee objects
   ```

3. **Frontend Dashboard**:
   - Open your frontend URL in the browser.
   - Confirm stat metric cards (Total: 8, Active: 7, Inactive/Leave: 1) render without errors.
   - Verify searching (e.g. typing "Jane") filters results in real time.
   - Verify modal creation works and triggers floating toast notifications.
   - Reload a deep route (e.g. `/employees`) to confirm SPA rewrites function without 404 errors.
