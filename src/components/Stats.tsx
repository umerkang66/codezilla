"use client";

import { Award, Briefcase, Globe, Smile } from "lucide-react";

export default function Stats() {
  const statItems = [
    {
      number: "50+",
      label: "Projects Delivered",
      detail: "AI models, web apps & PCB hardware",
      icon: Briefcase,
    },
    {
      number: "30+",
      label: "Happy Clients",
      detail: "Global startups & mid-sized tech firms",
      icon: Smile,
    },
    {
      number: "5+",
      label: "Countries Served",
      detail: "US, UK, UAE, Pakistan & Europe",
      icon: Globe,
    },
    {
      number: "98%",
      label: "Client Satisfaction",
      detail: "Verified top-rated quality score",
      icon: Award,
    },
  ];

  return (
    <section id="stats" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1A1A1A] border border-[#81D607]/40 p-8 sm:p-12 rounded-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E1E6EB]/10">
          {statItems.map((stat, idx) => (
            <div
              key={idx}
              className={`text-center space-y-2 ${
                idx > 0 ? "pt-6 sm:pt-0 sm:pl-6" : ""
              }`}
            >
              <stat.icon className="w-6 h-6 text-[#81D607] mx-auto mb-2" />
              <div className="text-4xl sm:text-5xl font-extrabold text-[#81D607] font-mono tracking-tight">
                {stat.number}
              </div>
              <h4 className="text-base font-bold text-[#E1E6EB]">{stat.label}</h4>
              <p className="text-xs text-[#9DA4B0] font-sans">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
