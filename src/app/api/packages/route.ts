import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const adminDb = createAdminClient();
    const db = adminDb || supabase;

    const { data: packages, error } = await db
      .from("packages")
      .select("*")
      .eq("status", "active")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Packages fetch warning:", error.message);
      return NextResponse.json({ packages: [] });
    }

    return NextResponse.json({ packages: packages || [] });
  } catch (err: any) {
    console.error("Exception fetching packages:", err);
    return NextResponse.json({ packages: [] });
  }
}
