import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/utils/admin-auth";
import { checkRateLimit, getClientIp } from "@/utils/security/rate-limit";
import { validateCsrf } from "@/utils/security/csrf";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export async function POST(request: Request) {
  // 1. Verify Admin Session & Role
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  // 2. Validate CSRF Origin Header
  const csrfCheck = validateCsrf(request);
  if (!csrfCheck.valid) {
    return NextResponse.json(
      { error: csrfCheck.error || "Forbidden: CSRF check failed." },
      { status: 403 }
    );
  }

  // 3. Rate Limit Admin Uploads (15 requests per minute)
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`admin_upload_${clientIp}`, {
    windowMs: 60 * 1000,
    maxRequests: 15,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: `Upload rate limit exceeded. Please wait ${rateLimit.resetSeconds} seconds.` },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // 4. Strict Image Type & Extension Validation
    const rawFileName = file.name || "avatar.png";
    const safeFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileExt = safeFileName.split(".").pop()?.toLowerCase() || "";

    if (!["png", "jpg", "jpeg", "webp", "svg"].includes(fileExt)) {
      return NextResponse.json(
        { error: "Invalid image extension. Allowed: .png, .jpg, .jpeg, .webp, .svg" },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid image MIME type." },
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

    // Storage upload
    try {
      const { error: bucketErr } = await auth.dbClient!.storage.getBucket(bucketName);
      if (bucketErr) {
        await auth.dbClient!.storage.createBucket(bucketName, { public: true });
      }

      const storagePath = `members/${Date.now()}_${safeFileName}`;

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

    if (!avatarUrl) {
      const base64Str = fileBuffer.toString("base64");
      avatarUrl = `data:${file.type || "image/png"};base64,${base64Str}`;
    }

    return NextResponse.json({ success: true, url: avatarUrl });
  } catch (err: any) {
    console.error("Error uploading team avatar:", err);
    return NextResponse.json(
      { error: "Failed to upload avatar image." },
      { status: 500 }
    );
  }
}
