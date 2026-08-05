import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { isMainAdmin } from "@/utils/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
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

  // 2. Fetch User Profile from Database
  let { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  const isSuperAdmin = isMainAdmin(user.email);
  const isRoleAdmin = profile?.role === "admin";
  const hasAdminAccess = isSuperAdmin || isRoleAdmin;

  // Extract Google Auth Metadata (Profile Picture & Name)
  const userMeta = user.user_metadata || {};
  const avatarUrl = userMeta.avatar_url || userMeta.picture;
  const fullName = userMeta.full_name || userMeta.name || "Admin User";

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

  // 4. FETCH REGISTERED USERS FOR ADMIN USER MANAGEMENT
  const { data: rawUsers } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, created_at")
    .order("created_at", { ascending: false });

  const initialUsers = (rawUsers || []).map((u) => ({
    ...u,
    isMainAdmin: isMainAdmin(u.email),
  }));

  // 5. RENDER DEDICATED ADMIN MANAGEMENT PAGE
  return (
    <main className="h-screen max-h-screen w-screen overflow-hidden bg-[#111111] text-[#E1E6EB] flex font-sans select-none">
      {/* Sidebar */}
      <AdminSidebar
        userEmail={user.email!}
        fullName={fullName}
        avatarUrl={avatarUrl}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Main Content Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#111111]">
        {/* Top Header */}
        <AdminHeader
          userEmail={user.email!}
          fullName={fullName}
          avatarUrl={avatarUrl}
          isSuperAdmin={isSuperAdmin}
        />

        {/* User Management Content Canvas */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto text-left">
          <AdminUserManagement
            isSuperAdmin={isSuperAdmin}
            initialUsers={initialUsers}
          />
        </div>
      </div>
    </main>
  );
}
