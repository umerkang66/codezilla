import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  LogOut,
  ArrowLeft,
  User,
  CheckCircle2,
  Users,
  BookOpen,
  Mail,
  Briefcase,
  Package,
  MessageSquareQuote,
  FolderGit2,
  ExternalLink,
  Plus,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { isMainAdmin, getAdminEmails } from "@/utils/admin";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { AdminLink } from "@/components/admin/AdminNavigationContext";

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

  // 4. FETCH SYSTEM METRICS & RECENT ACTIVITY
  const adminDb = createAdminClient();
  const db = adminDb || supabase;

  // Contact Messages (Schema: id, name, email, service, message, is_read, created_at)
  const { data: contactMsgs, error: contactErr } = await db
    .from("contact_messages")
    .select("id, name, email, service, message, is_read, created_at")
    .order("created_at", { ascending: false });

  if (contactErr) console.error("[Admin Overview] contact_messages error:", contactErr);

  const totalContactMsgs = contactMsgs?.length || 0;
  const unreadContactMsgs = contactMsgs?.filter((m) => !m.is_read) || [];
  const recentUnreadMsgs = unreadContactMsgs.slice(0, 3);

  // Job Applications & Job Postings
  const { data: jobApps, error: jobAppsErr } = await db
    .from("job_applications")
    .select("id, job_id, full_name, email, status, created_at")
    .order("created_at", { ascending: false });

  if (jobAppsErr) console.error("[Admin Overview] job_applications error:", jobAppsErr);

  const { data: jobPostings } = await db
    .from("job_postings")
    .select("id, title");

  const jobsMap = new Map((jobPostings || []).map((j: any) => [j.id, j.title]));

  const totalJobApps = jobApps?.length || 0;
  const pendingJobApps = jobApps?.filter((a) => a.status === "pending") || [];
  const recentPendingApps = pendingJobApps.slice(0, 3).map((app: any) => ({
    ...app,
    job_title: jobsMap.get(app.job_id) || "General Application",
  }));

  // Portfolio Projects
  const { data: portfolioData, error: portErr } = await db
    .from("portfolio_projects")
    .select("id");

  if (portErr) console.error("[Admin Overview] portfolio_projects error:", portErr);
  const totalPortfolioProjects = portfolioData?.length || 0;

  // Blogs
  const { data: blogsData, error: blogsErr } = await db
    .from("blogs")
    .select("id");

  if (blogsErr) console.error("[Admin Overview] blogs error:", blogsErr);
  const totalBlogs = blogsData?.length || 0;

  // Team Members
  const { data: teamData, error: teamErr } = await db
    .from("team_members")
    .select("id");

  if (teamErr) console.error("[Admin Overview] team_members error:", teamErr);
  const totalTeam = teamData?.length || 0;

  // Testimonials / Reviews
  const { data: testimonialsData, error: testErr } = await db
    .from("testimonials")
    .select("id");

  if (testErr) console.error("[Admin Overview] testimonials error:", testErr);
  const totalTestimonials = testimonialsData?.length || 0;

  // Packages
  const { data: packagesData, error: pkgErr } = await db
    .from("packages")
    .select("id");

  if (pkgErr) console.error("[Admin Overview] packages error:", pkgErr);
  const totalPackages = packagesData?.length || 0;

  // 5. MINIMALIST OVERVIEW PAGE
  return (
    <AdminLayoutClient
      userEmail={user.email!}
      fullName={fullName}
      avatarUrl={avatarUrl}
      isSuperAdmin={isSuperAdmin}
    >
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 bg-[#0F0F0F] text-left">
        
        {/* 1. Minimal Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E1E6EB]/10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-mono font-extrabold text-[#E1E6EB]">
                Overview
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#81D607]/10 border border-[#81D607]/30 text-[#81D607] font-mono text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#81D607] animate-pulse"></span>
                Operational
              </span>
            </div>
            <p className="text-xs text-[#9DA4B0] font-sans">
              Welcome back, <span className="text-[#E1E6EB] font-mono font-semibold">{fullName}</span>. Here is your executive summary & activity stream.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <AdminLink
              href="/admin/blogs"
              className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#E1E6EB]/15 hover:border-[#81D607]/50 text-[#E1E6EB] font-mono font-semibold text-xs transition-colors rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#81D607]" />
              <span>New Blog</span>
            </AdminLink>

            <AdminLink
              href="/admin/portfolio"
              className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#E1E6EB]/15 hover:border-[#81D607]/50 text-[#E1E6EB] font-mono font-semibold text-xs transition-colors rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#81D607]" />
              <span>New Project</span>
            </AdminLink>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 bg-[#81D607] hover:bg-[#92ed08] text-[#111111] font-mono font-bold text-xs transition-colors rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>
          </div>
        </div>

        {/* 2. Executive Stat Cards (4 Clean Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Contact Inbox */}
          <AdminLink
            href="/admin/contact-messages"
            className="group p-5 bg-[#161616] hover:bg-[#1C1C1C] border border-[#E1E6EB]/10 hover:border-[#81D607]/40 transition-all rounded-2xl space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-[#9DA4B0] tracking-wider">
                Contact Inbox
              </span>
              <div className="p-2 bg-[#111111] border border-[#E1E6EB]/10 text-[#81D607] group-hover:border-[#81D607]/40 transition-colors rounded-xl">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-extrabold text-[#E1E6EB]">
                  {unreadContactMsgs.length}
                </span>
                <span className="text-xs font-mono text-[#9DA4B0]">Unread</span>
              </div>
              <p className="text-[11px] text-[#9DA4B0] mt-1">
                {unreadContactMsgs.length > 0 ? (
                  <span className="text-[#81D607] font-semibold">● Action required</span>
                ) : (
                  <span>{totalContactMsgs} total received</span>
                )}
              </p>
            </div>
          </AdminLink>

          {/* Card 2: Applications */}
          <AdminLink
            href="/admin/talent-acquisition"
            className="group p-5 bg-[#161616] hover:bg-[#1C1C1C] border border-[#E1E6EB]/10 hover:border-[#81D607]/40 transition-all rounded-2xl space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-[#9DA4B0] tracking-wider">
                Job Candidates
              </span>
              <div className="p-2 bg-[#111111] border border-[#E1E6EB]/10 text-[#81D607] group-hover:border-[#81D607]/40 transition-colors rounded-xl">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-extrabold text-[#E1E6EB]">
                  {pendingJobApps.length}
                </span>
                <span className="text-xs font-mono text-[#9DA4B0]">Pending</span>
              </div>
              <p className="text-[11px] text-[#9DA4B0] mt-1">
                {pendingJobApps.length > 0 ? (
                  <span className="text-[#81D607] font-semibold">● Submissions to review</span>
                ) : (
                  <span>{totalJobApps} total applications</span>
                )}
              </p>
            </div>
          </AdminLink>

          {/* Card 3: Articles & Showcase */}
          <AdminLink
            href="/admin/blogs"
            className="group p-5 bg-[#161616] hover:bg-[#1C1C1C] border border-[#E1E6EB]/10 hover:border-[#81D607]/40 transition-all rounded-2xl space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-[#9DA4B0] tracking-wider">
                Blog & Portfolio
              </span>
              <div className="p-2 bg-[#111111] border border-[#E1E6EB]/10 text-[#81D607] group-hover:border-[#81D607]/40 transition-colors rounded-xl">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-extrabold text-[#E1E6EB]">
                  {totalBlogs}
                </span>
                <span className="text-xs font-mono text-[#9DA4B0]">Blogs Live</span>
              </div>
              <p className="text-[11px] text-[#9DA4B0] mt-1">
                {totalPortfolioProjects} portfolio case studies
              </p>
            </div>
          </AdminLink>

          {/* Card 4: Team & Reviews */}
          <AdminLink
            href="/admin/teams"
            className="group p-5 bg-[#161616] hover:bg-[#1C1C1C] border border-[#E1E6EB]/10 hover:border-[#81D607]/40 transition-all rounded-2xl space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-[#9DA4B0] tracking-wider">
                Team & Reviews
              </span>
              <div className="p-2 bg-[#111111] border border-[#E1E6EB]/10 text-[#81D607] group-hover:border-[#81D607]/40 transition-colors rounded-xl">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-extrabold text-[#E1E6EB]">
                  {totalTeam}
                </span>
                <span className="text-xs font-mono text-[#9DA4B0]">Team Members</span>
              </div>
              <p className="text-[11px] text-[#9DA4B0] mt-1">
                {totalTestimonials} client testimonials
              </p>
            </div>
          </AdminLink>

        </div>

        {/* 3. Main Split Section: Action Stream (Left) + Quick Management Hub (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column (7 cols): Priority Action Stream */}
          <div className="lg:col-span-7 space-y-6">

            {/* Unread Contact Messages Box */}
            <div className="bg-[#161616] border border-[#E1E6EB]/10 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E1E6EB]/10 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#81D607]" />
                  <h3 className="text-sm font-mono font-bold text-[#E1E6EB]">
                    Recent Contact Inquiries
                  </h3>
                  {unreadContactMsgs.length > 0 && (
                    <span className="px-2 py-0.5 bg-[#81D607] text-[#111111] text-[10px] font-mono font-bold rounded-full">
                      {unreadContactMsgs.length} Unread
                    </span>
                  )}
                </div>
                <AdminLink
                  href="/admin/contact-messages"
                  className="text-xs font-mono text-[#81D607] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3" />
                </AdminLink>
              </div>

              {recentUnreadMsgs.length > 0 ? (
                <div className="space-y-2.5">
                  {recentUnreadMsgs.map((msg: any) => (
                    <div
                      key={msg.id}
                      className="p-3 bg-[#111111] border border-[#E1E6EB]/10 hover:border-[#81D607]/30 transition-colors flex items-center justify-between gap-3 rounded-xl"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#E1E6EB] truncate">
                            {msg.name || "Anonymous Sender"}
                          </span>
                          <span className="text-[10px] font-mono text-[#9DA4B0] truncate">
                            ({msg.email})
                          </span>
                        </div>
                        <p className="text-xs text-[#9DA4B0] truncate">
                          {msg.service || msg.message || "Contact Message"}
                        </p>
                      </div>
                      <AdminLink
                        href="/admin/contact-messages"
                        className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#81D607] hover:text-[#111111] text-[#E1E6EB] font-mono text-[11px] font-semibold border border-[#E1E6EB]/10 transition-colors shrink-0 rounded-lg cursor-pointer"
                      >
                        Read
                      </AdminLink>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-[#81D607]/60 mx-auto" />
                  <p className="text-xs font-mono text-[#E1E6EB]">All inbox messages read</p>
                  <p className="text-[11px] text-[#9DA4B0]">No pending inquiries requiring attention.</p>
                </div>
              )}
            </div>

            {/* Pending Job Applications Box */}
            <div className="bg-[#161616] border border-[#E1E6EB]/10 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E1E6EB]/10 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#81D607]" />
                  <h3 className="text-sm font-mono font-bold text-[#E1E6EB]">
                    Pending Candidate Applications
                  </h3>
                  {pendingJobApps.length > 0 && (
                    <span className="px-2 py-0.5 bg-[#81D607] text-[#111111] text-[10px] font-mono font-bold rounded-full">
                      {pendingJobApps.length} Pending
                    </span>
                  )}
                </div>
                <AdminLink
                  href="/admin/talent-acquisition"
                  className="text-xs font-mono text-[#81D607] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3" />
                </AdminLink>
              </div>

              {recentPendingApps.length > 0 ? (
                <div className="space-y-2.5">
                  {recentPendingApps.map((app: any) => (
                    <div
                      key={app.id}
                      className="p-3 bg-[#111111] border border-[#E1E6EB]/10 hover:border-[#81D607]/30 transition-colors flex items-center justify-between gap-3 rounded-xl"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#E1E6EB] truncate">
                            {app.full_name}
                          </span>
                          <span className="px-1.5 py-0.5 bg-[#81D607]/10 text-[#81D607] font-mono text-[9px] font-bold uppercase rounded-md">
                            Pending
                          </span>
                        </div>
                        <p className="text-xs text-[#9DA4B0] truncate">
                          Applied for: <span className="text-[#E1E6EB]">{app.job_title || "General Application"}</span>
                        </p>
                      </div>
                      <AdminLink
                        href="/admin/talent-acquisition"
                        className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#81D607] hover:text-[#111111] text-[#E1E6EB] font-mono text-[11px] font-semibold border border-[#E1E6EB]/10 transition-colors shrink-0 rounded-lg cursor-pointer"
                      >
                        Review
                      </AdminLink>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-[#81D607]/60 mx-auto" />
                  <p className="text-xs font-mono text-[#E1E6EB]">No pending candidate reviews</p>
                  <p className="text-[11px] text-[#9DA4B0]">All submitted applications have been processed.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (5 cols): Quick Hub & Session Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Management Navigation Grid */}
            <div className="bg-[#161616] border border-[#E1E6EB]/10 p-5 rounded-2xl space-y-4">
              <div className="border-b border-[#E1E6EB]/10 pb-3">
                <h3 className="text-sm font-mono font-bold text-[#E1E6EB]">
                  Quick Management Access
                </h3>
                <p className="text-[11px] text-[#9DA4B0]">
                  Jump directly to administrative modules
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <AdminLink
                  href="/admin/portfolio"
                  className="p-3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607]/50 transition-all text-left group rounded-xl"
                >
                  <FolderGit2 className="w-4 h-4 text-[#81D607] mb-1.5" />
                  <div className="text-xs font-mono font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors">
                    Portfolio
                  </div>
                  <div className="text-[10px] text-[#9DA4B0]">{totalPortfolioProjects} Items</div>
                </AdminLink>

                <AdminLink
                  href="/admin/packages"
                  className="p-3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607]/50 transition-all text-left group rounded-xl"
                >
                  <Package className="w-4 h-4 text-[#81D607] mb-1.5" />
                  <div className="text-xs font-mono font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors">
                    Packages
                  </div>
                  <div className="text-[10px] text-[#9DA4B0]">{totalPackages} Plans</div>
                </AdminLink>

                <AdminLink
                  href="/admin/teams"
                  className="p-3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607]/50 transition-all text-left group rounded-xl"
                >
                  <Users className="w-4 h-4 text-[#81D607] mb-1.5" />
                  <div className="text-xs font-mono font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors">
                    Team Members
                  </div>
                  <div className="text-[10px] text-[#9DA4B0]">{totalTeam} Members</div>
                </AdminLink>

                <AdminLink
                  href="/admin/testimonials"
                  className="p-3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607]/50 transition-all text-left group rounded-xl"
                >
                  <MessageSquareQuote className="w-4 h-4 text-[#81D607] mb-1.5" />
                  <div className="text-xs font-mono font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors">
                    Client Reviews
                  </div>
                  <div className="text-[10px] text-[#9DA4B0]">{totalTestimonials} Reviews</div>
                </AdminLink>

                <AdminLink
                  href="/admin/talent-acquisition"
                  className="p-3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607]/50 transition-all text-left group rounded-xl"
                >
                  <Briefcase className="w-4 h-4 text-[#81D607] mb-1.5" />
                  <div className="text-xs font-mono font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors">
                    Talent & Jobs
                  </div>
                  <div className="text-[10px] text-[#9DA4B0]">{totalJobApps} Applicants</div>
                </AdminLink>

                <AdminLink
                  href="/admin/blogs"
                  className="p-3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607]/50 transition-all text-left group rounded-xl"
                >
                  <BookOpen className="w-4 h-4 text-[#81D607] mb-1.5" />
                  <div className="text-xs font-mono font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors">
                    Blogs Editor
                  </div>
                  <div className="text-[10px] text-[#9DA4B0]">{totalBlogs} Articles</div>
                </AdminLink>
              </div>

              <AdminLink
                href="/admin/adminmanagement"
                className="w-full p-2.5 bg-[#111111] hover:bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607]/40 font-mono text-xs text-[#E1E6EB] flex items-center justify-between transition-colors rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#81D607]" />
                  <span>Admin Users & Access Control</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#9DA4B0]" />
              </AdminLink>
            </div>

            {/* Session & System Profile Info Card (Minimal Footer Card) */}
            <div className="bg-[#161616] border border-[#E1E6EB]/10 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-9 h-9 border border-[#81D607] object-cover shrink-0 rounded-full"
                  />
                ) : (
                  <div className="w-9 h-9 bg-[#111111] border border-[#81D607] flex items-center justify-center text-[#81D607] shrink-0 rounded-full">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#E1E6EB] truncate">
                      {fullName}
                    </span>
                    <span className="px-1.5 py-0.5 bg-[#81D607] text-[#111111] font-mono font-bold text-[9px] uppercase rounded-full">
                      {isSuperAdmin ? "Main Admin" : "Sub-Admin"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#9DA4B0] truncate block">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AdminLayoutClient>
  );
}
