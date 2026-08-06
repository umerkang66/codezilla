# Codezilla Technologies

![Codezilla Technologies Banner](./public/codezilla_small.jpeg)

Next-generation corporate agency website and content management system built for high performance, security, and developer productivity using Next.js 16, React 19, TailwindCSS v4, and Supabase.

---

## Core Capabilities

- **Next.js 16 App Router**: Server-rendered React 19 architecture offering optimal page speed, streaming SSR, and built-in search engine optimization.
- **Role-Based Access Control**: Multi-tier authentication and authorization powered by Supabase Auth and PostgreSQL Row Level Security (RLS).
- **Glassmorphism Design System**: Clean dark-mode aesthetic with fluid Framer Motion transitions and custom component design system.
- **Comprehensive Agency Suite**: Public showcases for client projects, service offerings, team rosters, customer testimonials, blog publications, and hiring workflows.
- **Administrative CMS Portal**: Centralized administration dashboard at `/admin` for real-time article publishing, job application processing, contact lead evaluation, and role management.

---

## Technology Stack

<table width="100%">
  <tr>
    <td width="33%" align="center" valign="top">
      <img src="https://raw.githubusercontent.com/github/explore/main/topics/nextjs/nextjs.png" width="48" height="48" alt="Next.js" /><br/><br/>
      <b>Next.js 16</b><br/>
      <sub>App Router & Server Components</sub>
    </td>
    <td width="33%" align="center" valign="top">
      <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" width="48" height="48" alt="React" /><br/><br/>
      <b>React 19</b><br/>
      <sub>Server & Client UI Rendering</sub>
    </td>
    <td width="33%" align="center" valign="top">
      <img src="https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png" width="48" height="48" alt="TypeScript" /><br/><br/>
      <b>TypeScript 5</b><br/>
      <sub>Strict End-to-End Typing</sub>
    </td>
  </tr>
  <tr>
    <td width="33%" align="center" valign="top">
      <img src="https://raw.githubusercontent.com/github/explore/main/topics/tailwind/tailwind.png" width="48" height="48" alt="Tailwind CSS" /><br/><br/>
      <b>TailwindCSS v4</b><br/>
      <sub>Utility-First Responsive Styling</sub>
    </td>
    <td width="33%" align="center" valign="top">
      <img src="https://raw.githubusercontent.com/github/explore/main/topics/supabase/supabase.png" width="48" height="48" alt="Supabase" /><br/><br/>
      <b>Supabase Postgres</b><br/>
      <sub>Relational DB & RLS Security</sub>
    </td>
    <td width="33%" align="center" valign="top">
      <img src="https://raw.githubusercontent.com/github/explore/main/topics/framer/framer.png" width="48" height="48" alt="Framer Motion" /><br/><br/>
      <b>Framer Motion</b><br/>
      <sub>Fluid Animations & Transitions</sub>
    </td>
  </tr>
</table>

<br/>

### Framework & Core Engine
| Card | Technology | Version | Purpose |
| :---: | :--- | :--- | :--- |
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) | **Next.js** | `16.3.0` | App Router & Server Components |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | **React** | `19.2.8` | Server and Client UI rendering |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) | **TypeScript** | `^5.0.0` | Strict static typing across codebase |

### Database & Authentication
| Card | Technology | Version | Purpose |
| :---: | :--- | :--- | :--- |
| ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) | **Supabase** | `^2.112.0` | Postgres BaaS & Row Level Security |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) | **PostgreSQL** | `v15+` | Relational data persistence |
| ![Auth](https://img.shields.io/badge/Supabase_SSR-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) | **Supabase SSR** | `^0.12.4` | Cookie-based session management |

### Styling & Motion
| Card | Technology | Version | Purpose |
| :---: | :--- | :--- | :--- |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | **TailwindCSS** | `v4` | Utility-first responsive design |
| ![Framer](https://img.shields.io/badge/Framer-0055FF?style=for-the-badge&logo=framer&logoColor=white) | **Framer Motion** | `^13.0.0` | Layout animations & micro-interactions |
| ![Lucide](https://img.shields.io/badge/Lucide_Icons-F34F29?style=for-the-badge&logo=feather&logoColor=white) | **Lucide React** | `^1.28.0` | Iconography suite |

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
