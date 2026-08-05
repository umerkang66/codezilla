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

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, category, excerpt, content, author, authorRole, readTime } = body;

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) payload.title = title;
    if (category !== undefined) payload.category = category;
    if (excerpt !== undefined) payload.excerpt = excerpt;
    if (content !== undefined) payload.content = content;
    if (author !== undefined) payload.author = author;
    if (authorRole !== undefined) payload.author_role = authorRole;
    if (readTime !== undefined) payload.read_time = readTime;

    const { data: updatedBlog, error } = await auth.dbClient!
      .from("blogs")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update blog post" }, { status: 500 });
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

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
    }

    const { error } = await auth.dbClient!
      .from("blogs")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, message: "Blog post deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete blog post" }, { status: 500 });
  }
}
