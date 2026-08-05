"use client";

import { ArrowUpRight, BookOpen, Clock } from "lucide-react";

export default function BlogPreview() {
  const posts = [
    {
      title: "5 Signs Your Business Needs AI Automation in 2026",
      category: "AI & ML",
      excerpt: "Discover how custom computer vision models and neural workflows reduce operational QA costs and streamline legacy pipelines.",
      readTime: "4 min read",
      date: "Aug 2026",
    },
    {
      title: "KiCad vs Altium: Choosing the Right PCB Tool for Startups",
      category: "Hardware",
      excerpt: "A practical guide on schematic capture, multi-layer routing, BOM sourcing, and cost-efficient hardware prototyping.",
      readTime: "6 min read",
      date: "Jul 2026",
    },
    {
      title: "Architecting High-Scale Next.js 16 Web Applications",
      category: "Web Dev",
      excerpt: "Best practices for server components, fast page load speeds, Turbopack builds, and SEO optimization for modern SaaS apps.",
      readTime: "5 min read",
      date: "Jun 2026",
    },
  ];

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
        {posts.map((post, idx) => (
          <article
            key={idx}
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

              <h3 className="text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                {post.title}
              </h3>

              <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E1E6EB]/10 flex items-center justify-between text-xs font-bold text-[#81D607]">
              <span>Read Full Article</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
