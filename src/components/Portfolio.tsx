"use client";

import { useState } from "react";
import { ArrowUpRight, Cpu, Globe, Brain, Layers, Smartphone, CheckCircle } from "lucide-react";

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<"All" | "AI/ML" | "Web" | "PCB/Embedded" | "MATLAB" | "Mobile">("All");

  const categories = ["All", "AI/ML", "Web", "PCB/Embedded", "MATLAB", "Mobile"] as const;

  const projects = [
    {
      id: 1,
      title: "Automated Industrial Defect Inspection AI",
      category: "AI/ML",
      impact: "Reduced manual QA inspection time by 45%",
      tags: ["Python", "PyTorch", "OpenCV", "FastAPI"],
      description: "Custom deep learning computer vision model trained to detect micro-cracks in manufacturing hardware in real-time.",
      icon: Brain,
    },
    {
      id: 2,
      title: "IoT Edge Energy Gateway 4-Layer PCB",
      category: "PCB/Embedded",
      impact: "Achieved 99.8% signal integrity in high-noise environments",
      tags: ["KiCad", "STM32", "RS485", "Hardware R&D"],
      description: "Designed compact 4-layer printed circuit board for smart grid power monitoring and wireless telemetry.",
      icon: Cpu,
    },
    {
      id: 3,
      title: "Enterprise SaaS Analytics Platform",
      category: "Web",
      impact: "Handled 100k+ daily API requests with <50ms latency",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      description: "Full-stack web application featuring real-time data visualizers, role-based access, and subscription billing.",
      icon: Globe,
    },
    {
      id: 4,
      title: "MATLAB Motor Control DSP Algorithm",
      category: "MATLAB",
      impact: "Optimized torque response speed by 30%",
      tags: ["MATLAB", "Simulink", "Control Systems", "DSP"],
      description: "Modeled closed-loop field-oriented control (FOC) algorithm for brushless DC motor drive systems.",
      icon: Cpu,
    },
    {
      id: 5,
      title: "Cross-Platform Smart Field Telemetry App",
      category: "Mobile",
      impact: "Streamlined field engineer data sync in offline zones",
      tags: ["React Native", "REST API", "SQLite", "Bluetooth LE"],
      description: "Mobile application connecting via Bluetooth to hardware sensors for real-time field diagnostics.",
      icon: Smartphone,
    },
    {
      id: 6,
      title: "LLM Document Intelligence & OCR Pipeline",
      category: "AI/ML",
      impact: "Automated parsing of 10,000+ legal PDFs monthly",
      tags: ["Python", "LangChain", "OpenAI API", "Docker"],
      description: "Automated information extraction system turning unstructured PDF documents into structured JSON databases.",
      icon: Brain,
    },
  ];

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
          Proof of Work
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB] tracking-tight">
          Selected Portfolio & Case Studies
        </h2>
        <p className="text-base text-[#9DA4B0]">
          Explore representative engineering projects delivered across software engineering, machine learning, dynamic web apps, and KiCad PCB hardware.
        </p>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-mono tracking-wide transition-colors rounded-none ${
                activeCategory === cat
                  ? "bg-[#81D607] text-[#111111] font-bold"
                  : "bg-[#1A1A1A] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all duration-200 flex flex-col justify-between group rounded-none text-left"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#81D607] uppercase tracking-wider px-2 py-0.5 bg-[#111111] border border-[#81D607]/30">
                  {project.category}
                </span>
                <project.icon className="w-5 h-5 text-[#81D607]" />
              </div>

              <h3 className="text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                {project.title}
              </h3>

              <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans">
                {project.description}
              </p>

              {/* Impact Callout */}
              <div className="p-3 bg-[#111111] border-l-2 border-[#81D607] flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#81D607] shrink-0" />
                <span className="text-xs font-semibold text-[#E1E6EB]">
                  {project.impact}
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E1E6EB]/10 space-y-4">
              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 bg-[#111111] text-[#9DA4B0] border border-[#E1E6EB]/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-[#81D607]">
                <span>View Engineering Details</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
