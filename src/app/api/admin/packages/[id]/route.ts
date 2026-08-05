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
      return NextResponse.json({ error: "Missing package ID" }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      subtitle,
      price,
      period,
      featured,
      features,
      cta_text,
      ctaText,
      display_order,
      displayOrder,
      status,
    } = body;

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) payload.name = name.trim();
    if (subtitle !== undefined) payload.subtitle = subtitle.trim();
    if (price !== undefined) payload.price = price.trim();
    if (period !== undefined) payload.period = period.trim();
    if (featured !== undefined) payload.featured = Boolean(featured);

    if (features !== undefined) {
      if (Array.isArray(features)) {
        payload.features = features.map((f: any) => String(f).trim()).filter(Boolean);
      } else if (typeof features === "string") {
        payload.features = features
          .split("\n")
          .map((f: string) => f.trim())
          .filter(Boolean);
      }
    }

    const finalCta = cta_text !== undefined ? cta_text : ctaText;
    if (finalCta !== undefined) payload.cta_text = finalCta.trim();

    const orderVal = display_order !== undefined ? display_order : displayOrder;
    if (orderVal !== undefined) payload.display_order = Number(orderVal);

    if (status !== undefined) payload.status = status.trim();

    const { data: updatedPackage, error } = await auth.dbClient!
      .from("packages")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating package:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, package: updatedPackage });
  } catch (err: any) {
    console.error("Exception updating package:", err);
    return NextResponse.json({ error: err.message || "Failed to update package" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing package ID" }, { status: 400 });
    }

    const { error } = await auth.dbClient!
      .from("packages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting package:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, message: "Package deleted successfully." });
  } catch (err: any) {
    console.error("Exception deleting package:", err);
    return NextResponse.json({ error: err.message || "Failed to delete package" }, { status: 500 });
  }
}
