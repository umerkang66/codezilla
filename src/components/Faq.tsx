"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does a typical software or hardware project take?",
      answer:
        "Project timelines depend on complexity. Simple landing pages or 2-layer PCB layouts take 3–7 business days. Full-stack Next.js web applications or 4-layer PCB hardware with firmware take 2–4 weeks. Complex AI model training and custom R&D projects run in 4-to-6 week agile sprints.",
    },
    {
      question: "What pricing model do you use (Fixed-Price vs Hourly)?",
      answer:
        "We primarily offer transparent Fixed-Price milestone proposals after analyzing your requirements. This eliminates cost uncertainty. For ongoing iterative engineering or staff augmentation, we also offer flexible weekly/hourly developer arrangements.",
    },
    {
      question: "Do you sign Non-Disclosure Agreements (NDAs) to protect our IP?",
      answer:
        "Yes, absolutely. We treat intellectual property with standard commercial confidentiality. We sign mutual NDAs prior to reviewing proprietary schematics, codebases, or business datasets. Full IP rights transfers automatically upon project completion.",
    },
    {
      question: "What is your revision and quality assurance policy?",
      answer:
        "Every project proposal includes defined review cycles. We run automated code linting, unit tests, and hardware signal validation. If any deliverable deviates from agreed architectural specs, we fix it promptly at no extra charge.",
    },
    {
      question: "What post-launch support and maintenance do you offer?",
      answer:
        "All projects include complimentary post-launch support (ranging from 7 to 90 days depending on package tier). Beyond that, we offer monthly SLA technical maintenance retainers for server monitoring, updates, and hardware iterations.",
    },
    {
      question: "How do we get started on a project with Codzilla?",
      answer:
        "Simply fill out our Contact Form or reach us via email at codzilla.company@gmail.com. We will schedule a 20-minute Discovery Call or send a detailed technical proposal & timeline quote within 24 hours.",
    },
  ];

  return (
    <section id="faq" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
        <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
          Got Questions?
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#E1E6EB] tracking-tight leading-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#9DA4B0]">
          Clear answers to common questions about timelines, NDA policies, pricing models, and how we work with client engineering teams.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-4xl mx-auto space-y-3 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`border transition-all duration-300 rounded-none ${
                isOpen
                  ? "bg-[#1A1A1A] border-[#81D607] shadow-[0_0_15px_rgba(129,214,7,0.15)]"
                  : "bg-[#1A1A1A]/80 border-[#E1E6EB]/10 hover:border-[#81D607]/60"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 text-left font-mono font-bold text-xs sm:text-base text-[#E1E6EB] focus:outline-none group"
              >
                <span className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <HelpCircle className={`w-4 h-4 shrink-0 transition-colors duration-300 ${isOpen ? "text-[#81D607]" : "text-[#81D607]/70 group-hover:text-[#81D607]"}`} />
                  <span className={`transition-colors duration-200 ${isOpen ? "text-[#81D607]" : "text-[#E1E6EB] group-hover:text-[#81D607]"}`}>{faq.question}</span>
                </span>
                <span
                  className={`w-6 h-6 bg-[#111111] border flex items-center justify-center text-[#81D607] shrink-0 rounded-none transition-all duration-300 ${
                    isOpen
                      ? "border-[#81D607] bg-[#81D607]/10 rotate-180"
                      : "border-[#81D607]/40 group-hover:border-[#81D607] rotate-0"
                  }`}
                >
                  {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-[#9DA4B0] font-sans leading-relaxed border-t border-[#E1E6EB]/10">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
