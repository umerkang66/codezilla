import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    // Fetch applications
    const { data: applications, error: appsErr } = await auth.dbClient!
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (appsErr) {
      return NextResponse.json({ error: appsErr.message, applications: [] }, { status: 500 });
    }

    // Fetch jobs to attach job title & domain
    const { data: jobs } = await auth.dbClient!
      .from("job_postings")
      .select("id, title, domain");

    const jobsMap = new Map((jobs || []).map((j) => [j.id, j]));

    const enrichedApplications = (applications || []).map((app) => {
      const jobInfo = jobsMap.get(app.job_id);
      return {
        ...app,
        job_title: jobInfo?.title || "Unknown Job Position",
        job_domain: jobInfo?.domain || "Engineering",
      };
    });

    return NextResponse.json({ applications: enrichedApplications });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch applications." },
      { status: 500 }
    );
  }
}
