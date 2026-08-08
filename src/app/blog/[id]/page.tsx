import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User, Calendar, MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface BlogDetailProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0; // Dynamic route

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const adminDb = createAdminClient();
  const db = adminDb || supabase;

  const { data: post } = await db
    .from("blogs")
    .select("title, excerpt")
    .eq("id", id)
    .maybeSingle();

  if (!post) {
    return {
      title: "Article Not Found | Codzilla Technologies",
    };
  }

  return {
    title: `${post.title} | Codzilla Engineering Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { id } = await params;
  const supabase = await createClient();
  const adminDb = createAdminClient();
  const db = adminDb || supabase;

  const { data: post, error } = await db
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "August 2026";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <article className="max-w-4xl mx-auto space-y-10 text-left">
        {/* Navigation */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#81D607] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-6 border-b border-[#E1E6EB]/10 pb-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 bg-[#1A1A1A] text-[#81D607] border border-[#81D607]/40 uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs font-mono text-[#9DA4B0] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#81D607]" />
              {post.read_time || "5 min read"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB] tracking-tight leading-tight font-mono">
            {post.title}
          </h1>

          {/* Author Metadata Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#E1E6EB]/10 text-xs text-[#9DA4B0]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#81D607]" />
              <div>
                <span className="font-mono font-bold text-[#E1E6EB]">{post.author}</span>
                <span className="block text-[10px] text-[#9DA4B0]">{post.author_role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <Calendar className="w-4 h-4 text-[#81D607]" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </header>

        {/* Article Markdown Content - Beautifully Rendered */}
        <div className="py-2 border-b border-[#E1E6EB]/10 pb-12">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Article Bottom Call To Action */}
        <div className="p-8 bg-[#1A1A1A] border border-[#81D607]/40 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-none">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#E1E6EB] font-mono">Need Custom Engineering Solutions?</h3>
            <p className="text-xs text-[#9DA4B0] font-sans">
              Codzilla Technologies builds bespoke software, AI models, and KiCad PCB hardware for innovative businesses.
            </p>
          </div>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#81D607] text-[#111111] font-mono font-bold text-xs shrink-0 hover:bg-[#72BE06] transition-colors rounded-none"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consult Our Engineers</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
