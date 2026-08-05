import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const adminDb = createAdminClient();
    const db = adminDb || supabase;

    // Fetch active job postings for public website
    const { data: jobs, error } = await db
      .from("job_postings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback initial jobs if table is empty or error
      console.error("Error fetching jobs from database:", error.message);
      return NextResponse.json({ jobs: [] });
    }

    return NextResponse.json({ jobs: jobs || [] });
  } catch (err: any) {
    console.error("Public jobs fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch jobs", jobs: [] },
      { status: 500 }
    );
  }
}
