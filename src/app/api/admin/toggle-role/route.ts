import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { isMainAdmin } from "@/utils/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate caller session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. VERIFY CALLER IS MAIN ADMIN (Super Admin from process.env.ADMIN)
    if (!isMainAdmin(user.email)) {
      return NextResponse.json(
        {
          error:
            "Permission Denied: Only the Main Admin configured in environment can promote or demote admin users.",
        },
        { status: 403 }
      );
    }

    // 3. Parse request payload
    const body = await request.json();
    const { userId, targetRole } = body;

    if (!userId || !targetRole || (targetRole !== "admin" && targetRole !== "user")) {
      return NextResponse.json(
        { error: "Invalid parameters. 'userId' and 'targetRole' ('admin'|'user') are required." },
        { status: 400 }
      );
    }

    const adminDbClient = createAdminClient();
    const dbClient = adminDbClient || supabase;

    // 4. Fetch target user to prevent altering Main Admin status
    const { data: targetUser, error: fetchError } = await dbClient
      .from("profiles")
      .select("email, role")
      .eq("id", userId)
      .single();

    if (fetchError || !targetUser) {
      return NextResponse.json({ error: "Target user not found." }, { status: 404 });
    }

    if (isMainAdmin(targetUser.email) && targetRole === "user") {
      return NextResponse.json(
        { error: "Cannot demote a Main Admin configured in environment." },
        { status: 400 }
      );
    }

    // 5. Update target user's role in public.profiles table
    const { error: updateError } = await dbClient
      .from("profiles")
      .update({
        role: targetRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: `Database update failed: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      role: targetRole,
      message: `User ${targetUser.email} role updated to '${targetRole}'.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

