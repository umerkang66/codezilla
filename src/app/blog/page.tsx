import { Metadata } from "next";
import BlogClient from "./BlogClient";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const metadata: Metadata = {
  title: "Blog & Technical Publications | Codzilla Technologies",
  description:
    "Engineering insights, hardware prototyping guides, and AI architecture breakdowns written by Codzilla engineers.",
};

export const revalidate = 0; // Dynamic route

export default async function BlogIndexPage() {
  let initialBlogs: any[] = [];

  try {
    const supabase = await createClient();
    const adminDb = createAdminClient();
    const db = adminDb || supabase;

    const { data: blogs } = await db
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (blogs) {
      initialBlogs = blogs;
    }
  } catch (err) {
    console.error("Error fetching blogs for page:", err);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* Header Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] font-mono text-xs font-semibold uppercase tracking-wider">
          Technical Publications
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#E1E6EB] tracking-tight">
          Codzilla Engineering Blog
        </h1>
        <p className="text-xs sm:text-sm text-[#9DA4B0]">
          Explore deep dives on artificial intelligence, Next.js web architecture, and KiCad hardware design written by our lead engineers.
        </p>
      </div>

      {/* Blog Cards Grid & Search / Filter Controls */}
      <BlogClient initialBlogs={initialBlogs} />
    </main>
  );
}
