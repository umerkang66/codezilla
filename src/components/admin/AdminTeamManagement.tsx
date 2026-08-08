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
  Users,
  Eye,
  EyeOff,
  UserCheck,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { TeamMember } from "@/components/Team";

interface AdminTeamManagementProps {
  initialTeams: TeamMember[];
}

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  );
}

function XIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function AdminTeamManagement({ initialTeams }: AdminTeamManagementProps) {
  const [teams, setTeams] = useState<TeamMember[]>(initialTeams);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [initials, setInitials] = useState("");
  const [isFounder, setIsFounder] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // Image Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<"file" | "url">("file");

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
    setEditingMember(null);
    setName("");
    setRole("");
    setSpecialty("");
    setBio("");
    setAvatarUrl("");
    setInitials("");
    setIsFounder(false);
    setLinkedinUrl("");
    setGithubUrl("");
    setXUrl("");
    setDisplayOrder(teams.length > 0 ? Math.max(...teams.map((t) => t.display_order || 0)) + 1 : 1);
    setStatus("active");
    setImageInputMode("file");
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name || "");
    setRole(member.role || "");
    setSpecialty(member.specialty || "");
    setBio(member.bio || "");
    setAvatarUrl(member.avatar_url || "");
    setInitials(member.initials || "");
    setIsFounder(member.is_founder || false);
    setLinkedinUrl(member.linkedin_url || "");
    setGithubUrl(member.github_url || "");
    setXUrl(member.x_url || "");
    setDisplayOrder(member.display_order || 0);
    setStatus((member.status as "active" | "inactive") || "active");
    setImageInputMode(member.avatar_url && !member.avatar_url.startsWith("data:") ? "file" : "file");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("error", "Please select a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "Image file size should be less than 5MB.");
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/teams/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setAvatarUrl(data.url);
      showNotification("success", "Picture uploaded successfully!");
    } catch (err: any) {
      // Fallback to local Base64 Data URL if server upload route encounters error
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
          showNotification("success", "Picture loaded into preview!");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      showNotification("error", "Name and Role are required fields.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      role: role.trim(),
      specialty: specialty.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl.trim(),
      initials: initials.trim(),
      is_founder: isFounder,
      linkedin_url: linkedinUrl.trim(),
      github_url: githubUrl.trim(),
      x_url: xUrl.trim(),
      display_order: displayOrder,
      status: status,
    };

    try {
      const url = editingMember
        ? `/api/admin/teams/${editingMember.id}`
        : "/api/admin/teams";
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Operation failed.");
      }

      if (editingMember) {
        setTeams((prev) =>
          prev.map((item) => (item.id === editingMember.id ? data.team : item))
        );
        showNotification("success", `Team member "${name}" updated successfully.`);
      } else {
        setTeams((prev) => [...prev, data.team]);
        showNotification("success", `Team member "${name}" created successfully.`);
      }

      closeModal();
    } catch (err: any) {
      showNotification("error", err.message || "Failed to save team member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/teams/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete team member.");
      }

      setTeams((prev) => prev.filter((item) => item.id !== id));
      showNotification("success", "Team member deleted successfully.");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete team member.");
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  const toggleFounderStatus = async (member: TeamMember) => {
    try {
      const updatedFounder = !member.is_founder;
      const res = await fetch(`/api/admin/teams/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_founder: updatedFounder }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTeams((prev) =>
        prev.map((item) => (item.id === member.id ? data.team : item))
      );
      showNotification(
        "success",
        `Founder spotlight ${updatedFounder ? "enabled" : "disabled"} for ${member.name}.`
      );
    } catch (err: any) {
      showNotification("error", err.message || "Failed to update founder status.");
    }
  };

  const toggleMemberStatus = async (member: TeamMember) => {
    const nextStatus = member.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/admin/teams/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTeams((prev) =>
        prev.map((item) => (item.id === member.id ? data.team : item))
      );
      showNotification(
        "success",
        `Status set to ${nextStatus} for ${member.name}.`
      );
    } catch (err: any) {
      showNotification("error", err.message || "Failed to update status.");
    }
  };

  const derivedInitials = (mName: string, customInitials?: string) => {
    if (customInitials && customInitials.trim()) return customInitials.toUpperCase();
    if (!mName) return "CZ";
    return mName
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const filteredTeams = teams.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.specialty && member.specialty.toLowerCase().includes(searchQuery.toLowerCase()));

    if (statusFilter === "active") return matchesSearch && member.status === "active";
    if (statusFilter === "inactive") return matchesSearch && member.status === "inactive";
    return matchesSearch;
  });

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    return (a.display_order || 0) - (b.display_order || 0);
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#111111] text-[#E1E6EB]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#1A1A1A] border border-[#81D607]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#81D607] text-[#111111] text-[10px] font-mono font-extrabold uppercase">
              Admin Module
            </span>
            <h1 className="text-xl font-mono font-extrabold text-[#E1E6EB]">
              Team Members Management
            </h1>
          </div>
          <p className="text-xs text-[#9DA4B0]">
            Add, update, or remove leadership and engineering team members displayed on the website.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs transition-colors rounded-none shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 border font-mono text-xs flex items-center justify-between transition-all ${
            notification.type === "success"
              ? "bg-[#81D607]/10 border-[#81D607] text-[#81D607]"
              : "bg-red-500/10 border-red-500 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#81D607]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="hover:opacity-70 text-current"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#1A1A1A] border border-[#E1E6EB]/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9DA4B0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, or specialty..."
            className="w-full bg-[#111111] border border-[#E1E6EB]/15 pl-10 pr-4 py-2 text-xs font-mono text-[#E1E6EB] placeholder-[#9DA4B0]/60 focus:outline-none focus:border-[#81D607]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-2 text-xs font-mono font-bold transition-colors ${
              statusFilter === "all"
                ? "bg-[#81D607] text-[#111111]"
                : "bg-[#111111] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607]"
            }`}
          >
            All ({teams.length})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-2 text-xs font-mono font-bold transition-colors ${
              statusFilter === "active"
                ? "bg-[#81D607] text-[#111111]"
                : "bg-[#111111] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607]"
            }`}
          >
            Active ({teams.filter((t) => t.status === "active").length})
          </button>
          <button
            onClick={() => setStatusFilter("inactive")}
            className={`px-3 py-2 text-xs font-mono font-bold transition-colors ${
              statusFilter === "inactive"
                ? "bg-[#81D607] text-[#111111]"
                : "bg-[#111111] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607]"
            }`}
          >
            Inactive ({teams.filter((t) => t.status === "inactive").length})
          </button>
        </div>
      </div>

      {/* Team Members List / Cards */}
      {sortedTeams.length === 0 ? (
        <div className="p-12 bg-[#1A1A1A] border border-[#E1E6EB]/10 text-center space-y-4">
          <div className="w-12 h-12 bg-[#111111] border border-[#81D607]/40 flex items-center justify-center text-[#81D607] mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-mono text-[#E1E6EB]">No Team Members Found</h3>
          <p className="text-xs text-[#9DA4B0]">
            {teams.length === 0
              ? "Click 'Add Team Member' above to create your first team member entry."
              : "No team members matched your search query."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTeams.map((member) => (
            <div
              key={member.id}
              className={`p-5 bg-[#1A1A1A] border ${
                member.is_founder ? "border-[#81D607]" : "border-[#E1E6EB]/15"
              } flex flex-col justify-between space-y-4 relative group`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 border-b border-[#E1E6EB]/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#111111] border border-[#E1E6EB]/20 text-[10px] font-mono text-[#81D607]">
                    Order #{member.display_order || 0}
                  </span>
                  {member.is_founder && (
                    <span className="px-2 py-0.5 bg-[#81D607] text-[#111111] text-[10px] font-mono font-bold uppercase">
                      Founder
                    </span>
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-mono uppercase border ${
                    member.status === "active"
                      ? "bg-[#81D607]/10 border-[#81D607] text-[#81D607]"
                      : "bg-red-500/10 border-red-500/50 text-red-400"
                  }`}
                >
                  {member.status || "active"}
                </span>
              </div>

              {/* Main Content Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-14 h-14 bg-[#111111] border border-[#81D607] object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-[#111111] border border-[#81D607] flex items-center justify-center text-[#81D607] font-mono font-bold text-lg shrink-0">
                      {derivedInitials(member.name, member.initials)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-[#E1E6EB] font-sans truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs font-mono text-[#81D607] uppercase truncate">
                      {member.role}
                    </p>
                    {member.specialty && (
                      <p className="text-[11px] text-[#9DA4B0] truncate mt-1">
                        {member.specialty}
                      </p>
                    )}
                  </div>
                </div>

                {member.bio && (
                  <p className="text-xs text-[#9DA4B0] line-clamp-2 leading-relaxed font-sans border-t border-[#E1E6EB]/10 pt-2">
                    {member.bio}
                  </p>
                )}

                {/* Social Links Icons */}
                <div className="flex items-center gap-2 text-xs font-mono text-[#9DA4B0] pt-1">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607]"
                      title="LinkedIn"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607]"
                      title="GitHub"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.x_url && (
                    <a
                      href={member.x_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607]"
                      title="X / Twitter"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-3 border-t border-[#E1E6EB]/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleFounderStatus(member)}
                    title={member.is_founder ? "Remove Founder Spotlight" : "Set Founder Spotlight"}
                    className={`p-2 font-mono text-xs border transition-colors ${
                      member.is_founder
                        ? "bg-[#81D607] text-[#111111] border-[#81D607]"
                        : "bg-[#111111] text-[#9DA4B0] border-[#E1E6EB]/15 hover:text-[#81D607]"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleMemberStatus(member)}
                    title={member.status === "active" ? "Set to Inactive" : "Set to Active"}
                    className={`p-2 font-mono text-xs border transition-colors ${
                      member.status === "active"
                        ? "bg-[#111111] text-[#81D607] border-[#81D607]/40 hover:border-[#81D607]"
                        : "bg-[#111111] text-red-400 border-red-500/40 hover:border-red-500"
                    }`}
                  >
                    {member.status === "active" ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="px-3 py-1.5 bg-[#111111] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(member.id)}
                    className="px-3 py-1.5 bg-[#111111] border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white font-mono text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create or Edit Team Member */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#1A1A1A] border border-[#81D607] rounded-none shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E1E6EB]/10 p-5 sm:p-6 shrink-0 bg-[#1A1A1A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#111111] border border-[#81D607] flex items-center justify-center text-[#81D607]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-mono font-bold text-[#E1E6EB]">
                  {editingMember ? "Edit Team Member" : "Add New Team Member"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 bg-[#111111] border border-[#E1E6EB]/15 text-[#9DA4B0] hover:text-[#81D607] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 text-left font-sans overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-[#E1E6EB]">
                      Full Name <span className="text-[#81D607]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muhammad Ahmed Pasha"
                      className="w-full bg-[#111111] border border-[#E1E6EB]/15 px-3 py-2 text-xs font-mono text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                    />
                  </div>

                  {/* Role / Job Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-[#E1E6EB]">
                      Role / Title <span className="text-[#81D607]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Founder & CEO / Lead Full-Stack Architect"
                      className="w-full bg-[#111111] border border-[#E1E6EB]/15 px-3 py-2 text-xs font-mono text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                    />
                  </div>
                </div>

                {/* Technical Specialty */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#E1E6EB]">
                    Specialty / Technical Focus
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. PCB Layout, Next.js & PyTorch Systems"
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 px-3 py-2 text-xs font-mono text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                  />
                </div>

                {/* Computer Picture Selection Area */}
                <div className="space-y-2 p-4 bg-[#111111] border border-[#81D607]/40">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-bold text-[#81D607]">
                      Team Member Picture
                    </label>
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      <button
                        type="button"
                        onClick={() => setImageInputMode("file")}
                        className={`px-2 py-0.5 transition-colors ${
                          imageInputMode === "file"
                            ? "bg-[#81D607] text-[#111111] font-bold"
                            : "text-[#9DA4B0] hover:text-[#E1E6EB]"
                        }`}
                      >
                        Pick from Computer
                      </button>
                      <span className="text-[#9DA4B0]">|</span>
                      <button
                        type="button"
                        onClick={() => setImageInputMode("url")}
                        className={`px-2 py-0.5 transition-colors ${
                          imageInputMode === "url"
                            ? "bg-[#81D607] text-[#111111] font-bold"
                            : "text-[#9DA4B0] hover:text-[#E1E6EB]"
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {imageInputMode === "file" ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      {/* Picture Preview Box */}
                      <div className="w-16 h-16 bg-[#1A1A1A] border-2 border-[#81D607] overflow-hidden shrink-0 flex items-center justify-center relative">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-[#81D607] font-mono text-xl font-bold">
                            {derivedInitials(name, initials)}
                          </div>
                        )}
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-[#81D607] animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* File Picker Control */}
                      <div className="flex-1 space-y-2 text-left w-full">
                        <input
                          type="file"
                          id="computer-picture-input"
                          accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <label
                            htmlFor="computer-picture-input"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs cursor-pointer transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{avatarUrl ? "Change Picture" : "Choose Picture from Computer"}</span>
                          </label>

                          {avatarUrl && (
                            <button
                              type="button"
                              onClick={() => setAvatarUrl("")}
                              className="px-3 py-2 bg-[#1A1A1A] border border-red-500/50 text-red-400 hover:bg-red-600 hover:text-white font-mono text-xs transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-[#9DA4B0]">
                          Supports PNG, JPG, WEBP, or SVG (Max 5MB). File will be saved for this team member.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or web image link"
                        className="w-full bg-[#1A1A1A] border border-[#E1E6EB]/15 px-3 py-2 text-xs font-mono text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                      />
                    </div>
                  )}
                </div>

                {/* Bio / Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#E1E6EB]">
                    Short Bio / Overview
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe background, domain experience, and key engineering contributions..."
                    className="w-full bg-[#111111] border border-[#E1E6EB]/15 p-3 text-xs font-sans text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                  />
                </div>

                {/* Initials & Display Order */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-[#E1E6EB]">
                      Initials (Default: Auto)
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={initials}
                      onChange={(e) => setInitials(e.target.value.toUpperCase())}
                      placeholder={derivedInitials(name)}
                      className="w-full bg-[#111111] border border-[#E1E6EB]/15 px-3 py-2 text-xs font-mono text-[#E1E6EB] uppercase focus:outline-none focus:border-[#81D607]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-[#E1E6EB]">
                      Display Order (#)
                    </label>
                    <input
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#111111] border border-[#E1E6EB]/15 px-3 py-2 text-xs font-mono text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-[#E1E6EB]">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                      className="w-full bg-[#111111] border border-[#E1E6EB]/15 px-3 py-2 text-xs font-mono text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="inactive">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Social Profiles */}
                <div className="space-y-2 pt-2 border-t border-[#E1E6EB]/10">
                  <span className="block text-xs font-mono font-bold text-[#81D607]">
                    Social Media Links
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="LinkedIn URL"
                      className="w-full bg-[#111111] border border-[#E1E6EB]/15 px-3 py-2 text-xs font-mono text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                    />
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="GitHub URL"
                      className="w-full bg-[#111111] border border-[#E1E6EB]/15 px-3 py-2 text-xs font-mono text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                    />
                    <input
                      type="url"
                      value={xUrl}
                      onChange={(e) => setXUrl(e.target.value)}
                      placeholder="X / Twitter URL"
                      className="w-full bg-[#111111] border border-[#E1E6EB]/15 px-3 py-2 text-xs font-mono text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                    />
                  </div>
                </div>

                {/* Checkbox: Founder Spotlight */}
                <div className="pt-2">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFounder}
                      onChange={(e) => setIsFounder(e.target.checked)}
                      className="w-4 h-4 accent-[#81D607] bg-[#111111] border border-[#E1E6EB]/20 rounded-none cursor-pointer"
                    />
                    <span className="text-xs font-mono text-[#E1E6EB]">
                      Highlight as Founder / Leadership Spotlight
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="p-4 sm:p-6 border-t border-[#E1E6EB]/10 flex items-center justify-end gap-3 shrink-0 bg-[#1A1A1A]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-[#111111] border border-[#E1E6EB]/20 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] font-mono text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-6 py-2.5 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingMember ? "Save Changes" : "Create Team Member"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1A1A] border border-red-500/80 p-6 space-y-6 text-center rounded-none shadow-2xl">
            <div className="w-12 h-12 bg-[#111111] border border-red-500 flex items-center justify-center text-red-500 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-mono font-bold text-[#E1E6EB]">
                Confirm Deletion
              </h3>
              <p className="text-xs text-[#9DA4B0]">
                Are you sure you want to delete this team member? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 bg-[#111111] border border-[#E1E6EB]/20 text-[#E1E6EB] hover:border-[#81D607] font-mono text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deletingId === deleteConfirmId}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold flex items-center gap-2"
              >
                {deletingId === deleteConfirmId && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
