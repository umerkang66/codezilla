import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { isMainAdmin } from "@/utils/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPackagesManagement from "@/components/admin/AdminPackagesManagement";

export const metadata = {
  title: "Packages Management | Codzilla Admin Panel",
  description: "Manage, add, edit, and delete flexible engineering packages.",
};

export default async function AdminPackagesPage() {
  const supabase = await createClient();

  // 1. Authenticate User Session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin-signin");
  }

  // 2. Fetch User Profile from Database
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const isSuperAdmin = isMainAdmin(user.email);
  const isRoleAdmin = profile?.role === "admin";
  const hasAdminAccess = isSuperAdmin || isRoleAdmin;

  // Extract Metadata for Sidebar & Header
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

  // 3. ENFORCE ROLE-BASED ACCESS CONTROL (NON-ADMIN ACCESS DENIED VIEW)
  if (!hasAdminAccess) {
    return (
      <main className="h-screen max-h-screen w-screen overflow-hidden bg-[#111111] text-[#E1E6EB] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#1A1A1A] border border-red-500/60 p-8 space-y-6 text-center rounded-none shadow-2xl">
          <div className="w-14 h-14 bg-[#111111] border border-red-500 flex items-center justify-center text-red-500 mx-auto rounded-none">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider rounded-none">
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
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs transition-colors rounded-none flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </form>

            <Link
              href="/"
              className="w-full py-3 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] font-mono text-xs text-center transition-colors rounded-none flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Website</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 4. Fetch initial packages list from Supabase
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <main className="h-screen max-h-screen w-screen overflow-hidden bg-[#111111] text-[#E1E6EB] flex font-sans select-none">
      {/* Sidebar Navigation */}
      <AdminSidebar
        userEmail={user.email!}
        fullName={fullName}
        avatarUrl={avatarUrl}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Main Panel Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#111111]">
        <AdminHeader
          userEmail={user.email!}
          fullName={fullName}
          avatarUrl={avatarUrl}
          isSuperAdmin={isSuperAdmin}
        />

        {/* Packages Management Workspace */}
        <AdminPackagesManagement initialPackages={packages || []} />
      </div>
    </main>
  );
}
