import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

describe("Middleware Unit Tests - Security & CORS", () => {
  it("should attach security and CSP headers to standard requests", () => {
    const req = new NextRequest("http://localhost:3000/admin");
    const res = middleware(req);

    expect(res.headers.get("Content-Security-Policy")).toContain("default-src 'self'");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });

  it("should inject CORS allow origin header for allowed origin", () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      headers: { origin: "http://localhost:3000" },
    });
    const res = middleware(req);

    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:3000");
    expect(res.headers.get("Access-Control-Allow-Credentials")).toBe("true");
  });

  it("should NOT set CORS allow origin header for disallowed origin", () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      headers: { origin: "https://unknown-untrusted-domain.com" },
    });
    const res = middleware(req);

    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("should return HTTP 204 for OPTIONS preflight requests", () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "OPTIONS",
      headers: { origin: "http://localhost:3000" },
    });
    const res = middleware(req);

    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });
});
