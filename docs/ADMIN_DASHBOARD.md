# Admin Dashboard & Content Management Guide

This document provides a comprehensive operational guide for administrators managing the **Codezilla Technologies** platform content, hiring candidates, client messages, and user role assignments via the Admin Dashboard.

---

## 🔑 Accessing the Admin Dashboard

1. Navigate to `/admin-signin` or `/admin` in your browser.
2. Sign in using your registered Supabase user account.
3. If your user email is specified in the `ADMIN` environment variable or your database profile has `role = 'admin'`, you will be redirected to the **Admin Dashboard** (`/admin`).

> [!NOTE]
> Non-admin users attempting to access `/admin` will be denied access and redirected to the home page.

---

## 🛡️ Administrative Privilege Hierarchy

The application implements a two-tier administrative authorization model:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. Main Admin (Super Admin)                     │
│    - Email specified in ADMIN environment variable                     │
│    - Full access to all CMS modules & API endpoints                    │
│    - Exclusive permission to promote/demote other users to Admin       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        2. Standard Admin (Sub-Admin)                   │
│    - Assigned role = 'admin' in database profiles                      │
│    - Full access to all CMS modules (Blogs, Applications, Messages)    │
│    - Cannot demote Main Admin or modify env-provisioned accounts       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Management Modules

### 1. User Role Management (`Admin Management`)
Located under the **Admin Management** tab in the dashboard:
- Lists all registered platform users.
- Displays user profile status, email, and current role.
- **Grant Admin Access**: Promotes a standard user to an Admin role.
- **Revoke Admin Access**: Demotes an Admin user back to standard user level.

---

### 2. Blog & Article Manager (`Blogs`)
Create and manage technical blog posts published to the `/blog` section:
- **Title & Slug**: Automatic URL slug generation from title.
- **Markdown Editor**: Supports GFM Markdown formatting, code blocks, and headers.
- **Draft vs. Published**: Save posts as drafts or publish immediately.
- **Author & Category**: Assign category tags and author attributions.

---

### 3. Inbound Messages (`Contact Messages`)
View and process contact inquiries submitted via `/contact`:
- Displays sender name, email, selected service, submission timestamp, and message body.
- Mark messages as `read` or `replied`.
- Clean up or delete resolved inquiries.

---

### 4. Hiring & Careers (`Talent Acquisition`)
Manage open career opportunities and candidate submissions:
- **Job Openings**: Create, edit, or toggle active status on job positions.
- **Applications**: Review candidate submissions, access uploaded resume URLs, and evaluate cover letters.
- **Candidate Pipeline**: Move candidates through stages (`Pending` -> `Reviewing` -> `Accepted` / `Rejected`).

---

### 5. Services & Pricing (`Packages`)
Update service package tiers displayed on the pricing grid:
- Modify tier names, price strings, and feature highlight arrays.
- Toggle `is_popular` status to feature specific pricing cards.

---

### 6. Showcase & Portfolio (`Portfolio & Testimonials`)
- **Portfolio**: Manage client case studies, live demo URLs, cover images, and technology tags.
- **Testimonials**: Add and curate client reviews, company names, and star ratings.

---

## 📁 Related Documentation

- 🚀 [Getting Started Guide](./GETTING_STARTED.md)
- 📐 [Architecture Documentation](./ARCHITECTURE.md)
- 🗄️ [Database Schema Reference](./DATABASE_SCHEMA.md)
- 🔌 [API Endpoint Reference](./API_REFERENCE.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
