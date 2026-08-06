"use client";

import { useEffect, useState } from "react";
import { Check, ArrowRight, Package, Loader2 } from "lucide-react";

export interface EngineeringPackage {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  period?: string;
  featured?: boolean;
  features?: string[];
  cta_text?: string;
  ctaText?: string;
  display_order?: number;
  status?: string;
}

export default function Pricing() {
  const [packages, setPackages] = useState<EngineeringPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch("/api/packages");
        if (res.ok) {
          const data = await res.json();
          setPackages(data.packages || []);
        } else {
          setPackages([]);
        }
      } catch (err) {
        console.error("Error loading packages:", err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, []);

  return (
    <section id="pricing" className="py-12 sm:py-20 bg-[#0D0D0D] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
            Transparent Investment
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#E1E6EB] tracking-tight leading-tight">
            Flexible Engineering Packages
          </h2>
          <p className="text-sm sm:text-base text-[#9DA4B0]">
            Fixed transparent pricing tailored for web development, PCB electronic layout, and custom artificial intelligence deployment.
          </p>
        </div>

        {/* Pricing Tiers Grid or Empty / Loading Panel */}
        {loading ? (
          <div className="p-12 sm:p-16 text-center bg-[#1A1A1A] border border-[#E1E6EB]/10 flex flex-col items-center justify-center space-y-3 rounded-none">
            <Loader2 className="w-8 h-8 text-[#81D607] animate-spin" />
            <p className="text-xs font-mono text-[#9DA4B0]">Loading engineering packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="p-8 sm:p-16 text-center bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-4 rounded-none">
            <div className="w-12 h-12 bg-[#111111] border border-[#81D607]/40 flex items-center justify-center text-[#81D607] mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-mono font-bold text-[#E1E6EB]">
                no package was found
              </h3>
              <p className="text-xs text-[#9DA4B0] font-sans">
                Currently, there are no published engineering packages. Please check back later or request a custom proposal.
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${
              packages.length === 1
                ? "max-w-md mx-auto"
                : packages.length === 2
                ? "sm:grid-cols-2 max-w-4xl mx-auto"
                : "sm:grid-cols-2 lg:grid-cols-3"
            } gap-6 lg:gap-8 items-stretch`}
          >
            {packages.map((tier) => {
              const ctaText = tier.cta_text || tier.ctaText || "Choose Package";
              const featuresList = tier.features || [];

              return (
                <div
                  key={tier.id}
                  className={`p-6 sm:p-8 bg-[#1A1A1A] border ${
                    tier.featured
                      ? "border-[#81D607] shadow-xl"
                      : "border-[#E1E6EB]/10 hover:border-[#81D607]/60"
                  } transition-all duration-200 flex flex-col justify-between text-left rounded-none relative`}
                >
                  {tier.featured && (
                    <div className="absolute top-0 right-0 bg-[#81D607] text-[#111111] text-[10px] font-extrabold uppercase px-3 py-1 font-mono">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-[#E1E6EB] mb-1">{tier.name}</h3>
                      {tier.subtitle && (
                        <p className="text-xs text-[#9DA4B0] font-sans leading-relaxed">{tier.subtitle}</p>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 pt-2 border-t border-[#E1E6EB]/10">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#81D607] font-mono">{tier.price}</span>
                      {tier.period && (
                        <span className="text-xs text-[#9DA4B0] font-mono">{tier.period}</span>
                      )}
                    </div>

                    {/* Feature List */}
                    {featuresList.length > 0 && (
                      <ul className="space-y-3 pt-2 font-sans text-xs">
                        {featuresList.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-[#E1E6EB]">
                            <Check className="w-4 h-4 text-[#81D607] shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-[#E1E6EB]/10">
                    <a
                      href="#contact"
                      className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 font-mono font-bold text-xs rounded-none transition-colors ${
                        tier.featured
                          ? "bg-[#81D607] text-[#111111] hover:bg-[#72BE06]"
                          : "bg-[#111111] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607] hover:text-[#81D607]"
                      }`}
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bespoke Custom Quote Callout */}
        <div className="mt-8 sm:mt-12 p-5 sm:p-6 bg-[#1A1A1A] border border-[#81D607]/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 rounded-none text-left">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#E1E6EB]">Need a Custom Engineering Solution?</h4>
            <p className="text-xs text-[#9DA4B0]">
              Have a multi-board hardware project, enterprise LLM pipeline, or unique scope? We build custom tailored proposals.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#81D607] text-[#111111] font-mono font-bold text-xs shrink-0 hover:bg-[#72BE06] transition-colors rounded-none w-full sm:w-auto text-center"
          >
            <span>Request Custom Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
