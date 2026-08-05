import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdminEmail } from "@/utils/admin";

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
        const isAdmin = isAdminEmail(user.email);
        const assignedRole = isAdmin ? "admin" : "user";

        // Sync role to public.profiles table
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

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return user to sign-in page with error if auth failed
  return NextResponse.redirect(`${origin}/admin-signin?error=AuthCallbackFailed`);
}
