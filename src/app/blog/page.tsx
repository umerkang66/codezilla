import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, User, ArrowUpRight, Search, BookOpen } from "lucide-react";
import { staticBlogs } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Blog & Engineering Insights | Codzilla Technologies",
  description:
    "Engineering insights, hardware prototyping guides, and AI architecture breakdowns written by Codzilla engineers.",
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen py-16 bg-[#111111] text-[#E1E6EB]">
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

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staticBlogs.map((post) => (
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
                    {post.readTime}
                  </span>
                </div>

                <Link href={`/blog/${post.id}`} className="block group">
                  <h2 className="text-xl font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans">
                  {post.excerpt}
                </p>
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
      </div>
    </main>
  );
}
