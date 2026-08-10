"use client";

import { ArrowRight } from "lucide-react";
import Topography from "./Topography";

export default function Hero() {
  return (
    <section id="hero" className="relative z-10 w-full overflow-hidden pt-28 sm:pt-36 pb-16 lg:pb-28">
      {/* Background Topography Animation with finely balanced dark green lines */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-55 sm:opacity-65">
        <Topography
          lowColor="#102602"
          midColor="#2C6C03"
          highColor="#64B006"
          speed={0.35}
          morphAmount={3.0}
          morphSpeed={0.05}
          bands={2.0}
          thickness={0.01}
          scale={1.0}
          pixelSize={1.0}
          glow={0.35}
          colorMode="elevation"
          contrast={2.8}
          brightness={0.95}
          fillBands={false}
          opacity={1.0}
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseRadius={0.3}
          mouseStrength={0.4}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Tag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A]/90 border border-[#81D607]/40 text-[#81D607] text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-full max-w-full overflow-hidden truncate backdrop-blur-xs mb-6 sm:mb-8">
          <span>Software • AI/ML • Hardware Engineering</span>
        </div>

        {/* Static Clean Hero Heading */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#E1E6EB] tracking-tight leading-[1.25] sm:leading-[1.2] text-center mx-auto mb-6 sm:mb-8 max-w-4xl">
          We Build <span className="text-[#E1E6EB] underline decoration-[#81D607] decoration-4 sm:decoration-[5px] underline-offset-8 sm:underline-offset-10">AI, Web & Hardware</span> Solutions That Scale Your Business
        </h1>

        {/* Pitch Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-[#9DA4B0] font-normal leading-relaxed max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          Codzilla Technologies delivers enterprise software development, intelligent machine learning models, and embedded PCB engineering for startups and industry leaders.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto mx-auto mb-12 sm:mb-16">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-4 font-bold text-sm sm:text-base text-[#111111] bg-[#81D607] hover:bg-[#72BE06] transition-colors rounded-xl cursor-pointer w-full sm:w-auto text-center"
            id="hero-primary-cta"
          >
            <span>Get a Free Consultation</span>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </a>

          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 font-semibold text-sm sm:text-base text-[#E1E6EB] bg-[#1A1A1A]/90 hover:bg-[#262626] border border-[#E1E6EB]/15 hover:border-[#81D607]/60 transition-colors rounded-xl cursor-pointer w-full sm:w-auto text-center backdrop-blur-xs"
            id="hero-secondary-cta"
          >
            <span>Explore Our Services</span>
          </a>
        </div>

        {/* Quick Value Metrics Grid */}
        <div className="w-full max-w-4xl pt-6 sm:pt-8 border-t border-[#E1E6EB]/10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center">
          <div className="p-3 sm:p-4 bg-[#1A1A1A]/80 border border-[#E1E6EB]/10 rounded-xl backdrop-blur-xs">
            <div className="text-2xl sm:text-3xl font-black text-[#81D607] font-mono">50+</div>
            <div className="text-xs text-[#9DA4B0] uppercase tracking-wider font-mono mt-1">Projects Delivered</div>
          </div>
          <div className="p-3 sm:p-4 bg-[#1A1A1A]/80 border border-[#E1E6EB]/10 rounded-xl backdrop-blur-xs">
            <div className="text-2xl sm:text-3xl font-black text-[#81D607] font-mono">5+</div>
            <div className="text-xs text-[#9DA4B0] uppercase tracking-wider font-mono mt-1">Countries Served</div>
          </div>
          <div className="p-3 sm:p-4 bg-[#1A1A1A]/80 border border-[#E1E6EB]/10 rounded-xl backdrop-blur-xs">
            <div className="text-2xl sm:text-3xl font-black text-[#81D607] font-mono">99%</div>
            <div className="text-xs text-[#9DA4B0] uppercase tracking-wider font-mono mt-1">On-Time Delivery</div>
          </div>
        </div>
      </div>
    </section>
  );
}


