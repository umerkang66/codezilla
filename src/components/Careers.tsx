"use client";

import { ArrowRight, Briefcase, Users, Code2, Cpu, Brain } from "lucide-react";

export default function Careers() {
  const openRoles = [
    {
      title: "AI & Computer Vision Researcher",
      type: "Remote / Project-Based",
      domain: "AI / ML Engineering",
      icon: Brain,
      skills: ["PyTorch", "OpenCV", "YOLO", "FastAPI"],
    },
    {
      title: "KiCad PCB Layout Engineer",
      type: "Remote / Part-Time",
      domain: "Hardware & Embedded",
      icon: Cpu,
      skills: ["KiCad", "STM32", "Signal Integrity", "BOM Routing"],
    },
    {
      title: "Full-Stack Next.js Developer",
      type: "Remote / Project-Based",
      domain: "Web Development",
      icon: Code2,
      skills: ["Next.js", "TypeScript", "Tailwind CSS", "REST APIs"],
    },
  ];

  return (
    <section id="careers" className="py-20 bg-[#0D0D0D] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
            Talent Acquisition
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB] tracking-tight">
            Join Codzilla — Learn & Earn on Real Engineering Work
          </h2>
          <p className="text-base text-[#9DA4B0]">
            We recruit student developers, hardware tinkerers, and AI researchers. Get paid per project contribution while engineering commercial client software & PCB systems.
          </p>
        </div>

        {/* Roles List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {openRoles.map((role, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all duration-200 flex flex-col justify-between group rounded-none"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] rounded-none">
                    <role.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 bg-[#111111] text-[#81D607] border border-[#81D607]/30">
                    {role.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                  {role.title}
                </h3>

                <p className="text-xs font-mono text-[#9DA4B0]">
                  Domain: <span className="text-[#E1E6EB]">{role.domain}</span>
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {role.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono px-2 py-0.5 bg-[#111111] text-[#9DA4B0] border border-[#E1E6EB]/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E1E6EB]/10">
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#111111] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs transition-colors rounded-none"
                >
                  <span>Apply For Role</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
