import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  LogOut,
  ArrowLeft,
  User,
  CheckCircle2,
  Database,
  Users,
  BookOpen,
  Mail,
  Briefcase,
  Package,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { isMainAdmin, getAdminEmails } from "@/utils/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Admin Panel | Codzilla Technologies",
  description: "Administrative Dashboard Overview for Codzilla Technologies.",
};

export default async function AdminDashboardPage() {
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
    .select("*")
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

  // Sync profile & role to database if email matches ADMIN env variable or profile is updated
  if (isSuperAdmin && profile?.role !== "admin") {
    const payload: Record<string, any> = {
      id: user.id,
      email: user.email!,
      role: "admin",
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
          email: user.email!,
          role: "admin",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    }
  }

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

  const configuredAdmins = getAdminEmails();

  // Fetch contact messages statistics
  const { data: contactMsgs } = await supabase
    .from("contact_messages")
    .select("id, is_read");

  const totalContactMsgs = contactMsgs?.length || 0;
  const unreadContactMsgs = contactMsgs?.filter((m) => !m.is_read).length || 0;

  // Fetch Talent Acquisition statistics
  const { data: jobApps } = await supabase
    .from("job_applications")
    .select("id, status");
  const totalJobApps = jobApps?.length || 0;
  const pendingJobApps = jobApps?.filter((a) => a.status === "pending").length || 0;

  // Fetch Packages statistics
  const { data: packagesData } = await supabase
    .from("packages")
    .select("id, status");
  const totalPackages = packagesData?.length || 0;

  // 4. OVERVIEW PAGE WITH SHARED SIDEBAR & HEADER
  return (
    <main className="h-screen max-h-screen w-screen overflow-hidden bg-[#111111] text-[#E1E6EB] flex font-sans select-none">
      {/* Sidebar */}
      <AdminSidebar
        userEmail={user.email!}
        fullName={fullName}
        avatarUrl={avatarUrl}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Main Panel Content Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#111111]">
        {/* Top Header */}
        <AdminHeader
          userEmail={user.email!}
          fullName={fullName}
          avatarUrl={avatarUrl}
          isSuperAdmin={isSuperAdmin}
        />

        {/* Dashboard Main Workspace Canvas */}
        <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto text-left space-y-8">
          {/* Welcome & Overview Header */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-mono font-extrabold text-[#E1E6EB]">
                Admin Dashboard Overview
              </h2>
              <p className="text-xs text-[#9DA4B0]">
                Welcome back, <span className="text-[#81D607] font-mono">{fullName}</span> ({isSuperAdmin ? "Main Admin" : "Sub-Admin"}). System is fully operational and synchronized.
              </p>
            </div>

            {/* Admin Profile Details Card (Featured Avatar Picture) */}
            <div className="p-6 bg-[#1A1A1A] border border-[#81D607]/40 space-y-4 rounded-none">
              <div className="flex items-center gap-4 border-b border-[#E1E6EB]/10 pb-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-14 h-14 border-2 border-[#81D607] object-cover shrink-0 rounded-none shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 bg-[#111111] border-2 border-[#81D607] flex items-center justify-center text-[#81D607] shrink-0 rounded-none">
                    <User className="w-7 h-7" />
                  </div>
                )}

                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-mono font-bold text-[#E1E6EB]">
                      {fullName}
                    </h3>
                    <span className="px-2 py-0.5 bg-[#81D607] text-[#111111] font-mono font-extrabold text-[10px] uppercase">
                      {isSuperAdmin ? "Main Admin" : "Sub-Admin"}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#81D607]">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 bg-[#111111] border border-[#E1E6EB]/10">
                  <span className="text-[#9DA4B0] block text-[10px] uppercase">User Email</span>
                  <span className="text-[#81D607] font-bold truncate block">{user.email}</span>
                </div>
                <div className="p-3 bg-[#111111] border border-[#E1E6EB]/10">
                  <span className="text-[#9DA4B0] block text-[10px] uppercase">RBAC Role</span>
                  <span className="text-[#81D607] font-bold block">
                    {isSuperAdmin ? "MAIN ADMIN (Env)" : "SUB-ADMIN"}
                  </span>
                </div>
                <div className="p-3 bg-[#111111] border border-[#E1E6EB]/10">
                  <span className="text-[#9DA4B0] block text-[10px] uppercase">Supabase Auth</span>
                  <span className="text-[#81D607] font-bold block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="p-5 bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-2 rounded-none">
                <div className="flex items-center justify-between text-[#81D607]">
                  <span className="text-xs font-mono uppercase">Talent Applications</span>
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="text-xl font-extrabold text-[#E1E6EB] font-mono flex items-center gap-2">
                  <span>{totalJobApps} Total</span>
                  {pendingJobApps > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-[#81D607] text-[#111111] font-bold">
                      {pendingJobApps} New
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#9DA4B0]">From /talent-acquisition</p>
              </div>

              <div className="p-5 bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-2 rounded-none">
                <div className="flex items-center justify-between text-[#81D607]">
                  <span className="text-xs font-mono uppercase">Contact Messages</span>
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xl font-extrabold text-[#E1E6EB] font-mono flex items-center gap-2">
                  <span>{totalContactMsgs} Total</span>
                  {unreadContactMsgs > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-[#81D607] text-[#111111] font-bold">
                      {unreadContactMsgs} Unread
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#9DA4B0]">From /contact & Homepage</p>
              </div>

              <div className="p-5 bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-2 rounded-none">
                <div className="flex items-center justify-between text-[#81D607]">
                  <span className="text-xs font-mono uppercase">Database Engine</span>
                  <Database className="w-5 h-5" />
                </div>
                <div className="text-xl font-extrabold text-[#E1E6EB] font-mono">PostgreSQL</div>
                <p className="text-[11px] text-[#9DA4B0]">Row-Level Security Enabled</p>
              </div>

              <div className="p-5 bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-2 rounded-none">
                <div className="flex items-center justify-between text-[#81D607]">
                  <span className="text-xs font-mono uppercase">Configured Admins</span>
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-xl font-extrabold text-[#E1E6EB] font-mono">{configuredAdmins.length} Emails</div>
                <p className="text-[11px] text-[#9DA4B0]">From process.env.ADMIN</p>
              </div>
            </div>
          </div>

          {/* Quick Navigation Callout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="p-5 bg-[#1A1A1A] border border-[#81D607]/40 flex flex-col justify-between space-y-4 rounded-none">
              <div className="space-y-1">
                <h3 className="text-sm font-mono font-bold text-[#E1E6EB] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#81D607]" />
                  <span>Packages Management</span>
                </h3>
                <p className="text-xs text-[#9DA4B0]">
                  Create, update, order, or hide Flexible Engineering Packages pricing cards.
                </p>
              </div>
              <Link
                href="/admin/packages"
                className="px-4 py-2.5 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs rounded-none flex items-center justify-center gap-2 w-full"
              >
                <Package className="w-4 h-4" />
                <span>Manage Packages</span>
              </Link>
            </div>

            <div className="p-5 bg-[#1A1A1A] border border-[#81D607]/40 flex flex-col justify-between space-y-4 rounded-none">
              <div className="space-y-1">
                <h3 className="text-sm font-mono font-bold text-[#E1E6EB] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#81D607]" />
                  <span>Team Management</span>
                </h3>
                <p className="text-xs text-[#9DA4B0]">
                  Add, edit, or delete leadership & engineering team members shown on frontend.
                </p>
              </div>
              <Link
                href="/admin/teams"
                className="px-4 py-2.5 bg-[#1A1A1A] border border-[#81D607] text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs rounded-none flex items-center justify-center gap-2 w-full transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Manage Team</span>
              </Link>
            </div>

            <div className="p-5 bg-[#1A1A1A] border border-[#81D607]/40 flex flex-col justify-between space-y-4 rounded-none">
              <div className="space-y-1">
                <h3 className="text-sm font-mono font-bold text-[#E1E6EB] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#81D607]" />
                  <span>Talent Acquisition</span>
                </h3>
                <p className="text-xs text-[#9DA4B0]">
                  Manage job postings CRUD and review candidate CV applications (.pdf, .docx).
                </p>
              </div>
              <Link
                href="/admin/talent-acquisition"
                className="px-4 py-2.5 bg-[#1A1A1A] border border-[#81D607] text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs rounded-none flex items-center justify-center gap-2 w-full transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                <span>Talent Acquisition</span>
              </Link>
            </div>

            <div className="p-5 bg-[#1A1A1A] border border-[#81D607]/40 flex flex-col justify-between space-y-4 rounded-none">
              <div className="space-y-1">
                <h3 className="text-sm font-mono font-bold text-[#E1E6EB] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#81D607]" />
                  <span>Contact Messages</span>
                </h3>
                <p className="text-xs text-[#9DA4B0]">
                  View incoming messages, filter by All or Unread, read in modal and mark as read.
                </p>
              </div>
              <Link
                href="/admin/contact-messages"
                className="px-4 py-2.5 bg-[#1A1A1A] border border-[#81D607] text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs rounded-none flex items-center justify-center gap-2 w-full transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>View Messages</span>
              </Link>
            </div>

            <div className="p-5 bg-[#1A1A1A] border border-[#81D607]/40 flex flex-col justify-between space-y-4 rounded-none">
              <div className="space-y-1">
                <h3 className="text-sm font-mono font-bold text-[#E1E6EB] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#81D607]" />
                  <span>Blogs Management</span>
                </h3>
                <p className="text-xs text-[#9DA4B0]">
                  Create, edit, delete, and publish technical articles using live Markdown editor.
                </p>
              </div>
              <Link
                href="/admin/blogs"
                className="px-4 py-2.5 bg-[#1A1A1A] border border-[#81D607] text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs rounded-none flex items-center justify-center gap-2 w-full transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Manage Blogs</span>
              </Link>
            </div>

            <div className="p-5 bg-[#1A1A1A] border border-[#81D607]/40 flex flex-col justify-between space-y-4 rounded-none">
              <div className="space-y-1">
                <h3 className="text-sm font-mono font-bold text-[#E1E6EB] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#81D607]" />
                  <span>User Management</span>
                </h3>
                <p className="text-xs text-[#9DA4B0]">
                  Search registered users by name or email, assign sub-admin privileges, or revoke.
                </p>
              </div>
              <Link
                href="/admin/adminmanagement"
                className="px-4 py-2.5 bg-[#1A1A1A] border border-[#81D607] text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs rounded-none flex items-center justify-center gap-2 w-full transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>User Roles</span>
              </Link>
            </div>
          </div>

          {/* Quick Actions Footer Bar */}
          <div className="pt-4 border-t border-[#E1E6EB]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-[#9DA4B0]">
              Codzilla Administrative System v1.0
            </span>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 bg-[#111111] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs transition-colors rounded-none flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
