import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { isMainAdmin } from "@/utils/admin";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import AdminUserManagement from "@/components/admin/AdminUserManagement";

export const metadata = {
  title: "Admin Management | Codzilla Technologies",
  description: "User Management & Admin Role Assignment for Codzilla Technologies.",
};

export default async function AdminManagementPage() {
  const supabase = await createClient();

  // 1. Authenticate User Session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin-signin");
  }

  const adminDbClient = createAdminClient();
  const dbClient = adminDbClient || supabase;

  // 2. Fetch User Profile from Database
  let { data: profile } = await dbClient
    .from("profiles")
    .select("role, email, full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const isSuperAdmin = isMainAdmin(user.email);
  const isRoleAdmin = profile?.role === "admin";
  const hasAdminAccess = isSuperAdmin || isRoleAdmin;

  // Extract Google Auth Metadata (Profile Picture & Name)
  const userMeta = user.user_metadata || {};
  const identityMeta = user.identities?.[0]?.identity_data || {};
  const avatarUrl =
    profile?.avatar_url ||
    userMeta.avatar_url ||
    userMeta.picture ||
    identityMeta.avatar_url ||
    identityMeta.picture ||
    "";
  const fullName =
    profile?.full_name ||
    userMeta.full_name ||
    userMeta.name ||
    identityMeta.full_name ||
    identityMeta.name ||
    user.email?.split("@")[0] ||
    "Admin User";

  // Sync role to database if email matches ADMIN env variable but DB profile is outdated
  if (isSuperAdmin && profile?.role !== "admin") {
    await dbClient.from("profiles").upsert(
      {
        id: user.id,
        email: user.email!,
        full_name: fullName,
        avatar_url: avatarUrl,
        role: "admin",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  }

  // 3. ENFORCE ROLE-BASED ACCESS CONTROL (NON-ADMIN ACCESS DENIED VIEW)
  if (!hasAdminAccess) {
    return (
      <main className="h-screen max-h-screen w-screen overflow-hidden bg-[#111111] text-[#E1E6EB] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#1A1A1A] border border-red-500/60 p-8 space-y-6 text-center rounded-2xl shadow-2xl">
          <div className="w-14 h-14 bg-[#111111] border border-red-500 flex items-center justify-center text-red-500 mx-auto rounded-xl">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full">
              Access Denied
            </div>
            <h1 className="text-xl font-mono font-extrabold text-[#E1E6EB]">
              Admin Role Required
            </h1>
            <p className="text-xs text-[#9DA4B0] font-sans leading-relaxed">
              Signed in as <span className="text-[#81D607] font-mono">{user.email}</span>. You do not have permission to view this panel.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs transition-colors rounded-xl cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </form>

            <Link
              href="/"
              className="w-full py-3 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] font-mono text-xs text-center transition-colors rounded-xl cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Website</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 4. FETCH REGISTERED USERS FOR ADMIN USER MANAGEMENT
  // Map auth users metadata (full_name, avatar_url) from Auth Admin API
  const authUsersMap: Record<string, { email?: string; full_name?: string; avatar_url?: string; created_at?: string }> = {};

  if (adminDbClient) {
    try {
      const { data: authUsersData } = await adminDbClient.auth.admin.listUsers();
      if (authUsersData?.users && authUsersData.users.length > 0) {
        const profilesToUpsert = [];

        for (const authUser of authUsersData.users) {
          const meta = authUser.user_metadata || {};
          const idMeta = authUser.identities?.[0]?.identity_data || {};
          const fullName =
            meta.full_name ||
            meta.name ||
            idMeta.full_name ||
            idMeta.name ||
            authUser.email?.split("@")[0] ||
            "Registered User";
          const avatarUrl =
            meta.avatar_url ||
            meta.picture ||
            idMeta.avatar_url ||
            idMeta.picture ||
            "";

          authUsersMap[authUser.id] = {
            email: authUser.email || "",
            full_name: fullName,
            avatar_url: avatarUrl,
            created_at: authUser.created_at,
          };

          profilesToUpsert.push({
            id: authUser.id,
            email: authUser.email || "",
            full_name: fullName,
            avatar_url: avatarUrl,
            role: isMainAdmin(authUser.email) ? "admin" : "user",
            updated_at: new Date().toISOString(),
          });
        }

        if (profilesToUpsert.length > 0) {
          const { error: upsertErr } = await adminDbClient
            .from("profiles")
            .upsert(profilesToUpsert, {
              onConflict: "id",
              ignoreDuplicates: true,
            });

          if (upsertErr) {
            // Fallback without full_name/avatar_url if DB schema lacks those columns
            const fallbackProfiles = profilesToUpsert.map((p) => ({
              id: p.id,
              email: p.email,
              role: p.role,
              updated_at: p.updated_at,
            }));
            await adminDbClient.from("profiles").upsert(fallbackProfiles, {
              onConflict: "id",
              ignoreDuplicates: true,
            });
          }
        }
      }
    } catch (e) {
      console.error("Error syncing auth users to profiles:", e);
    }
  }

  const { data: rawUsers, error: usersError } = await dbClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (usersError) {
    console.error("Error fetching profiles:", usersError);
  }

  let initialUsers = (rawUsers || []).map((u: any) => {
    const meta = authUsersMap[u.id] || {};
    return {
      id: u.id,
      email: u.email,
      role: u.role || (isMainAdmin(u.email) ? "admin" : "user"),
      full_name: u.full_name || meta.full_name || u.email?.split("@")[0] || "Registered User",
      avatar_url: u.avatar_url || meta.avatar_url || "",
      created_at: u.created_at || new Date().toISOString(),
      isMainAdmin: isMainAdmin(u.email),
    };
  });

  // Fallback: If profiles query returned 0 rows, populate list directly from authUsersMap
  if (initialUsers.length === 0 && Object.keys(authUsersMap).length > 0) {
    initialUsers = Object.entries(authUsersMap).map(([id, meta]) => ({
      id,
      email: meta.email || "",
      role: isMainAdmin(meta.email) ? "admin" : "user",
      full_name: meta.full_name || meta.email?.split("@")[0] || "Registered User",
      avatar_url: meta.avatar_url || "",
      created_at: meta.created_at || new Date().toISOString(),
      isMainAdmin: isMainAdmin(meta.email),
    }));
  }

  // 5. RENDER DEDICATED ADMIN MANAGEMENT PAGE
  return (
    <AdminLayoutClient
      userEmail={user.email!}
      fullName={fullName}
      avatarUrl={avatarUrl}
      isSuperAdmin={isSuperAdmin}
    >
      <div className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto text-left">
        <AdminUserManagement
          isSuperAdmin={isSuperAdmin}
          initialUsers={initialUsers}
        />
      </div>
    </AdminLayoutClient>
  );
}

