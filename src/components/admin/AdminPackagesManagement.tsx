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
  Package as PackageIcon,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { EngineeringPackage } from "@/components/Pricing";

interface AdminPackagesManagementProps {
  initialPackages: EngineeringPackage[];
}

export default function AdminPackagesManagement({
  initialPackages,
}: AdminPackagesManagementProps) {
  const [packagesList, setPackagesList] = useState<EngineeringPackage[]>(initialPackages);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<EngineeringPackage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState("Starting price");
  const [featured, setFeatured] = useState(false);
  const [features, setFeatures] = useState<string[]>([""]);
  const [ctaText, setCtaText] = useState("Choose Package");
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
    setEditingPackage(null);
    setName("");
    setSubtitle("");
    setPrice("");
    setPeriod("Starting price");
    setFeatured(false);
    setFeatures([""]);
    setCtaText("Choose Package");
    setDisplayOrder(
      packagesList.length > 0
        ? Math.max(...packagesList.map((p) => p.display_order || 0)) + 1
        : 1
    );
    setStatus("active");
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: EngineeringPackage) => {
    setEditingPackage(pkg);
    setName(pkg.name || "");
    setSubtitle(pkg.subtitle || "");
    setPrice(pkg.price || "");
    setPeriod(pkg.period || "Starting price");
    setFeatured(pkg.featured || false);
    setFeatures(pkg.features && pkg.features.length > 0 ? pkg.features : [""]);
    setCtaText(pkg.cta_text || pkg.ctaText || "Choose Package");
    setDisplayOrder(pkg.display_order || 0);
    setStatus((pkg.status as "active" | "hidden") || "active");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  // Dynamic feature line management
  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeatureInput = () => {
    setFeatures([...features, ""]);
  };

  const removeFeatureInput = (index: number) => {
    if (features.length === 1) {
      setFeatures([""]);
    } else {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showNotification("error", "Package name is required.");
      return;
    }
    if (!price.trim()) {
      showNotification("error", "Package price is required.");
      return;
    }

    setSubmitting(true);

    // Clean empty features
    const cleanedFeatures = features.map((f) => f.trim()).filter(Boolean);

    const payload = {
      name: name.trim(),
      subtitle: subtitle.trim(),
      price: price.trim(),
      period: period.trim(),
      featured,
      features: cleanedFeatures,
      cta_text: ctaText.trim() || "Choose Package",
      display_order: Number(displayOrder),
      status,
    };

    try {
      const url = editingPackage
        ? `/api/admin/packages/${editingPackage.id}`
        : `/api/admin/packages`;
      const method = editingPackage ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save package");
      }

      if (editingPackage) {
        setPackagesList((prev) =>
          prev.map((p) => (p.id === editingPackage.id ? result.package : p))
        );
        showNotification("success", `Package "${name}" updated successfully.`);
      } else {
        setPackagesList((prev) => [...prev, result.package]);
        showNotification("success", `New package "${name}" created successfully.`);
      }

      closeModal();
    } catch (err: any) {
      console.error("Save package error:", err);
      showNotification("error", err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to delete package");
      }

      setPackagesList((prev) => prev.filter((p) => p.id !== id));
      showNotification("success", "Package removed successfully.");
      setDeleteConfirmId(null);
    } catch (err: any) {
      console.error("Delete package error:", err);
      showNotification("error", err.message || "Failed to delete package.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtering
  const filteredPackages = packagesList.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.subtitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.price.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && (pkg.status === "active" || !pkg.status)) ||
      (statusFilter === "hidden" && pkg.status === "hidden");

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

      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1E6EB]/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1A1A] border border-[#81D607] flex items-center justify-center text-[#81D607]">
              <PackageIcon className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-mono font-extrabold text-[#E1E6EB]">
              Packages Management
            </h1>
          </div>
          <p className="text-xs text-[#9DA4B0]">
            Control pricing tiers, feature lists, and highlighted solutions for Flexible Engineering Packages.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs transition-colors rounded-none flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1A1A1A] p-4 border border-[#E1E6EB]/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]" />
          <input
            type="text"
            placeholder="Search by package name or price..."
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

      {/* Packages Grid */}
      {filteredPackages.length === 0 ? (
        <div className="p-16 text-center bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-4 rounded-none">
          <PackageIcon className="w-10 h-10 text-[#81D607]/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-mono font-bold text-[#E1E6EB]">
              no package was found
            </h3>
            <p className="text-xs text-[#9DA4B0]">
              {searchQuery || statusFilter !== "all"
                ? "No engineering packages match your current filter query."
                : "No packages exist in the database. Click 'Add New Package' to create one."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const isHidden = pkg.status === "hidden";
            return (
              <div
                key={pkg.id}
                className={`p-6 bg-[#1A1A1A] border ${
                  pkg.featured
                    ? "border-[#81D607]"
                    : "border-[#E1E6EB]/10 hover:border-[#81D607]/60"
                } transition-all flex flex-col justify-between space-y-6 relative rounded-none ${
                  isHidden ? "opacity-60" : ""
                }`}
              >
                {/* Badges */}
                <div className="flex items-center justify-between border-b border-[#E1E6EB]/10 pb-4">
                  <div className="flex items-center gap-2">
                    {pkg.featured && (
                      <span className="px-2 py-0.5 bg-[#81D607] text-[#111111] text-[10px] font-mono font-extrabold uppercase flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Most Popular</span>
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                        isHidden
                          ? "bg-amber-950/60 border-amber-500/40 text-amber-400"
                          : "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                      }`}
                    >
                      {isHidden ? "Hidden" : "Active"}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#9DA4B0]">
                    Order: #{pkg.display_order ?? 0}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#E1E6EB]">{pkg.name}</h3>
                    {pkg.subtitle && (
                      <p className="text-xs text-[#9DA4B0] mt-1 leading-relaxed">
                        {pkg.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2 pt-2 border-t border-[#E1E6EB]/10">
                    <span className="text-3xl font-extrabold text-[#81D607] font-mono">
                      {pkg.price}
                    </span>
                    {pkg.period && (
                      <span className="text-xs text-[#9DA4B0] font-mono">
                        {pkg.period}
                      </span>
                    )}
                  </div>

                  {/* Feature list preview */}
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="space-y-2 pt-2 text-xs">
                      {pkg.features.map((ft, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-[#E1E6EB]">
                          <Check className="w-3.5 h-3.5 text-[#81D607] shrink-0 mt-0.5" />
                          <span>{ft}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-[#E1E6EB]/10 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono text-[#9DA4B0] truncate">
                    CTA: {pkg.cta_text || pkg.ctaText || "Choose Package"}
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditModal(pkg)}
                      className="p-2 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors rounded-none"
                      title="Edit Package"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(pkg.id)}
                      className="p-2 bg-[#111111] border border-red-500/40 text-red-400 hover:bg-red-950/50 hover:border-red-500 transition-colors rounded-none"
                      title="Delete Package"
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
                  <PackageIcon className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-mono font-bold text-[#E1E6EB]">
                  {editingPackage ? "Edit Engineering Package" : "Create New Engineering Package"}
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
                {/* Package Name */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Package Name <span className="text-[#81D607]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starter Package"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Price Tag <span className="text-[#81D607]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $499 or $1,499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Subtitle / Summary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. For early prototypes & landing web apps"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  />
                </div>

                {/* Period */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Billing Period / Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Starting price or Per project"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-none"
                  />
                </div>
              </div>

              {/* Dynamic Feature List */}
              <div className="space-y-2 border-t border-[#E1E6EB]/10 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-[#9DA4B0] uppercase block">
                    Features Included
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureInput}
                    className="px-2.5 py-1 bg-[#111111] border border-[#81D607] text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] transition-colors rounded-none flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#81D607] shrink-0" />
                      <input
                        type="text"
                        placeholder={`Feature #${fIdx + 1} item detail...`}
                        value={feat}
                        onChange={(e) => handleFeatureChange(fIdx, e.target.value)}
                        className="flex-1 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2 text-xs focus:outline-none focus:border-[#81D607] rounded-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeatureInput(fIdx)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50"
                        title="Remove feature line"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E1E6EB]/10 pt-4">
                {/* CTA Button Text */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    placeholder="Choose Package"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
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

              {/* Featured Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#81D607] bg-[#111111]"
                  />
                  <span className="text-[#E1E6EB]">
                    Highlight as <strong className="text-[#81D607]">Most Popular</strong> tier
                  </span>
                </label>
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
                  <span>{editingPackage ? "Save Changes" : "Create Package"}</span>
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
                Confirm Delete Package?
              </h3>
              <p className="text-xs text-[#9DA4B0] font-sans">
                Are you sure you want to permanently delete this package? This action cannot be undone.
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
                <span>Delete Package</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
