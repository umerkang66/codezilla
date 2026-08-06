import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { data: projects, error } = await auth.dbClient!
    .from("portfolio_projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message, projects: [] }, { status: 500 });
  }

  return NextResponse.json({ projects: projects || [] });
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
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

    // Process tags as array of trimmed non-empty strings
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

    const { data: newProject, error } = await auth.dbClient!
      .from("portfolio_projects")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Error inserting portfolio project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: newProject });
  } catch (err: any) {
    console.error("Exception creating portfolio project:", err);
    return NextResponse.json({ error: err.message || "Failed to create project" }, { status: 500 });
  }
}
