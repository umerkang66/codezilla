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
      return NextResponse.json({ error: "Missing testimonial ID" }, { status: 400 });
    }

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

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (quote !== undefined) payload.quote = quote.trim();
    if (author !== undefined) payload.author = author.trim();
    if (role !== undefined) payload.role = role.trim();
    if (rating !== undefined) {
      const numericRating = Number(rating);
      payload.rating = isNaN(numericRating) ? 5 : Math.min(5, Math.max(1, numericRating));
    }
    if (platform !== undefined) payload.platform = platform.trim();

    const finalAvatar = avatar_url !== undefined ? avatar_url : avatarUrl;
    if (finalAvatar !== undefined) payload.avatar_url = finalAvatar.trim();

    const orderVal = display_order !== undefined ? display_order : displayOrder;
    if (orderVal !== undefined) payload.display_order = Number(orderVal);

    if (status !== undefined) payload.status = status.trim();

    const { data: updatedTestimonial, error } = await auth.dbClient!
      .from("testimonials")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating testimonial:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, testimonial: updatedTestimonial });
  } catch (err: any) {
    console.error("Exception updating testimonial:", err);
    return NextResponse.json({ error: err.message || "Failed to update testimonial" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing testimonial ID" }, { status: 400 });
    }

    const { error } = await auth.dbClient!
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting testimonial:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, message: "Testimonial deleted successfully." });
  } catch (err: any) {
    console.error("Exception deleting testimonial:", err);
    return NextResponse.json({ error: err.message || "Failed to delete testimonial" }, { status: 500 });
  }
}
