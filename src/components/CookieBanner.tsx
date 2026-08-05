"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("codzilla_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("codzilla_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("codzilla_cookie_consent", "essential_only");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-5 bg-[#1A1A1A] border border-[#81D607]/60 shadow-2xl rounded-none text-left space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[#81D607]">
          <Cookie className="w-5 h-5 shrink-0" />
          <h4 className="text-sm font-mono font-bold text-[#E1E6EB]">Cookie & Privacy Notice</h4>
        </div>
        <button
          onClick={handleDecline}
          className="text-[#9DA4B0] hover:text-[#E1E6EB] p-1"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-[#9DA4B0] font-sans leading-relaxed">
        We use essential cookies to improve website performance and process quote requests. Read our{" "}
        <Link href="/privacy" className="text-[#81D607] hover:underline font-mono">
          Privacy Policy
        </Link>{" "}
        for details.
      </p>

      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-[#81D607] text-[#111111] font-mono font-bold text-xs hover:bg-[#72BE06] transition-colors rounded-none"
        >
          Accept All
        </button>
        <button
          onClick={handleDecline}
          className="px-4 py-2 bg-[#111111] border border-[#E1E6EB]/15 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] font-mono text-xs transition-colors rounded-none"
        >
          Essential Only
        </button>
      </div>
    </aside>
  );
}
