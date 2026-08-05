"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Brain, Code2 } from "lucide-react";

export default function TalentAcquisitionClient() {
  const jobs = [
    {
      id: "ai-vision-researcher",
      title: "AI & Computer Vision Researcher",
      type: "Remote / Project-Based",
      domain: "AI / ML Engineering",
      icon: Brain,
      description:
        "Train, fine-tune, and deploy computer vision models, object detection pipelines, and high-performance inference APIs.",
      skills: ["PyTorch", "OpenCV", "YOLO", "FastAPI"],
    },
    {
      id: "fullstack-nextjs-developer",
      title: "Full-Stack Next.js Developer",
      type: "Remote / Project-Based",
      domain: "Web Development",
      icon: Code2,
      description:
        "Architect dynamic, responsive web applications using Next.js, TypeScript, Tailwind CSS, and REST/GraphQL APIs.",
      skills: ["Next.js", "TypeScript", "Tailwind CSS", "REST APIs"],
    },
  ];

  return (
    <main className="min-h-screen py-16 pt-28 bg-[#111111] text-[#E1E6EB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#81D607] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-mono font-semibold uppercase tracking-wider rounded-none">
            Talent Acquisition
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB] tracking-tight">
            Available Positions
          </h1>
          <p className="text-base text-[#9DA4B0]">
            Join Codzilla Technologies. Work on commercial software & engineering projects.
          </p>
        </div>

        {/* Static Jobs List (2 Jobs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {jobs.map((job) => {
            const IconComp = job.icon;
            return (
              <div
                key={job.id}
                className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all duration-200 flex flex-col justify-between group rounded-none"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] rounded-none">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 bg-[#111111] text-[#81D607] border border-[#81D607]/30">
                      {job.type}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                    {job.title}
                  </h2>

                  <p className="text-xs font-mono text-[#9DA4B0]">
                    Domain: <span className="text-[#E1E6EB]">{job.domain}</span>
                  </p>

                  <p className="text-xs text-[#9DA4B0] leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.skills.map((skill) => (
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
                  <button
                    type="button"
                    onClick={() => {}}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#111111] border border-[#81D607]/40 text-[#81D607] hover:bg-[#81D607] hover:text-[#111111] font-mono font-bold text-xs transition-colors rounded-none"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
