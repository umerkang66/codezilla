"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { staticBlogs } from "@/data/blogs";

export default function BlogPreview() {
  return (
    <section id="blog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
          Technical Insights & Articles
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB] tracking-tight">
          Latest Engineering Articles
        </h2>
        <p className="text-base text-[#9DA4B0]">
          Engineering insights, hardware prototyping guides, and AI architecture breakdowns written by Codzilla engineers.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {staticBlogs.map((post) => (
          <article
            key={post.id}
            className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all duration-200 flex flex-col justify-between group rounded-none"
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

              <Link href={`/blog/${post.id}`}>
                <h3 className="text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                  {post.title}
                </h3>
              </Link>

              <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E1E6EB]/10 flex items-center justify-between">
              <Link
                href={`/blog/${post.id}`}
                className="text-xs font-mono font-bold text-[#81D607] hover:underline inline-flex items-center gap-1"
              >
                <span>Read Full Article</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Link to Dedicated Blog Index */}
      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs transition-colors rounded-none"
        >
          <span>View All Engineering Articles</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
