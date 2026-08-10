"use client";

import { ArrowRight, Code2, MessageSquare } from "lucide-react";

export default function CtaBanner() {
  return (
    <section id="cta-banner" className="py-16 bg-[#1A1A1A] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] border border-[#81D607]/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 rounded-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-full">
            <span>Turn Ideas Into Execution</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#E1E6EB] tracking-tight max-w-3xl">
            Ready to Build Something Great?
          </h2>

          <p className="text-xs sm:text-sm text-[#9DA4B0] max-w-xl">
            Tell us about your project requirements and receive a detailed proposal & free engineering consultation within 24 hours.
          </p>

          <div className="pt-2">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 font-bold text-sm text-[#111111] bg-[#81D607] hover:bg-[#72BE06] transition-all duration-200 rounded-xl cursor-pointer"
              id="cta-banner-btn"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
