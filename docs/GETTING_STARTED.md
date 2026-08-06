# Getting Started Guide

This guide provides comprehensive instructions for setting up, configuring, running, and testing the Codezilla Technologies web application on your local development environment.

---

## Prerequisites

Ensure you have the following software installed on your machine before getting started:

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` v10+ (bundled with Node.js)
- **Git**: Latest version
- **Database**: A Supabase project (Cloud or local Supabase CLI instance)

---

## Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/umerkang66/codezilla-website.git
cd codezilla-website
```

### 2. Install Dependencies

Install all required production and development dependencies using npm:

```bash
npm install
```

---

## Environment Configuration

The application requires specific environment variables for database connectivity, authentication, and role assignment.

### 1. Copy the Environment Template

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Open `.env` and fill in your configuration:

```env
# Admin Email Accounts (Comma-separated list for super-admin privileges)
ADMIN="codzilla.company@gmail.com,admin@codezilla.tech"

# Database Credentials
DB_PASSWORD="your_postgres_password"

# Public Supabase Credentials (Used by Client Components)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"

# Supabase Server Credentials (Used by Server Components & API Routes)
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"
SUPABASE_SECRET_KEY="your_supabase_secret_key"
SUPABASE_JWKS_URL="https://your-project-id.supabase.co/auth/v1/.well-known/jwks.json"
```

> **Important**: Never commit your `.env` or `.env.production` file to version control. Keep `SUPABASE_SECRET_KEY` secure.

---

## Database Provisioning

To set up the required tables, triggers, and Row Level Security (RLS) policies:

1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Copy the contents of [`supabase/schema.sql`](../supabase/schema.sql).
3. Paste and click **Run**.

For a detailed breakdown of table schemas and policies, refer to the [Database Schema Documentation](./DATABASE_SCHEMA.md).

---

## Running the Application

### Development Mode

Start the Next.js development server with hot-reloading:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

Compile TypeScript, optimize assets, and create a production build:

```bash
npm run build
```

### Running Production Server

Start the production server locally after running `npm run build`:

```bash
npm run start
```

### Code Linting

Run ESLint to check for code quality and syntax issues:

```bash
npm run lint
```

---

## Related Documentation

- [Architecture Documentation](./ARCHITECTURE.md)
- [Database Schema Reference](./DATABASE_SCHEMA.md)
- [API Endpoint Reference](./API_REFERENCE.md)
- [Admin Dashboard Guide](./ADMIN_DASHBOARD.md)
- [Deployment Guide](./DEPLOYMENT.md)
