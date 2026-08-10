"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  ArrowRight,
} from "lucide-react";
import { TeamMember } from "@/components/Team";

interface TeamClientProps {
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

export default function TeamClient({ initialTeams }: TeamClientProps) {
  const [teams] = useState<TeamMember[]>(initialTeams);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "founders" | "engineers">("all");

  const getInitials = (member: TeamMember) => {
    if (member.initials && member.initials.trim()) return member.initials.toUpperCase();
    if (!member.name) return "CZ";
    return member.name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const filteredTeams = teams.filter((member) => {
    const matchesQuery =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.specialty && member.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.bio && member.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterRole === "founders") {
      return matchesQuery && member.is_founder;
    }
    if (filterRole === "engineers") {
      return matchesQuery && !member.is_founder;
    }
    return matchesQuery;
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
            placeholder="Search by name, role, or technical domain..."
            className="w-full bg-[#111111] border border-[#E1E6EB]/15 pl-10 pr-4 py-2 text-xs font-mono text-[#E1E6EB] placeholder-[#9DA4B0]/60 focus:outline-none focus:border-[#81D607] rounded-xl"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterRole("all")}
            className={`px-3 py-2 text-xs font-mono font-bold transition-colors cursor-pointer rounded-xl ${
              filterRole === "all"
                ? "bg-[#81D607] text-[#111111]"
                : "bg-[#111111] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607]"
            }`}
          >
            All Members ({teams.length})
          </button>

          <button
            onClick={() => setFilterRole("founders")}
            className={`px-3 py-2 text-xs font-mono font-bold transition-colors cursor-pointer rounded-xl ${
              filterRole === "founders"
                ? "bg-[#81D607] text-[#111111]"
                : "bg-[#111111] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607]"
            }`}
          >
            Leadership
          </button>

          <button
            onClick={() => setFilterRole("engineers")}
            className={`px-3 py-2 text-xs font-mono font-bold transition-colors cursor-pointer rounded-xl ${
              filterRole === "engineers"
                ? "bg-[#81D607] text-[#111111]"
                : "bg-[#111111] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607]"
            }`}
          >
            Engineers
          </button>
        </div>
      </div>

      {/* Empty Search / No Data Results */}
      {filteredTeams.length === 0 && (
        <div className="p-12 bg-[#1A1A1A] border border-[#E1E6EB]/10 text-center space-y-4 rounded-2xl">
          <div className="w-12 h-12 bg-[#111111] border border-[#81D607]/40 flex items-center justify-center text-[#81D607] mx-auto rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-mono text-[#E1E6EB]">
            {teams.length === 0 ? "No Team Members Listed Yet" : "No Matching Team Members Found"}
          </h3>
          <p className="text-xs text-[#9DA4B0] max-w-md mx-auto leading-relaxed">
            {teams.length === 0
              ? "The admin team has not added team members to the directory yet. Check back soon!"
              : "Try adjusting your search criteria or filter options to view available team members."}
          </p>
          {teams.length === 0 && (
            <div className="pt-2">
              <Link
                href="/talent-acquisition"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#81D607] text-[#111111] font-mono text-xs font-bold hover:bg-[#72BE06] transition-colors rounded-xl cursor-pointer"
              >
                <span>Join Our Engineering Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Grid of Team Member Cards */}
      {filteredTeams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((member) => (
            <div
              key={member.id}
              className={`p-6 bg-[#1A1A1A] border ${
                member.is_founder ? "border-[#81D607]" : "border-[#E1E6EB]/10"
              } hover:border-[#81D607] transition-all flex flex-col justify-between group relative rounded-2xl overflow-hidden`}
            >
              {member.is_founder && (
                <div className="absolute top-0 right-0 bg-[#81D607] text-[#111111] text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-bl-xl">
                  Leadership / Founder
                </div>
              )}

              <div className="space-y-5">
                {/* Avatar Box + Basic Info Header */}
                <div className="flex items-start gap-4">
                  {member.avatar_url ? (
                    <div className="w-20 h-20 bg-[#111111] border border-[#81D607]/60 overflow-hidden shrink-0 group-hover:border-[#81D607] transition-colors rounded-full">
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] text-lg font-bold font-mono shrink-0 group-hover:border-[#81D607] transition-colors rounded-full">
                      {getInitials(member)}
                    </div>
                  )}

                  <div className="space-y-1 min-w-0 pr-12">
                    <h3 className="text-base sm:text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs font-mono text-[#81D607] uppercase tracking-wide truncate">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Specialty Badge */}
                {member.specialty && (
                  <div className="pt-2 border-t border-[#E1E6EB]/10">
                    <div className="text-[10px] font-mono uppercase text-[#9DA4B0] mb-1">
                      Technical Domain & Focus
                    </div>
                    <p className="text-xs font-mono text-[#E1E6EB] bg-[#111111] p-2.5 border border-[#E1E6EB]/10 rounded-xl">
                      {member.specialty}
                    </p>
                  </div>
                )}

                {/* Bio / Description */}
                {member.bio && (
                  <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Social Links Footer */}
              {(member.linkedin_url || member.github_url || member.x_url) && (
                <div className="pt-4 mt-6 border-t border-[#E1E6EB]/10 flex items-center gap-2 flex-wrap">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#111111] border border-[#E1E6EB]/15 text-xs font-mono text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors inline-flex items-center gap-1.5 rounded-lg cursor-pointer"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5 text-[#81D607]" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#111111] border border-[#E1E6EB]/15 text-xs font-mono text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors inline-flex items-center gap-1.5 rounded-lg cursor-pointer"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-[#81D607]" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {member.x_url && (
                    <a
                      href={member.x_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#111111] border border-[#E1E6EB]/15 text-xs font-mono text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors inline-flex items-center gap-1.5 rounded-lg cursor-pointer"
                    >
                      <XIcon className="w-3.5 h-3.5 text-[#81D607]" />
                      <span>X</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
