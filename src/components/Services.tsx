"use client";

import {
  Brain,
  Globe,
  Cpu,
  Binary,
  Code2,
  LineChart,
  Layers,
  ArrowRight,
  Microchip,
} from "lucide-react";

export default function Services() {
  const servicesList = [
    {
      icon: Brain,
      title: "Artificial Intelligence & Automation",
      description: "Custom AI workflows, LLM fine-tuning, autonomous agents, and smart process automation for businesses.",
      category: "AI / ML",
    },
    {
      icon: Binary,
      title: "Machine Learning & Data Science",
      description: "Predictive modeling, data analytics pipelines, computer vision systems, and neural network training.",
      category: "AI / ML",
    },
    {
      icon: Globe,
      title: "Dynamic Web Development",
      description: "High-performance, SEO-optimized web applications built with Next.js, React, and modern cloud architecture.",
      category: "Web & Software",
    },
    {
      icon: Cpu,
      title: "KiCad PCB Design & Hardware",
      description: "Schematic capture, multi-layer printed circuit board (PCB) layout design, signal integrity & prototyping.",
      category: "Hardware",
    },
    {
      icon: Microchip,
      title: "MATLAB & Simulink Engineering",
      description: "Control system design, numerical simulation, DSP algorithms, and hardware-in-the-loop (HIL) testing.",
      category: "Hardware",
    },
    {
      icon: Code2,
      title: "Full-Stack Software Engineering",
      description: "Bespoke desktop & mobile applications, RESTful APIs, microservices, and maintainable clean code architecture.",
      category: "Web & Software",
    },
    {
      icon: LineChart,
      title: "Deep Learning & Computer Vision",
      description: "Object detection, image recognition, anomaly detection models, and custom PyTorch/TensorFlow solutions.",
      category: "AI / ML",
    },
    {
      icon: Layers,
      title: "Research & Hardware R&D",
      description: "Cross-domain prototyping combining embedded sensors, microcontrollers, edge AI, and software validation.",
      category: "R&D",
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-20 bg-[#0D0D0D] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-full">
            Commercial Offerings
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#E1E6EB] tracking-tight leading-tight">
            End-to-End Technology Solutions Under One Roof
          </h2>
          <p className="text-xs sm:text-sm text-[#9DA4B0]">
            From software architecture and AI models to physical hardware PCB engineering, we turn technical complexities into scalable commercial products.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className="glass-card p-5 sm:p-6 border border-[#E1E6EB]/10 bg-[#1A1A1A] hover:bg-[#222222] card-hover-effect flex flex-col justify-between group rounded-xl text-left"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#111111] border border-[#E1E6EB]/15 flex items-center justify-center text-[#81D607] group-hover:border-[#81D607] group-hover:scale-110 group-hover:bg-[#81D607]/10 transition-all duration-300 rounded-xl">
                  <service.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] font-mono text-[#81D607] uppercase tracking-wider">
                  {service.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 sm:pt-6 mt-4 border-t border-[#E1E6EB]/10">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#81D607] hover:text-[#72BE06] transition-colors cursor-pointer"
                >
                  <span>Request Service Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
