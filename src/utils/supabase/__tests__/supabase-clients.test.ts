import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createAdminClient } from "../admin";
import { createClient as createBrowserClient } from "../client";

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [],
    set: vi.fn(),
  }),
}));

describe("Supabase Client Factory Utilities", () => {
  const envBackup = { ...process.env };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SECRET_KEY = "test-secret-key";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-pub-key";
  });

  afterEach(() => {
    process.env = { ...envBackup };
  });

  it("should create admin client when environment variables are configured", () => {
    const client = createAdminClient();
    expect(client).not.toBeNull();
    expect(client).toBeDefined();
  });

  it("should return null from createAdminClient if keys are missing in sandbox", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const client = createAdminClient();
    expect(client).toBeNull();
  });

  it("should instantiate browser Supabase client cleanly", () => {
    const browserClient = createBrowserClient();
    expect(browserClient).toBeDefined();
  });
});
