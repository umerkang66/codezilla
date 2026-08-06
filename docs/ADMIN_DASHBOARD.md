# Admin Dashboard and Content Management Guide

This guide provides a comprehensive manual for operating the Codezilla Technologies Admin Dashboard. It is designed to allow any new administrator or team member to understand the dashboard architecture, access controls, navigation, and management workflows.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Accessing the Admin Dashboard](#2-accessing-the-admin-dashboard)
3. [User Roles and Authorization Model](#3-user-roles-and-authorization-model)
4. [Dashboard Interface and Navigation](#4-dashboard-interface-and-navigation)
5. [User Role Management](#5-user-role-management)
6. [Blog and Article Management](#6-blog-and-article-management)
7. [Inbound Contact Messages](#7-inbound-contact-messages)
8. [Talent Acquisition and Hiring](#8-talent-acquisition-and-hiring)
9. [Service Packages and Pricing](#9-service-packages-and-pricing)
10. [Portfolio Projects Management](#10-portfolio-projects-management)
11. [Team Roster Management](#11-team-roster-management)
12. [Client Testimonials Management](#12-client-testimonials-management)
13. [Troubleshooting and Common Questions](#13-troubleshooting-and-common-questions)

---

## 1. Overview

The Codezilla Admin Dashboard is a centralized management portal accessible at `/admin`. It enables authorized administrators to manage site content, review client contact inquiries, process job applications, publish technical articles, and assign user roles without modifying code or accessing the raw database.

---

## 2. Accessing the Admin Dashboard

### Step 1: Navigate to the Authentication Page
Open your web browser and navigate to:
`http://your-domain.com/admin-signin` (or `http://localhost:3000/admin-signin` during local development).

### Step 2: Sign In
Enter your registered email address and password, then click **Sign In**.

### Step 3: Automated Privilege Check
Upon authentication, the system verifies your user account against database records and environment variables:
- If your account holds administrative permissions, you will be redirected automatically to `/admin`.
- If your account lacks administrative permissions, access is denied and you will be redirected to the home page.

### Step 4: Signing Out
To terminate your administrative session, click the **Sign Out** button located in the top-right header of the Admin Dashboard.

---

## 3. User Roles and Authorization Model

The application enforces a strict two-tier administrative structure.

### Role Types

1. **Main Admin (Super Admin)**
   - Defined via the `ADMIN` environment variable in `.env` (e.g. `ADMIN="codzilla.company@gmail.com,admin@codezilla.tech"`).
   - Holds unrestricted access to all management modules and API endpoints.
   - Has exclusive authority to promote standard users to Admin or demote existing sub-admins.
   - Cannot be demoted by sub-admins.

2. **Standard Admin (Sub-Admin)**
   - Assigned the `admin` role value in the database `profiles` table by a Main Admin.
   - Holds full access to publish blogs, process messages, review applications, and edit CMS content.
   - Cannot manage user roles or demote Main Admins.

3. **Standard User**
   - Default role assigned to newly registered accounts (`role = 'user'`).
   - Has no access to `/admin` or `/api/admin/*` endpoints.

---

## 4. Dashboard Interface and Navigation

The dashboard is structured into three main regions:

1. **Header Bar**: Displays current system status, quick notification counts, logged-in admin email, and the Sign Out control.
2. **Sidebar Navigation**: Fixed menu on the left side allowing instant switching between management modules:
   - User Management
   - Blogs & Articles
   - Contact Messages
   - Talent Acquisition
   - Packages & Pricing
   - Portfolio Projects
   - Team Roster
   - Testimonials
3. **Main Content Canvas**: Dynamic workplace that displays data tables, filter bars, search fields, and modal forms based on the active tab.

---

## 5. User Role Management

**Accessible via**: Sidebar -> **User Management** (Restricted to Main Admin)

### Key Capabilities
- **View Account Roster**: Inspect all registered users, their full names, email addresses, registration dates, and assigned roles (`user` or `admin`).
- **Promote User**: Click **Grant Admin** next to a standard user. The system updates their profile in real time and sends a request to `/api/admin/toggle-role`.
- **Revoke Admin**: Click **Revoke Admin** to demote a sub-admin back to standard user status.

---

## 6. Blog and Article Management

**Accessible via**: Sidebar -> **Blogs & Articles**

### Overview
This tab controls the articles displayed on the public `/blog` page.

### Publishing a New Blog Post
1. Click **Create New Post** in the top right.
2. **Title**: Enter a descriptive title. The URL `slug` is generated automatically from the title.
3. **Category**: Select a category (e.g. Engineering, Artificial Intelligence, Product Design).
4. **Author**: Enter the author name or leave default (`Codezilla Team`).
5. **Excerpt**: Provide a short 2-3 sentence preview that will appear on blog preview cards.
6. **Markdown Content Editor**: Write the full body using GFM Markdown syntax. The editor includes live preview tabs for headers, lists, code blocks, and blockquotes.
7. **Publication Status**:
   - Check **Publish Immediately** to make the post live on `/blog`.
   - Leave unchecked to save as a draft (`is_published = false`).
8. Click **Save Article**.

### Editing or Deleting Posts
- Click **Edit** next to any post to modify title, content, or publication status.
- Click **Delete** to permanently remove a post.

---

## 7. Inbound Contact Messages

**Accessible via**: Sidebar -> **Contact Messages**

### Overview
Displays inquiries submitted through the website `/contact` form.

### Processing Workflow
1. **Filtering**: Use tab filters to switch between **All**, **Unread**, and **Replied** messages.
2. **Reading Inquiries**: Click on any message row to open the full message detail view, which displays sender name, email, target service, timestamp, and message body.
3. **Updating Status**: Mark messages as **Read** or **Replied** to keep track of communications.
4. **Deletion**: Delete spam or archived messages by clicking the red trash bin icon.

---

## 8. Talent Acquisition and Hiring

**Accessible via**: Sidebar -> **Talent Acquisition**

### Overview
Manages job opening announcements on `/careers` and candidate submissions received via `/talent-acquisition`.

### Sub-Module A: Managing Job Postings
1. Click **Create Job Opening**.
2. Fill in position details: Job Title, Department (Engineering, Design, Marketing), Work Location (Remote, Hybrid, On-site), and Employment Type (Full-time, Contract).
3. Enter the full job description and requirements.
4. Toggle **Active Status**: Active postings appear immediately on `/careers`. Inactive postings are hidden from applicants.

### Sub-Module B: Candidate Application Tracking
1. Switch to the **Applications** tab.
2. View candidate submissions including applicant name, email, targeted job title, and submission date.
3. **Resume Review**: Click **View Resume** to open the candidate uploaded PDF/document in a new tab.
4. **Candidate Pipeline**: Update candidate stage using the status selector:
   - `Pending`: New application awaiting review.
   - `Reviewing`: Candidate currently under HR evaluation.
   - `Accepted`: Candidate selected for interview/offer.
   - `Rejected`: Application archived.

---

## 9. Service Packages and Pricing

**Accessible via**: Sidebar -> **Packages & Pricing**

### Overview
Controls pricing cards and feature lists displayed on the public `/pricing` section.

### Operations
1. Click **Add Package** or click **Edit** on an existing plan.
2. Define package details: Name (e.g. Starter, Growth, Enterprise) and Price (e.g. `$2,499/mo`).
3. **Features List**: Add bullet points describing included services.
4. **Popular Badge**: Check **Mark as Popular** to highlight the package card with a highlighted border and badge on the website.
5. Click **Save Package**.

---

## 10. Portfolio Projects Management

**Accessible via**: Sidebar -> **Portfolio Projects**

### Overview
Manages case studies and featured work shown in the `/portfolio` showcase.

### Operations
1. Click **Add Project**.
2. Enter Project Title and Detailed Description.
3. **Media & Links**: Provide a cover image URL (`image_url`) and live website link (`project_url`).
4. **Technology Stack Tags**: Enter comma-separated tags (e.g. `Next.js, Supabase, TailwindCSS, AI`).
5. Save changes to update the live portfolio grid.

---

## 11. Team Roster Management

**Accessible via**: Sidebar -> **Team Roster**

### Overview
Manages employee profiles displayed on the `/team` page.

### Operations
1. Click **Add Team Member**.
2. Provide Full Name, Job Role/Title, Short Biography, and Profile Photo URL.
3. **Display Priority Order**: Assign an integer value to `order_index`. Lower numbers appear first in the team grid (e.g. `1` for Founder/CEO).
4. Save to update team roster.

---

## 12. Client Testimonials Management

**Accessible via**: Sidebar -> **Testimonials**

### Overview
Curates customer reviews and social proof shown across landing pages.

### Operations
1. Click **Add Testimonial**.
2. Fill in Client Name, Company / Organization, Review Text, and Rating Score (1 to 5 stars).
3. Save to update published customer feedback.

---

## 13. Troubleshooting and Common Questions

### Issue: "Access Denied: You do not have permission to access the admin panel."
- **Cause**: Your user account has `role = 'user'` in the database and your email is not listed in the `ADMIN` environment variable.
- **Solution**: Contact the Main Admin to grant your email administrative access via the User Management tab or append your email address to the `ADMIN` variable in `.env`.

### Issue: "Changes saved in Admin Dashboard are not showing on the live website."
- **Cause**: Browser cache or page revalidation delay.
- **Solution**: Hard refresh your browser page (`Ctrl + Shift + R` or `Cmd + Shift + R`). All API routes utilize cache revalidation on mutation.

### Issue: "Cannot demote Main Admin user."
- **Cause**: Safety check preventing demotion of super-admin accounts provisioned in environment files.
- **Solution**: To modify Main Admin privileges, update the `ADMIN` string in `.env` and restart the application server.

---

## Related Documentation

- [Getting Started Guide](./GETTING_STARTED.md)
- [Architecture Blueprint](./ARCHITECTURE.md)
- [Database Schema Reference](./DATABASE_SCHEMA.md)
- [API Reference](./API_REFERENCE.md)
- [Production Deployment Guide](./DEPLOYMENT.md)
