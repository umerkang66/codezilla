import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const adminDb = createAdminClient();
    const db = adminDb || supabase;

    const { data: teams, error } = await db
      .from("team_members")
      .select("*")
      .eq("status", "active")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      // If table does not exist or error, return empty array gracefully
      return NextResponse.json({ error: error.message, teams: [] }, { status: 500 });
    }

    return NextResponse.json({ teams: teams || [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch team members", teams: [] },
      { status: 500 }
    );
  }
}
