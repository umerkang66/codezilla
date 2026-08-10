import { Metadata } from "next";
import TeamClient from "./TeamClient";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const metadata: Metadata = {
  title: "Our Team | Codzilla Technologies",
  description:
    "Meet the multidisciplinary software architects, machine learning researchers, and embedded hardware engineers at Codzilla Technologies.",
};

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  let initialTeams = [];

  try {
    const supabase = await createClient();
    const adminDb = createAdminClient();
    const db = adminDb || supabase;

    const { data } = await db
      .from("team_members")
      .select("*")
      .eq("status", "active")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (data) {
      initialTeams = data;
    }
  } catch (err) {
    console.error("Error fetching team members for page:", err);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* Header Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-block px-3.5 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] font-mono text-xs font-semibold uppercase tracking-wider rounded-full">
          Our Team
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#E1E6EB] tracking-tight">
          Meet the Minds Behind Codzilla
        </h1>
        <p className="text-xs sm:text-sm text-[#9DA4B0]">
          Our multidisciplinary team combines software architects, machine learning researchers, and embedded hardware developers.
        </p>
      </div>

      {/* Team Cards Grid */}
      <TeamClient initialTeams={initialTeams} />
    </main>
  );
}
