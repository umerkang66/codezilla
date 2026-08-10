"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Download,
  X,
  Loader2,
  FileText,
  AlertCircle,
  Mail,
  Phone,
  Globe,
  Share2,
  Filter,
  Check,
  FileSpreadsheet,
} from "lucide-react";
import { exportApplicationsToExcel } from "@/utils/excelExport";
import CustomSelect from "@/components/ui/CustomSelect";
import { getApplicationStatusConfig, CANDIDATE_STATUS_OPTIONS } from "@/utils/statusConfig";

export interface JobPosting {
  id: string;
  title: string;
  domain: string;
  type: string;
  description: string;
  skills: string[];
  requirements?: string;
  status: string;
  created_at: string;
  applications_count?: number;
  pending_count?: number;
}

export interface JobApplication {
  id: string;
  job_id: string;
  job_title?: string;
  job_domain?: string;
  full_name: string;
  email: string;
  phone?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  cover_letter?: string;
  resume_url: string;
  resume_file_name: string;
  resume_file_type: string;
  status: string;
  created_at: string;
}

interface AdminTalentAcquisitionProps {
  initialJobs: JobPosting[];
  initialApplications: JobApplication[];
}

export default function AdminTalentAcquisition({
  initialJobs = [],
  initialApplications = [],
}: AdminTalentAcquisitionProps) {
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");

  // Jobs state
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");

  // Job Modal state (Create / Edit)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDomain, setJobDomain] = useState("Engineering");
  const [jobType, setJobType] = useState("Remote / Project-Based");
  const [jobDescription, setJobDescription] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobStatus, setJobStatus] = useState("active");
  const [isSavingJob, setIsSavingJob] = useState(false);

  // Job Delete Modal state
  const [deletingJob, setDeletingJob] = useState<JobPosting | null>(null);
  const [isDeletingJob, setIsDeletingJob] = useState(false);

  // Applications state
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appSearch, setAppSearch] = useState("");
  const [appJobFilter, setAppJobFilter] = useState("all");
  const [appStatusFilter, setAppStatusFilter] = useState("all");

  // Application Detail Modal (with PDF / DOCX Viewer)
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isUpdatingAppStatus, setIsUpdatingAppStatus] = useState(false);
  const [docxViewerMode, setDocxViewerMode] = useState<"google" | "office">("google");
  const [pdfViewerMode, setPdfViewerMode] = useState<"native" | "google">("native");
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedApp?.resume_url) {
      setPdfBlobUrl(null);
      return;
    }

    const url = selectedApp.resume_url;
    if (url.startsWith("data:")) {
      try {
        const parts = url.split(",");
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : "application/pdf";
        const base64Data = parts[1] || "";
        const binaryStr = atob(base64Data);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const objectUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(objectUrl);

        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } catch (e) {
        console.error("Error creating Blob URL from data URI:", e);
        setPdfBlobUrl(null);
      }
    } else {
      setPdfBlobUrl(null);
    }
  }, [selectedApp?.resume_url]);

  // Error / Toast state
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Fetch Jobs
  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await fetch("/api/admin/talent-acquisition/jobs");
      if (res.ok) {
        const data = await res.json();
        if (data.jobs) setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setJobsLoading(false);
    }
  };

  // Fetch Applications
  const fetchApplications = async () => {
    setAppsLoading(true);
    try {
      const res = await fetch("/api/admin/talent-acquisition/applications");
      if (res.ok) {
        const data = await res.json();
        if (data.applications) setApplications(data.applications);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  // Handle Job Form Submit (Create / Edit)
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) {
      showToast("error", "Job title and description are required.");
      return;
    }

    setIsSavingJob(true);
    try {
      const payload = {
        title: jobTitle,
        domain: jobDomain,
        type: jobType,
        description: jobDescription,
        skills: jobSkills,
        requirements: jobRequirements,
        status: jobStatus,
      };

      const url = editingJob
        ? `/api/admin/talent-acquisition/jobs/${editingJob.id}`
        : "/api/admin/talent-acquisition/jobs";
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save job posting.");

      showToast(
        "success",
        editingJob ? "Job posting updated successfully!" : "Job posting created successfully!"
      );
      setIsJobModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      showToast("error", err.message || "An error occurred.");
    } finally {
      setIsSavingJob(false);
    }
  };

  // Open Create Job Modal
  const handleOpenCreateJob = () => {
    setEditingJob(null);
    setJobTitle("");
    setJobDomain("Engineering");
    setJobType("Remote / Project-Based");
    setJobDescription("");
    setJobSkills("");
    setJobRequirements("");
    setJobStatus("active");
    setIsJobModalOpen(true);
  };

  // Open Edit Job Modal
  const handleOpenEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobDomain(job.domain);
    setJobType(job.type);
    setJobDescription(job.description);
    setJobSkills(Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "");
    setJobRequirements(job.requirements || "");
    setJobStatus(job.status || "active");
    setIsJobModalOpen(true);
  };

  // Toggle Job Status (Active <-> Closed)
  const handleToggleJobStatus = async (job: JobPosting) => {
    const newStatus = job.status === "active" ? "closed" : "active";
    try {
      const res = await fetch(`/api/admin/talent-acquisition/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast("success", `Job status changed to ${newStatus}`);
        fetchJobs();
      }
    } catch (err) {
      showToast("error", "Failed to update status.");
    }
  };

  // Delete Job
  const handleDeleteJob = async () => {
    if (!deletingJob) return;
    setIsDeletingJob(true);
    try {
      const res = await fetch(`/api/admin/talent-acquisition/jobs/${deletingJob.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("success", "Job posting deleted.");
        setDeletingJob(null);
        fetchJobs();
        fetchApplications();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete job.");
      }
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setIsDeletingJob(false);
    }
  };

  // Application Status Update
  const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
    setIsUpdatingAppStatus(true);
    try {
      const res = await fetch(`/api/admin/talent-acquisition/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast("success", `Application status updated to '${newStatus}'`);
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
        fetchApplications();
        fetchJobs();
      }
    } catch (err) {
      showToast("error", "Failed to update application status.");
    } finally {
      setIsUpdatingAppStatus(false);
    }
  };

  // Application Delete Modal state
  const [deletingApp, setDeletingApp] = useState<JobApplication | null>(null);
  const [isDeletingApp, setIsDeletingApp] = useState(false);

  // Delete Application
  const handleDeleteApp = async () => {
    if (!deletingApp) return;
    setIsDeletingApp(true);
    try {
      const res = await fetch(`/api/admin/talent-acquisition/applications/${deletingApp.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("success", "Application deleted successfully.");
        if (selectedApp && selectedApp.id === deletingApp.id) {
          setSelectedApp(null);
        }
        setDeletingApp(null);
        fetchApplications();
        fetchJobs();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete application.");
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete application.");
    } finally {
      setIsDeletingApp(false);
    }
  };

  // Filtering Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.domain.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.description.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesStatus =
      jobStatusFilter === "all" || job.status === jobStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtering Applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.email.toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.job_title || "").toLowerCase().includes(appSearch.toLowerCase());
    const matchesJob = appJobFilter === "all" || app.job_id === appJobFilter;
    const matchesStatus =
      appStatusFilter === "all" || app.status === appStatusFilter;
    return matchesSearch && matchesJob && matchesStatus;
  });

  // Export Candidate Applications to Excel (.xlsx)
  const handleExportApplicationsExcel = (all: boolean = false) => {
    const listToExport = all ? applications : filteredApps;
    if (listToExport.length === 0) {
      showToast("error", "No candidate applications available to export.");
      return;
    }

    const filterInfo = appJobFilter !== "all" ? "Filtered" : "All";
    const prefix = all ? "Candidate_Applications_All" : `Candidate_Applications_${filterInfo}`;
    
    const success = exportApplicationsToExcel(listToExport, prefix);
    if (success) {
      showToast("success", `Exported ${listToExport.length} candidate applications to Excel (.xlsx)`);
    } else {
      showToast("error", "Failed to export candidate applications.");
    }
  };

  const handleExportSingleAppExcel = (app: JobApplication) => {
    const prefix = `Candidate_${app.full_name.replace(/\s+/g, "_")}`;
    const success = exportApplicationsToExcel([app], prefix);
    if (success) {
      showToast("success", `Exported ${app.full_name}'s details to Excel (.xlsx)`);
    }
  };

  const activeJobsCount = jobs.filter((j) => j.status === "active").length;
  const pendingAppsCount = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto text-left space-y-6 bg-[#111111] text-[#E1E6EB]">
      {/* Toast Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 text-xs font-mono flex items-center justify-between transition-all ${
            feedback.type === "success"
              ? "bg-[#81D607]/20 border border-[#81D607] text-[#81D607]"
              : "bg-red-950/80 border border-red-500 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-current opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#1A1A1A] border border-[#81D607]/30 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#81D607] text-[#111111] text-[10px] font-mono font-extrabold uppercase rounded-full">
              Admin Module
            </span>
            <h1 className="text-xl font-mono font-extrabold text-[#E1E6EB]">
              Talent Acquisition Management
            </h1>
          </div>
          <p className="text-xs text-[#9DA4B0]">
            Manage job postings, review applicant CVs (.pdf, .docx), and track candidate statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateJob}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs transition-all rounded-xl cursor-pointer shrink-0 shadow-md hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#E1E6EB]/10">
        <button
          type="button"
          onClick={() => setActiveTab("jobs")}
          className={`px-5 py-3 font-mono font-bold text-xs flex items-center gap-2 border-b-2 transition-colors rounded-t-xl cursor-pointer ${
            activeTab === "jobs"
              ? "border-[#81D607] text-[#81D607] bg-[#1A1A1A]"
              : "border-transparent text-[#9DA4B0] hover:text-[#E1E6EB] hover:bg-[#1A1A1A]/50"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Postings ({jobs.length})</span>
          {activeJobsCount > 0 && (
            <span className="px-2 py-0.5 bg-[#81D607]/20 text-[#81D607] border border-[#81D607]/40 text-[10px] rounded-full">
              {activeJobsCount} Active
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`px-5 py-3 font-mono font-bold text-xs flex items-center gap-2 border-b-2 transition-colors rounded-t-xl cursor-pointer ${
            activeTab === "applications"
              ? "border-[#81D607] text-[#81D607] bg-[#1A1A1A]"
              : "border-transparent text-[#9DA4B0] hover:text-[#E1E6EB] hover:bg-[#1A1A1A]/50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Applications ({applications.length})</span>
          {pendingAppsCount > 0 && (
            <span className="px-2 py-0.5 bg-yellow-950 text-yellow-400 border border-yellow-500/40 text-[10px] rounded-full animate-pulse">
              {pendingAppsCount} New
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: JOB POSTINGS MANAGEMENT (CRUD) */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#1A1A1A] border border-[#E1E6EB]/10 rounded-2xl shadow-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]" />
              <input
                type="text"
                placeholder="Search job postings..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#111111] border border-[#E1E6EB]/15 text-xs text-[#E1E6EB] placeholder-[#9DA4B0] font-mono focus:outline-none focus:border-[#81D607] rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-mono text-[#9DA4B0]">Status:</span>
              <CustomSelect
                value={jobStatusFilter}
                onChange={setJobStatusFilter}
                options={[
                  { label: "All Statuses", value: "all" },
                  { label: "Active Only", value: "active" },
                  { label: "Closed Only", value: "closed" },
                ]}
                size="sm"
              />

              <button
                type="button"
                onClick={fetchJobs}
                disabled={jobsLoading}
                className="p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#9DA4B0] hover:text-[#81D607] hover:border-[#81D607] rounded-xl cursor-pointer transition-colors"
                title="Refresh jobs"
              >
                <Clock className={`w-4 h-4 ${jobsLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Jobs List / Table */}
          {jobsLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#81D607] mx-auto" />
              <p className="text-xs font-mono text-[#9DA4B0]">Loading job postings...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-12 text-center bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-3 rounded-2xl">
              <Briefcase className="w-10 h-10 text-[#9DA4B0] mx-auto opacity-50" />
              <h3 className="text-base font-mono font-bold text-[#E1E6EB]">No Job Postings Found</h3>
              <p className="text-xs text-[#9DA4B0]">
                {jobSearch ? "Try adjusting your search filter." : "Click 'Post New Job' to create your first posting."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 flex flex-col justify-between space-y-4 rounded-2xl hover:border-[#81D607]/60 transition-all shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#111111] text-[#81D607] border border-[#81D607]/30 rounded-full inline-block font-bold">
                          {job.domain}
                        </span>
                        <h3 className="text-lg font-mono font-bold text-[#E1E6EB] leading-snug">
                          {job.title}
                        </h3>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-3 py-1 font-bold uppercase rounded-full shrink-0 ${
                          job.status === "active"
                            ? "bg-[#81D607]/20 border border-[#81D607] text-[#81D607]"
                            : "bg-gray-800 border border-gray-600 text-gray-400"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#9DA4B0] leading-relaxed line-clamp-3">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-[#9DA4B0]">
                      <span className="px-2.5 py-0.5 bg-[#111111] border border-[#E1E6EB]/10 text-[#E1E6EB] rounded-full">
                        {job.type}
                      </span>
                      {job.skills &&
                        (Array.isArray(job.skills) ? job.skills : [job.skills]).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 bg-[#111111] border border-[#81D607]/20 text-[#81D607] rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E1E6EB]/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("applications");
                        setAppJobFilter(job.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#81D607] hover:underline cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>
                        {job.applications_count || 0} Applications
                      </span>
                      {job.pending_count ? (
                        <span className="px-2 py-0.5 bg-yellow-500 text-[#111111] font-bold text-[9px] rounded-full">
                          {job.pending_count} new
                        </span>
                      ) : null}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleJobStatus(job)}
                        className="px-3 py-1.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] text-xs font-mono rounded-xl cursor-pointer transition-colors"
                        title={job.status === "active" ? "Close position" : "Activate position"}
                      >
                        {job.status === "active" ? "Close" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditJob(job)}
                        className="p-2 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] rounded-xl cursor-pointer transition-colors"
                        title="Edit job"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingJob(job)}
                        className="p-2 bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/60 rounded-xl cursor-pointer transition-colors"
                        title="Delete job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CANDIDATE APPLICATIONS MANAGEMENT */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {/* Applications Controls Bar */}
          <div className="p-5 bg-[#1A1A1A] border border-[#E1E6EB]/15 space-y-4 rounded-2xl shadow-xl">
            {/* Top Row: Search, Filters & Excel Download */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DA4B0]" />
                <input
                  type="text"
                  placeholder="Search candidate name, email, or phone..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-xs text-[#E1E6EB] placeholder-[#9DA4B0] font-mono focus:outline-none focus:border-[#81D607] rounded-xl"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#81D607]" />
                  <span className="text-xs font-mono text-[#9DA4B0]">Position:</span>
                  <CustomSelect
                    value={appJobFilter}
                    onChange={setAppJobFilter}
                    options={[
                      { label: "All Positions", value: "all" },
                      ...jobs.map((j) => ({ label: j.title, value: j.id })),
                    ]}
                    size="sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#9DA4B0]">Status:</span>
                  <CustomSelect
                    value={appStatusFilter}
                    onChange={setAppStatusFilter}
                    options={[
                      { label: "All Statuses", value: "all" },
                      ...CANDIDATE_STATUS_OPTIONS,
                    ]}
                    buttonClassName={
                      appStatusFilter !== "all"
                        ? getApplicationStatusConfig(appStatusFilter).buttonClass
                        : ""
                    }
                    size="sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={fetchApplications}
                  disabled={appsLoading}
                  className="p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#9DA4B0] hover:text-[#81D607] hover:border-[#81D607] rounded-xl cursor-pointer transition-colors"
                  title="Refresh applications"
                >
                  <Clock className={`w-4 h-4 ${appsLoading ? "animate-spin" : ""}`} />
                </button>

                {/* Export to Excel Buttons */}
                <button
                  type="button"
                  onClick={() => handleExportApplicationsExcel(false)}
                  disabled={filteredApps.length === 0}
                  className="px-4 py-2 bg-[#81D607] hover:bg-[#72BE06] disabled:opacity-50 disabled:cursor-not-allowed text-[#111111] font-mono font-bold text-xs flex items-center gap-2 transition-all rounded-xl cursor-pointer shadow-sm hover:scale-[1.02]"
                  title="Download candidate applications in Excel file (.xlsx)"
                >
                  <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    Excel {filteredApps.length !== applications.length ? `(${filteredApps.length})` : `(${applications.length})`}
                  </span>
                </button>

                {filteredApps.length !== applications.length && applications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleExportApplicationsExcel(true)}
                    className="px-3 py-2 bg-[#111111] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs transition-all rounded-xl cursor-pointer hover:scale-[1.02]"
                    title={`Download all ${applications.length} applications in Excel format`}
                  >
                    All ({applications.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Applications Table View */}
          {appsLoading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#81D607] mx-auto" />
              <p className="text-xs font-mono text-[#9DA4B0]">Loading candidate applications...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-16 text-center bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-4 rounded-2xl">
              <Users className="w-12 h-12 text-[#81D607]/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-mono font-bold text-[#E1E6EB]">No Applications Found</h3>
                <p className="text-xs text-[#9DA4B0]">
                  {appSearch || appJobFilter !== "all" || appStatusFilter !== "all"
                    ? "No candidate applications match your current search or dropdown filters."
                    : "No candidate applications have been submitted yet."}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#E1E6EB]/15 rounded-2xl overflow-hidden shadow-xl bg-[#1A1A1A]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#141414] border-b border-[#E1E6EB]/10 text-[#81D607] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4.5 whitespace-nowrap">Candidate</th>
                    <th className="p-4.5 whitespace-nowrap">Applied Position</th>
                    <th className="p-4.5 whitespace-nowrap">CV File</th>
                    <th className="p-4.5 whitespace-nowrap">Applied Date</th>
                    <th className="p-4.5 whitespace-nowrap min-w-[160px]">Status</th>
                    <th className="p-4.5 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E6EB]/10 bg-[#111111]">
                  {filteredApps.map((app) => {
                    const fileExt = app.resume_file_type?.toLowerCase() || app.resume_file_name?.split(".").pop()?.toLowerCase() || "";
                    const isPdf = fileExt === "pdf";

                    return (
                      <tr key={app.id} className="hover:bg-[#1A1A1A]/80 transition-colors">
                        <td className="p-4.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#1A1A1A] border border-[#81D607] flex items-center justify-center text-[#81D607] font-mono font-bold text-xs rounded-full shrink-0 shadow-sm">
                              {app.full_name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <p className="font-bold text-[#E1E6EB]">{app.full_name}</p>
                              <a href={`mailto:${app.email}`} className="text-[11px] text-[#9DA4B0] hover:text-[#81D607] block transition-colors cursor-pointer">
                                {app.email}
                              </a>
                              {app.phone && <p className="text-[10px] text-[#81D607]">{app.phone}</p>}
                            </div>
                          </div>
                        </td>

                        <td className="p-4.5 space-y-1.5 whitespace-nowrap">
                          <p className="font-bold text-[#E1E6EB]">{app.job_title}</p>
                          <span className="text-[10px] px-2.5 py-0.5 bg-[#1A1A1A] text-[#81D607] border border-[#81D607]/20 rounded-full inline-block">
                            {app.job_domain || "Engineering"}
                          </span>
                        </td>

                        <td className="p-4.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] transition-colors rounded-full cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="uppercase text-[10px] font-bold">
                              {isPdf ? "PDF CV" : "DOCX CV"}
                            </span>
                          </button>
                        </td>

                        <td className="p-4.5 text-[#9DA4B0] text-[11px] whitespace-nowrap">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>

                        <td className="p-4.5 whitespace-nowrap min-w-[165px]">
                          <CustomSelect
                            value={app.status}
                            onChange={(val) => handleUpdateAppStatus(app.id, val)}
                            disabled={isUpdatingAppStatus}
                            options={CANDIDATE_STATUS_OPTIONS}
                            buttonClassName={getApplicationStatusConfig(app.status).buttonClass}
                            size="sm"
                          />
                        </td>

                        <td className="p-4.5 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="px-3.5 py-2 bg-[#81D607] text-[#111111] font-bold text-xs hover:bg-[#72BE06] transition-colors inline-flex items-center gap-1.5 rounded-xl cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingApp(app)}
                            className="p-2 bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/60 inline-flex items-center rounded-xl cursor-pointer transition-colors"
                            title="Delete application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: CREATE / EDIT JOB POSTING */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#1A1A1A] border border-[#81D607]/60 shadow-2xl p-6 sm:p-8 space-y-6 my-8 rounded-2xl text-left">
            <button
              type="button"
              onClick={() => setIsJobModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#9DA4B0] hover:text-[#E1E6EB] rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-[#E1E6EB]/10 pb-4 pr-8">
              <h2 className="text-xl font-mono font-extrabold text-[#E1E6EB]">
                {editingJob ? "Edit Job Posting" : "Post New Job Opening"}
              </h2>
              <p className="text-xs text-[#9DA4B0]">
                {editingJob
                  ? "Update position parameters and requirements."
                  : "Create a new position visible on /talent-acquisition and /careers."}
              </p>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#9DA4B0]">
                    Position Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI & Vision Researcher"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607] rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#9DA4B0]">Domain / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. AI / ML Engineering, Web Dev"
                    value={jobDomain}
                    onChange={(e) => setJobDomain(e.target.value)}
                    className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#9DA4B0]">Employment Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / Project-Based, Full-Time"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607] rounded-xl"
                  />
                </div>

                <CustomSelect
                  label="Status"
                  value={jobStatus}
                  onChange={setJobStatus}
                  options={[
                    { label: "Active (Visible on website)", value: "active" },
                    { label: "Closed / Draft", value: "closed" },
                  ]}
                  size="md"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9DA4B0]">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe role responsibilities, team overview, and impact..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607] font-sans text-xs rounded-xl"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-[#9DA4B0]">
                  Required Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PyTorch, OpenCV, YOLO, FastAPI"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607] rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#9DA4B0]">Requirements / Qualifications (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="List degree, experience, or prerequisite tech stack requirements..."
                  value={jobRequirements}
                  onChange={(e) => setJobRequirements(e.target.value)}
                  className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607] font-sans text-xs rounded-xl"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E1E6EB]/10">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  disabled={isSavingJob}
                  className="px-4 py-2 bg-[#111111] border border-[#E1E6EB]/20 text-[#9DA4B0] hover:text-[#E1E6EB] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingJob}
                  className="px-6 py-2 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-bold flex items-center gap-2 rounded-xl cursor-pointer"
                >
                  {isSavingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingJob ? "Save Changes" : "Create Job"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE JOB CONFIRMATION */}
      {deletingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1A1A] border border-red-500/60 p-6 space-y-4 text-left rounded-2xl shadow-2xl">
            <h3 className="text-lg font-mono font-bold text-[#E1E6EB]">Confirm Deletion</h3>
            <p className="text-xs text-[#9DA4B0] leading-relaxed">
              Are you sure you want to delete <span className="text-red-400 font-bold">{deletingJob.title}</span>? All candidate applications attached to this job will also be removed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingJob(null)}
                disabled={isDeletingJob}
                className="px-4 py-2 bg-[#111111] border border-[#E1E6EB]/20 text-[#9DA4B0] font-mono text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteJob}
                disabled={isDeletingJob}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs flex items-center gap-2 rounded-xl cursor-pointer"
              >
                {isDeletingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Delete Job</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: APPLICATION DETAIL & CV FILE VIEWER (.PDF, .DOCX) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
          <div className="relative w-full max-w-6xl h-[92vh] max-h-[900px] bg-[#1A1A1A] border border-[#81D607]/60 shadow-2xl flex flex-col rounded-2xl text-left overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#141414] border-b border-[#E1E6EB]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-[#111111] border border-[#81D607] flex items-center justify-center text-[#81D607] shrink-0 rounded-full">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-mono font-bold text-[#E1E6EB] truncate">
                      {selectedApp.full_name}
                    </h2>
                    <span className="px-3 py-0.5 bg-[#81D607] text-[#111111] font-mono text-[10px] font-extrabold uppercase shrink-0 rounded-full">
                      {selectedApp.job_title}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#9DA4B0] truncate">
                    {selectedApp.email} • Applied on {new Date(selectedApp.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                {/* Status Dropdown */}
                <CustomSelect
                  value={selectedApp.status}
                  onChange={(val) => handleUpdateAppStatus(selectedApp.id, val)}
                  disabled={isUpdatingAppStatus}
                  options={CANDIDATE_STATUS_OPTIONS.map((opt) => ({
                    ...opt,
                    label: `Status: ${opt.label}`,
                  }))}
                  buttonClassName={getApplicationStatusConfig(selectedApp.status).buttonClass}
                  size="sm"
                />

                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="p-2 text-[#9DA4B0] hover:text-[#E1E6EB] bg-[#111111] border border-[#E1E6EB]/15 hover:border-[#81D607] transition-colors rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Grid (Split View on desktop: Candidate Info on left, Document Viewer on right) */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#111111]">
              
              {/* Left Side: Candidate Profile & Details (4 columns) */}
              <div className="lg:col-span-4 p-5 bg-[#141414] border-r border-[#E1E6EB]/10 overflow-y-auto space-y-5 font-mono text-xs">
                
                {/* Candidate Card */}
                <div className="p-4 bg-[#1A1A1A] border border-[#81D607]/30 space-y-3 rounded-xl">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#81D607] uppercase font-bold tracking-wider">
                      Candidate Information
                    </span>
                    <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-full flex items-center gap-1.5 ${getApplicationStatusConfig(selectedApp.status).badgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getApplicationStatusConfig(selectedApp.status).dotClass}`} />
                      {getApplicationStatusConfig(selectedApp.status).label}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-[#9DA4B0] block">Full Name</span>
                      <p className="font-bold text-[#E1E6EB] text-sm">{selectedApp.full_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9DA4B0] block">Email</span>
                      <a href={`mailto:${selectedApp.email}`} className="text-[#81D607] font-bold hover:underline break-all cursor-pointer">
                        {selectedApp.email}
                      </a>
                    </div>
                    {selectedApp.phone && (
                      <div>
                        <span className="text-[10px] text-[#9DA4B0] block">Phone</span>
                        <p className="text-[#E1E6EB]">{selectedApp.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Links */}
                <div className="p-4 bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-2 rounded-xl">
                  <span className="text-[10px] text-[#9DA4B0] uppercase font-bold">Candidate Links</span>
                  <div className="flex flex-col gap-2 pt-1">
                    {selectedApp.portfolio_url ? (
                      <a
                        href={selectedApp.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#111111] border border-[#E1E6EB]/15 text-[#81D607] hover:border-[#81D607] flex items-center justify-between rounded-xl cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5" />
                          <span>Portfolio Website</span>
                        </span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : null}

                    {selectedApp.linkedin_url ? (
                      <a
                        href={selectedApp.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#111111] border border-[#E1E6EB]/15 text-[#81D607] hover:border-[#81D607] flex items-center justify-between rounded-xl cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Share2 className="w-3.5 h-3.5" />
                          <span>LinkedIn Profile</span>
                        </span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : null}

                    {!selectedApp.portfolio_url && !selectedApp.linkedin_url && (
                      <span className="text-[#9DA4B0] italic">No portfolio or LinkedIn provided.</span>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApp.cover_letter && (
                  <div className="p-4 bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-2 rounded-xl">
                    <span className="text-[10px] text-[#81D607] uppercase font-bold">Cover Letter / Note</span>
                    <p className="text-[#E1E6EB] font-sans text-xs leading-relaxed whitespace-pre-wrap bg-[#111111] p-3 border border-[#E1E6EB]/10 max-h-48 overflow-y-auto rounded-xl">
                      {selectedApp.cover_letter}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={pdfBlobUrl || selectedApp.resume_url}
                    download={selectedApp.resume_file_name}
                    className="w-full py-2.5 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-bold text-xs flex items-center justify-center gap-2 transition-colors rounded-xl cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV ({selectedApp.resume_file_name})</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleExportSingleAppExcel(selectedApp)}
                    className="w-full py-2 bg-[#111111] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-bold text-xs flex items-center justify-center gap-2 transition-colors rounded-xl cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Download Excel Details (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingApp(selectedApp)}
                    className="w-full py-2 bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/60 font-bold text-xs flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Application</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Embedded PDF / DOCX Document Viewer Canvas (8 columns) */}
              <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-[#111111]">
                {/* Document Toolbar Header */}
                <div className="px-4 py-3 bg-[#181818] border-b border-[#E1E6EB]/10 flex items-center justify-between gap-3 shrink-0 font-mono text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#81D607] shrink-0" />
                    <span className="font-bold text-[#E1E6EB] truncate">
                      {selectedApp.resume_file_name}
                    </span>
                    <span className="px-2 py-0.5 bg-[#111111] text-[#81D607] border border-[#81D607]/30 text-[10px] uppercase font-bold shrink-0 rounded-md">
                      {selectedApp.resume_file_type?.toUpperCase() || "PDF"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* PDF Viewer Mode Switcher */}
                    {(selectedApp.resume_file_type === "pdf" ||
                      selectedApp.resume_file_name.toLowerCase().endsWith(".pdf") ||
                      selectedApp.resume_url.startsWith("data:application/pdf")) && (
                      <div className="flex items-center gap-1 bg-[#111111] p-1 border border-[#E1E6EB]/10 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setPdfViewerMode("native")}
                          className={`px-2 py-1 text-[10px] font-bold rounded-xl cursor-pointer ${
                            pdfViewerMode === "native"
                              ? "bg-[#81D607] text-[#111111]"
                              : "text-[#9DA4B0]"
                          }`}
                        >
                          Native PDF
                        </button>
                        {!selectedApp.resume_url.startsWith("data:") && (
                          <button
                            type="button"
                            onClick={() => setPdfViewerMode("google")}
                            className={`px-2 py-1 text-[10px] font-bold rounded-xl cursor-pointer ${
                              pdfViewerMode === "google"
                                ? "bg-[#81D607] text-[#111111]"
                                : "text-[#9DA4B0]"
                            }`}
                          >
                            Google Viewer
                          </button>
                        )}
                      </div>
                    )}

                    {/* DOCX Viewer Mode Switcher */}
                    {(selectedApp.resume_file_type === "docx" || selectedApp.resume_file_type === "doc" || selectedApp.resume_file_name.endsWith(".docx")) && (
                      <div className="flex items-center gap-1 bg-[#111111] p-1 border border-[#E1E6EB]/10 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setDocxViewerMode("google")}
                          className={`px-2 py-1 text-[10px] font-bold rounded-xl cursor-pointer ${
                            docxViewerMode === "google"
                              ? "bg-[#81D607] text-[#111111]"
                              : "text-[#9DA4B0]"
                          }`}
                        >
                          Google Viewer
                        </button>
                        <button
                          type="button"
                          onClick={() => setDocxViewerMode("office")}
                          className={`px-2 py-1 text-[10px] font-bold rounded-xl cursor-pointer ${
                            docxViewerMode === "office"
                              ? "bg-[#81D607] text-[#111111]"
                              : "text-[#9DA4B0]"
                          }`}
                        >
                          MS Office Viewer
                        </button>
                      </div>
                    )}

                    <a
                      href={pdfBlobUrl || selectedApp.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] font-bold text-xs flex items-center gap-1.5 rounded-xl cursor-pointer transition-colors"
                      title="Open in new browser tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Tab</span>
                    </a>
                  </div>
                </div>

                {/* Viewport Frame */}
                <div className="flex-1 w-full h-full relative overflow-hidden bg-[#0A0A0A]">
                  {(() => {
                    const rawUrl = selectedApp.resume_url;
                    const displayUrl = pdfBlobUrl || rawUrl;
                    const isPdf =
                      selectedApp.resume_file_type === "pdf" ||
                      selectedApp.resume_file_name.toLowerCase().endsWith(".pdf") ||
                      rawUrl.startsWith("data:application/pdf");

                    if (isPdf) {
                      if (pdfViewerMode === "google" && !rawUrl.startsWith("data:")) {
                        const googlePdfUrl = `https://docs.google.com/gview?url=${encodeURIComponent(rawUrl)}&embedded=true`;
                        return (
                          <iframe
                            src={googlePdfUrl}
                            title={`PDF Preview (Google) - ${selectedApp.full_name}`}
                            className="w-full h-full border-0 block"
                          />
                        );
                      }

                      return (
                        <object
                          data={displayUrl}
                          type="application/pdf"
                          className="w-full h-full border-0 block"
                        >
                          <iframe
                            src={displayUrl}
                            title={`CV Preview - ${selectedApp.full_name}`}
                            className="w-full h-full border-0 block"
                          >
                            <div className="p-8 text-center space-y-4 flex flex-col justify-center items-center h-full text-white">
                              <FileText className="w-12 h-12 text-[#81D607]" />
                              <p className="text-xs text-[#9DA4B0]">
                                PDF preview cannot be embedded inline. Click below to view or download.
                              </p>
                              <a
                                href={displayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-[#81D607] text-[#111111] font-bold text-xs"
                              >
                                Open PDF in New Tab
                              </a>
                            </div>
                          </iframe>
                        </object>
                      );
                    }

                    // DOCX / DOC Viewer
                    if (rawUrl.startsWith("data:")) {
                      return (
                        <div className="p-8 text-center space-y-4 flex flex-col justify-center items-center h-full">
                          <FileText className="w-12 h-12 text-[#81D607]" />
                          <div className="space-y-1 font-mono">
                            <h4 className="text-sm font-bold text-[#E1E6EB]">
                              Word Document (.docx)
                            </h4>
                            <p className="text-xs text-[#9DA4B0] max-w-sm mx-auto">
                              This CV was uploaded as a Word file. Click below to download and view.
                            </p>
                          </div>
                          <a
                            href={rawUrl}
                            download={selectedApp.resume_file_name}
                            className="px-5 py-2.5 bg-[#81D607] text-[#111111] font-mono font-bold text-xs flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Word CV</span>
                          </a>
                        </div>
                      );
                    }

                    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(rawUrl)}&embedded=true`;
                    const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(rawUrl)}`;
                    const embedSrc = docxViewerMode === "office" ? officeViewerUrl : googleViewerUrl;

                    return (
                      <iframe
                        src={embedSrc}
                        title={`DOCX Preview - ${selectedApp.full_name}`}
                        className="w-full h-full border-0 block"
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CANDIDATE APPLICATION CONFIRMATION */}
      {deletingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1A1A] border border-red-500/60 p-6 space-y-4 text-left shadow-2xl rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#111111] border border-red-500 flex items-center justify-center text-red-500 shrink-0 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-mono font-bold text-[#E1E6EB]">Delete Candidate Application</h3>
                <p className="text-[11px] font-mono text-red-400">Action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs font-mono text-[#9DA4B0] leading-relaxed">
              Are you sure you want to delete the application submitted by{" "}
              <span className="text-[#E1E6EB] font-bold">{deletingApp.full_name}</span> ({deletingApp.email}) for position{" "}
              <span className="text-[#81D607] font-semibold">{deletingApp.job_title}</span>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E1E6EB]/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setDeletingApp(null)}
                disabled={isDeletingApp}
                className="px-4 py-2 bg-[#111111] border border-[#E1E6EB]/20 text-[#9DA4B0] hover:text-[#E1E6EB] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteApp}
                disabled={isDeletingApp}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 transition-colors disabled:opacity-50 rounded-xl cursor-pointer"
              >
                {isDeletingApp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
