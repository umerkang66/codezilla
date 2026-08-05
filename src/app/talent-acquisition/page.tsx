import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import TalentAcquisitionClient from "./TalentAcquisitionClient";

export const metadata: Metadata = {
  title: "Talent Acquisition & Engineering Careers | Codzilla Technologies",
  description:
    "Join Codzilla Technologies as a developer, AI researcher, or hardware engineer. Contribute to real commercial projects and build your engineering career.",
};

export const revalidate = 0; // Dynamic data

export default async function TalentAcquisitionPage() {
  let initialJobs: any[] = [];
  try {
    const supabase = await createClient();
    const adminDb = createAdminClient();
    const db = adminDb || supabase;

    const { data: jobs } = await db
      .from("job_postings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (jobs && jobs.length > 0) {
      initialJobs = jobs;
    }
  } catch (err) {
    console.error("Error loading initial jobs:", err);
  }

  return <TalentAcquisitionClient initialJobs={initialJobs} />;
}
