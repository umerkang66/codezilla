import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const adminDb = createAdminClient();
    const db = adminDb || supabase;

    const { data: testimonials, error } = await db
      .from("testimonials")
      .select("*")
      .eq("status", "active")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Testimonials fetch warning:", error.message);
      return NextResponse.json({ testimonials: [] });
    }

    return NextResponse.json({ testimonials: testimonials || [] });
  } catch (err: any) {
    console.error("Exception fetching testimonials:", err);
    return NextResponse.json({ testimonials: [] });
  }
}
