import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, User, ArrowUpRight, BookOpen } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const metadata: Metadata = {
  title: "Blog & Engineering Insights | Codzilla Technologies",
  description:
    "Engineering insights, hardware prototyping guides, and AI architecture breakdowns written by Codzilla engineers.",
};

export const revalidate = 0; // Dynamic route

export default async function BlogIndexPage() {
  const supabase = await createClient();
  const adminDb = createAdminClient();
  const db = adminDb || supabase;

  const { data: blogs } = await db
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  const blogPosts = blogs || [];

  return (
    <main className="min-h-screen py-16 pt-28 bg-[#111111] text-[#E1E6EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation & Header */}
        <div className="space-y-6 text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#81D607] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
              Technical Insights & Publications
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#E1E6EB] tracking-tight">
              Codzilla Engineering Blog
            </h1>
            <p className="text-base text-[#9DA4B0] font-sans leading-relaxed">
              Explore deep dives on artificial intelligence, Next.js web architecture, and KiCad hardware design written by our lead engineers.
            </p>
          </div>
        </div>

        {/* Blog Posts Grid or No Blogs Found State */}
        {blogPosts.length === 0 ? (
          <div className="py-24 bg-[#1A1A1A] border border-[#81D607]/30 text-center p-8 space-y-4">
            <BookOpen className="w-12 h-12 text-[#81D607]/40 mx-auto" />
            <p className="text-xl text-[#E1E6EB] font-mono">
              <strong className="font-bold text-[#E1E6EB] text-2xl">no blogs found</strong>
            </p>
            <p className="text-xs text-[#9DA4B0]">
              Check back soon for technical articles and engineering deep dives.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all duration-200 flex flex-col justify-between group text-left rounded-none"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#111111] text-[#81D607] border border-[#81D607]/30">
                      {post.category}
                    </span>
                    <span className="text-[11px] font-mono text-[#9DA4B0] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.read_time || "5 min read"}
                    </span>
                  </div>

                  <Link href={`/blog/${post.id}`} className="block group">
                    <h2 className="text-xl font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  {post.excerpt && (
                    <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-[#E1E6EB]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#9DA4B0]">
                    <User className="w-3.5 h-3.5 text-[#81D607]" />
                    <span className="font-mono text-[11px] text-[#E1E6EB]">{post.author}</span>
                  </div>

                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#81D607] hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
