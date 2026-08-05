"use client";

import { CheckCircle2, ShieldCheck, Target, Award, Users, Globe2, Briefcase } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Visual Card / Stats Grid */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1A1A1A] border border-[#E1E6EB]/15 p-8 rounded-none space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#81D607] uppercase tracking-wider">
                Who We Are
              </span>
              <h3 className="text-2xl font-bold text-[#E1E6EB]">
                Codzilla Technologies
              </h3>
              <p className="text-xs text-[#9DA4B0] leading-relaxed">
                Founded with a vision to merge multi-domain expertise in AI, software engineering, and hardware PCB prototyping.
              </p>
            </div>

            {/* Mission Box */}
            <div className="p-4 bg-[#111111] border-l-2 border-[#81D607]">
              <div className="text-xs text-[#9DA4B0] uppercase font-mono mb-1">Our Core Mission</div>
              <p className="text-sm font-semibold text-[#E1E6EB] italic">
                &ldquo;To create opportunities through skills, not just software.&rdquo;
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E1E6EB]/10 text-center">
              <div className="p-3 bg-[#111111] border border-[#E1E6EB]/10">
                <Briefcase className="w-5 h-5 text-[#81D607] mx-auto mb-1" />
                <div className="text-lg font-bold text-[#E1E6EB]">50+</div>
                <div className="text-[10px] text-[#9DA4B0] uppercase">Projects</div>
              </div>

              <div className="p-3 bg-[#111111] border border-[#E1E6EB]/10">
                <Globe2 className="w-5 h-5 text-[#81D607] mx-auto mb-1" />
                <div className="text-lg font-bold text-[#E1E6EB]">5+</div>
                <div className="text-[10px] text-[#9DA4B0] uppercase">Countries</div>
              </div>

              <div className="p-3 bg-[#111111] border border-[#E1E6EB]/10">
                <Users className="w-5 h-5 text-[#81D607] mx-auto mb-1" />
                <div className="text-lg font-bold text-[#E1E6EB]">10+</div>
                <div className="text-[10px] text-[#9DA4B0] uppercase">Engineers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Origin Story & Core Philosophy */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
            About Our Company
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E1E6EB] tracking-tight">
            Bridging Software, Artificial Intelligence & Hardware Engineering
          </h2>

          <p className="text-base text-[#9DA4B0] leading-relaxed">
            Codzilla Technologies was built by engineers passionate about solving real-world technical problems. Unlike traditional agencies that focus solely on web design, we possess deep technical capabilities spanning machine learning models, cloud systems, and physical circuit design.
          </p>

          <p className="text-base text-[#9DA4B0] leading-relaxed">
            Whether you are an early-stage startup needing a complete prototype or an established business seeking to automate complex operations with AI, our dedicated engineering team delivers reliable, scalable solutions on schedule.
          </p>

          {/* Key Value Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3 p-3 bg-[#1A1A1A] border border-[#E1E6EB]/10">
              <ShieldCheck className="w-5 h-5 text-[#81D607] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#E1E6EB]">Direct Communication</h4>
                <p className="text-xs text-[#9DA4B0]">Speak directly with lead developers & project founders.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#1A1A1A] border border-[#E1E6EB]/10">
              <Target className="w-5 h-5 text-[#81D607] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#E1E6EB]">Quality & Compliance</h4>
                <p className="text-xs text-[#9DA4B0]">Rigorous testing, linting, and industry standards.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#1A1A1A] border border-[#E1E6EB]/10">
              <Award className="w-5 h-5 text-[#81D607] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#E1E6EB]">Cross-Domain Skills</h4>
                <p className="text-xs text-[#9DA4B0]">Unified expertise in AI, Web apps, MATLAB & PCB design.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#1A1A1A] border border-[#E1E6EB]/10">
              <CheckCircle2 className="w-5 h-5 text-[#81D607] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#E1E6EB]">Post-Launch Support</h4>
                <p className="text-xs text-[#9DA4B0]">Dedicated maintenance and continuous optimization.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
