import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function PUT(
  request: NextRequest,
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
    const { title, category, excerpt, content, author, authorRole, author_role, readTime, read_time } = body;

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) payload.title = title.trim();
    if (category !== undefined) payload.category = category.trim();
    if (excerpt !== undefined) payload.excerpt = excerpt.trim();
    if (content !== undefined) payload.content = content.trim();
    if (author !== undefined) payload.author = author.trim();
    
    const roleVal = authorRole !== undefined ? authorRole : author_role;
    if (roleVal !== undefined) payload.author_role = roleVal.trim();

    const timeVal = readTime !== undefined ? readTime : read_time;
    if (timeVal !== undefined) payload.read_time = timeVal.trim();

    const { data: updatedBlog, error } = await auth.dbClient!
      .from("blogs")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating blog:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (err: any) {
    console.error("Exception updating blog:", err);
    return NextResponse.json({ error: err.message || "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
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
      console.error("Error deleting blog:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, message: "Blog post deleted successfully." });
  } catch (err: any) {
    console.error("Exception deleting blog:", err);
    return NextResponse.json({ error: err.message || "Failed to delete blog post" }, { status: 500 });
  }
}
