"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  MessageSquareQuote,
  Quote,
  ShieldCheck,
} from "lucide-react";
import { Testimonial } from "@/components/Testimonials";

interface AdminTestimonialsManagementProps {
  initialTestimonials: Testimonial[];
}

export default function AdminTestimonialsManagement({
  initialTestimonials,
}: AdminTestimonialsManagementProps) {
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(initialTestimonials);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [platform, setPlatform] = useState("Verified Upwork Review");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [status, setStatus] = useState<"active" | "hidden">("active");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setQuote("");
    setAuthor("");
    setRole("");
    setRating(5);
    setPlatform("Verified Upwork Review");
    setAvatarUrl("");
    setDisplayOrder(
      testimonialsList.length > 0
        ? Math.max(...testimonialsList.map((t) => t.display_order || 0)) + 1
        : 1
    );
    setStatus("active");
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setQuote(t.quote || "");
    setAuthor(t.author || "");
    setRole(t.role || "");
    setRating(t.rating || 5);
    setPlatform(t.platform || "Verified Upwork Review");
    setAvatarUrl(t.avatar_url || t.avatarUrl || "");
    setDisplayOrder(t.display_order || 0);
    setStatus((t.status as "active" | "hidden") || "active");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quote.trim()) {
      showNotification("error", "Client review quote is required.");
      return;
    }
    if (!author.trim()) {
      showNotification("error", "Author name is required.");
      return;
    }

    setSubmitting(true);

    const payload = {
      quote: quote.trim(),
      author: author.trim(),
      role: role.trim(),
      rating: Number(rating),
      platform: platform.trim() || "Verified Review",
      avatar_url: avatarUrl.trim(),
      display_order: Number(displayOrder),
      status,
    };

    try {
      const url = editingTestimonial
        ? `/api/admin/testimonials/${editingTestimonial.id}`
        : `/api/admin/testimonials`;
      const method = editingTestimonial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save review");
      }

      if (editingTestimonial) {
        setTestimonialsList((prev) =>
          prev.map((item) => (item.id === editingTestimonial.id ? result.testimonial : item))
        );
        showNotification("success", `Client review from "${author}" updated successfully.`);
      } else {
        setTestimonialsList((prev) => [result.testimonial, ...prev]);
        showNotification("success", `New review from "${author}" added successfully.`);
      }

      closeModal();
    } catch (err: any) {
      console.error("Save testimonial error:", err);
      showNotification("error", err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to delete review");
      }

      setTestimonialsList((prev) => prev.filter((item) => item.id !== id));
      showNotification("success", "Client review removed successfully.");
      setDeleteConfirmId(null);
    } catch (err: any) {
      console.error("Delete testimonial error:", err);
      showNotification("error", err.message || "Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtering
  const filteredTestimonials = testimonialsList.filter((item) => {
    const matchesSearch =
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.role || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.platform || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && (item.status === "active" || !item.status)) ||
      (statusFilter === "hidden" && item.status === "hidden");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 p-8 overflow-y-auto text-left space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 border font-mono text-xs flex items-center justify-between transition-all rounded-none ${
            notification.type === "success"
              ? "bg-[#81D607]/10 border-[#81D607] text-[#81D607]"
              : "bg-red-950/80 border-red-500 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#1A1A1A] border border-[#81D607]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#81D607] text-[#111111] text-[10px] font-mono font-extrabold uppercase">
              Admin Module
            </span>
            <h1 className="text-xl font-mono font-extrabold text-[#E1E6EB]">
              What Our Clients Say (Reviews)
            </h1>
          </div>
          <p className="text-xs text-[#9DA4B0]">
            Manage, publish, edit, or remove client reviews, star ratings, and verified credentials displayed on the homepage.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs transition-colors rounded-none shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Client Review</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1A1A1A] p-4 border border-[#E1E6EB]/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]" />
          <input
            type="text"
            placeholder="Search by client name, quote, platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] pl-9 pr-4 py-2 font-mono text-xs placeholder:text-[#9DA4B0]/60 focus:outline-none focus:border-[#81D607] rounded-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-[#9DA4B0]">Filter:</span>
          {(["all", "active", "hidden"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors rounded-none border ${
                statusFilter === st
                  ? "bg-[#81D607] text-[#111111] border-[#81D607] font-bold"
                  : "bg-[#111111] text-[#9DA4B0] border-[#E1E6EB]/15 hover:border-[#81D607] hover:text-[#E1E6EB]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      {filteredTestimonials.length === 0 ? (
        <div className="p-16 text-center bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-4 rounded-none">
          <MessageSquareQuote className="w-10 h-10 text-[#81D607]/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-mono font-bold text-[#E1E6EB]">
              no client review was found
            </h3>
            <p className="text-xs text-[#9DA4B0]">
              {searchQuery || statusFilter !== "all"
                ? "No client reviews match your current search or status filter."
                : "No client reviews exist in the database. Click 'Add Client Review' to create one."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => {
            const isHidden = item.status === "hidden";
            const ratingCount = Math.min(5, Math.max(1, item.rating || 5));
            const avatar = item.avatar_url || item.avatarUrl;

            return (
              <div
                key={item.id}
                className={`p-6 bg-[#1A1A1A] border ${
                  isHidden ? "border-[#E1E6EB]/10 opacity-60" : "border-[#E1E6EB]/10 hover:border-[#81D607]"
                } transition-all flex flex-col justify-between space-y-6 rounded-none relative group`}
              >
                {/* Header info bar */}
                <div className="flex items-center justify-between border-b border-[#E1E6EB]/10 pb-3">
                  <div className="flex items-center gap-1.5 text-[#81D607]">
                    {[...Array(ratingCount)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                        isHidden
                          ? "bg-amber-950/60 border-amber-500/40 text-amber-400"
                          : "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                      }`}
                    >
                      {isHidden ? "Hidden" : "Active"}
                    </span>
                    <span className="text-[10px] font-mono text-[#9DA4B0]">
                      #{item.display_order ?? 0}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[#81D607] text-[10px] font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{item.platform || "Verified Review"}</span>
                  </div>

                  <Quote className="w-6 h-6 text-[#81D607]/30" />

                  <p className="text-xs text-[#E1E6EB] italic leading-relaxed line-clamp-4">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-[#E1E6EB]/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={item.author}
                        className="w-7 h-7 border border-[#81D607] object-cover shrink-0 rounded-none"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#E1E6EB] truncate">{item.author}</h4>
                      {item.role && (
                        <p className="text-[10px] text-[#9DA4B0] truncate">{item.role}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors rounded-none"
                      title="Edit Review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-2 bg-[#111111] border border-red-500/40 text-red-400 hover:bg-red-950/50 hover:border-red-500 transition-colors rounded-none"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1A1A1A] border border-[#81D607]/40 w-full max-w-2xl my-8 p-6 space-y-6 text-left rounded-none shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E1E6EB]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#111111] border border-[#81D607] flex items-center justify-center text-[#81D607]">
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-mono font-bold text-[#E1E6EB]">
                  {editingTestimonial ? "Edit Client Review" : "Add New Client Review"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="text-[#9DA4B0] hover:text-[#E1E6EB] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Author Name */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Author Name <span className="text-[#81D607]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  />
                </div>

                {/* Role / Title */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Role / Position / Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hardware Product Manager, US Tech Firm"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rating */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Star Rating (1 to 5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                {/* Platform Badge */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Verified Platform Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verified Upwork Review, Verified Enterprise Client"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  />
                </div>
              </div>

              {/* Review Quote */}
              <div className="space-y-1.5">
                <label className="text-[#9DA4B0] uppercase block">
                  Client Review Quote <span className="text-[#81D607]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter detailed client review quote..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E1E6EB]/10 pt-4">
                {/* Avatar URL */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Avatar / Photo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  />
                </div>

                {/* Display Order */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Visibility Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "active" | "hidden")}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="hidden">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#E1E6EB]/10 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#9DA4B0] hover:text-[#E1E6EB] rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-bold rounded-none flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingTestimonial ? "Save Changes" : "Create Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-red-500/60 w-full max-w-md p-6 space-y-4 text-center rounded-none shadow-2xl">
            <div className="w-12 h-12 bg-red-950/50 border border-red-500 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-mono font-bold text-[#E1E6EB]">
                Confirm Delete Review?
              </h3>
              <p className="text-xs text-[#9DA4B0] font-sans">
                Are you sure you want to permanently delete this client review? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] font-mono text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deletingId === deleteConfirmId}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs flex items-center gap-2"
              >
                {deletingId === deleteConfirmId && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Delete Review</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
