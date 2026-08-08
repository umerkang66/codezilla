"use client";

import { useEffect, useState } from "react";
import { Star, Quote, ShieldCheck, Loader2, MessageSquareQuote } from "lucide-react";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  rating?: number;
  platform?: string;
  avatar_url?: string;
  avatarUrl?: string;
  display_order?: number;
  status?: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          setReviews(data.testimonials || []);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Error loading testimonials:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-12 sm:py-20 bg-[#0D0D0D] border-t border-b border-[#E1E6EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
            Client Feedback
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#E1E6EB] tracking-tight leading-tight">
            What Our Clients Say
          </h2>
          <p className="text-xs sm:text-sm text-[#9DA4B0]">
            Direct feedback from startups and global clients who trust Codzilla for software, AI, and hardware development.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="p-12 sm:p-16 text-center bg-[#1A1A1A] border border-[#E1E6EB]/10 flex flex-col items-center justify-center space-y-3 rounded-none">
            <Loader2 className="w-8 h-8 text-[#81D607] animate-spin" />
            <p className="text-xs font-mono text-[#9DA4B0]">Loading client reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          /* Empty state */
          <div className="p-8 sm:p-16 text-center bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-4 rounded-none">
            <div className="w-12 h-12 bg-[#111111] border border-[#81D607]/40 flex items-center justify-center text-[#81D607] mx-auto">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-mono font-bold text-[#E1E6EB]">
                no review was found
              </h3>
              <p className="text-xs text-[#9DA4B0] font-sans">
                Currently, there are no published client testimonials available. Check back soon for client feedback!
              </p>
            </div>
          </div>
        ) : (
          /* Testimonials Display Grid */
          <div
            className={`grid grid-cols-1 ${
              reviews.length === 1
                ? "max-w-md mx-auto"
                : reviews.length === 2
                ? "md:grid-cols-2 max-w-4xl mx-auto"
                : "sm:grid-cols-2 lg:grid-cols-3"
            } gap-4 sm:gap-6 text-left items-stretch`}
          >
            {reviews.map((rev) => {
              const ratingCount = Math.min(5, Math.max(1, rev.rating || 5));
              const avatar = rev.avatar_url || rev.avatarUrl;
              const platformText = rev.platform || "Verified Client";

              return (
                <div
                  key={rev.id}
                  className="p-5 sm:p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 card-hover-effect flex flex-col justify-between rounded-none group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {/* Star Rating */}
                      <div className="flex items-center gap-1 text-[#81D607]">
                        {[...Array(ratingCount)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-[#81D607] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {platformText}
                      </span>
                    </div>

                    <Quote className="w-8 h-8 text-[#81D607]/30 group-hover:text-[#81D607]/60 transition-colors" />

                    <p className="text-sm text-[#E1E6EB] italic leading-relaxed font-sans">
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E1E6EB]/10 flex items-center gap-3">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={rev.author}
                        className="w-10 h-10 border border-[#81D607] object-cover shrink-0 rounded-none"
                      />
                    ) : null}
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-sm font-bold text-[#E1E6EB] truncate">{rev.author}</h4>
                      {rev.role && (
                        <p className="text-xs text-[#9DA4B0] font-sans truncate">{rev.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
