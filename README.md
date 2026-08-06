# Codezilla Technologies

![Codezilla Technologies Banner](./public/codezilla_small.jpeg)

![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.x-0055FF?style=for-the-badge&logo=framer&logoColor=white)

Next-generation corporate agency website and content management system built with Next.js 16, React 19, TailwindCSS v4, and Supabase.

---

## Core Capabilities

- **Next.js 16 App Router**: Server-rendered React 19 architecture with streaming SSR and search engine optimization.
- **Role-Based Access Control**: Multi-tier authentication and authorization powered by Supabase Auth and PostgreSQL Row Level Security (RLS).
- **Glassmorphism Design System**: Dark-mode aesthetic with fluid Framer Motion transitions.
- **Comprehensive Agency Suite**: Public showcases for client projects, service offerings, team rosters, testimonials, blogs, and career portals.
- **Administrative CMS Portal**: Centralized administration dashboard at `/admin` for real-time article publishing, job application processing, contact lead evaluation, and role management.

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/umerkang66/codezilla-website.git
cd codezilla-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Provision Environment Variables

Create a local `.env` file from the example template:

```bash
cp .env.example .env
```

Populate `.env` with your Supabase keys and main admin email:

```env
ADMIN="codzilla.company@gmail.com,admin@example.com"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"
SUPABASE_SECRET_KEY="your_supabase_secret_key"
```

### 4. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Documentation Index

Detailed engineering guides, architecture blueprints, database schema specifications, and deployment procedures are available in the [`docs/`](./docs) folder:

| Document | Description |
| :--- | :--- |
| [**Getting Started Guide**](./docs/GETTING_STARTED.md) | Full setup, environment configuration, database setup, and scripts |
| [**System Architecture**](./docs/ARCHITECTURE.md) | Next.js App Router design, directory structure, and security model |
| [**Database Schema Reference**](./docs/DATABASE_SCHEMA.md) | PostgreSQL tables, RLS security policies, triggers, and functions |
| [**API Endpoint Reference**](./docs/API_REFERENCE.md) | Complete reference for public and admin REST API endpoints |
| [**Admin Dashboard Guide**](./docs/ADMIN_DASHBOARD.md) | Operational manual for RBAC, user management, and CMS operations |
| [**Production Deployment**](./docs/DEPLOYMENT.md) | Deployment workflows for Vercel, Docker, Netlify, and production Supabase |

---

## License

Private repository © **Codezilla Technologies**. All rights reserved.
