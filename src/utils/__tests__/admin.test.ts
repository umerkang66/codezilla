import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getAdminEmails, isAdminEmail, isMainAdmin } from "../admin";

describe("Admin Email Utilities", () => {
  const originalEnv = process.env.ADMIN;

  beforeEach(() => {
    process.env.ADMIN = "admin@example.com, superadmin@codezilla.com ";
  });

  afterEach(() => {
    process.env.ADMIN = originalEnv;
  });

  it("should parse comma-separated admin emails from process.env.ADMIN", () => {
    const emails = getAdminEmails();
    expect(emails).toEqual(["admin@example.com", "superadmin@codezilla.com"]);
  });

  it("should handle empty or missing ADMIN env variable", () => {
    delete process.env.ADMIN;
    expect(getAdminEmails()).toEqual([]);
  });

  it("should verify admin emails case-insensitively", () => {
    expect(isAdminEmail("ADMIN@EXAMPLE.COM")).toBe(true);
    expect(isAdminEmail("superadmin@codezilla.com")).toBe(true);
    expect(isAdminEmail("user@example.com")).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("should correctly identify main admins", () => {
    expect(isMainAdmin("admin@example.com")).toBe(true);
    expect(isMainAdmin("other@example.com")).toBe(false);
  });
});
