import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isMainAdmin } from "@/utils/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email) {
        const userMeta = user.user_metadata || {};
        const fullName = userMeta.full_name || userMeta.name || "User";
        const avatarUrl = userMeta.avatar_url || userMeta.picture || "";
        const isSuperAdmin = isMainAdmin(user.email);

        // Fetch existing profile to check current assigned role
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        let assignedRole = existingProfile?.role || "user";
        if (isSuperAdmin) {
          assignedRole = "admin";
        }

        // Upsert user profile into public.profiles table
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email,
            full_name: fullName,
            avatar_url: avatarUrl,
            role: assignedRole,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return user to sign-in page with error if auth failed
  return NextResponse.redirect(`${origin}/admin-signin?error=AuthCallbackFailed`);
}
