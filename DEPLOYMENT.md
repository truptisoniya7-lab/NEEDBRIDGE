# NEEDBRIDGE — Deployment & Operations Guide

> **Document Version:** 1.0.0  
> **Platforms:** Vercel (Frontend SPA) & Render (Backend Node.js Web Service) + Supabase Cloud (PostgreSQL)

---

## Table of Contents
- [1. Deployment Overview](#1-deployment-overview)
- [2. Prerequisites](#2-prerequisites)
- [3. Environment Variables](#3-environment-variables)
- [4. Frontend Deployment (Vercel)](#4-frontend-deployment-vercel)
- [5. Backend Deployment (Render)](#5-backend-deployment-render)
- [6. Database Configuration (Supabase)](#6-database-configuration-supabase)
- [7. Authentication Configuration](#7-authentication-configuration)
- [8. CORS Configuration](#8-cors-configuration)
- [9. Production Build](#9-production-build)
- [10. Step-by-Step Deployment Guide](#10-step-by-step-deployment-guide)
- [11. Domain Configuration](#11-domain-configuration)
- [12. Post-Deployment Verification](#12-post-deployment-verification)
- [13. Common Deployment Errors](#13-common-deployment-errors)
- [14. Troubleshooting](#14-troubleshooting)
- [15. Maintenance Guidelines](#15-maintenance-guidelines)

---

## 1. Deployment Overview
NEEDBRIDGE is architected for zero-downtime, continuous deployment leveraging modern cloud PaaS providers:
- **Frontend SPA:** Deployed on **Vercel** with global edge CDN distribution and automatic routing rewrites configured via [`client/vercel.json`](file:///c:/Users/hp/OneDrive/Pictures/Desktop/NEEDBRIDGE/client/vercel.json).
- **Backend API:** Deployed on **Render** as a Node.js web service orchestrated via [`render.yaml`](file:///c:/Users/hp/OneDrive/Pictures/Desktop/NEEDBRIDGE/render.yaml).
- **Database:** Hosted on **Supabase PostgreSQL** with automated connection pooling and SQL schema migrations.

---

## 2. Prerequisites
- GitHub repository containing the complete NEEDBRIDGE codebase.
- A free **Supabase** account with a new project created.
- A free **Render** account connected to your GitHub repository.
- A free **Vercel** account connected to your GitHub repository.
- Node.js `v18+` for local CLI tools.

---

## 3. Environment Variables

### Backend Environment (`Render / server/.env`)
| Variable | Example Value | Description |
|---|---|---|
| `PORT` | `10000` | Port assigned by Render runtime |
| `NODE_ENV` | `production` | Set Node environment to production mode |
| `SUPABASE_URL` | `https://xyzproject.supabase.co` | Supabase Project API URL |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` | Supabase Public Anonymous API key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` | Optional service role key for admin tasks |
| `JWT_SECRET` | `YOUR_SECURE_RANDOM_LONG_SECRET_KEY` | HMAC secret for signing user tokens |
| `CLIENT_URL` | `https://needbridge.vercel.app` | Whitelisted frontend domain for CORS |

### Frontend Environment (`Vercel / client/.env`)
| Variable | Example Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://needbridge-api.onrender.com/api` | Base URL of deployed Render REST API |

---

## 4. Frontend Deployment (Vercel)
1. In Vercel, click **Add New &rarr; Project**.
2. Select your NEEDBRIDGE repository.
3. Configure the build parameters:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. The repository includes [`client/vercel.json`](file:///c:/Users/hp/OneDrive/Pictures/Desktop/NEEDBRIDGE/client/vercel.json) ensuring all SPA sub-paths (`/browse`, `/requests/:id`, `/dashboard`) redirect to `index.html`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 5. Backend Deployment (Render)
Render is automated via [`render.yaml`](file:///c:/Users/hp/OneDrive/Pictures/Desktop/NEEDBRIDGE/render.yaml):
1. In Render, select **New &rarr; Blueprint**.
2. Connect your repository. Render automatically reads `render.yaml`:
```yaml
services:
  - type: web
    name: needbridge-api
    env: node
    rootDir: server
    buildCommand: npm install && npm run build
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```
3. In the Render service dashboard, supply your production values for `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `CLIENT_URL`.

---

## 6. Database Configuration (Supabase)
1. Open your Supabase project dashboard.
2. Navigate to the **SQL Editor** in the left sidebar.
3. Open [`server/supabase_schema.sql`](file:///c:/Users/hp/OneDrive/Pictures/Desktop/NEEDBRIDGE/server/supabase_schema.sql) and paste the entire script.
4. Click **Run**. This creates:
   - Extensions: `uuid-ossp`
   - Tables: `profiles`, `categories`, `requests`, `responses`
   - Foreign key cascading rules
   - Default seed categories
   - Row Level Security (RLS) policies

---

## 7. Authentication Configuration
- Ensure `JWT_SECRET` is set to a cryptographically secure 64-character random string in production.
- Token expiration defaults to 7 days (`7d`).
- User passwords are automatically hashed with 10 salt rounds prior to persistence.

---

## 8. CORS Configuration
CORS is actively enforced in [`server/src/index.ts`](file:///c:/Users/hp/OneDrive/Pictures/Desktop/NEEDBRIDGE/server/src/index.ts):
```typescript
app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,
  })
);
```
Ensure your deployed Vercel domain (`https://needbridge.vercel.app`) is set as `CLIENT_URL` on Render.

---

## 9. Production Build
Test production builds locally before deployment:
```bash
# Build client
cd client && npm run build

# Build server
cd ../server && npm run build
```

---

## 10. Step-by-Step Deployment Guide
1. **Step 1:** Push code to GitHub repository.
2. **Step 2:** Execute `supabase_schema.sql` in Supabase SQL editor.
3. **Step 3:** Deploy backend on Render (`rootDir: server`). Obtain the live Render URL.
4. **Step 4:** Deploy frontend on Vercel (`rootDir: client`). Obtain live Vercel URL.
5. **Step 5:** Add `CLIENT_URL` to Render environment pointing to Vercel URL.
6. **Step 6:** Update client API endpoint pointing to Render URL.

---

## 11. Domain Configuration
To attach custom domains:
- **Vercel:** Add custom domain (e.g. `needbridge.org`) in Project Settings &rarr; Domains &rarr; Add CNAME record `cname.vercel-dns.com`.
- **Render:** Add custom domain in Service Settings &rarr; Custom Domains &rarr; Add CNAME pointing to `onrender.com`.

---

## 12. Post-Deployment Verification
Run these checks against your live URLs:
1. `GET https://your-backend.onrender.com/api/health` &rarr; Returns HTTP 200 with `status: healthy`.
2. Open frontend URL &rarr; Confirm hero banner, categories, and seed requests load properly.
3. Test User Sign-In &rarr; Verify JWT token is received and user profile displays in header.
4. Post a Test Request &rarr; Verify request appears in the browse feed and dashboard.

---

## 13. Common Deployment Errors

| Error | Root Cause | Solution |
|---|---|---|
| **CORS Policy Error** | `CLIENT_URL` on backend does not match Vercel URL | Update `CLIENT_URL` on Render and trigger redeploy. |
| **404 on Page Refresh (Vercel)** | Missing SPA rewrite rule | Ensure [`client/vercel.json`](file:///c:/Users/hp/OneDrive/Pictures/Desktop/NEEDBRIDGE/client/vercel.json) is present in `client/`. |
| **Render Spin-down Delay** | Free tier Render instances sleep after 15 min | First request may take 30-40 seconds to warm up. |
| **Supabase Connection Timeout** | Invalid `SUPABASE_URL` or network rule | Double check project URL and ensure anon key is valid. |

---

## 14. Troubleshooting
- Inspect backend server logs directly in the Render logs tab.
- Inspect client runtime console errors using browser DevTools (F12 &rarr; Console / Network).
- Verify database tables in Supabase Table Editor.

---

## 15. Maintenance Guidelines
- Regularly run `npm audit` to check for security advisories.
- Periodically clean up closed or deleted requests older than 180 days.
- Retain automated backups through Supabase point-in-time recovery (PITR).
