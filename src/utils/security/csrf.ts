/**
 * Security helper module for Cross-Site Request Forgery (CSRF) protection
 * and strict HTTP Origin/Referer validation.
 */

import { NextResponse } from "next/server";

/**
 * Validates request Origin / Referer headers against the host to prevent CSRF.
 */
export function validateCsrf(request: Request): { valid: boolean; error?: string } {
  // Only validate state-changing HTTP methods
  const method = request.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return { valid: true };
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (!host) {
    return { valid: false, error: "Missing Host header" };
  }

  // Validate Origin header if present
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        // Allow configured app domain if matching
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        if (appUrl) {
          const appHost = new URL(appUrl).host;
          if (originUrl.host === appHost) {
            return { valid: true };
          }
        }
        return { valid: false, error: `Invalid origin: ${origin}` };
      }
    } catch {
      return { valid: false, error: "Malformed Origin header" };
    }
  }

  // Validate Referer header if Origin is absent
  if (!origin && referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host !== host) {
        return { valid: false, error: `Invalid referer: ${referer}` };
      }
    } catch {
      return { valid: false, error: "Malformed Referer header" };
    }
  }

  // Also check custom CSRF token if present
  const csrfHeader = request.headers.get("x-csrf-token");
  const csrfCookie = request.headers.get("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith("csrf_token="))
    ?.split("=")[1];

  if (csrfHeader && csrfCookie && csrfHeader !== csrfCookie) {
    return { valid: false, error: "CSRF token mismatch" };
  }

  return { valid: true };
}
