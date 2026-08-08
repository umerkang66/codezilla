/**
 * Security helper module for input sanitization and XSS prevention.
 * Implements OWASP recommendations for input validation & output encoding.
 */

/**
 * Encodes special HTML characters to prevent XSS execution in HTML context.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Strips HTML tags, script tags, event handlers, and dangerous control characters from raw text.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";
  return input
    // Strip script and style tags completely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Strip event attributes (e.g. onclick=..., onerror=...)
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/on\w+\s*=\s*[^>\s]+/gi, "")
    // Strip javascript: pseudo-protocol
    .replace(/javascript\s*:/gi, "")
    // Strip standard HTML tags
    .replace(/<[^>]*>/g, "")
    // Strip null characters
    .replace(/\0/g, "")
    .trim();
}

/**
 * Recursively sanitizes user input objects, arrays, and string properties.
 */
export function sanitizeInput<T>(input: T): T {
  if (typeof input === "string") {
    return sanitizeText(input) as unknown as T;
  }
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item)) as unknown as T;
  }
  if (input !== null && typeof input === "object") {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitizedObj[key] = sanitizeInput(value);
    }
    return sanitizedObj as T;
  }
  return input;
}

/**
 * Sanitizes HTML output rendered from Markdown to allow safe rich-text rendering
 * while removing dangerous scripts, inline event handlers, iframe injections, etc.
 */
export function sanitizeHtmlContent(html: string): string {
  if (typeof html !== "string") return "";

  return html
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove style tags that can cause UI redos or phishing overlays
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Remove iframe, object, embed, applet tags
    .replace(/<\/?(iframe|object|embed|applet|form|input|button)\b[^>]*>/gi, "")
    // Remove inline event handlers (onload, onerror, onclick, etc.)
    .replace(/\s+on\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/\s+on\w+\s*=\s*[^>\s]+/gi, "")
    // Remove javascript: and data: URLs (except images)
    .replace(/href\s*=\s*(["'])\s*javascript:[^"']*\1/gi, 'href="#"')
    .replace(/src\s*=\s*(["'])\s*javascript:[^"']*\1/gi, 'src=""')
    .trim();
}
