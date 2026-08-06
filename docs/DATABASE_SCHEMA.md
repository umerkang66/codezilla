# Database Schema & Security Reference

This document provides complete technical specifications for the PostgreSQL database schema, tables, functions, triggers, and Row Level Security (RLS) policies defined in [`supabase/schema.sql`](../supabase/schema.sql).

---

## 📊 Entity Relationship & Table Overview

```
                      ┌──────────────────┐
                      │    auth.users    │
                      └────────┬─────────┘
                               │ 1:1
                               ▼
                      ┌──────────────────┐
                      │ public.profiles  │
                      └──────────────────┘

   ┌────────────────────────────────────────────────────────┐
   │                  CMS & Content Tables                  │
   ├──────────────┬───────────────────┬─────────────────────┤
   │ public.blogs │ public.packages   │ public.testimonials │
   ├──────────────┼───────────────────┼─────────────────────┤
   │ public.teams │ public.portfolio  │ public.job_postings │
   └──────────────┴───────────────────┴──────────┬──────────┘
                                                 │ 1:N
                                                 ▼
                                     ┌───────────────────────┐
                                     │public.job_applications│
                                     └───────────────────────┘

   ┌────────────────────────────────────────────────────────┐
   │                   Inbound Submissions                  │
   ├────────────────────────────────────────────────────────┤
   │               public.contact_messages                  │
   └────────────────────────────────────────────────────────┘
```

---

## 🗄️ Detailed Table Specifications

### 1. `public.profiles`
Stores user profile information, links to Supabase `auth.users`, and defines application roles (`user` or `admin`).

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `REFERENCES auth.users(id) ON DELETE CASCADE` | User unique ID |
| `email` | `TEXT` | `NOT NULL` | Account email address |
| `full_name` | `TEXT` | Nullable | User display name |
| `avatar_url` | `TEXT` | Nullable | Profile picture URL |
| `role` | `TEXT` | `NOT NULL`, Default: `'user'` | Role (`'user'` or `'admin'`) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, Default: `now()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL`, Default: `now()` | Record update timestamp |

---

### 2. `public.blogs`
Stores technical articles, agency announcements, and blog content with markdown support.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `gen_random_uuid()` | Post identifier |
| `title` | `TEXT` | `NOT NULL` | Blog title |
| `slug` | `TEXT` | `NOT NULL`, `UNIQUE` | URL slug |
| `excerpt` | `TEXT` | Nullable | Short summary preview |
| `content` | `TEXT` | `NOT NULL` | Full post content (Markdown/HTML) |
| `author` | `TEXT` | `NOT NULL` | Author name |
| `category` | `TEXT` | Nullable | Blog category |
| `published_at` | `TIMESTAMPTZ` | Nullable | Publication timestamp |
| `is_published` | `BOOLEAN` | `NOT NULL`, Default: `false` | Draft vs Published toggle |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, Default: `now()` | Record timestamp |

---

### 3. `public.contact_messages`
Stores inquiries sent via the website contact form.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `gen_random_uuid()` | Message identifier |
| `name` | `TEXT` | `NOT NULL` | Sender full name |
| `email` | `TEXT` | `NOT NULL` | Sender contact email |
| `subject` | `TEXT` | Nullable | Inquiry subject |
| `message` | `TEXT` | `NOT NULL` | Message body |
| `status` | `TEXT` | `NOT NULL`, Default: `'unread'` | Processing status (`unread`, `read`, `replied`) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, Default: `now()` | Submission timestamp |

---

### 4. `public.job_postings`
Career openings and position listings published by Codezilla HR.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `gen_random_uuid()` | Position identifier |
| `title` | `TEXT` | `NOT NULL` | Job position title |
| `department` | `TEXT` | `NOT NULL` | Department (Engineering, Design, etc.) |
| `location` | `TEXT` | `NOT NULL` | Working mode (Remote, Hybrid, Onsite) |
| `type` | `TEXT` | `NOT NULL` | Employment type (Full-time, Contract) |
| `description` | `TEXT` | `NOT NULL` | Full role description & responsibilities |
| `is_active` | `BOOLEAN` | `NOT NULL`, Default: `true` | Open for applications flag |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, Default: `now()` | Creation timestamp |

---

### 5. `public.job_applications`
Applicant submissions for active job openings.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `gen_random_uuid()` | Application identifier |
| `job_id` | `UUID` | `REFERENCES public.job_postings(id) ON DELETE CASCADE` | Target job posting |
| `applicant_name` | `TEXT` | `NOT NULL` | Applicant name |
| `applicant_email`| `TEXT` | `NOT NULL` | Applicant email |
| `resume_url` | `TEXT` | `NOT NULL` | Link to uploaded resume document |
| `cover_letter` | `TEXT` | Nullable | Cover letter / pitch |
| `status` | `TEXT` | `NOT NULL`, Default: `'pending'` | Candidate stage (`pending`, `reviewing`, `accepted`, `rejected`) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, Default: `now()` | Application timestamp |

---

### 6. `public.team_members`
Showcase of agency team members and leadership.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `gen_random_uuid()` | Member identifier |
| `name` | `TEXT` | `NOT NULL` | Full name |
| `role` | `TEXT` | `NOT NULL` | Position / Title |
| `bio` | `TEXT` | Nullable | Short biography |
| `image_url` | `TEXT` | Nullable | Profile photo URL |
| `order_index` | `INTEGER` | Default: `0` | Display sorting priority |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, Default: `now()` | Record timestamp |

---

### 7. `public.packages`
Services and project pricing tiers.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `gen_random_uuid()` | Package identifier |
| `name` | `TEXT` | `NOT NULL` | Tier name (e.g. Starter, MVP, Enterprise) |
| `price` | `TEXT` | `NOT NULL` | Formatted price string |
| `features` | `JSONB` | Default: `'[]'` | List of included features |
| `is_popular` | `BOOLEAN` | Default: `false` | Featured package flag |

---

### 8. `public.testimonials`
Client reviews, ratings, and social proof.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `gen_random_uuid()` | Testimonial identifier |
| `client_name` | `TEXT` | `NOT NULL` | Client name |
| `company` | `TEXT` | Nullable | Client company name |
| `content` | `TEXT` | `NOT NULL` | Review text |
| `rating` | `INTEGER` | Default: `5` | Rating score (1-5) |

---

### 9. `public.portfolio_projects`
Agency project portfolio and case studies.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `gen_random_uuid()` | Project identifier |
| `title` | `TEXT` | `NOT NULL` | Project name |
| `description` | `TEXT` | `NOT NULL` | Detailed project description |
| `tags` | `TEXT[]` | Default: `'{}'` | Applied technology tags |
| `image_url` | `TEXT` | Nullable | Cover image URL |
| `project_url` | `TEXT` | Nullable | Live project URL |

---

## ⚙️ Stored Procedures & Triggers

### `public.is_admin()`
Helper SQL function that checks whether `auth.uid()` has `role = 'admin'` in `public.profiles` without triggering RLS recursion loops:

```sql
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
```

### `public.handle_new_user()` Trigger
Trigger function attached to `auth.users` that automatically inserts a record into `public.profiles` when a user registers or logs in for the first time:

```sql
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 🛡️ Row Level Security (RLS) Summary

- **Profiles**: Authenticated users can view/edit their own profile. Admins can view/update all profiles.
- **Blogs**: Anyone can view published blogs (`is_published = true`). Only Admins can insert, update, or delete.
- **Contact Messages**: Public visitors can insert (`INSERT`). Only Admins can view (`SELECT`) and modify status (`UPDATE`/`DELETE`).
- **Job Postings**: Anyone can view active postings. Admins manage all postings.
- **Job Applications**: Public applicants can submit (`INSERT`). Only Admins can view (`SELECT`) or update candidate statuses.
- **Packages / Testimonials / Team / Portfolio**: Public read-only access. Full write access restricted to Admins.

---

## 📁 Related Documentation

- 🚀 [Getting Started Guide](./GETTING_STARTED.md)
- 📐 [Architecture Documentation](./ARCHITECTURE.md)
- 🔌 [API Endpoint Reference](./API_REFERENCE.md)
- 🛡️ [Admin Dashboard Guide](./ADMIN_DASHBOARD.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
