# API Reference and Route Handler Documentation

This document provides detailed documentation for the HTTP REST API endpoints provided by the Codezilla Technologies backend built with Next.js 16 App Router Route Handlers.

---

## Base URL and Conventions

- **Base Local URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **Response Format**:
  - Success: `{ "success": true, "data": ... }`
  - Failure: `{ "error": "Description of error" }`

---

## Public Endpoints

### 1. Submit Contact Message
Submit an inquiry form from the public contact page.

- **Endpoint**: `POST /api/contact`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "service": "AI & Automation",
    "message": "We would like to request a proposal for AI integration."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Contact message received successfully.",
    "data": { "id": "uuid-...", "name": "Jane Doe" }
  }
  ```

---

### 2. Fetch Blog Posts
Fetch published blog articles for the public blog section.

- **Endpoint**: `GET /api/blogs`
- **Auth**: Public
- **Query Parameters**:
  - `slug` *(optional)*: Filter single article by URL slug.
  - `limit` *(optional)*: Maximum items to return (default: `10`).
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid-...",
        "title": "Building Scalable AI Solutions",
        "slug": "building-scalable-ai-solutions",
        "excerpt": "Learn how modern AI models optimize workflows...",
        "content": "# Markdown content...",
        "author": "Codezilla Team",
        "published_at": "2026-08-01T12:00:00Z"
      }
    ]
  }
  ```

---

### 3. Submit Career / Job Application
Submit candidate application and resume for active job postings.

- **Endpoint**: `POST /api/talent-acquisition`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "job_id": "uuid-job-posting-id",
    "applicant_name": "Alex Smith",
    "applicant_email": "alex@example.com",
    "resume_url": "https://storage.supabase.co/resumes/alex.pdf",
    "cover_letter": "I am excited to apply..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Application submitted successfully."
  }
  ```

---

### 4. Fetch Public Resources (Packages, Teams, Portfolio, Testimonials)

- **`GET /api/packages`**: Returns available pricing packages.
- **`GET /api/teams`**: Returns company team roster.
- **`GET /api/portfolio`**: Returns project case studies.
- **`GET /api/testimonials`**: Returns client reviews.

---

## Admin Endpoints (`/api/admin/*`)

> **Important**: Admin endpoints require an authenticated user session (`Supabase Auth Cookie`) with `role = 'admin'` or an email listed in the `ADMIN` environment variable.

### 1. Toggle User Role (Grant/Revoke Admin)
Promote or demote a registered user profile. Restricted to Main Admin (Super Admin).

- **Endpoint**: `POST /api/admin/toggle-role`
- **Auth**: Restricted to Main Admin (`ADMIN` env var match)
- **Request Body**:
  ```json
  {
    "userId": "uuid-user-id",
    "targetRole": "admin"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "userId": "uuid-user-id",
    "role": "admin",
    "message": "User user@example.com role updated to 'admin'."
  }
  ```

---

### 2. Admin Blog Management (`/api/admin/blogs`)

- **`GET /api/admin/blogs`**: Fetch all blog posts including drafts.
- **`POST /api/admin/blogs`**: Create a new blog post.
- **`PUT /api/admin/blogs`**: Update an existing blog post by ID.
- **`DELETE /api/admin/blogs?id={id}`**: Delete a blog post.

---

### 3. Admin Inbound Messages (`/api/admin/contact-messages`)

- **`GET /api/admin/contact-messages`**: Fetch received contact submissions.
- **`PUT /api/admin/contact-messages`**: Mark message as read/replied.
- **`DELETE /api/admin/contact-messages?id={id}`**: Delete message.

---

### 4. Admin Talent Acquisition (`/api/admin/talent-acquisition`)

- **`GET /api/admin/talent-acquisition`**: View job applications & candidates.
- **`PUT /api/admin/talent-acquisition`**: Update candidate stage (`pending`, `reviewing`, `accepted`, `rejected`).
- **`DELETE /api/admin/talent-acquisition?id={id}`**: Remove application record.

---

### 5. Admin CMS Operations (`packages`, `portfolio`, `teams`, `testimonials`)

Standard CRUD routes under `/api/admin/*`:
- `GET /api/admin/{module}`: List items
- `POST /api/admin/{module}`: Create item
- `PUT /api/admin/{module}`: Update item
- `DELETE /api/admin/{module}?id={id}`: Remove item

---

## HTTP Status Codes

| Status | Code | Description |
| :--- | :--- | :--- |
| **OK** | `200` | Request succeeded |
| **Created** | `201` | Resource successfully created |
| **Bad Request** | `400` | Missing required parameters or invalid payload format |
| **Unauthorized** | `401` | Authentication cookie missing or expired |
| **Forbidden** | `403` | User lacks administrative role |
| **Not Found** | `404` | Requested entity ID does not exist |
| **Internal Server Error**| `500` | Database failure or unhandled exception |

---

## Related Documentation

- [Getting Started Guide](./GETTING_STARTED.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Database Schema Reference](./DATABASE_SCHEMA.md)
- [Admin Dashboard Guide](./ADMIN_DASHBOARD.md)
- [Deployment Guide](./DEPLOYMENT.md)
