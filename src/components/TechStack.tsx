"use client";

import { useState } from "react";
import { Code2, Cpu, Layers, Terminal } from "lucide-react";

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState<"All" | "Languages" | "Frameworks" | "Hardware & Tools">("All");

  const categories = ["All", "Languages", "Frameworks", "Hardware & Tools"] as const;

  const stackItems = [
    { name: "Python", category: "Languages", desc: "AI / ML & Backend Systems", icon: Code2 },
    { name: "C++", category: "Languages", desc: "Embedded Firmware & Performance", icon: Terminal },
    { name: "TypeScript / JS", category: "Languages", desc: "Modern Full-Stack Applications", icon: Code2 },
    { name: "React", category: "Frameworks", desc: "Interactive Frontend Interfaces", icon: Layers },
    { name: "Next.js", category: "Frameworks", desc: "Full-Stack Server-Side Framework", icon: Layers },
    { name: "TensorFlow", category: "Frameworks", desc: "Deep Learning & Neural Networks", icon: Cpu },
    { name: "PyTorch", category: "Frameworks", desc: "Computer Vision & AI Models", icon: Cpu },
    { name: "KiCad PCB", category: "Hardware & Tools", desc: "Multi-layer Circuit Layout & Schematics", icon: Cpu },
    { name: "MATLAB & Simulink", category: "Hardware & Tools", desc: "Control Systems & Algorithm Modeling", icon: Terminal },
    { name: "Docker", category: "Hardware & Tools", desc: "Containerized Microservices & Deployment", icon: Layers },
    { name: "Figma", category: "Hardware & Tools", desc: "UI/UX Architecture & Wireframing", icon: Code2 },
  ];

  const filteredItems = activeCategory === "All"
    ? stackItems
    : stackItems.filter((item) => item.category === activeCategory);

  return (
    <section id="tech-stack" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
          Technical Stack
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB] tracking-tight">
          Technologies & Tools We Work With
        </h2>
        <p className="text-base text-[#9DA4B0]">
          We use industry-standard languages, deep learning frameworks, and electronic design tools to craft robust engineering solutions.
        </p>

        {/* Filter Buttons */}
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

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="p-5 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all duration-200 group text-left rounded-none"
          >
            <div className="w-10 h-10 bg-[#111111] border border-[#E1E6EB]/15 flex items-center justify-center text-[#81D607] group-hover:border-[#81D607] transition-colors mb-4 rounded-none">
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-[#81D607] uppercase tracking-wider block mb-1">
              {item.category}
            </span>
            <h3 className="text-base font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors mb-1">
              {item.name}
            </h3>
            <p className="text-xs text-[#9DA4B0] leading-normal font-sans">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
