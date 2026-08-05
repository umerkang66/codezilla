"use client";

import { Check, ArrowRight, Sparkles } from "lucide-react";

export default function Pricing() {
  const tiers = [
    {
      name: "Starter Package",
      subtitle: "For early prototypes & single-layer PCB / Landing Web Apps",
      price: "$499",
      period: "Starting price",
      featured: false,
      features: [
        "2-Layer KiCad PCB Layout OR Single Page Next.js Web App",
        "Schematic Capture & Bill of Materials (BOM)",
        "Fully Responsive & Mobile Optimized",
        "Basic Contact Form & API Integration",
        "1 Round of Revisions Included",
        "7 Days Post-Launch Support",
      ],
      ctaText: "Choose Starter",
    },
    {
      name: "Standard Commercial",
      subtitle: "For full-stack web applications & complex 4-layer PCBs",
      price: "$1,499",
      period: "Starting price",
      featured: true,
      features: [
        "4-Layer High-Density KiCad PCB OR Full Next.js Web Platform",
        "Signal Integrity & Power Distribution Network (PDN)",
        "Database Architecture & RESTful API Microservices",
        "Custom UI/UX Theme & Admin Dashboard",
        "Automated CI/CD Pipeline Setup",
        "30 Days Post-Launch SLA Support",
      ],
      ctaText: "Choose Standard",
    },
    {
      name: "Enterprise & AI Hardware",
      subtitle: "For custom AI/ML model training, edge hardware & scale",
      price: "$3,499",
      period: "Starting price",
      featured: false,
      features: [
        "Custom Neural Network Training (Computer Vision / NLP / LLMs)",
        "Multi-Board Hardware Ecosystem & Firmware Development",
        "High-Availability Cloud Server Infrastructure Setup",
        "Hardware-in-the-Loop (HIL) & MATLAB Simulation",
        "Complete Source Code & Intellectual Property Handover",
        "90 Days Priority Support & Maintenance",
      ],
      ctaText: "Choose Enterprise",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-[#0D0D0D] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
            Transparent Investment
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB] tracking-tight">
            Flexible Engineering Packages
          </h2>
          <p className="text-base text-[#9DA4B0]">
            Fixed transparent pricing tailored for web development, PCB electronic layout, and custom artificial intelligence deployment.
          </p>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-8 bg-[#1A1A1A] border ${
                tier.featured
                  ? "border-[#81D607] shadow-xl"
                  : "border-[#E1E6EB]/10 hover:border-[#81D607]/60"
              } transition-all duration-200 flex flex-col justify-between text-left rounded-none relative`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-0 bg-[#81D607] text-[#111111] text-[10px] font-extrabold uppercase px-3 py-1 font-mono">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#E1E6EB] mb-1">{tier.name}</h3>
                  <p className="text-xs text-[#9DA4B0] font-sans leading-relaxed">{tier.subtitle}</p>
                </div>

                <div className="flex items-baseline gap-2 pt-2 border-t border-[#E1E6EB]/10">
                  <span className="text-4xl font-extrabold text-[#81D607] font-mono">{tier.price}</span>
                  <span className="text-xs text-[#9DA4B0] font-mono">{tier.period}</span>
                </div>

                {/* Feature List */}
                <ul className="space-y-3 pt-2 font-sans text-xs">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-[#E1E6EB]">
                      <Check className="w-4 h-4 text-[#81D607] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-8 border-t border-[#E1E6EB]/10">
                <a
                  href="#contact"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 font-mono font-bold text-xs rounded-none transition-colors ${
                    tier.featured
                      ? "bg-[#81D607] text-[#111111] hover:bg-[#72BE06]"
                      : "bg-[#111111] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607] hover:text-[#81D607]"
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bespoke Custom Quote Callout */}
        <div className="mt-12 p-6 bg-[#1A1A1A] border border-[#81D607]/40 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-none text-left">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#E1E6EB]">Need a Custom Engineering Solution?</h4>
            <p className="text-xs text-[#9DA4B0]">
              Have a multi-board hardware project, enterprise LLM pipeline, or unique scope? We build custom tailored proposals.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#81D607] text-[#111111] font-mono font-bold text-xs shrink-0 hover:bg-[#72BE06] transition-colors rounded-none"
          >
            <span>Request Custom Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
