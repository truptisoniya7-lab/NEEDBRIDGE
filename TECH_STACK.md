# NEEDBRIDGE — Technology Stack & Dependencies

> **Document Version:** 1.0.0  
> **Source Verification:** Verified directly against repository `package.json` files.

---

## Table of Contents
- [1. Technology Overview](#1-technology-overview)
- [2. Frontend Technologies](#2-frontend-technologies)
- [3. Backend Technologies](#3-backend-technologies)
- [4. Database Technologies](#4-database-technologies)
- [5. Authentication Tools](#5-authentication-tools)
- [6. UI and Styling Libraries](#6-ui-and-styling-libraries)
- [7. API and Integration Tools](#7-api-and-integration-tools)
- [8. Development Tools](#8-development-tools)
- [9. Version Control](#9-version-control)
- [10. Deployment Platforms](#10-deployment-platforms)
- [11. Technology Justification](#11-technology-justification)
- [12. Dependencies and Their Purposes](#12-dependencies-and-their-purposes)

---

## 1. Technology Overview
NEEDBRIDGE utilizes a modern TypeScript full-stack ecosystem engineered for rapid execution, type safety, low bundle overhead, and frictionless local testing:
- **Client Tier:** React 18 with TypeScript and Vite.
- **Styling Tier:** Tailwind CSS with Lucide React iconography and shadcn-style UI primitives.
- **Server Tier:** Node.js with Express.js and TypeScript.
- **Database Tier:** Supabase PostgreSQL with SQL schema and fallback memory data access layer.
- **Auth Tier:** Cryptographic JWT token-based authentication paired with bcryptjs password hashing.

---

## 2. Frontend Technologies
- **React (`^18.3.1`):** Industry-standard component-based library for declarative user interfaces.
- **TypeScript (`~5.7.2`):** Compile-time static type verification preventing runtime property errors.
- **Vite (`^6.1.0`):** Ultra-fast ESM-based frontend dev server and production bundler with Rollup.
- **React Router DOM (`^6.28.2`):** Declarative client-side routing, protected route guards, and URL query param state binding.

---

## 3. Backend Technologies
- **Node.js (`v26.3.0` runtime environment):** Asynchronous event-driven JavaScript runtime.
- **Express.js (`^4.21.2`):** Minimalist, flexible web framework for building RESTful microservices and routing.
- **TypeScript (`^5.7.3`):** Strongly typed backend development with compile-to-JS pipeline.
- **ts-node-dev (`^2.0.0`):** Fast development runner with automatic server reloading on code change.

---

## 4. Database Technologies
- **Supabase PostgreSQL (`@supabase/supabase-js ^2.49.1`):** Managed relational database with SQL DDL migrations, Row Level Security (RLS), and connection pooling.
- **Integrated In-Memory Data Store:** High-performance fallback data layer enabling zero-setup local demonstration out of the box.

---

## 5. Authentication Tools
- **JSON Web Tokens (`jsonwebtoken ^9.0.2`):** Compact, URL-safe cryptographic tokens for stateless user sessions.
- **Bcrypt (`bcryptjs ^3.0.2`):** Cryptographic password hashing algorithm utilizing a work factor of 10 to resist rainbow-table and brute-force attacks.

---

## 6. UI and Styling Libraries
- **Tailwind CSS (`^3.4.17`):** Utility-first CSS framework delivering responsive layouts and clean glassmorphism aesthetics.
- **Lucide React (`^0.475.0`):** Modern SVG icon collection matching design guidelines.
- **clsx (`^2.1.1`) & tailwind-merge (`^2.6.0`):** Utility helpers for conditional class merging and resolving Tailwind rule conflicts.
- **PostCSS (`^8.5.2`) & Autoprefixer (`^10.4.20`):** CSS transformations and automated vendor prefixing.

---

## 7. API and Integration Tools
- **Native Browser Fetch API:** Modern HTTP client for lightweight asynchronous REST operations.
- **CORS (`cors ^2.8.5`):** Cross-Origin Resource Sharing middleware restricting API access to authorized frontend origins.
- **Dotenv (`dotenv ^16.4.7`):** Environment variable loader for separating secrets from code.
- **Automated Test Suite (`test_api.js`):** Native Node.js HTTP integration test runner.

---

## 8. Development Tools
- **Concurrently (`concurrently ^9.1.2`):** Monorepo runner executing client and server concurrently from root.
- **TypeScript Compiler (`tsc`):** Strict compilation checking and DTO generation.
- **Postman:** REST API manual inspection and endpoint validation tool.

---

## 9. Version Control
- **Git (`git version 2.54.0.windows.1`):** Distributed source code version control.
- **GitHub:** Remote repository hosting and collaboration workflow.

---

## 10. Deployment Platforms
- **Vercel:** Optimized static host for the React Vite SPA frontend with automated HTTPS and edge rewrites via `vercel.json`.
- **Render:** Cloud platform for deploying the Node.js Express API service configured via `render.yaml`.
- **Supabase Cloud:** Managed PostgreSQL hosting with web SQL query editor.

---

## 11. Technology Justification

| Technology Choice | Key Reason for Selection | Alternative Evaluated |
|---|---|---|
| **Vite over Create React App** | Sub-second Hot Module Replacement (HMR) and optimized Rollup production builds. | CRA (deprecated, slow build times) |
| **Tailwind CSS over CSS Modules** | Eliminates CSS bloat; enables rapid responsive design prototyping directly in TSX. | Vanilla CSS / Styled Components |
| **Express + TypeScript over NestJS** | Minimalist footprint, zero unnecessary boilerplate, transparent middleware pipeline. | NestJS (over-engineered for this scope) |
| **Supabase over Raw Mongo** | Relational integrity with foreign keys for users, categories, and offers; built-in RLS. | MongoDB (lacks native relational constraints) |
| **Dual-Mode Persistence** | Guarantees instant evaluator runnability without requiring local database daemons. | SQLite-only or Cloud-only |

---

## 12. Dependencies and Their Purposes
*Derived directly from root, client, and server `package.json` manifests:*

### Root (`package.json`)
| Package | Version | Purpose |
|---|---|---|
| `concurrently` | `^9.1.2` | Runs both client (`5173`) and server (`5000`) concurrently via `npm run dev`. |

### Client (`client/package.json`)
| Package | Version | Purpose |
|---|---|---|
| `react` | `^18.3.1` | Core UI library for component hierarchy. |
| `react-dom` | `^18.3.1` | DOM renderer for React. |
| `react-router-dom` | `^6.28.2` | Declarative routing and browser history management. |
| `lucide-react` | `^0.475.0` | Iconography across categories, navigation, and badges. |
| `@supabase/supabase-js` | `^2.49.1` | Supabase JavaScript client for cloud database interactions. |
| `clsx` | `^2.1.1` | Dynamic conditional class merging. |
| `tailwind-merge` | `^2.6.0` | Prevents Tailwind utility conflicts. |
| `vite` (dev) | `^6.1.0` | Fast bundler and development server. |
| `typescript` (dev) | `~5.7.2` | Client-side static type safety. |
| `tailwindcss` (dev) | `^3.4.17` | Utility-first CSS compiler. |
| `postcss` (dev) | `^8.5.2` | Tool for transforming styles with JS plugins. |
| `autoprefixer` (dev) | `^10.4.20` | Automatic browser prefixing. |
| `@vitejs/plugin-react` (dev) | `^4.3.4` | Vite plugin for React fast refresh and JSX. |

### Server (`server/package.json`)
| Package | Version | Purpose |
|---|---|---|
| `express` | `^4.21.2` | Web server framework and routing. |
| `cors` | `^2.8.5` | Cross-Origin header management for API security. |
| `dotenv` | `^16.4.7` | Loads environment configurations from `.env`. |
| `jsonwebtoken` | `^9.0.2` | Generates and verifies JWT bearer tokens. |
| `bcryptjs` | `^3.0.2` | Salts and hashes user passwords. |
| `@supabase/supabase-js` | `^2.49.1` | Supabase SDK for PostgreSQL operations and queries. |
| `typescript` (dev) | `^5.7.3` | Server-side TypeScript compiler. |
| `ts-node-dev` (dev) | `^2.0.0` | Live development reloader for TypeScript Node scripts. |
| `@types/express` (dev) | `^4.17.21` | Type definitions for Express. |
| `@types/cors` (dev) | `^2.8.17` | Type definitions for CORS. |
| `@types/jsonwebtoken` (dev) | `^9.0.9` | Type definitions for JWT. |
| `@types/bcryptjs` (dev) | `^2.4.6` | Type definitions for bcrypt. |
| `@types/node` (dev) | `^22.13.1` | Type definitions for Node runtime APIs. |
