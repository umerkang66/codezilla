"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Code2,
  Briefcase,
  Search,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  User,
  Mail,
  Phone,
  Globe,
  Share2,
} from "lucide-react";

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
}

interface TalentAcquisitionClientProps {
  initialJobs?: JobPosting[];
}

export default function TalentAcquisitionClient({
  initialJobs = [],
}: TalentAcquisitionClientProps) {
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
  const [loading, setLoading] = useState<boolean>(initialJobs.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch jobs dynamically client-side if initial empty or for live refresh
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/talent-acquisition/jobs");
        if (res.ok) {
          const data = await res.json();
          if (data.jobs) {
            setJobs(data.jobs);
          }
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  // Filter jobs based on search query & selected domain
  const domains = [
    "All",
    ...Array.from(new Set(jobs.map((j) => j.domain).filter(Boolean))),
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.skills || []).some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDomain =
      selectedDomain === "All" || job.domain === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  const handleOpenApplyModal = (job: JobPosting) => {
    setSelectedJob(job);
    setSubmitError("");
    setSubmitSuccess(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setPortfolioUrl("");
    setLinkedinUrl("");
    setCoverLetter("");
    setResumeFile(null);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setSelectedJob(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["pdf", "docx", "doc"].includes(ext || "")) {
        setSubmitError("Please upload a PDF (.pdf) or Word (.docx, .doc) file.");
        return;
      }
      setSubmitError("");
      setResumeFile(file);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!fullName.trim() || !email.trim()) {
      setSubmitError("Please enter your full name and email address.");
      return;
    }

    if (!resumeFile) {
      setSubmitError("Please attach your CV / Resume file (.pdf or .docx).");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("jobId", selectedJob.id);
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("portfolioUrl", portfolioUrl);
      formData.append("linkedinUrl", linkedinUrl);
      formData.append("coverLetter", coverLetter);
      formData.append("resumeFile", resumeFile);

      const res = await fetch("/api/talent-acquisition/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.");
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Icon helper based on domain / title
  const getJobIcon = (domain: string, title: string) => {
    if (
      domain.toLowerCase().includes("ai") ||
      title.toLowerCase().includes("ai")
    ) {
      return Brain;
    }
    if (
      domain.toLowerCase().includes("web") ||
      title.toLowerCase().includes("developer")
    ) {
      return Code2;
    }
    return Briefcase;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* Header Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] font-mono text-xs font-semibold uppercase tracking-wider">
          Talent Acquisition
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB] tracking-tight">
          Available Positions
        </h1>
        <p className="text-sm sm:text-base text-[#9DA4B0]">
          Join Codzilla Technologies. Work on high-impact commercial software, AI models, and embedded engineering projects.
        </p>
      </div>

      <div className="space-y-8">
        {/* Controls Bar: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#1A1A1A] border border-[#E1E6EB]/10">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9DA4B0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by position title, domain, or required skills..."
              className="w-full bg-[#111111] border border-[#E1E6EB]/15 pl-10 pr-4 py-2 text-xs font-mono text-[#E1E6EB] placeholder-[#9DA4B0]/60 focus:outline-none focus:border-[#81D607]"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {domains.map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-2 text-xs font-mono font-bold transition-colors ${
                  selectedDomain === dom
                    ? "bg-[#81D607] text-[#111111]"
                    : "bg-[#111111] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607]"
                }`}
              >
                {dom === "All" ? `All Positions (${jobs.length})` : dom}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#81D607] mx-auto" />
            <p className="text-xs font-mono text-[#9DA4B0]">Loading available job postings...</p>
          </div>
        )}

        {/* Empty Search / No Data Results */}
        {!loading && filteredJobs.length === 0 && (
          <div className="p-12 bg-[#1A1A1A] border border-[#E1E6EB]/10 text-center space-y-4">
            <div className="w-12 h-12 bg-[#111111] border border-[#81D607]/40 flex items-center justify-center text-[#81D607] mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-[#E1E6EB]">
              {jobs.length === 0 ? "No Job Openings Listed Yet" : "No Matching Openings Found"}
            </h3>
            <p className="text-xs text-[#9DA4B0] max-w-md mx-auto leading-relaxed">
              {jobs.length === 0
                ? "We currently do not have any active position listings. Check back soon!"
                : "Try adjusting your search criteria or domain filter options to view available positions."}
            </p>
            {jobs.length > 0 && (searchQuery || selectedDomain !== "All") && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDomain("All");
                  }}
                  className="px-4 py-2 bg-[#81D607] text-[#111111] font-mono text-xs font-bold hover:bg-[#72BE06] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Grid of Job Cards */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const IconComp = getJobIcon(job.domain, job.title);
              return (
                <div
                  key={job.id}
                  className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all flex flex-col justify-between group relative"
                >
                  {job.type && (
                    <div className="absolute top-0 right-0 bg-[#81D607] text-[#111111] text-[10px] font-mono font-extrabold uppercase px-2.5 py-1">
                      {job.type}
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Icon Box + Basic Info Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] shrink-0 group-hover:border-[#81D607] transition-colors">
                        <IconComp className="w-8 h-8" />
                      </div>

                      <div className="space-y-1 min-w-0 pr-12">
                        <h3 className="text-xl font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors line-clamp-2">
                          {job.title}
                        </h3>
                        <p className="text-xs font-mono text-[#81D607] uppercase tracking-wide truncate">
                          {job.domain}
                        </p>
                      </div>
                    </div>

                    {/* Tech Stack / Skills Box */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="pt-2 border-t border-[#E1E6EB]/10">
                        <div className="text-[10px] font-mono uppercase text-[#9DA4B0] mb-1">
                          Required Tech Stack
                        </div>
                        <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#111111] border border-[#E1E6EB]/10">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] font-mono px-2 py-0.5 bg-[#1A1A1A] text-[#E1E6EB] border border-[#E1E6EB]/10"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Job Description */}
                    {job.description && (
                      <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans line-clamp-3">
                        {job.description}
                      </p>
                    )}
                  </div>

                  {/* Apply Button Footer */}
                  <div className="pt-4 mt-6 border-t border-[#E1E6EB]/10">
                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(job)}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#E1E6EB]/15 text-xs font-mono font-bold text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <span>Apply For Position</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#81D607]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CANDIDATE APPLICATION MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#1A1A1A] border border-[#81D607]/60 shadow-2xl p-6 sm:p-8 space-y-6 my-8 rounded-none text-left">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-2 text-[#9DA4B0] hover:text-[#E1E6EB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 bg-[#111111] border-2 border-[#81D607] flex items-center justify-center text-[#81D607] mx-auto rounded-none">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 bg-[#81D607]/20 border border-[#81D607]/40 text-[#81D607] text-[10px] font-mono uppercase font-bold">
                    Application Received
                  </span>
                  <h3 className="text-2xl font-mono font-bold text-[#E1E6EB]">
                    Thank You for Applying!
                  </h3>
                  <p className="text-xs text-[#9DA4B0] max-w-md mx-auto leading-relaxed">
                    Your application for <span className="text-[#81D607] font-semibold">{selectedJob.title}</span> has been submitted. Our engineering team will review your CV and contact you at <span className="text-[#E1E6EB]">{email}</span>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 bg-[#81D607] text-[#111111] font-mono font-bold text-xs rounded-none hover:bg-[#72BE06] transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="space-y-2 border-b border-[#E1E6EB]/10 pb-4 pr-8">
                  <span className="px-2.5 py-0.5 bg-[#111111] border border-[#81D607]/40 text-[#81D607] font-mono text-[10px] uppercase font-bold">
                    {selectedJob.domain}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-mono font-extrabold text-[#E1E6EB]">
                    Apply for {selectedJob.title}
                  </h2>
                  <p className="text-xs text-[#9DA4B0]">
                    Complete the form below and attach your CV (.pdf or .docx).
                  </p>
                </div>

                {/* Submit Error Banner */}
                {submitError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/60 text-red-400 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Application Form */}
                <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[#9DA4B0] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#81D607]" />
                        <span>Full Name <span className="text-red-400">*</span></span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[#9DA4B0] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#81D607]" />
                        <span>Email Address <span className="text-red-400">*</span></span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[#9DA4B0] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#81D607]" />
                        <span>Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 234 567 890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                      />
                    </div>

                    {/* Portfolio / GitHub */}
                    <div className="space-y-1.5">
                      <label className="text-[#9DA4B0] flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#81D607]" />
                        <span>Portfolio / GitHub</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-1.5">
                      <label className="text-[#9DA4B0] flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-[#81D607]" />
                        <span>LinkedIn Profile</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607]"
                      />
                    </div>
                  </div>

                  {/* Cover Letter / Message */}
                  <div className="space-y-1.5">
                    <label className="text-[#9DA4B0]">Cover Letter / Brief Introduction</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us briefly about your background and experience..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full p-2.5 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] focus:outline-none focus:border-[#81D607] font-sans text-xs"
                    ></textarea>
                  </div>

                  {/* CV / Resume File Upload (.pdf, .docx) */}
                  <div className="space-y-1.5">
                    <label className="text-[#9DA4B0] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#81D607]" />
                      <span>CV / Resume Attachment (.pdf, .docx) <span className="text-red-400">*</span></span>
                    </label>

                    <div className="relative border-2 border-dashed border-[#81D607]/40 hover:border-[#81D607] p-4 bg-[#111111] text-center transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {resumeFile ? (
                        <div className="flex items-center justify-center gap-3 text-[#81D607]">
                          <FileText className="w-5 h-5" />
                          <div className="text-left font-mono">
                            <p className="font-bold text-xs text-[#E1E6EB] truncate max-w-xs">
                              {resumeFile.name}
                            </p>
                            <span className="text-[10px] text-[#9DA4B0]">
                              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-[#81D607] ml-2" />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-6 h-6 text-[#81D607] mx-auto" />
                          <p className="text-xs text-[#E1E6EB] font-bold">
                            Click or drag file to attach CV
                          </p>
                          <p className="text-[10px] text-[#9DA4B0]">
                            Supported formats: PDF (.pdf), Word (.docx, .doc)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E1E6EB]/10">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                      className="px-4 py-2.5 bg-[#111111] border border-[#E1E6EB]/20 text-[#9DA4B0] hover:text-[#E1E6EB] font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[#81D607] hover:bg-[#72BE06] text-[#111111] font-mono font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
