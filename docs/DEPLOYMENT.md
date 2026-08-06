# Production Deployment Guide

This guide outlines step-by-step instructions for deploying the Codezilla Technologies platform to production environments such as Vercel, Netlify, Docker, or Node.js server hosts.

---

## Pre-Deployment Checklist

Before deploying to production, ensure the following steps are completed:

- [ ] All environment variables are provisioned in your hosting environment.
- [ ] Database schema and RLS policies from [`supabase/schema.sql`](../supabase/schema.sql) are executed on your production Supabase database.
- [ ] Production build succeeds cleanly locally (`npm run build`).
- [ ] Code passes all linting rules (`npm run lint`).
- [ ] Production domain SSL certificates are valid.

---

## Deploying to Vercel (Recommended)

Vercel provides native zero-configuration support for Next.js 16 App Router applications.

### 1. Import Repository
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Select and import the `codezilla-website` repository.

### 2. Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: Next.js default (`.next`)

### 3. Provision Environment Variables
Add all required environment variables in the Vercel project settings:

| Key | Example / Description |
| :--- | :--- |
| `ADMIN` | `codzilla.company@gmail.com,admin@codezilla.tech` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-production-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `your_production_publishable_key` |
| `SUPABASE_URL` | `https://your-production-project.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | `your_production_publishable_key` |
| `SUPABASE_SECRET_KEY` | `your_production_secret_key` |
| `SUPABASE_JWKS_URL` | `https://your-production-project.supabase.co/auth/v1/.well-known/jwks.json` |

### 4. Trigger Deployment
Click **Deploy**. Vercel will compile the application, optimize static assets, and deploy edge functions.

---

## Deploying with Docker

To run the application inside a containerized production environment:

### 1. Sample Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. Build and Run Container

```bash
docker build -t codezilla-website .
docker run -p 3000:3000 --env-file .env.production codezilla-website
```

---

## Supabase Production Setup

1. **Database Migration**:
   Execute [`supabase/schema.sql`](../supabase/schema.sql) in your production database SQL editor.
2. **Authentication Redirect URLs**:
   In your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**:
   - Set **Site URL** to `https://yourdomain.com`.
   - Add `https://yourdomain.com/**` to **Redirect URLs**.
3. **Connection Pooling**:
   Enable Transaction Pooler (PG Bouncer) for high traffic scale if necessary.

---

## Post-Deployment Verification

1. Verify site loads over HTTPS at your production URL.
2. Test sign in at `/admin-signin` and verify Admin Dashboard access.
3. Test public contact form submission at `/contact` and verify message appears in the Admin Dashboard.
4. Check browser dev console and server logs for any unhandled exceptions.

---

## Related Documentation

- [Getting Started Guide](./GETTING_STARTED.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Database Schema Reference](./DATABASE_SCHEMA.md)
- [API Reference](./API_REFERENCE.md)
- [Admin Dashboard Guide](./ADMIN_DASHBOARD.md)
