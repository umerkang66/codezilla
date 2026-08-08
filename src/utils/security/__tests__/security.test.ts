import { describe, it, expect, beforeEach } from "vitest";
import {
  escapeHtml,
  sanitizeText,
  sanitizeInput,
  sanitizeHtmlContent,
} from "../sanitize";
import { validatePasswordStrength } from "../password";
import { checkRateLimit, getClientIp } from "../rate-limit";
import { validateCsrf } from "../csrf";

describe("Security Utils - Sanitization", () => {
  it("should escape special HTML characters correctly", () => {
    const raw = '<script>alert("XSS & test")</script>';
    const escaped = escapeHtml(raw);
    expect(escaped).toBe(
      "&lt;script&gt;alert(&quot;XSS &amp; test&quot;)&lt;&#x2F;script&gt;"
    );
  });

  it("should return non-string inputs unchanged in escapeHtml", () => {
    // @ts-expect-error testing invalid type
    expect(escapeHtml(123)).toBe(123);
  });

  it("should strip HTML tags, script tags, style tags, and dangerous protocols in sanitizeText", () => {
    const dangerousInput =
      '<script>alert("hack")</script><style>body{color:red}</style><a href="javascript:alert(1)">Click</a> <b onclick="doBad()">Hello</b>';
    const sanitized = sanitizeText(dangerousInput);
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).not.toContain("<style>");
    expect(sanitized).not.toContain("javascript:");
    expect(sanitized).not.toContain("onclick=");
    expect(sanitized).toBe("Click Hello");
  });

  it("should handle empty or invalid inputs gracefully in sanitizeText", () => {
    // @ts-expect-error testing null
    expect(sanitizeText(null)).toBe("");
    // @ts-expect-error testing undefined
    expect(sanitizeText(undefined)).toBe("");
  });

  it("should recursively sanitize objects and arrays in sanitizeInput", () => {
    const nestedData = {
      name: "   John <script>bad()</script>   ",
      tags: ["<b>AI</b>", "<iframe src='x'></iframe>"],
      details: {
        bio: "<style>h1{font-size:100px}</style>Developer",
        age: 30,
        active: true,
      },
    };

    const sanitized = sanitizeInput(nestedData);
    expect(sanitized).toEqual({
      name: "John",
      tags: ["AI", ""],
      details: {
        bio: "Developer",
        age: 30,
        active: true,
      },
    });
  });

  it("should sanitize rich HTML markdown output while retaining structure", () => {
    const markdownHtml =
      '<h1>Title</h1><script>alert(1)</script><p>Safe content with <a href="javascript:alert(2)">link</a></p><iframe src="evil.com"></iframe>';
    const cleaned = sanitizeHtmlContent(markdownHtml);
    expect(cleaned).toContain("<h1>Title</h1>");
    expect(cleaned).toContain("<p>Safe content with");
    expect(cleaned).not.toContain("<script>");
    expect(cleaned).not.toContain("<iframe");
    expect(cleaned).toContain('href="#"');
  });
});

describe("Security Utils - Password Strength", () => {
  it("should reject empty or non-string passwords", () => {
    // @ts-expect-error testing null input
    expect(validatePasswordStrength(null)).toEqual({
      valid: false,
      score: 0,
      errors: ["Password is required."],
    });
  });

  it("should reject passwords shorter than 8 characters", () => {
    const result = validatePasswordStrength("Ab1!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Password must be at least 8 characters long.");
  });

  it("should validate a strong password successfully", () => {
    const result = validatePasswordStrength("SecureP@ssw0rd2026!");
    expect(result.valid).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(4);
    expect(result.errors).toHaveLength(0);
  });

  it("should flag missing uppercase, lowercase, or digits", () => {
    const noUpper = validatePasswordStrength("weakpass1!");
    expect(noUpper.valid).toBe(false);
    expect(noUpper.errors).toContain("Password must contain at least one uppercase letter (A-Z).");

    const noSpecial = validatePasswordStrength("WeakPass123");
    expect(noSpecial.valid).toBe(false);
    expect(noSpecial.errors).toContain("Password must contain at least one special character (e.g. !@#$%^&*).");
  });
});

describe("Security Utils - Rate Limiter & IP", () => {
  beforeEach(() => {
    // Reset clock or rate limit windows between tests
  });

  it("should allow requests under the limit and enforce rate limit when exceeded", () => {
    const ipKey = "test_ip_" + Math.random();
    const options = { windowMs: 60000, maxRequests: 3 };

    // Request 1
    const res1 = checkRateLimit(ipKey, options);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    // Request 2
    const res2 = checkRateLimit(ipKey, options);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    // Request 3
    const res3 = checkRateLimit(ipKey, options);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);

    // Request 4 (Limit reached)
    const res4 = checkRateLimit(ipKey, options);
    expect(res4.success).toBe(false);
    expect(res4.remaining).toBe(0);
  });

  it("should extract client IP from headers safely", () => {
    const req1 = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18" },
    });
    expect(getClientIp(req1)).toBe("203.0.113.195");

    const req2 = new Request("http://localhost", {
      headers: { "x-real-ip": "198.51.100.1" },
    });
    expect(getClientIp(req2)).toBe("198.51.100.1");

    const req3 = new Request("http://localhost");
    expect(getClientIp(req3)).toBe("127.0.0.1");
  });
});

describe("Security Utils - CSRF Validation", () => {
  it("should allow safe HTTP GET methods unconditionally", () => {
    const req = new Request("http://localhost/api/test", { method: "GET" });
    expect(validateCsrf(req)).toEqual({ valid: true });
  });

  it("should fail validation if host header is missing", () => {
    const req = new Request("http://localhost/api/test", { method: "POST" });
    // Request constructor automatically adds host in standard fetch, so we remove it
    req.headers.delete("host");
    const result = validateCsrf(req);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Missing Host header");
  });

  it("should reject requests from unauthorized origins", () => {
    const req = new Request("http://localhost:3000/api/test", {
      method: "POST",
      headers: {
        host: "localhost:3000",
        origin: "https://evil-hacker.com",
      },
    });
    const result = validateCsrf(req);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid origin: https://evil-hacker.com");
  });

  it("should accept requests matching the host origin", () => {
    const req = new Request("http://localhost:3000/api/test", {
      method: "POST",
      headers: {
        host: "localhost:3000",
        origin: "http://localhost:3000",
      },
    });
    expect(validateCsrf(req)).toEqual({ valid: true });
  });
});
