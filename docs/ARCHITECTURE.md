# System Architecture Documentation

This document outlines the software architecture, design patterns, folder structure, and tech stack of the **Codezilla Technologies** platform.

---

## 🏗️ High-Level Architecture Overview

Codezilla is built as a full-stack, server-rendered React application utilizing the **Next.js 16 App Router** pattern powered by **React 19** and **Supabase Backend-as-a-Service (BaaS)**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Client Browser                                │
│        (React 19 Server Components & Framer Motion UI Components)      │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │ HTTP / HTTPS                    │ Supabase SDK
                   ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│       Next.js Server / API           │  │    Supabase Auth & Storage   │
│   - App Router Route Handlers        │  │  - User Auth / JWT Tokens    │
│   - @supabase/server SDK             │  │  - Storage Buckets (Resumes) │
└──────────────────┬───────────────────┘  └──────────────┬───────────────┘
                   │ Direct Postgres Connection          │ SQL / RLS
                   ▼                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Supabase PostgreSQL Database                      │
│        (Profiles, Blogs, Jobs, Applications, Projects, RBAC)           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | `16.3.0` | React Framework with App Router & React Compiler |
| **UI Library** | React | `19.2.8` | Component rendering engine |
| **Styling** | TailwindCSS | `v4` | Utility-first CSS framework with custom design system |
| **Animations** | Framer Motion | `^13.0.0` | Fluid animations, page transitions, and micro-interactions |
| **Icons** | Lucide React | `^1.28.0` | Clean vector icons |
| **Markdown** | Marked | `^18.0.9` | Client-side and server-side markdown parsing for blog posts |
| **Backend / DB** | Supabase Postgres | - | PostgreSQL database with Row Level Security (RLS) |
| **Supabase SSR** | `@supabase/ssr` / `@supabase/server` | `^0.12.4` / `^1.4.1` | Cookie-based Server-Side Auth and context clients |

---

## 📁 Repository Structure

```
codezilla-website/
├── docs/                      # Architectural & engineering documentation
│   ├── ADMIN_DASHBOARD.md
│   ├── API_REFERENCE.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT.md
│   └── GETTING_STARTED.md
├── public/                    # Static assets (images, logos, icons)
├── src/
│   ├── app/                   # Next.js App Router (Pages, API Routes, Layouts)
│   │   ├── admin/             # Authenticated Admin Dashboard interface
│   │   ├── admin-signin/      # Admin Auth authentication view
│   │   ├── api/               # Server-side API Endpoints (JSON APIs)
│   │   │   ├── admin/         # Protected management APIs
│   │   │   ├── blogs/         # Public blog endpoints
│   │   │   ├── contact/       # Form submission endpoints
│   │   │   └── ...            # Other module route handlers
│   │   ├── blog/              # Public blog listing & detail pages
│   │   ├── careers/           # Public careers & hiring page
│   │   ├── contact/           # Contact form page
│   │   ├── privacy/           # Legal privacy policy page
│   │   ├── talent-acquisition/# Job application submission portal
│   │   ├── team/              # Team member showcase
│   │   ├── terms/             # Terms of service page
│   │   ├── globals.css        # Global CSS, font imports, Tailwind setup
│   │   ├── layout.tsx         # Root application layout
│   │   └── page.tsx           # Home landing page
│   ├── components/            # Reusable UI Components
│   │   ├── admin/             # Admin panel sub-components
│   │   ├── ui/                # Generic UI primitives
│   │   ├── Header.tsx         # Site navigation header
│   │   ├── Footer.tsx         # Site footer navigation
│   │   ├── Hero.tsx           # Hero section animation
│   │   ├── Services.tsx       # Offered services grid
│   │   ├── Portfolio.tsx      # Showcase of projects
│   │   └── ...                # Dedicated section components
│   ├── utils/                 # Helpers and utility libraries
│   │   ├── admin-auth.ts      # Server-side admin verification helpers
│   │   ├── admin.ts           # Admin utility functions
│   │   └── supabase/          # Supabase client factories
│   │       ├── client.ts      # Browser-side Supabase client
│   │       ├── server.ts      # Server-side cookie-aware Supabase client
│   │       └── admin.ts       # Service-role administrative Supabase client
├── supabase/
│   └── schema.sql             # SQL schema definition, RLS policies, & triggers
├── .env.example               # Environment variables specification
├── next.config.ts             # Next.js runtime configuration
├── package.json               # Dependencies and build scripts
└── tsconfig.json              # TypeScript compiler settings
```

---

## 🔒 Security & Auth Architecture

### 1. Authentication Engine
Authentication relies on Supabase Auth. Sessions are stored in HTTP-only, secure cookies handled via `@supabase/ssr` (`src/utils/supabase/server.ts`).

### 2. Role-Based Access Control (RBAC)
User authorization is enforced through a dual layer:
1. **Database Row Level Security (RLS)**: Enforces access policies directly in PostgreSQL based on `auth.uid()` and the `profiles.role` column.
2. **Server-Side Helper Verification**: `src/utils/admin-auth.ts` verifies user authentication and checks against the `ADMIN` environment variable or `profiles.role = 'admin'` before servicing API requests.

### 3. Server vs. Client Components

- **Server Components**: Used by default for page layouts, static content rendering, metadata generation, and initial data fetching.
- **Client Components** (`'use client'`): Used for interactive forms, admin panel tabs, animated buttons, modal dialogues, and live filtering.

---

## 🎨 Design System & Styling

- **Theme Palette**: Rich dark themes with vibrant accents (`#111827`, `#1F2937`, emerald, cyan, and purple highlights).
- **Glassmorphism**: Subtle backdrops with `backdrop-blur-md` and semi-transparent borders.
- **Typography**: Optimized clean sans-serif font stack.

---

## 📁 Related Documentation

- 🚀 [Getting Started Guide](./GETTING_STARTED.md)
- 🗄️ [Database Schema Reference](./DATABASE_SCHEMA.md)
- 🔌 [API Endpoint Reference](./API_REFERENCE.md)
- 🛡️ [Admin Dashboard Guide](./ADMIN_DASHBOARD.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
