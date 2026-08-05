import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();
    const trimmedService = service ? String(service).trim() : "AI & Automation";
    const trimmedMessage = String(message).trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return NextResponse.json(
        { error: "Name, email, and message cannot be blank." },
        { status: 400 }
      );
    }

    // Try admin client first, fallback to standard server client
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
        { error: `Failed to submit contact message: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact message received successfully.",
      data,
    });
  } catch (err: any) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
