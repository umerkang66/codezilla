"use client";

import { ArrowRight, Cpu, Globe, Brain, Code2, Terminal, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headlines & Pitch */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
            <span>Software • AI/ML • Hardware Engineering</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#E1E6EB] tracking-tight leading-[1.1]">
            We Build <span className="text-[#81D607] underline decoration-[#81D607]/40 decoration-2 underline-offset-4">AI, Web & Hardware</span> Solutions That Scale Your Business
          </h1>

          <p className="text-lg sm:text-xl text-[#9DA4B0] font-normal leading-relaxed max-w-2xl">
            Codzilla Technologies delivers enterprise software development, intelligent machine learning models, and embedded PCB engineering for startups and industry leaders.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 font-bold text-sm text-[#111111] bg-[#81D607] hover:bg-[#72BE06] transition-colors rounded-none"
              id="hero-primary-cta"
            >
              <span>Get a Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-sm text-[#E1E6EB] bg-[#1A1A1A] hover:bg-[#262626] border border-[#E1E6EB]/15 hover:border-[#81D607]/60 transition-colors rounded-none"
              id="hero-secondary-cta"
            >
              <span>Explore Our Services</span>
            </a>
          </div>

          {/* Quick Value Metrics */}
          <div className="pt-6 border-t border-[#E1E6EB]/10 grid grid-cols-3 gap-4 text-left">
            <div>
              <div className="text-xl font-extrabold text-[#81D607]">50+</div>
              <div className="text-xs text-[#9DA4B0] uppercase tracking-wider">Projects Delivered</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#81D607]">5+</div>
              <div className="text-xs text-[#9DA4B0] uppercase tracking-wider">Countries Served</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#81D607]">99%</div>
              <div className="text-xs text-[#9DA4B0] uppercase tracking-wider">On-Time Delivery</div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Interactive Graphic Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="bg-[#1A1A1A] border border-[#E1E6EB]/15 p-6 rounded-none space-y-6">
            {/* Mockup Header */}
            <div className="flex items-center justify-between border-b border-[#E1E6EB]/10 pb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#81D607]" />
                <span className="text-xs font-mono text-[#E1E6EB]">codzilla_stack.config.ts</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#E1E6EB]/20"></span>
                <span className="w-2.5 h-2.5 bg-[#E1E6EB]/20"></span>
                <span className="w-2.5 h-2.5 bg-[#81D607]"></span>
              </div>
            </div>

            {/* Code / Visual Cards Grid */}
            <div className="space-y-3 font-mono text-xs text-[#9DA4B0]">
              <div className="p-3 bg-[#111111] border border-[#E1E6EB]/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-[#81D607]" />
                  <span className="text-[#E1E6EB]">AI & ML Automation</span>
                </div>
                <span className="text-[10px] text-[#81D607] uppercase">Active</span>
              </div>

              <div className="p-3 bg-[#111111] border border-[#E1E6EB]/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#81D607]" />
                  <span className="text-[#E1E6EB]">Next.js Cloud App</span>
                </div>
                <span className="text-[10px] text-[#81D607] uppercase">Deployed</span>
              </div>

              <div className="p-3 bg-[#111111] border border-[#E1E6EB]/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-[#81D607]" />
                  <span className="text-[#E1E6EB]">KiCad PCB Hardware</span>
                </div>
                <span className="text-[10px] text-[#81D607] uppercase">Verified</span>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="p-4 bg-[#0D0D0D] border border-[#E1E6EB]/10 text-xs font-mono text-[#9DA4B0] space-y-1">
              <p className="text-[#81D607]">// Codzilla Engineering Guarantee</p>
              <p><span className="text-[#E1E6EB]">const</span> delivery = &#123; quality: <span className="text-[#81D607]">"100%"</span>, support: <span className="text-[#81D607]">"24/7"</span> &#125;;</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
