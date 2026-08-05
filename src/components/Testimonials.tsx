"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from "lucide-react";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      quote:
        "Codzilla Technologies delivered our complex KiCad multi-layer PCB design ahead of schedule. Their attention to detail and signal testing gave us total confidence.",
      author: "Marcus Vance",
      role: "Hardware Product Manager, US Tech Firm",
      rating: 5,
      platform: "Verified Upwork Review",
    },
    {
      quote:
        "Extremely skilled team in AI & Machine Learning. They trained a custom computer vision model for our quality control pipeline that achieved 99%+ accuracy instantly.",
      author: "Dr. Sarah Jenkins",
      role: "CTO, Industrial Automation Solutions",
      rating: 5,
      platform: "Verified Enterprise Client",
    },
    {
      quote:
        "The Next.js website they built for us is lightning-fast, responsive, and converted our leads significantly better than our old site. Incredible engineering quality!",
      author: "David Miller",
      role: "Founder, Apex Cloud Services",
      rating: 5,
      platform: "Verified Fiverr Pro Buyer",
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-[#0D0D0D] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
            Client Feedback
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB] tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-base text-[#9DA4B0]">
            Direct feedback from startups and global clients who trust Codzilla for software, AI, and hardware development.
          </p>
        </div>

        {/* Testimonials Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all duration-200 flex flex-col justify-between rounded-none group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[#81D607]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#81D607] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {rev.platform}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-[#81D607]/30 group-hover:text-[#81D607]/60 transition-colors" />

                <p className="text-sm text-[#E1E6EB] italic leading-relaxed font-sans">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E1E6EB]/10">
                <h4 className="text-sm font-bold text-[#E1E6EB]">{rev.author}</h4>
                <p className="text-xs text-[#9DA4B0] font-sans">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
