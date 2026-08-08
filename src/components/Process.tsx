"use client";

import { MessageSquare, FileCode, Code, CheckSquare, Rocket } from "lucide-react";

export default function Process() {
  const steps = [
    {
      number: "01",
      title: "Discovery Call & Requirements",
      description: "We align on your project goals, technical constraints, NDA signing, and target deliverables.",
      duration: "1–2 Days",
      icon: MessageSquare,
    },
    {
      number: "02",
      title: "Proposal & Architecture Planning",
      description: "Our technical leads define the tech stack, schematic layout, milestones, and fixed-price quote.",
      duration: "2–3 Days",
      icon: FileCode,
    },
    {
      number: "03",
      title: "Agile Development & Prototyping",
      description: "Continuous sprints across software engineering, AI model training, or KiCad PCB layout routing.",
      duration: "Sprint Based",
      icon: Code,
    },
    {
      number: "04",
      title: "Testing & Quality Assurance",
      description: "Rigorous unit testing, hardware signal integrity verification, performance benchmarks, and code review.",
      duration: "Parallel QA",
      icon: CheckSquare,
    },
    {
      number: "05",
      title: "Delivery, Deployment & Support",
      description: "Final production release, full source code / hardware files handover, and ongoing technical support.",
      duration: "Continuous",
      icon: Rocket,
    },
  ];

  return (
    <section id="process" className="py-12 sm:py-20 bg-[#0D0D0D] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
            Proven Workflow
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#E1E6EB] tracking-tight leading-tight">
            How We Work — Step by Step
          </h2>
          <p className="text-xs sm:text-sm text-[#9DA4B0]">
            Our structured engineering process ensures complete transparency, on-time delivery, and zero unexpected technical surprises.
          </p>
        </div>

        {/* Process Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all duration-200 flex flex-col justify-between text-left group rounded-none relative"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#81D607] font-mono">
                    {step.number}
                  </span>
                  <div className="w-8 h-8 bg-[#111111] border border-[#E1E6EB]/10 flex items-center justify-center text-[#81D607] rounded-none">
                    <step.icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 mt-5 sm:mt-6 border-t border-[#E1E6EB]/10 flex items-center justify-between text-[11px] font-mono text-[#9DA4B0]">
                <span>Est. Duration:</span>
                <span className="text-[#81D607] font-semibold">{step.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
