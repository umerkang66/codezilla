/**
 * In-memory Token Bucket rate limiter for Next.js API routes.
 * Prevents brute-force abuse and Denial of Service (DoS) attacks on endpoints.
 */

interface RateLimitStore {
  [key: string]: {
    tokens: number;
    lastRefill: number;
  };
}

const store: RateLimitStore = {};

// Clean up stale entries every 10 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const key in store) {
      if (now - store[key].lastRefill > 600000) {
        delete store[key];
      }
    }
  }, 600000);
}

export interface RateLimitOptions {
  windowMs?: number; // Time frame in ms (default: 1 minute = 60000)
  maxRequests?: number; // Max allowed requests per window (default: 10)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks and updates rate limit for a unique identifier (e.g. client IP + route identifier).
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs || 60000;
  const maxRequests = options.maxRequests || 10;
  const now = Date.now();

  if (!store[identifier]) {
    store[identifier] = {
      tokens: maxRequests - 1,
      lastRefill: now,
    };
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  const record = store[identifier];
  const timeElapsed = now - record.lastRefill;

  // Refill tokens based on elapsed time window
  if (timeElapsed >= windowMs) {
    record.tokens = maxRequests - 1;
    record.lastRefill = now;
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.tokens > 0) {
    record.tokens -= 1;
    const resetMs = windowMs - timeElapsed;
    return {
      success: true,
      limit: maxRequests,
      remaining: record.tokens,
      resetSeconds: Math.ceil(resetMs / 1000),
    };
  }

  const resetMs = windowMs - timeElapsed;
  return {
    success: false,
    limit: maxRequests,
    remaining: 0,
    resetSeconds: Math.ceil(resetMs / 1000),
  };
}

/**
 * Helper to extract client IP address from Next.js request headers safely.
 */
export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }
  return "127.0.0.1";
}
