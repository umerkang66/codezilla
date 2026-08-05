import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { isMainAdmin } from "@/utils/admin";

export async function verifyAdminAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    return { authorized: false, user: null, dbClient: null, error: "Unauthorized" };
  }

  const isSuperAdmin = isMainAdmin(user.email);

  // Fetch profile role from database
  let { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // Auto-sync superadmin profile to admin role if missing
  if (isSuperAdmin && profile?.role !== "admin") {
    const adminDb = createAdminClient();
    const db = adminDb || supabase;
    await db.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        role: "admin",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  }

  const isRoleAdmin = profile?.role === "admin" || isSuperAdmin;
  const hasAdminAccess = isSuperAdmin || isRoleAdmin;

  if (!hasAdminAccess) {
    return { authorized: false, user, dbClient: null, error: "Forbidden: Admin privileges required." };
  }

  const adminDbClient = createAdminClient();
  const dbClient = adminDbClient || supabase;

  return { authorized: true, user, isSuperAdmin, isRoleAdmin, dbClient, error: null };
}
