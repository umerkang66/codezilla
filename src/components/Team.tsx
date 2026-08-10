"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Users, Loader2 } from "lucide-react";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  bio?: string;
  avatar_url?: string;
  initials?: string;
  is_founder: boolean;
  linkedin_url?: string;
  github_url?: string;
  x_url?: string;
  display_order?: number;
  status?: string;
}

interface TeamProps {
  initialTeams?: TeamMember[];
}

function LinkedinIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GithubIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  );
}

function XIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Team({ initialTeams }: TeamProps) {
  const [teams, setTeams] = useState<TeamMember[]>(initialTeams || []);
  const [loading, setLoading] = useState<boolean>(!initialTeams);

  useEffect(() => {
    if (initialTeams && initialTeams.length > 0) return;

    async function fetchTeams() {
      try {
        const res = await fetch("/api/teams");
        if (res.ok) {
          const data = await res.json();
          setTeams(data.teams || []);
        }
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, [initialTeams]);

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

  return (
    <section id="team" className="py-12 sm:py-20 bg-[#0D0D0D] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-full">
            Leadership & Engineering Talent
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#E1E6EB] tracking-tight leading-tight">
            Meet the Minds Behind Codzilla
          </h2>
          <p className="text-xs sm:text-sm text-[#9DA4B0]">
            Our multidisciplinary team combines software architects, machine learning researchers, and embedded hardware developers.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#81D607] animate-spin" />
            <p className="font-mono text-xs text-[#9DA4B0]">Loading team members...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && teams.length === 0 && (
          <div className="p-8 sm:p-10 bg-[#1A1A1A] border border-[#E1E6EB]/10 text-center max-w-lg mx-auto space-y-4 rounded-2xl">
            <div className="w-12 h-12 bg-[#111111] border border-[#81D607]/50 flex items-center justify-center text-[#81D607] mx-auto rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-[#E1E6EB]">Our Team is Expanding</h3>
            <p className="text-xs text-[#9DA4B0] leading-relaxed">
              We are currently onboarding world-class engineers, AI researchers, and full-stack developers.
            </p>
            <div className="pt-2">
              <Link
                href="/talent-acquisition"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#81D607] text-[#111111] font-mono text-xs font-bold hover:bg-[#72BE06] transition-colors rounded-xl cursor-pointer"
              >
                <span>Join Our Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Team Grid */}
        {!loading && teams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {teams.map((member) => (
              <div
                key={member.id}
                className={`p-5 sm:p-6 bg-[#1A1A1A] border ${
                  member.is_founder ? "border-[#81D607]" : "border-[#E1E6EB]/10"
                } card-hover-effect text-left flex flex-col justify-between group rounded-2xl relative overflow-hidden`}
              >
                {member.is_founder && (
                  <div className="absolute top-0 right-0 bg-[#81D607] text-[#111111] text-[10px] font-extrabold uppercase px-2.5 py-1 font-mono rounded-bl-xl">
                    Founder Spotlight
                  </div>
                )}

                <div className="space-y-4">
                  {/* Avatar Box / Image */}
                  {member.avatar_url ? (
                    <div className="w-16 h-16 bg-[#111111] border border-[#81D607]/60 overflow-hidden group-hover:border-[#81D607] transition-colors rounded-full shrink-0">
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] text-xl font-bold font-mono rounded-full group-hover:border-[#81D607] transition-colors shrink-0">
                      {getInitials(member)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-mono text-[#81D607] uppercase tracking-wide">
                      {member.role}
                    </p>
                  </div>

                  {member.specialty && (
                    <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans border-t border-[#E1E6EB]/10 pt-3">
                      {member.specialty}
                    </p>
                  )}
                </div>

                {/* Social Links */}
                {(member.linkedin_url || member.github_url || member.x_url) && (
                  <div className="pt-4 mt-6 border-t border-[#E1E6EB]/10 flex items-center gap-2 flex-wrap">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                        className="px-2.5 py-1 bg-[#111111] border border-[#E1E6EB]/15 text-[11px] font-mono text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors inline-flex items-center gap-1.5 rounded-md cursor-pointer"
                      >
                        <LinkedinIcon className="w-3 h-3 text-[#81D607]" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {member.github_url && (
                      <a
                        href={member.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} GitHub`}
                        className="px-2.5 py-1 bg-[#111111] border border-[#E1E6EB]/15 text-[11px] font-mono text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors inline-flex items-center gap-1.5 rounded-md cursor-pointer"
                      >
                        <GithubIcon className="w-3 h-3 text-[#81D607]" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {member.x_url && (
                      <a
                        href={member.x_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} X`}
                        className="px-2.5 py-1 bg-[#111111] border border-[#E1E6EB]/15 text-[11px] font-mono text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors inline-flex items-center gap-1.5 rounded-md cursor-pointer"
                      >
                        <XIcon className="w-3 h-3 text-[#81D607]" />
                        <span>X</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Bar / Link to Separate Team Page */}
        <div className="mt-12 text-center">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs transition-colors rounded-xl cursor-pointer"
          >
            <span>Explore Full Team Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
