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

  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      title,
      category,
      impact,
      description,
      tags,
      icon,
      project_url,
      display_order,
      displayOrder,
      status,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Project title is required." }, { status: 400 });
    }

    let processedTags: string[] = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t: any) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === "string") {
      processedTags = tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    }

    const payload = {
      title: title.trim(),
      category: (category || "AI/ML").trim(),
      impact: (impact || "").trim(),
      description: (description || "").trim(),
      tags: processedTags,
      icon: (icon || "Globe").trim(),
      project_url: (project_url || "").trim(),
      display_order: Number(display_order !== undefined ? display_order : (displayOrder || 0)),
      status: (status || "active").trim(),
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProject, error } = await auth.dbClient!
      .from("portfolio_projects")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating portfolio project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (err: any) {
    console.error("Exception updating portfolio project:", err);
    return NextResponse.json({ error: err.message || "Failed to update project" }, { status: 500 });
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

  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  try {
    const { error } = await auth.dbClient!
      .from("portfolio_projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting portfolio project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Exception deleting portfolio project:", err);
    return NextResponse.json({ error: err.message || "Failed to delete project" }, { status: 500 });
  }
}
