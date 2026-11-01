# NEEDBRIDGE

> **"Someone needs it. Someone has it. Let's connect."**

NEEDBRIDGE is a full-stack community assistance and resource-sharing platform engineered to connect individuals who require help with peers, neighbors, and volunteers willing to provide assistance. Whether students sharing academic textbooks and equipment, neighbors providing emergency food supplies, volunteers offering transportation assistance, or local community members providing hardware repairs, NEEDBRIDGE simplifies mutual aid through direct collaboration.

---

## Table of Contents

- [1. Project Title](#1-project-title)
- [2. Project Introduction](#2-project-introduction)
- [3. Problem Statement](#3-problem-statement)
- [4. Project Objectives](#4-project-objectives)
- [5. Key Features](#5-key-features)
- [6. Technology Overview](#6-technology-overview)
- [7. System Requirements](#7-system-requirements)
- [8. Installation Instructions](#8-installation-instructions)
- [9. Environment Configuration](#9-environment-configuration)
- [10. Running the Application](#10-running-the-application)
- [11. Project Structure](#11-project-structure)
- [12. Application Screenshots](#12-application-screenshots)
- [13. Deployment Information](#13-deployment-information)
- [14. Future Enhancements](#14-future-enhancements)
- [15. Contributing Guidelines](#15-contributing-guidelines)
- [16. License](#16-license)

---

## 1. Project Title
**NEEDBRIDGE** — Community Assistance and Mutual Aid Platform

## 2. Project Introduction
In campuses, local neighborhoods, and volunteer communities, people frequently face temporary resource deficits—a student missing a vital course textbook before midterms, a family experiencing grocery shortages between paychecks, or an elderly resident needing transportation to a medical clinic. Concurrently, neighboring community members frequently possess the exact idle resources, skills, or capacity required to fulfill these needs. NEEDBRIDGE acts as a transparent digital bridge, closing the gap with peer-to-peer connection and zero monetization barriers.

## 3. Problem Statement
Existing platforms suffer from significant limitations:
- **Commercial Marketplaces (Craigslist, Facebook Marketplace):** Focus heavily on monetary sales rather than mutual aid, creating financial barriers for vulnerable individuals.
- **Social Media Groups (WhatsApp, Reddit, Telegram):** Rapid chat velocity buries urgent requests within hours, lacking categorization, status tracking, urgency tags, or resolution confirmation.
- **Traditional Charity Portals:** Involve cumbersome bureaucratic intake procedures that delay emergency assistance by days or weeks.

NEEDBRIDGE directly resolves these pain points with structured request management, category filtering, real-time urgency indicators, volunteer offer coordination, and community impact tracking.

## 4. Project Objectives
- Provide a responsive, high-performance web interface for posting and discovering community needs.
- Enable community volunteers to review, filter, and offer targeted assistance quickly.
- Deliver real-time status management (`open` &rarr; `in_progress` &rarr; `resolved`).
- Foster local community resilience through transparent, non-monetized mutual aid.
- Maintain a secure, privacy-respecting architecture with authenticated communications and configurable cloud or local storage.

## 5. Key Features
The following features are fully implemented and verified in the source code:

| Feature | Status | Description |
|---|---|---|
| **User Authentication** | **Implemented** | JWT-based authentication with bcrypt password hashing, token persistence, and role assignment (`user` vs `volunteer`). |
| **User Profiles** | **Implemented** | Customizable profiles featuring full names, bios, contact phones, neighborhoods/locations, and avatar URLs. |
| **Create Assistance Request** | **Implemented** | Multi-field form capturing title, category, description, urgency level, safe location, contact coordinates, and optional image URL. |
| **Browse Community Requests** | **Implemented** | Paginated/filtered catalog with full-text search, category selection, urgency filters (`low`, `medium`, `high`, `critical`), and status filters. |
| **Categorization System** | **Implemented** | 7 pre-seeded categories (Academic, Food, Transportation, Health, Household, Tech, Other) with distinct Lucide icons and color tags. |
| **Offer Assistance Workflow** | **Implemented** | Interactive modal enabling helpers to propose assistance with messages and contact numbers. |
| **Response Management** | **Implemented** | Requesters can review offers, accept help, decline offers, and mark assistance as completed. |
| **Request Status Tracking** | **Implemented** | Full lifecycle tracking across `open`, `in_progress`, `resolved`, and `closed` states. |
| **Mark as Resolved** | **Implemented** | Dedicated resolution control updating community metrics and closing requests. |
| **Personal Dashboard** | **Implemented** | Dual-tab dashboard displaying "My Requests" and "My Offers" with personal KPI cards. |
| **Community Impact Statistics** | **Implemented** | Real-time aggregate statistics tracking total needs, resolved requests, active helpers, and resolution success rates. |

## 6. Technology Overview
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router v6.
- **Backend:** Node.js, Express.js, TypeScript, JSON Web Tokens (JWT), bcryptjs, CORS.
- **Database:** Supabase PostgreSQL with schema definitions, Row Level Security (RLS), and an integrated fallback data store for zero-config local execution.
- **Deployment:** Vercel (Frontend SPA rewrite), Render (Node.js REST service via `render.yaml`).

## 7. System Requirements
- **Node.js:** v18.0.0 or higher (Tested and verified on Node.js v26.3.0).
- **npm:** v9.0.0 or higher (Tested and verified on npm v11.16.0).
- **Operating System:** Windows, macOS, or Linux.
- **Browser:** Modern Evergreen browser (Chrome, Firefox, Safari, Edge).

## 8. Installation Instructions

1. Clone or navigate to the repository directory:
```bash
cd NEEDBRIDGE
```

2. Install all root, server, and client dependencies with a single command:
```bash
npm run install:all
```
*(Alternatively, execute `npm install` inside the root, `client/`, and `server/` directories).*

## 9. Environment Configuration

### Backend Configuration (`server/.env`)
Create or edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=needbridge_jwt_secret_development_key_12345
CLIENT_URL=http://localhost:5173
```
> *Note: If Supabase credentials are left with defaults/placeholders, the server automatically runs using its built-in memory datastore pre-seeded with community requests.*

### Frontend Configuration (`client/.env`)
Client automatically proxies `/api` calls to `http://localhost:5000` via `vite.config.ts`.

## 10. Running the Application

To run both frontend and backend concurrently in development mode:
```bash
npm run dev
```

Or run services individually:
- **Client only:** `npm run dev:client` (Serves on `http://localhost:5173`)
- **Server only:** `npm run dev:server` (Serves on `http://localhost:5000`)

### Pre-Seeded Demo Test Accounts
For instant testing, use either of the pre-seeded accounts:
- **Requester:** `sarah.c@community.org` / `password123`
- **Volunteer Helper:** `marcus.j@volunteer.net` / `password123`

## 11. Project Structure
```
NEEDBRIDGE/
├── client/                     # Frontend Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── CategoryIcon.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ImpactBanner.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── RequestCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── UrgencyBadge.tsx
│   │   ├── context/            # React AuthContext
│   │   │   └── AuthContext.tsx
│   │   ├── pages/              # Application pages
│   │   │   ├── BrowseRequestsPage.tsx
│   │   │   ├── CreateRequestPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── RequestDetailPage.tsx
│   │   ├── services/           # REST API client
│   │   │   └── api.ts
│   │   ├── types/              # Client TypeScript definitions
│   │   │   └── index.ts
│   │   ├── App.tsx             # Routing & Layout container
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.tsx            # React DOM mounting
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json             # Vercel SPA rewrite config
│   └── vite.config.ts
├── server/                     # Backend REST API
│   ├── src/
│   │   ├── config/             # Supabase & environment config
│   │   │   └── supabase.ts
│   │   ├── controllers/        # Request/Response/Auth logic
│   │   │   ├── authController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── dashboardController.ts
│   │   │   ├── requestController.ts
│   │   │   └── responseController.ts
│   │   ├── middleware/         # JWT auth middleware
│   │   │   └── auth.ts
│   │   ├── models/             # Data access layer & seed data
│   │   │   └── db.ts
│   │   ├── routes/             # Express route routers
│   │   │   ├── authRoutes.ts
│   │   │   ├── categoryRoutes.ts
│   │   │   ├── dashboardRoutes.ts
│   │   │   ├── requestRoutes.ts
│   │   │   └── responseRoutes.ts
│   │   ├── types/              # Server TypeScript definitions
│   │   │   └── index.ts
│   │   └── index.ts            # Express server initialization
│   ├── .env.example
│   ├── package.json
│   ├── supabase_schema.sql     # Supabase SQL DDL migration script
│   ├── test_api.js             # Automated API integration test suite
│   └── tsconfig.json
├── package.json                # Monorepo root scripts
├── render.yaml                 # Render backend deployment descriptor
└── README.md
```

## 12. Application Screenshots
```
+-----------------------------------------------------------------------------------------+
| [HandHeart] NEEDBRIDGE    Browse Requests   Urgent Needs   [Ask for Help]  [Sarah Chen] |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|      Someone needs it. Someone has it. Let's connect.                                   |
|      A peer-to-peer assistance platform connecting students and neighbors               |
|                                                                                         |
|      [ Search for textbooks, grocery aid, rides, tutoring...            ] [Find Needs]   |
|                                                                                         |
|      [+ Ask for Assistance]      [Explore Community Needs]                              |
|                                                                                         |
|  -------------------------------------------------------------------------------------  |
|  [ Impact Banner: 4 Needs Posted | 1 Resolved (25%) | 3 Volunteers | 7 Categories ]    |
|  -------------------------------------------------------------------------------------  |
|                                                                                         |
|  Active Community Needs:                                                                |
|  +-------------------------+  +-------------------------+  +-------------------------+  |
|  | [CRITICAL] [IN PROGRESS]|  | [HIGH] [OPEN]           |  | [MEDIUM] [OPEN]         |  |
|  | Ride to Central Hospital|  | Emergency Food Pantry   |  | Need CLRS Algorithms    |  |
|  | Location: Elmwood Apts  |  | Location: Oakridge Area |  | Location: University Lib|  |
|  | 2 offers received        |  | 1 offer received        |  | 1 offer received        |  |
|  +-------------------------+  +-------------------------+  +-------------------------+  |
+-----------------------------------------------------------------------------------------+
```

## 13. Deployment Information
- **Frontend Deployment (Vercel):**
  - Root Directory: `client`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Rewrites handled via [`client/vercel.json`](file:///c:/Users/hp/OneDrive/Pictures/Desktop/NEEDBRIDGE/client/vercel.json).
- **Backend Deployment (Render):**
  - Service Type: Web Service
  - Root Directory: `server`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm run start`
  - Configured via [`render.yaml`](file:///c:/Users/hp/OneDrive/Pictures/Desktop/NEEDBRIDGE/render.yaml).

## 14. Future Enhancements
- **Real-Time Push Notifications:** Integrating WebSockets / Supabase Realtime for instant in-app alerts on new assistance offers.
- **Geo-Location Radius Filtering:** Interactive map view filtering requests within a 5-mile or campus boundary.
- **Direct Peer Messaging:** End-to-end threaded messaging between requesters and verified helpers.
- **Karma & Volunteer Badging:** Gamified recognition system celebrating high-impact volunteers and NGO partners.

## 15. Contributing Guidelines
1. Fork and create a feature branch (`git checkout -b feature/mutual-aid-enhancement`).
2. Adhere to TypeScript strict mode and Tailwind CSS conventions.
3. Verify backend endpoints by running `node server/test_api.js`.
4. Ensure client builds cleanly with `npm run build --prefix client`.
5. Submit a descriptive Pull Request.

## 16. License
This project is licensed under the MIT License — open, non-profit, community-driven mutual aid.
