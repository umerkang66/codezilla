import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { title, domain, type, description, skills, requirements, status } = body;

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) payload.title = title.trim();
    if (domain !== undefined) payload.domain = domain.trim();
    if (type !== undefined) payload.type = type.trim();
    if (description !== undefined) payload.description = description.trim();
    if (requirements !== undefined) payload.requirements = requirements.trim();
    if (status !== undefined) payload.status = status;

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        payload.skills = skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof skills === "string") {
        payload.skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    const { data: updatedJob, error } = await auth.dbClient!
      .from("job_postings")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update job posting." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { error } = await auth.dbClient!
      .from("job_postings")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Job posting deleted." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete job posting." },
      { status: 500 }
    );
  }
}
