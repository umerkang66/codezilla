"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Clock, User, ArrowUpRight } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  category?: string;
  author: string;
  author_role?: string;
  read_time?: string;
  excerpt?: string;
  created_at?: string;
}

interface BlogClientProps {
  initialBlogs: BlogPost[];
}

export default function BlogClient({ initialBlogs }: BlogClientProps) {
  const [blogs] = useState<BlogPost[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))),
  ];

  const filteredBlogs = blogs.filter((post) => {
    const matchesQuery =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#1A1A1A] border border-[#E1E6EB]/10 rounded-2xl">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9DA4B0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by article title, author, or technical domain..."
            className="w-full bg-[#111111] border border-[#E1E6EB]/15 pl-10 pr-4 py-2 text-xs font-mono text-[#E1E6EB] placeholder-[#9DA4B0]/60 focus:outline-none focus:border-[#81D607] rounded-xl"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat as string}
              type="button"
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-3 py-2 text-xs font-mono font-bold transition-colors cursor-pointer rounded-xl ${
                selectedCategory === cat
                  ? "bg-[#81D607] text-[#111111]"
                  : "bg-[#111111] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607]"
              }`}
            >
              {cat === "All" ? `All Articles (${blogs.length})` : (cat as string)}
            </button>
          ))}
        </div>
      </div>

      {/* Empty Search / No Data Results */}
      {filteredBlogs.length === 0 && (
        <div className="p-12 bg-[#1A1A1A] border border-[#E1E6EB]/10 text-center space-y-4 rounded-2xl">
          <div className="w-12 h-12 bg-[#111111] border border-[#81D607]/40 flex items-center justify-center text-[#81D607] mx-auto rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-mono text-[#E1E6EB]">
            {blogs.length === 0 ? "No Articles Published Yet" : "No Matching Articles Found"}
          </h3>
          <p className="text-xs text-[#9DA4B0] max-w-md mx-auto leading-relaxed">
            {blogs.length === 0
              ? "Our engineering team has not published blog articles yet. Check back soon!"
              : "Try adjusting your search criteria or category filter options to view available articles."}
          </p>
          {blogs.length > 0 && (searchQuery || selectedCategory !== "All") && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-4 py-2 bg-[#81D607] text-[#111111] font-mono text-xs font-bold hover:bg-[#72BE06] transition-colors rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid of Blog Cards */}
      {filteredBlogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((post) => (
            <div
              key={post.id}
              className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all flex flex-col justify-between group relative rounded-2xl overflow-hidden"
            >
              {post.category && (
                <div className="absolute top-0 right-0 bg-[#81D607] text-[#111111] text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-bl-xl">
                  {post.category}
                </div>
              )}

              <div className="space-y-5">
                {/* Icon Box + Header Title */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] shrink-0 group-hover:border-[#81D607] transition-colors rounded-xl">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 min-w-0 pr-12">
                    <Link href={`/blog/${post.id}`} className="block cursor-pointer">
                      <h3 className="text-base sm:text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-xs font-mono text-[#81D607] uppercase tracking-wide truncate">
                      {post.category || "Engineering"}
                    </p>
                  </div>
                </div>

                {/* Author & Read Time Info Box */}
                <div className="pt-2 border-t border-[#E1E6EB]/10">
                  <div className="text-[10px] font-mono uppercase text-[#9DA4B0] mb-1">
                    Author & Reading Time
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-[#111111] border border-[#E1E6EB]/10 text-xs font-mono text-[#E1E6EB] rounded-xl">
                    <span className="truncate flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#81D607]" />
                      {post.author}
                    </span>
                    <span className="text-[#9DA4B0] text-[11px] flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-[#81D607]" />
                      {post.read_time || "5 min read"}
                    </span>
                  </div>
                </div>

                {/* Excerpt / Summary */}
                {post.excerpt && (
                  <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
              </div>

              {/* Read Full Article Button Footer */}
              <div className="pt-4 mt-6 border-t border-[#E1E6EB]/10">
                <Link
                  href={`/blog/${post.id}`}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#E1E6EB]/15 text-xs font-mono font-bold text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors inline-flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#81D607]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
