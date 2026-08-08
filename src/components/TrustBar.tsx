"use client";

import { Award, Star, CheckCircle, ShieldCheck } from "lucide-react";

export default function TrustBar() {
  const badges = [
    {
      icon: Star,
      title: "Upwork Top Rated",
      subtitle: "100% Job Success Score",
    },
    {
      icon: Award,
      title: "Fiverr Level 2 Seller",
      subtitle: "5-Star Average Rating",
    },
    {
      icon: CheckCircle,
      title: "50+ Projects Delivered",
      subtitle: "Software, AI & Hardware",
    },
    {
      icon: ShieldCheck,
      title: "Verified Enterprise R&D",
      subtitle: "NDA & Client Security",
    },
  ];

  return (
    <section id="trust-bar" className="py-12 bg-[#0D0D0D] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-[#9DA4B0] mb-8">
          Trusted By Industry Leaders & Verified Platforms
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#1A1A1A] border border-[#E1E6EB]/10 flex items-center gap-4 card-hover-effect group rounded-none"
            >
              <div className="w-10 h-10 bg-[#111111] border border-[#81D607]/40 flex items-center justify-center text-[#81D607] shrink-0 rounded-none group-hover:scale-110 group-hover:border-[#81D607] group-hover:bg-[#81D607]/10 transition-all duration-300">
                <badge.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-[#E1E6EB]">{badge.title}</h4>
                <p className="text-xs text-[#9DA4B0] font-sans">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
