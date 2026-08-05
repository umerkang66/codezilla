import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image file (PNG, JPG, WEBP, SVG)." },
        { status: 400 }
      );
    }

    // Limit file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file size exceeds the 5MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    let avatarUrl = "";
    const bucketName = "team-avatars";

    // 1. Try uploading to Supabase Storage bucket 'team-avatars'
    try {
      // Ensure bucket exists
      const { error: bucketErr } = await auth.dbClient!.storage.getBucket(bucketName);
      if (bucketErr) {
        await auth.dbClient!.storage.createBucket(bucketName, { public: true });
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `members/${Date.now()}_${safeName}`;

      const { data: uploadData, error: uploadErr } = await auth.dbClient!.storage
        .from(bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: file.type || "image/png",
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: pubUrlData } = auth.dbClient!.storage
          .from(bucketName)
          .getPublicUrl(storagePath);
        avatarUrl = pubUrlData.publicUrl;
      } else if (uploadErr) {
        console.warn("Supabase storage upload failed, falling back to base64 data URI:", uploadErr.message);
      }
    } catch (stgErr) {
      console.warn("Storage exception, using fallback data URI:", stgErr);
    }

    // 2. Fallback to Data URI if Storage bucket is disabled/unavailable
    if (!avatarUrl) {
      const base64Str = fileBuffer.toString("base64");
      avatarUrl = `data:${file.type || "image/png"};base64,${base64Str}`;
    }

    return NextResponse.json({ success: true, url: avatarUrl });
  } catch (err: any) {
    console.error("Error uploading team avatar:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload avatar image." },
      { status: 500 }
    );
  }
}
