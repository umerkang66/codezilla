"use client";

import { Code2, Cpu, Brain, Layers } from "lucide-react";

export default function Team() {
  const teamMembers = [
    {
      name: "Muhammad Ahmed (Pasha)",
      role: "Founder & CEO",
      specialty: "PCB/Embedded Engineering & AI Systems",
      initials: "MA",
      isFounder: true,
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    {
      name: "Ali Hassan",
      role: "Lead Full-Stack Architect",
      specialty: "Next.js, Cloud Services & API Systems",
      initials: "AH",
      isFounder: false,
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    {
      name: "Usman Tariq",
      role: "Senior AI / ML Engineer",
      specialty: "Computer Vision, PyTorch & Automation",
      initials: "UT",
      isFounder: false,
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    {
      name: "Hamza Raza",
      role: "Embedded Hardware Lead",
      specialty: "KiCad PCB Layout & DSP Simulation",
      initials: "HR",
      isFounder: false,
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
  ];

  return (
    <section id="team" className="py-20 bg-[#0D0D0D] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
            Leadership & Engineering Talent
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB] tracking-tight">
            Meet the Minds Behind Codzilla
          </h2>
          <p className="text-base text-[#9DA4B0]">
            Our multidisciplinary team combines software architects, machine learning researchers, and embedded hardware developers.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className={`p-6 bg-[#1A1A1A] border ${
                member.isFounder ? "border-[#81D607]" : "border-[#E1E6EB]/10"
              } hover:border-[#81D607] transition-all duration-200 text-left flex flex-col justify-between group rounded-none relative`}
            >
              {member.isFounder && (
                <div className="absolute top-0 right-0 bg-[#81D607] text-[#111111] text-[10px] font-extrabold uppercase px-2.5 py-1">
                  Founder Spotlight
                </div>
              )}

              <div className="space-y-4">
                {/* Avatar Box */}
                <div className="w-16 h-16 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] text-xl font-bold font-mono rounded-none group-hover:border-[#81D607] transition-colors">
                  {member.initials}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-[#81D607] uppercase tracking-wide">
                    {member.role}
                  </p>
                </div>

                <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans border-t border-[#E1E6EB]/10 pt-3">
                  {member.specialty}
                </p>
              </div>

              {/* Social Links */}
              <div className="pt-4 mt-6 border-t border-[#E1E6EB]/10 flex items-center gap-3">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  className="px-2.5 py-1 bg-[#111111] border border-[#E1E6EB]/15 text-[11px] font-mono text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} GitHub`}
                  className="px-2.5 py-1 bg-[#111111] border border-[#E1E6EB]/15 text-[11px] font-mono text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
