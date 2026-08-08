import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { checkRateLimit, getClientIp } from "@/utils/security/rate-limit";
import { sanitizeText } from "@/utils/security/sanitize";
import { validateCsrf } from "@/utils/security/csrf";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  try {
    // 1. CSRF Check
    const csrfCheck = validateCsrf(request);
    if (!csrfCheck.valid) {
      return NextResponse.json(
        { error: csrfCheck.error || "Forbidden: CSRF check failed." },
        { status: 403 }
      );
    }

    // 2. Rate Limiting (5 applications per 15 minutes per IP)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`job_apply_${clientIp}`, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many applications submitted. Please try again in ${rateLimit.resetSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();

    const jobId = formData.get("jobId") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = (formData.get("phone") as string) || "";
    const portfolioUrl = (formData.get("portfolioUrl") as string) || "";
    const linkedinUrl = (formData.get("linkedinUrl") as string) || "";
    const coverLetter = (formData.get("coverLetter") as string) || "";
    const resumeFile = formData.get("resumeFile") as File | null;

    if (!jobId || !fullName || !email) {
      return NextResponse.json(
        { error: "Job position, Full Name, and Email are required fields." },
        { status: 400 }
      );
    }

    if (!resumeFile) {
      return NextResponse.json(
        { error: "CV / Resume file (.pdf or .docx) is required." },
        { status: 400 }
      );
    }

    // 3. Strict File Upload Validation (Type, Extension & Size)
    const rawFileName = resumeFile.name || "resume.pdf";
    const safeFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileExt = safeFileName.split(".").pop()?.toLowerCase() || "";

    if (!["pdf", "docx", "doc"].includes(fileExt)) {
      return NextResponse.json(
        { error: "Invalid file extension. Only PDF (.pdf) and Word (.docx, .doc) files are allowed." },
        { status: 400 }
      );
    }

    if (resumeFile.type && !ALLOWED_MIME_TYPES.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: "Invalid file MIME type. Only PDF and Word documents are permitted." },
        { status: 400 }
      );
    }

    // Max file size 10MB limit
    if (resumeFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds maximum limit of 10MB." },
        { status: 400 }
      );
    }

    // 4. Sanitize Text Inputs
    const cleanFullName = sanitizeText(fullName);
    const cleanEmail = sanitizeText(email);
    const cleanPhone = sanitizeText(phone);
    const cleanPortfolioUrl = sanitizeText(portfolioUrl);
    const cleanLinkedinUrl = sanitizeText(linkedinUrl);
    const cleanCoverLetter = sanitizeText(coverLetter);
    const cleanJobId = sanitizeText(jobId);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const adminDb = createAdminClient();
    const serverDb = await createClient();
    const db = adminDb || serverDb;

    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
    let resumeUrl = "";

    // 5. Storage Upload with Sanitized Path
    try {
      const bucketName = "resumes";
      
      const { error: bucketErr } = await db.storage.getBucket(bucketName);
      if (bucketErr) {
        await db.storage.createBucket(bucketName, { public: true });
      }

      const storagePath = `${cleanJobId}/${Date.now()}_${safeFileName}`;

      const { data: uploadData, error: uploadErr } = await db.storage
        .from(bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: resumeFile.type || "application/pdf",
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: pubUrlData } = db.storage
          .from(bucketName)
          .getPublicUrl(storagePath);
        resumeUrl = pubUrlData.publicUrl;
      } else if (uploadErr) {
        console.warn("Supabase storage upload error, using fallback:", uploadErr.message);
      }
    } catch (stgErr) {
      console.warn("Storage attempt failed, proceeding with fallback URI:", stgErr);
    }

    if (!resumeUrl) {
      const base64Str = fileBuffer.toString("base64");
      const mimeType =
        resumeFile.type ||
        (fileExt === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      resumeUrl = `data:${mimeType};base64,${base64Str}`;
    }

    const payload = {
      job_id: cleanJobId,
      full_name: cleanFullName,
      email: cleanEmail,
      phone: cleanPhone,
      portfolio_url: cleanPortfolioUrl,
      linkedin_url: cleanLinkedinUrl,
      cover_letter: cleanCoverLetter,
      resume_url: resumeUrl,
      resume_file_name: safeFileName,
      resume_file_type: fileExt,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: application, error: dbErr } = await db
      .from("job_applications")
      .insert([payload])
      .select()
      .single();

    if (dbErr) {
      console.error("Database insert job_application error:", dbErr);
      return NextResponse.json(
        { error: "Failed to submit job application." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      application,
    });
  } catch (err: any) {
    console.error("Apply route exception:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing application." },
      { status: 500 }
    );
  }
}
