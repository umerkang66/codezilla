import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  LogOut,
  Users,
  MessageSquare,
  Activity,
  Database,
  ArrowLeft,
  Lock,
  Mail,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { isAdminEmail, getAdminEmails } from "@/utils/admin";

export const metadata = {
  title: "Admin Dashboard | Codzilla Technologies",
  description: "Restricted Administrative Control Panel for Codzilla Technologies.",
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
    .select("role, email")
    .eq("id", user.id)
    .single();

  const isEmailAdmin = isAdminEmail(user.email);
  const isRoleAdmin = profile?.role === "admin";
  const hasAdminAccess = isEmailAdmin || isRoleAdmin;

  // Sync role to database if email matches ADMIN env variable but DB profile is outdated
  if (isEmailAdmin && profile?.role !== "admin") {
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

  // 3. ENFORCE ROLE-BASED ACCESS CONTROL (RBAC)
  if (!hasAdminAccess) {
    return (
      <main className="min-h-screen py-16 bg-[#111111] text-[#E1E6EB] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-[#1A1A1A] border border-red-500/60 p-8 space-y-6 text-center rounded-none">
          <div className="w-14 h-14 bg-[#111111] border border-red-500 flex items-center justify-center text-red-500 mx-auto rounded-none">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider rounded-none">
              Access Denied
            </div>
            <h1 className="text-2xl font-extrabold text-[#E1E6EB]">
              Admin Role Required
            </h1>
            <p className="text-xs text-[#9DA4B0] font-sans leading-relaxed">
              You are signed in as <span className="text-[#81D607] font-mono">{user.email}</span>, but your account has not been granted the <span className="text-red-400 font-mono">'admin'</span> role.
            </p>
          </div>

          <div className="p-4 bg-[#111111] border border-[#E1E6EB]/10 text-left text-xs font-mono text-[#9DA4B0] space-y-2 rounded-none">
            <p className="text-[#E1E6EB] font-bold">Why am I seeing this?</p>
            <p>1. Only emails configured in the <code className="text-[#81D607]">ADMIN</code> environment variable can access this panel.</p>
            <p>2. Non-admin users are restricted to standard features.</p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs transition-colors rounded-none flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out & Try Admin Account</span>
              </button>
            </form>

            <Link
              href="/"
              className="w-full py-3 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] font-mono text-xs text-center transition-colors rounded-none"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 4. RENDER AUTHORIZED ADMIN DASHBOARD
  const configuredAdmins = getAdminEmails();

  return (
    <main className="min-h-screen py-12 bg-[#111111] text-[#E1E6EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        {/* Top Admin Header Bar */}
        <div className="bg-[#1A1A1A] border border-[#81D607]/40 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-none">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#111111] border border-[#81D607] flex items-center justify-center text-[#81D607] rounded-none">
                <Lock className="w-4 h-4" />
              </div>
              <span className="px-2.5 py-0.5 bg-[#81D607] text-[#111111] font-mono font-extrabold text-[10px] uppercase tracking-wider rounded-none">
                Admin Role Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#E1E6EB] tracking-tight">
              Codzilla Administrative Control Panel
            </h1>
            <p className="text-xs font-mono text-[#9DA4B0]">
              Logged in as: <span className="text-[#81D607] font-bold">{user.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="px-4 py-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-xs font-mono text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors rounded-none inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>View Website</span>
            </Link>

            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs transition-colors rounded-none inline-flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-2 rounded-none">
            <div className="flex items-center justify-between text-[#81D607]">
              <span className="text-xs font-mono uppercase">System Health</span>
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-[#E1E6EB] font-mono">100% Operational</div>
            <p className="text-[11px] text-[#9DA4B0] font-sans">Supabase Auth & Database Online</p>
          </div>

          <div className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-2 rounded-none">
            <div className="flex items-center justify-between text-[#81D607]">
              <span className="text-xs font-mono uppercase">Active Role</span>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-[#81D607] font-mono">ADMIN</div>
            <p className="text-[11px] text-[#9DA4B0] font-sans">Verified via Env & RLS Policy</p>
          </div>

          <div className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-2 rounded-none">
            <div className="flex items-center justify-between text-[#81D607]">
              <span className="text-xs font-mono uppercase">Configured Admins</span>
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-[#E1E6EB] font-mono">{configuredAdmins.length} Accounts</div>
            <p className="text-[11px] text-[#9DA4B0] font-sans">Parsed from process.env.ADMIN</p>
          </div>

          <div className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-2 rounded-none">
            <div className="flex items-center justify-between text-[#81D607]">
              <span className="text-xs font-mono uppercase">Database Engine</span>
              <Database className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-[#E1E6EB] font-mono">PostgreSQL</div>
            <p className="text-[11px] text-[#9DA4B0] font-sans">Row-Level Security Enabled</p>
          </div>
        </div>

        {/* Section: Configured Admin Emails */}
        <div className="bg-[#1A1A1A] border border-[#E1E6EB]/10 p-6 sm:p-8 space-y-6 rounded-none">
          <div className="flex items-center justify-between border-b border-[#E1E6EB]/10 pb-4">
            <h2 className="text-lg font-bold text-[#E1E6EB] font-mono flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#81D607]" />
              <span>Configured Admin Email Registry</span>
            </h2>
            <span className="text-xs font-mono text-[#81D607]">ADMIN env var</span>
          </div>

          <p className="text-xs text-[#9DA4B0] font-sans">
            Users signing in with the following Google emails are automatically assigned the <code className="text-[#81D607]">admin</code> role:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
            {configuredAdmins.map((email, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#111111] border border-[#81D607]/40 flex items-center justify-between text-[#E1E6EB] rounded-none"
              >
                <span>{email}</span>
                <span className="text-[10px] text-[#81D607] font-bold">AUTHORIZED</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
