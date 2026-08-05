"use client";

import { useState, useEffect, FormEvent } from "react";
import { X, Save, Loader2, Sparkles } from "lucide-react";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

export interface BlogItem {
  id?: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  author_role: string;
  read_time: string;
  created_at?: string;
  updated_at?: string;
}

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blogToEdit?: BlogItem | null;
  defaultAuthorName?: string;
}

export default function BlogModal({
  isOpen,
  onClose,
  onSuccess,
  blogToEdit,
  defaultAuthorName = "Codzilla Team",
}: BlogModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [authorRole, setAuthorRole] = useState("Engineering Team");
  const [readTime, setReadTime] = useState("5 min read");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isEditing = Boolean(blogToEdit && blogToEdit.id);

  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title || "");
      setCategory(blogToEdit.category || "Engineering");
      setExcerpt(blogToEdit.excerpt || "");
      setContent(blogToEdit.content || "");
      setAuthor(blogToEdit.author || defaultAuthorName);
      setAuthorRole(blogToEdit.author_role || "Engineering Team");
      setReadTime(blogToEdit.read_time || "5 min read");
    } else {
      setTitle("");
      setCategory("Engineering");
      setExcerpt("");
      setContent("");
      setAuthor(defaultAuthorName);
      setAuthorRole("Engineering Team");
      setReadTime("5 min read");
    }
    setErrorMsg("");
  }, [blogToEdit, isOpen, defaultAuthorName]);

  // Auto update estimated read time when content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const words = newContent.trim() ? newContent.trim().split(/\s+/).length : 0;
    const est = Math.max(1, Math.ceil(words / 200));
    setReadTime(`${est} min read`);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg("Title and Markdown Content are required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const payload = {
      title: title.trim(),
      category: category.trim() || "Engineering",
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author.trim() || defaultAuthorName,
      authorRole: authorRole.trim() || "Engineering Team",
      readTime: readTime.trim() || "5 min read",
    };

    try {
      const url = isEditing
        ? `/api/admin/blogs/${blogToEdit!.id}`
        : `/api/admin/blogs`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save blog post.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#1A1A1A] border border-[#81D607]/40 shadow-2xl rounded-none flex flex-col max-h-[90vh] my-auto text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E1E6EB]/10 bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1A1A] border border-[#81D607] flex items-center justify-center text-[#81D607]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-bold text-[#E1E6EB]">
                {isEditing ? "Edit Blog Article" : "Create New Blog Article"}
              </h2>
              <p className="text-xs text-[#9DA4B0]">
                Write and edit articles with live Markdown preview
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#1A1A1A] border border-transparent hover:border-[#81D607]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-[#9DA4B0]">
              Blog Title <span className="text-[#81D607]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5 Signs Your Business Needs AI Automation in 2026"
              className="w-full px-4 py-2.5 bg-[#111111] border border-[#E1E6EB]/20 text-[#E1E6EB] font-mono text-sm focus:outline-none focus:border-[#81D607] transition-colors"
            />
          </div>

          {/* Grid Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-[#9DA4B0]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#111111] border border-[#E1E6EB]/20 text-[#E1E6EB] font-mono text-xs focus:outline-none focus:border-[#81D607]"
              >
                <option value="AI & ML">AI & ML</option>
                <option value="Hardware">Hardware</option>
                <option value="Web Dev">Web Dev</option>
                <option value="Software">Software</option>
                <option value="Embedded">Embedded</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-[#9DA4B0]">
                Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 5 min read"
                className="w-full px-4 py-2.5 bg-[#111111] border border-[#E1E6EB]/20 text-[#E1E6EB] font-mono text-xs focus:outline-none focus:border-[#81D607]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-[#9DA4B0]">
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Muhammad Ahmed Pasha"
                className="w-full px-4 py-2.5 bg-[#111111] border border-[#E1E6EB]/20 text-[#E1E6EB] font-mono text-xs focus:outline-none focus:border-[#81D607]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-[#9DA4B0]">
                Author Role
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. Founder & CEO"
                className="w-full px-4 py-2.5 bg-[#111111] border border-[#E1E6EB]/20 text-[#E1E6EB] font-mono text-xs focus:outline-none focus:border-[#81D607]"
              />
            </div>
          </div>

          {/* Excerpt Input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-[#9DA4B0]">
              Short Excerpt / Summary
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence overview of the article..."
              className="w-full px-4 py-2 bg-[#111111] border border-[#E1E6EB]/20 text-[#E1E6EB] font-sans text-xs focus:outline-none focus:border-[#81D607]"
            />
          </div>

          {/* Markdown Content Editor */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-[#9DA4B0]">
              Article Content (Markdown) <span className="text-[#81D607]">*</span>
            </label>
            <MarkdownEditor value={content} onChange={handleContentChange} minHeight="300px" />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#E1E6EB]/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#111111] border border-[#E1E6EB]/20 text-[#9DA4B0] hover:text-[#E1E6EB] hover:border-[#E1E6EB]/40 font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? "Update Article" : "Create Article"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
