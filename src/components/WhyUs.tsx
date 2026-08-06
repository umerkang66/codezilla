"use client";

import { Clock, ShieldCheck, DollarSign, Headset, Cpu, MessageSquare } from "lucide-react";

export default function WhyUs() {
  const usps = [
    {
      icon: Clock,
      title: "On-Time Delivery Guarantee",
      description: "We work with strict milestone commitments. Your project ships on schedule, backed by sprint planning.",
      metric: "99% Milestone Punctuality",
    },
    {
      icon: ShieldCheck,
      title: "Rigorous Quality Assurance",
      description: "Automated linting, unit test coverage, and hardware signal validation ensure bulletproof code.",
      metric: "100% Code Quality Check",
    },
    {
      icon: DollarSign,
      title: "Transparent Fixed Pricing",
      description: "Clear architectural proposals upfront with zero hidden fees or unexpected end-of-project surprises.",
      metric: "Fixed-Price Proposals",
    },
    {
      icon: Headset,
      title: "Dedicated Post-Launch Support",
      description: "We don't vanish after release. Enjoy continuous technical maintenance and SLA SLA guarantees.",
      metric: "24/7 SLA Technical Cover",
    },
    {
      icon: Cpu,
      title: "Cross-Domain Expertise",
      description: "Unified capabilities across full-stack web, machine learning models, and KiCad PCB hardware.",
      metric: "Software + AI + Hardware",
    },
    {
      icon: MessageSquare,
      title: "Direct Founder Communication",
      description: "No middle managers or telephone games. Communicate directly with lead engineers and project founders.",
      metric: "Direct Engineer Line",
    },
  ];

  return (
    <section id="why-us" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
        <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
          Why Choose Codzilla
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#E1E6EB] tracking-tight leading-tight">
          What Sets Us Apart From Traditional Software Houses
        </h2>
        <p className="text-sm sm:text-lg text-[#9DA4B0]">
          We combine technical rigor, cross-domain hardware-software engineering, and direct founder communication to deliver commercial success.
        </p>
      </div>

      {/* USPs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {usps.map((usp, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all duration-200 text-left flex flex-col justify-between group rounded-none"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] group-hover:border-[#81D607] transition-colors rounded-none">
                <usp.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                {usp.title}
              </h3>

              <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans">
                {usp.description}
              </p>
            </div>

            <div className="pt-4 mt-5 sm:mt-6 border-t border-[#E1E6EB]/10">
              <span className="text-[10px] sm:text-[11px] font-mono text-[#81D607] uppercase tracking-wide">
                {usp.metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
