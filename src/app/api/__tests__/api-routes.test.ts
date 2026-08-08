import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as contactPostHandler } from "../contact/route";
import { GET as blogsGetHandler } from "../blogs/route";
import { POST as toggleRoleHandler } from "../admin/toggle-role/route";
import * as serverSupabase from "@/utils/supabase/server";
import * as adminSupabase from "@/utils/supabase/admin";

vi.mock("@/utils/supabase/server");
vi.mock("@/utils/supabase/admin");

describe("API Route Handlers - DB Offline Sandbox Tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.ADMIN = "admin@codezilla.com";
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  describe("POST /api/contact", () => {
    it("should reject requests failing CSRF validation", async () => {
      const request = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          host: "localhost:3000",
          origin: "http://malicious-site.com",
        },
        body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hi" }),
      });

      const response = await contactPostHandler(request);
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.error).toContain("Invalid origin");
    });

    it("should reject requests missing name, email, or message", async () => {
      const request = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          host: "localhost:3000",
          origin: "http://localhost:3000",
        },
        body: JSON.stringify({ name: "Test", email: "" }),
      });

      const response = await contactPostHandler(request);
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("required fields");
    });

    it("should reject invalid email formatting", async () => {
      const request = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          host: "localhost:3000",
          origin: "http://localhost:3000",
        },
        body: JSON.stringify({ name: "Test", email: "invalid-email-address", message: "Hello" }),
      });

      const response = await contactPostHandler(request);
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("valid email address");
    });

    it("should handle DB failure gracefully when DB is disconnected or offline", async () => {
      const mockDbClient = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Database connection failed" },
              }),
            }),
          }),
        }),
      };

      vi.spyOn(adminSupabase, "createAdminClient").mockReturnValue(mockDbClient as any);
      vi.spyOn(serverSupabase, "createClient").mockResolvedValue(mockDbClient as any);

      const request = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          host: "localhost:3000",
          origin: "http://localhost:3000",
        },
        body: JSON.stringify({
          name: "Alice",
          email: "alice@example.com",
          message: "I need AI development services",
        }),
      });

      const response = await contactPostHandler(request);
      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe("Failed to submit contact message.");
    });

    it("should successfully process contact form submission with mocked DB", async () => {
      const mockInsertedData = {
        id: "msg-1",
        name: "Alice",
        email: "alice@example.com",
        service: "AI & Automation",
        message: "Hello team!",
      };

      const mockDbClient = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockInsertedData,
                error: null,
              }),
            }),
          }),
        }),
      };

      vi.spyOn(adminSupabase, "createAdminClient").mockReturnValue(mockDbClient as any);
      vi.spyOn(serverSupabase, "createClient").mockResolvedValue(mockDbClient as any);

      const request = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          host: "localhost:3000",
          origin: "http://localhost:3000",
        },
        body: JSON.stringify({
          name: "Alice",
          email: "alice@example.com",
          message: "Hello team!",
        }),
      });

      const response = await contactPostHandler(request);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockInsertedData);
    });
  });

  describe("GET /api/blogs", () => {
    it("should return blogs list when database returns items", async () => {
      const mockBlogs = [
        { id: "b1", title: "Building Next.js 16 Apps", created_at: "2026-01-01" },
      ];

      const mockDbClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockBlogs,
              error: null,
            }),
          }),
        }),
      };

      vi.spyOn(adminSupabase, "createAdminClient").mockReturnValue(mockDbClient as any);
      vi.spyOn(serverSupabase, "createClient").mockResolvedValue(mockDbClient as any);

      const response = await blogsGetHandler();
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.blogs).toEqual(mockBlogs);
    });

    it("should handle DB error gracefully and return status 500 with empty array", async () => {
      const mockDbClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "DB Offline" },
            }),
          }),
        }),
      };

      vi.spyOn(adminSupabase, "createAdminClient").mockReturnValue(mockDbClient as any);
      vi.spyOn(serverSupabase, "createClient").mockResolvedValue(mockDbClient as any);

      const response = await blogsGetHandler();
      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.blogs).toEqual([]);
      expect(body.error).toBe("DB Offline");
    });
  });

  describe("POST /api/admin/toggle-role", () => {
    it("should return 401 Unauthorized if user session is absent", async () => {
      const mockServerSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: { message: "No auth" } }),
        },
      };
      vi.spyOn(serverSupabase, "createClient").mockResolvedValue(mockServerSupabase as any);

      const request = new Request("http://localhost:3000/api/admin/toggle-role", {
        method: "POST",
        body: JSON.stringify({ userId: "u1", targetRole: "admin" }),
      });

      const response = await toggleRoleHandler(request);
      expect(response.status).toBe(401);
    });

    it("should return 403 Forbidden if logged in user is not Main Admin in process.env.ADMIN", async () => {
      const mockServerSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { email: "regular-admin@codezilla.com" } },
            error: null,
          }),
        },
      };
      vi.spyOn(serverSupabase, "createClient").mockResolvedValue(mockServerSupabase as any);

      const request = new Request("http://localhost:3000/api/admin/toggle-role", {
        method: "POST",
        body: JSON.stringify({ userId: "u1", targetRole: "admin" }),
      });

      const response = await toggleRoleHandler(request);
      expect(response.status).toBe(403);
    });

    it("should return 400 if target user is Main Admin and attempt is made to demote them", async () => {
      const mockServerSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { email: "admin@codezilla.com" } },
            error: null,
          }),
        },
      };

      const mockDbClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { email: "admin@codezilla.com", role: "admin" },
                error: null,
              }),
            }),
          }),
        }),
      };

      vi.spyOn(serverSupabase, "createClient").mockResolvedValue(mockServerSupabase as any);
      vi.spyOn(adminSupabase, "createAdminClient").mockReturnValue(mockDbClient as any);

      const request = new Request("http://localhost:3000/api/admin/toggle-role", {
        method: "POST",
        body: JSON.stringify({ userId: "u1", targetRole: "user" }),
      });

      const response = await toggleRoleHandler(request);
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("Cannot demote a Main Admin");
    });
  });
});
