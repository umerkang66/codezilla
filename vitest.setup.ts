import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Set environment variables for unit testing in sandbox (DB-disconnected)
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://mock-supabase-project.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "mock-publishable-key";
process.env.SUPABASE_SECRET_KEY = "mock-secret-key";
process.env.ADMIN = "admin@example.com,superadmin@codezilla.com";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

// Global Mock for matchMedia (required for Framer Motion / UI testing in jsdom)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
