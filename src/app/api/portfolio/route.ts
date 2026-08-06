import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const adminDb = createAdminClient();
    const db = adminDb || supabase;

    const { data: projects, error } = await db
      .from("portfolio_projects")
      .select("*")
      .eq("status", "active")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Portfolio projects fetch warning:", error.message);
      return NextResponse.json({ projects: [] });
    }

    return NextResponse.json({ projects: projects || [] });
  } catch (err: any) {
    console.error("Exception fetching portfolio projects:", err);
    return NextResponse.json({ projects: [] });
  }
}
