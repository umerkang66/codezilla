import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const adminDb = createAdminClient();
    const db = adminDb || supabase;

    const { data: blogs, error } = await db
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message, blogs: [] }, { status: 500 });
    }

    return NextResponse.json({ blogs: blogs || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch blogs", blogs: [] }, { status: 500 });
  }
}
