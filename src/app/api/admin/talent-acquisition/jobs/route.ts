import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    // Fetch all job postings
    const { data: jobs, error: jobsErr } = await auth.dbClient!
      .from("job_postings")
      .select("*")
      .order("created_at", { ascending: false });

    if (jobsErr) {
      return NextResponse.json({ error: jobsErr.message, jobs: [] }, { status: 500 });
    }

    // Fetch applications count for each job
    const { data: apps, error: appsErr } = await auth.dbClient!
      .from("job_applications")
      .select("id, job_id, status");

    const jobsWithCounts = (jobs || []).map((job) => {
      const jobApps = (apps || []).filter((a) => a.job_id === job.id);
      return {
        ...job,
        applications_count: jobApps.length,
        pending_count: jobApps.filter((a) => a.status === "pending").length,
      };
    });

    return NextResponse.json({ jobs: jobsWithCounts });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch job postings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, domain, type, description, skills, requirements, status } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Job title and description are required." },
        { status: 400 }
      );
    }

    // Normalize skills input into array of strings
    let parsedSkills: string[] = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof skills === "string") {
      parsedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const payload = {
      title: title.trim(),
      domain: (domain || "Engineering").trim(),
      type: (type || "Remote / Project-Based").trim(),
      description: description.trim(),
      skills: parsedSkills,
      requirements: (requirements || "").trim(),
      status: status === "closed" ? "closed" : "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newJob, error } = await auth.dbClient!
      .from("job_postings")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Error creating job posting:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, job: newJob });
  } catch (err: any) {
    console.error("Exception creating job posting:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create job posting." },
      { status: 500 }
    );
  }
}
