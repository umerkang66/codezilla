"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  User,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import BlogModal, { BlogItem } from "@/components/admin/BlogModal";
import Link from "next/link";

interface AdminBlogsManagementProps {
  initialBlogs?: BlogItem[];
  userFullName: string;
}

export default function AdminBlogsManagement({
  initialBlogs = [],
  userFullName,
}: AdminBlogsManagementProps) {
  const [blogs, setBlogs] = useState<BlogItem[]>(initialBlogs);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<BlogItem | null>(null);

  // Delete Dialog State
  const [blogToDelete, setBlogToDelete] = useState<BlogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (res.ok && data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs by search query
  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setBlogToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (blog: BlogItem) => {
    setBlogToEdit(blog);
    setIsModalOpen(true);
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete || !blogToDelete.id) return;
    setIsDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/admin/blogs/${blogToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete blog post.");
      }

      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
      setBlogToDelete(null);
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete blog.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto text-left space-y-8">
      <div className="space-y-6">
        {/* Title Header & Main Create Blog Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1E6EB]/10 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-mono font-extrabold text-[#E1E6EB] flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#81D607]" />
              <span>Blogs Management</span>
            </h2>
            <p className="text-xs text-[#9DA4B0]">
              Create, edit, manage, and publish engineering articles using Markdown editor
            </p>
          </div>

          {/* Primary Create Blog Button */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs shrink-0 transition-colors flex items-center gap-2 rounded-none"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Blog</span>
          </button>
        </div>

        {/* Search & Stats Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1A1A1A] p-4 border border-[#E1E6EB]/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs by title, category, author..."
              className="w-full pl-9 pr-4 py-2 bg-[#111111] border border-[#E1E6EB]/20 text-[#E1E6EB] font-mono text-xs focus:outline-none focus:border-[#81D607]"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#9DA4B0]">
            <span>
              Total Articles: <strong className="text-[#81D607]">{blogs.length}</strong>
            </span>
          </div>
        </div>

        {/* Main Blogs Table / Cards List */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#81D607] animate-spin" />
            <p className="text-xs font-mono text-[#9DA4B0]">Loading blog articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-16 bg-[#1A1A1A] border border-[#81D607]/30 text-center space-y-4 p-8">
            <BookOpen className="w-12 h-12 text-[#81D607]/40 mx-auto" />
            <p className="text-lg text-[#E1E6EB]">
              <strong className="font-bold text-[#E1E6EB]">no blogs found</strong>
            </p>
            <p className="text-xs text-[#9DA4B0]">
              {searchQuery ? "No articles matched your search query." : "Get started by creating your first blog article."}
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#81D607] text-[#111111] font-mono font-bold text-xs hover:bg-[#72BE06] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Blog</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#E1E6EB]/10 bg-[#1A1A1A]">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#111111] border-b border-[#E1E6EB]/10 font-mono text-[11px] text-[#81D607] uppercase">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Article Details</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Author</th>
                  <th className="py-3.5 px-4 font-bold">Read Time</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E6EB]/10">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[#111111]/60 transition-colors">
                    <td className="py-4 px-4 max-w-xs sm:max-w-md">
                      <div className="space-y-1">
                        <Link
                          href={`/blog/${blog.id}`}
                          target="_blank"
                          className="font-mono font-bold text-sm text-[#E1E6EB] hover:text-[#81D607] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>{blog.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#9DA4B0]" />
                        </Link>
                        {blog.excerpt && (
                          <p className="text-xs text-[#9DA4B0] line-clamp-1 font-sans">
                            {blog.excerpt}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <span className="px-2.5 py-0.5 bg-[#111111] text-[#81D607] border border-[#81D607]/30 text-[10px]">
                        {blog.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-[#E1E6EB]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#81D607]" />
                        <span>{blog.author}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-[#9DA4B0]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#81D607]" />
                        <span>{blog.read_time}</span>
                      </div>
                    </td>

                    {/* Action Buttons: Edit and Delete */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(blog)}
                          className="p-2 bg-[#111111] border border-[#81D607]/30 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono text-xs transition-colors flex items-center gap-1"
                          title="Edit Blog"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {/* Button to delete the blogs */}
                        <button
                          type="button"
                          onClick={() => setBlogToDelete(blog)}
                          className="p-2 bg-[#111111] border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white font-mono text-xs transition-colors flex items-center gap-1"
                          title="Delete Blog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Blog Create / Edit Modal */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBlogs}
        blogToEdit={blogToEdit}
        defaultAuthorName={userFullName}
      />

      {/* Delete Blog Confirmation Dialog */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1A1A] border border-red-500/60 p-6 space-y-6 text-left shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-10 h-10 bg-[#111111] border border-red-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-mono font-bold text-[#E1E6EB]">
                  Delete Blog Article?
                </h3>
                <p className="text-xs text-[#9DA4B0]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#9DA4B0] bg-[#111111] p-3 border border-red-500/20 font-mono">
              Are you sure you want to permanently delete <strong className="text-[#E1E6EB]">"{blogToDelete.title}"</strong>?
            </p>

            {deleteError && (
              <p className="text-xs text-red-400 font-mono">{deleteError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-[#111111] border border-[#E1E6EB]/20 text-[#9DA4B0] hover:text-[#E1E6EB] font-mono text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteBlog}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer System Info */}
      <div className="pt-4 border-t border-[#E1E6EB]/10 flex items-center justify-between text-xs font-mono text-[#9DA4B0]">
        <span>Codzilla Blogs Management Engine</span>
        <span className="text-[#81D607]">Markdown Support Active</span>
      </div>
    </div>
  );
}
