"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  FolderGit2,
  Brain,
  Cpu,
  Globe,
  Smartphone,
  Layers,
  Code,
  Server,
  Database,
  Zap,
  ArrowUpRight,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  impact?: string;
  description?: string;
  tags?: string[];
  icon?: string;
  project_url?: string;
  display_order?: number;
  status?: "active" | "hidden";
  created_at?: string;
  updated_at?: string;
}

interface AdminPortfolioManagementProps {
  initialProjects: PortfolioProject[];
}

const AVAILABLE_ICONS = [
  { name: "Brain", icon: Brain, label: "AI / ML" },
  { name: "Cpu", icon: Cpu, label: "PCB / Hardware / DSP" },
  { name: "Globe", icon: Globe, label: "Web / SaaS" },
  { name: "Smartphone", icon: Smartphone, label: "Mobile" },
  { name: "Layers", icon: Layers, label: "Architecture / Systems" },
  { name: "Code", icon: Code, label: "Software" },
  { name: "Server", icon: Server, label: "Backend / Infra" },
  { name: "Database", icon: Database, label: "Data Pipeline" },
  { name: "Zap", icon: Zap, label: "Automation / Edge" },
];

export default function AdminPortfolioManagement({
  initialProjects,
}: AdminPortfolioManagementProps) {
  const [projectsList, setProjectsList] = useState<PortfolioProject[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("AI/ML");
  const [impact, setImpact] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Globe");
  const [projectUrl, setProjectUrl] = useState("");
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

  // Derive unique categories from existing projects
  const uniqueCategories = [
    "All",
    ...Array.from(new Set(projectsList.map((p) => p.category).filter(Boolean))),
  ];

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle("");
    setCategory("AI/ML");
    setImpact("");
    setDescription("");
    setTagsInput("");
    setSelectedIcon("Brain");
    setProjectUrl("");
    setDisplayOrder(
      projectsList.length > 0
        ? Math.max(...projectsList.map((p) => p.display_order || 0)) + 1
        : 1
    );
    setStatus("active");
    setIsModalOpen(true);
  };

  const openEditModal = (p: PortfolioProject) => {
    setEditingProject(p);
    setTitle(p.title || "");
    setCategory(p.category || "AI/ML");
    setImpact(p.impact || "");
    setDescription(p.description || "");
    setTagsInput(Array.isArray(p.tags) ? p.tags.join(", ") : "");
    setSelectedIcon(p.icon || "Globe");
    setProjectUrl(p.project_url || "");
    setDisplayOrder(p.display_order || 0);
    setStatus((p.status as "active" | "hidden") || "active");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showNotification("error", "Project title is required.");
      return;
    }

    setSubmitting(true);

    const processedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      category: category.trim() || "AI/ML",
      impact: impact.trim(),
      description: description.trim(),
      tags: processedTags,
      icon: selectedIcon,
      project_url: projectUrl.trim(),
      display_order: Number(displayOrder),
      status,
    };

    try {
      const url = editingProject
        ? `/api/admin/portfolio/${editingProject.id}`
        : `/api/admin/portfolio`;
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save project");
      }

      if (editingProject) {
        setProjectsList((prev) =>
          prev.map((item) => (item.id === editingProject.id ? result.project : item))
        );
        showNotification("success", `Project "${title}" updated successfully.`);
      } else {
        setProjectsList((prev) => [result.project, ...prev]);
        showNotification("success", `New project "${title}" created successfully.`);
      }

      closeModal();
    } catch (err: any) {
      console.error("Save portfolio project error:", err);
      showNotification("error", err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to delete project");
      }

      setProjectsList((prev) => prev.filter((item) => item.id !== id));
      showNotification("success", "Portfolio project deleted successfully.");
      setDeleteConfirmId(null);
    } catch (err: any) {
      console.error("Delete portfolio project error:", err);
      showNotification("error", err.message || "Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to render dynamic icon preview
  const getIconComponent = (iconName?: string) => {
    const found = AVAILABLE_ICONS.find((i) => i.name === iconName);
    return found ? found.icon : Globe;
  };

  // Filtering
  const filteredProjects = projectsList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.impact || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && (item.status === "active" || !item.status)) ||
      (statusFilter === "hidden" && item.status === "hidden");

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="flex-1 p-8 overflow-y-auto text-left space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 border font-mono text-xs flex items-center justify-between transition-all rounded-xl ${
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
          <button onClick={() => setNotification(null)} className="hover:opacity-75 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#1A1A1A] border border-[#81D607]/30 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#81D607] text-[#111111] text-[10px] font-mono font-extrabold uppercase rounded-full">
              Admin Module
            </span>
            <h1 className="text-xl font-mono font-extrabold text-[#E1E6EB]">
              Portfolio & Case Studies Management
            </h1>
          </div>
          <p className="text-xs text-[#9DA4B0]">
            Manage, publish, edit, reorder, or draft representative engineering projects and case studies shown on the website.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs transition-colors rounded-xl cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1A1A1A] p-4 border border-[#E1E6EB]/10 rounded-2xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]" />
          <input
            type="text"
            placeholder="Search by title, category, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] pl-9 pr-4 py-2 font-mono text-xs placeholder:text-[#9DA4B0]/60 focus:outline-none focus:border-[#81D607] rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-[#9DA4B0]">Category:</span>
            <CustomSelect
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={uniqueCategories.map((cat) => ({ label: cat, value: cat }))}
              size="sm"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-[#9DA4B0]">Status:</span>
            {(["all", "active", "hidden"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors rounded-xl border cursor-pointer ${
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
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-16 text-center bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-4 rounded-2xl">
          <FolderGit2 className="w-10 h-10 text-[#81D607]/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-mono font-bold text-[#E1E6EB]">
              No portfolio projects found
            </h3>
            <p className="text-xs text-[#9DA4B0]">
              {searchQuery || statusFilter !== "all" || categoryFilter !== "All"
                ? "No portfolio projects match your search query or filters."
                : "No portfolio projects exist in the database yet. Click 'Add New Project' to create one."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isHidden = project.status === "hidden";
            const IconComp = getIconComponent(project.icon);

            return (
              <div
                key={project.id}
                className={`p-6 bg-[#1A1A1A] border ${
                  isHidden
                    ? "border-[#E1E6EB]/10 opacity-60"
                    : "border-[#E1E6EB]/10 hover:border-[#81D607]"
                } transition-all flex flex-col justify-between space-y-5 rounded-2xl group relative`}
              >
                <div className="space-y-4 text-left">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#81D607] uppercase tracking-wider px-2 py-0.5 bg-[#111111] border border-[#81D607]/30 rounded-md">
                      {project.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border rounded-full ${
                          isHidden
                            ? "bg-amber-950/60 border-amber-500/40 text-amber-400"
                            : "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                        }`}
                      >
                        {isHidden ? "Hidden" : "Active"}
                      </span>
                      <span className="text-[10px] font-mono text-[#9DA4B0]">
                        #{project.display_order ?? 0}
                      </span>
                      <IconComp className="w-5 h-5 text-[#81D607]" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {/* Impact Callout */}
                  {project.impact && (
                    <div className="p-3 bg-[#111111] border-l-2 border-[#81D607] flex items-center gap-2 rounded-r-xl">
                      <CheckCircle className="w-3.5 h-3.5 text-[#81D607] shrink-0" />
                      <span className="text-xs font-semibold text-[#E1E6EB]">
                        {project.impact}
                      </span>
                    </div>
                  )}

                  {/* Tech Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 bg-[#111111] text-[#9DA4B0] border border-[#E1E6EB]/10 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.project_url && (
                    <div className="text-[11px] font-mono text-[#81D607] flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{project.project_url}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-[#E1E6EB]/10 flex items-center justify-between gap-3">
                  <div className="text-[10px] font-mono text-[#9DA4B0]">
                    ID: {project.id.slice(0, 8)}...
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors rounded-lg cursor-pointer"
                      title="Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-2 bg-[#111111] border border-red-500/40 text-red-400 hover:bg-red-950/50 hover:border-red-500 transition-colors rounded-lg cursor-pointer"
                      title="Delete Project"
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
          <div className="bg-[#1A1A1A] border border-[#81D607]/40 w-full max-w-2xl my-8 p-6 space-y-6 text-left rounded-2xl shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E1E6EB]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#111111] border border-[#81D607] flex items-center justify-center text-[#81D607] rounded-lg">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-mono font-bold text-[#E1E6EB]">
                  {editingProject ? "Edit Portfolio Project" : "Add Portfolio Project"}
                </h2>
              </div>
              <button onClick={closeModal} className="text-[#9DA4B0] hover:text-[#E1E6EB] p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Project Title <span className="text-[#81D607]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Automated Industrial Defect Inspection AI"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-xl"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Category Tag <span className="text-[#81D607]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI/ML, Web, PCB/Embedded, Mobile, MATLAB"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-xl"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[#9DA4B0] uppercase block">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Custom deep learning computer vision model trained to detect micro-cracks in manufacturing hardware..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-xl resize-y"
                />
              </div>

              {/* Impact Callout */}
              <div className="space-y-1.5">
                <label className="text-[#9DA4B0] uppercase block">
                  Engineering Impact / Key Result Callout
                </label>
                <input
                  type="text"
                  placeholder="e.g. Reduced manual QA inspection time by 45%"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tech Tags */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Tech Stack Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Python, PyTorch, OpenCV, FastAPI"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-xl"
                  />
                </div>

                {/* Icon Selection */}
                <CustomSelect
                  label="CARD ICON"
                  value={selectedIcon}
                  onChange={setSelectedIcon}
                  options={AVAILABLE_ICONS.map((ic) => ({
                    label: `${ic.name} (${ic.label})`,
                    value: ic.name,
                  }))}
                  size="md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E1E6EB]/10 pt-4">
                {/* Project URL */}
                <div className="space-y-1.5">
                  <label className="text-[#9DA4B0] uppercase block">
                    Project / Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-xl"
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
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] p-2.5 focus:outline-none focus:border-[#81D607] rounded-xl"
                  />
                </div>

                {/* Status */}
                <CustomSelect
                  label="VISIBILITY STATUS"
                  value={status}
                  onChange={(val) => setStatus(val as "active" | "hidden")}
                  options={[
                    { label: "Active (Published)", value: "active" },
                    { label: "Hidden (Draft)", value: "hidden" },
                  ]}
                  size="md"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#E1E6EB]/10 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#9DA4B0] hover:text-[#E1E6EB] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-bold rounded-xl cursor-pointer flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingProject ? "Save Changes" : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-red-500/60 w-full max-w-md p-6 space-y-4 text-center rounded-2xl shadow-2xl">
            <div className="w-12 h-12 bg-red-950/50 border border-red-500 text-red-500 flex items-center justify-center mx-auto rounded-xl">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-mono font-bold text-[#E1E6EB]">
                Confirm Delete Project?
              </h3>
              <p className="text-xs text-[#9DA4B0] font-sans">
                Are you sure you want to permanently remove this portfolio project from the system? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] font-mono text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deletingId === deleteConfirmId}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs flex items-center gap-2 rounded-xl cursor-pointer"
              >
                {deletingId === deleteConfirmId && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
