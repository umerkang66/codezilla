import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit, getClientIp } from "@/utils/security/rate-limit";
import { sanitizeText } from "@/utils/security/sanitize";
import { validateCsrf } from "@/utils/security/csrf";

export async function POST(request: Request) {
  try {
    // 1. CSRF Origin Validation
    const csrfCheck = validateCsrf(request);
    if (!csrfCheck.valid) {
      return NextResponse.json(
        { error: csrfCheck.error || "Forbidden: CSRF check failed." },
        { status: 403 }
      );
    }

    // 2. Rate Limiting (Max 5 submissions per 15 minutes per IP)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`contact_form_${clientIp}`, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please try again in ${rateLimit.resetSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        }
      );
    }

    // 3. Parse and sanitize input
    const body = await request.json();
    const { name, email, service, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const trimmedName = sanitizeText(String(name));
    const trimmedEmail = sanitizeText(String(email));
    const trimmedService = service ? sanitizeText(String(service)) : "AI & Automation";
    const trimmedMessage = sanitizeText(String(message));

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return NextResponse.json(
        { error: "Name, email, and message cannot be blank." },
        { status: 400 }
      );
    }

    // 4. Store in database
    const adminSupabase = createAdminClient();
    const serverSupabase = await createClient();
    const dbClient = adminSupabase || serverSupabase;

    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      service: trimmedService,
      message: trimmedMessage,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await dbClient
      .from("contact_messages")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Error inserting contact message:", error);
      return NextResponse.json(
        { error: "Failed to submit contact message." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact message received successfully.",
        data,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (err: any) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
