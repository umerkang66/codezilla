import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { data: blogs, error } = await auth.dbClient!
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ blogs: blogs || [] });
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, excerpt, content, author, authorRole, author_role, readTime, read_time } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required fields." },
        { status: 400 }
      );
    }

    const payload = {
      title: title.trim(),
      category: (category || "Engineering").trim(),
      excerpt: (excerpt || "").trim(),
      content: content.trim(),
      author: (author || "Codzilla Team").trim(),
      author_role: (authorRole || author_role || "Engineering Team").trim(),
      read_time: (readTime || read_time || "5 min read").trim(),
      updated_at: new Date().toISOString(),
    };

    const { data: newBlog, error } = await auth.dbClient!
      .from("blogs")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Error inserting blog into database:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (err: any) {
    console.error("Exception creating blog:", err);
    return NextResponse.json({ error: err.message || "Failed to create blog post" }, { status: 500 });
  }
}
