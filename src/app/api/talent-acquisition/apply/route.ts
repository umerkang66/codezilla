import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
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

    // Check file extension
    const fileName = resumeFile.name || "resume.pdf";
    const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
    if (!["pdf", "docx", "doc"].includes(fileExt)) {
      return NextResponse.json(
        { error: "Only PDF (.pdf) and Word (.docx, .doc) files are allowed." },
        { status: 400 }
      );
    }

    // Max file size 15MB check
    if (resumeFile.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds maximum limit of 15MB." },
        { status: 400 }
      );
    }

    const adminDb = createAdminClient();
    const serverDb = await createClient();
    const db = adminDb || serverDb;

    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
    let resumeUrl = "";

    // 1. Try uploading to Supabase Storage bucket 'resumes'
    try {
      const bucketName = "resumes";
      
      // Ensure bucket exists
      const { error: bucketErr } = await db.storage.getBucket(bucketName);
      if (bucketErr) {
        await db.storage.createBucket(bucketName, { public: true });
      }

      const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${jobId}/${Date.now()}_${safeName}`;

      const { data: uploadData, error: uploadErr } = await db.storage
        .from(bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: resumeFile.type || "application/octet-stream",
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

    // 2. Fallback to Data URI if Storage fails/unavailable
    if (!resumeUrl) {
      const base64Str = fileBuffer.toString("base64");
      const mimeType =
        resumeFile.type ||
        (fileExt === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      resumeUrl = `data:${mimeType};base64,${base64Str}`;
    }

    // 3. Save application record in Database
    const payload = {
      job_id: jobId,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      portfolio_url: portfolioUrl.trim(),
      linkedin_url: linkedinUrl.trim(),
      cover_letter: coverLetter.trim(),
      resume_url: resumeUrl,
      resume_file_name: fileName,
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
        { error: `Failed to record application: ${dbErr.message}` },
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
      { error: err.message || "An unexpected error occurred while processing application." },
      { status: 500 }
    );
  }
}
