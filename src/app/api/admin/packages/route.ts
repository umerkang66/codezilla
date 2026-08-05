import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { data: packages, error } = await auth.dbClient!
    .from("packages")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message, packages: [] }, { status: 500 });
  }

  return NextResponse.json({ packages: packages || [] });
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
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

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Package name is required." }, { status: 400 });
    }
    if (!price || !price.trim()) {
      return NextResponse.json({ error: "Price is required." }, { status: 400 });
    }

    // Process features as an array of trimmed non-empty strings
    let processedFeatures: string[] = [];
    if (Array.isArray(features)) {
      processedFeatures = features.map((f: any) => String(f).trim()).filter(Boolean);
    } else if (typeof features === "string") {
      processedFeatures = features
        .split("\n")
        .map((f: string) => f.trim())
        .filter(Boolean);
    }

    const payload = {
      name: name.trim(),
      subtitle: (subtitle || "").trim(),
      price: price.trim(),
      period: (period || "Starting price").trim(),
      featured: Boolean(featured),
      features: processedFeatures,
      cta_text: (cta_text || ctaText || "Choose Package").trim(),
      display_order: Number(display_order !== undefined ? display_order : (displayOrder || 0)),
      status: (status || "active").trim(),
      updated_at: new Date().toISOString(),
    };

    const { data: newPackage, error } = await auth.dbClient!
      .from("packages")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Error inserting package:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, package: newPackage });
  } catch (err: any) {
    console.error("Exception creating package:", err);
    return NextResponse.json({ error: err.message || "Failed to create package" }, { status: 500 });
  }
}
