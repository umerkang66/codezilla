import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyAdminAuth } from "../admin-auth";
import * as serverSupabase from "../supabase/server";
import * as adminSupabase from "../supabase/admin";

vi.mock("../supabase/server");
vi.mock("../supabase/admin");

describe("Admin Auth Verification - Isolated & DB-Disconnected Tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.ADMIN = "admin@codezilla.com";
  });

  it("should return Unauthorized when user session does not exist (e.g. unauthenticated or DB unreadable)", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "No active session" },
        }),
      },
    };
    vi.spyOn(serverSupabase, "createClient").mockResolvedValue(mockSupabase as any);

    const result = await verifyAdminAuth();
    expect(result).toEqual({
      authorized: false,
      user: null,
      dbClient: null,
      error: "Unauthorized",
    });
  });

  it("should return Forbidden when user email is not in ADMIN env and role is not admin in profiles DB", async () => {
    const mockUser = { id: "user-123", email: "regular@example.com" };
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { role: "user" },
              error: null,
            }),
          }),
        }),
      }),
    };
    vi.spyOn(serverSupabase, "createClient").mockResolvedValue(mockSupabase as any);

    const result = await verifyAdminAuth();
    expect(result.authorized).toBe(false);
    expect(result.error).toContain("Forbidden: Admin privileges required.");
  });

  it("should grant access and return authorized=true when user email matches process.env.ADMIN", async () => {
    const mockAdminUser = { id: "admin-1", email: "admin@codezilla.com" };
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockAdminUser },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { role: "admin" },
              error: null,
            }),
          }),
        }),
      }),
    };

    vi.spyOn(serverSupabase, "createClient").mockResolvedValue(mockSupabase as any);
    vi.spyOn(adminSupabase, "createAdminClient").mockReturnValue(mockSupabase as any);

    const result = await verifyAdminAuth();
    expect(result.authorized).toBe(true);
    expect(result.isSuperAdmin).toBe(true);
    expect(result.user).toEqual(mockAdminUser);
    expect(result.error).toBeNull();
  });
});
