import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { data: testimonials, error } = await auth.dbClient!
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message, testimonials: [] }, { status: 500 });
  }

  return NextResponse.json({ testimonials: testimonials || [] });
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      quote,
      author,
      role,
      rating,
      platform,
      avatar_url,
      avatarUrl,
      display_order,
      displayOrder,
      status,
    } = body;

    if (!quote || !quote.trim()) {
      return NextResponse.json({ error: "Client quote is required." }, { status: 400 });
    }
    if (!author || !author.trim()) {
      return NextResponse.json({ error: "Author name is required." }, { status: 400 });
    }

    const numericRating = Number(rating);
    const validRating = isNaN(numericRating) ? 5 : Math.min(5, Math.max(1, numericRating));

    const payload = {
      quote: quote.trim(),
      author: author.trim(),
      role: (role || "").trim(),
      rating: validRating,
      platform: (platform || "Verified Review").trim(),
      avatar_url: (avatar_url || avatarUrl || "").trim(),
      display_order: Number(display_order !== undefined ? display_order : (displayOrder || 0)),
      status: (status || "active").trim(),
      updated_at: new Date().toISOString(),
    };

    const { data: newTestimonial, error } = await auth.dbClient!
      .from("testimonials")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Error inserting testimonial:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, testimonial: newTestimonial });
  } catch (err: any) {
    console.error("Exception creating testimonial:", err);
    return NextResponse.json({ error: err.message || "Failed to create testimonial" }, { status: 500 });
  }
}
