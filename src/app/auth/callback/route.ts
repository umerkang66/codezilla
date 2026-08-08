import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isMainAdmin } from "@/utils/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/admin";
  // Validate redirect parameter to prevent Open Redirect attacks
  const safeNext = (rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\") && !rawNext.includes("://"))
    ? rawNext
    : "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email) {
        const userMeta = user.user_metadata || {};
        const identityMeta = user.identities?.[0]?.identity_data || {};
        const fullName =
          userMeta.full_name ||
          userMeta.name ||
          identityMeta.full_name ||
          identityMeta.name ||
          user.email.split("@")[0] ||
          "User";
        const avatarUrl =
          userMeta.avatar_url ||
          userMeta.picture ||
          identityMeta.avatar_url ||
          identityMeta.picture ||
          "";
        const isSuperAdmin = isMainAdmin(user.email);

        // Fetch existing profile to check current assigned role
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        let assignedRole = existingProfile?.role || "user";
        if (isSuperAdmin) {
          assignedRole = "admin";
        }

        // Upsert user profile into public.profiles table with fallback
        const payload: Record<string, any> = {
          id: user.id,
          email: user.email,
          role: assignedRole,
          updated_at: new Date().toISOString(),
        };
        if (fullName) payload.full_name = fullName;
        if (avatarUrl) payload.avatar_url = avatarUrl;

        const { error: upsertErr } = await supabase
          .from("profiles")
          .upsert(payload, { onConflict: "id" });

        if (upsertErr) {
          await supabase.from("profiles").upsert(
            {
              id: user.id,
              email: user.email,
              role: assignedRole,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );
        }
      }

      return NextResponse.redirect(`${origin}${safeNext}`);
    } else {
      console.error("Auth callback exchangeCodeForSession error:", error);
    }
  }

  // Return user to sign-in page with error if auth failed
  return NextResponse.redirect(`${origin}/admin-signin?error=AuthCallbackFailed`);
}
