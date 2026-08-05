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
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isRoleAdmin = profile?.role === "admin";
  const hasAdminAccess = isSuperAdmin || isRoleAdmin;

  if (!hasAdminAccess) {
    return { authorized: false, user, dbClient: null, error: "Forbidden: Admin privileges required." };
  }

  const adminDbClient = createAdminClient();
  const dbClient = adminDbClient || supabase;

  return { authorized: true, user, isSuperAdmin, isRoleAdmin, dbClient, error: null };
}
