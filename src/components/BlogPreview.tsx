"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Loader2 } from "lucide-react";
import { BlogItem } from "@/components/admin/BlogModal";

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (res.ok && data.blogs) {
          setBlogs(data.blogs);
        }
      } catch (err) {
        console.error("Failed to load blogs for preview:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <section id="blog" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
        <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
          Technical Insights & Articles
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#E1E6EB] tracking-tight leading-tight">
          Latest Engineering Articles
        </h2>
        <p className="text-xs sm:text-sm text-[#9DA4B0]">
          Engineering insights, hardware prototyping guides, and AI architecture breakdowns written by Codzilla engineers.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#81D607] animate-spin" />
          <p className="text-xs font-mono text-[#9DA4B0]">Fetching latest articles...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-16 bg-[#1A1A1A] border border-[#81D607]/30 text-center p-8">
          <p className="text-[#9DA4B0] text-lg font-mono">
            <strong className="font-bold text-[#E1E6EB] text-xl">no blogs found</strong>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
          {blogs.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="p-5 sm:p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 card-hover-effect flex flex-col justify-between group rounded-none"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#111111] text-[#81D607] border border-[#81D607]/30">
                    {post.category}
                  </span>
                  <span className="text-[11px] font-mono text-[#9DA4B0] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.read_time || "5 min read"}
                  </span>
                </div>

                <Link href={`/blog/${post.id}`}>
                  <h3 className="text-base sm:text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                    {post.title}
                  </h3>
                </Link>

                {post.excerpt && (
                  <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-4 sm:pt-6 mt-5 sm:mt-6 border-t border-[#E1E6EB]/10 flex items-center justify-between">
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
      )}

      {/* Link to Dedicated Blog Index */}
      {blogs.length > 0 && (
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs transition-colors rounded-none"
          >
            <span>View All Engineering Articles</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
