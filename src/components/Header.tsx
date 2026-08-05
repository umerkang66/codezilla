"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ArrowRight, Code2 } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide header completely on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "Team", href: "/team" },
    { name: "Careers", href: "/talent-acquisition" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-header py-3 border-b border-[#81D607]/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform duration-200"
            id="header-logo"
          >
            <div className="w-10 h-10 bg-[#1A1A1A] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] group-hover:border-[#81D607] transition-colors rounded-none">
              <Code2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-lg tracking-tight text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-none">
                CODZILLA
              </span>
              <span className="text-[10px] font-mono font-semibold tracking-widest text-[#9DA4B0] uppercase">
                Technologies
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1A1A1A] px-3 py-1.5 border border-[#81D607]/30 rounded-none">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-mono tracking-wide text-[#E1E6EB] hover:text-[#111111] hover:bg-[#81D607] transition-colors rounded-none"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Header CTA & Quick Contact */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="tel:+923339072742"
              className="flex items-center gap-2 text-xs font-mono text-[#E1E6EB] hover:text-[#81D607] transition-colors group"
            >
              <div className="w-8 h-8 bg-[#1A1A1A] border border-[#81D607]/40 flex items-center justify-center group-hover:border-[#81D607] transition-colors rounded-none">
                <Phone className="w-3.5 h-3.5 text-[#81D607]" />
              </div>
              <span>+92 333 9072742</span>
            </a>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 font-mono font-bold text-xs text-[#111111] bg-[#81D607] hover:bg-[#72BE06] transition-colors rounded-none"
              id="header-cta-btn"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-[#1A1A1A] border border-[#81D607]/40 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-all rounded-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-header border-b border-[#81D607]/30 px-4 pt-4 pb-6 mt-3 space-y-4 rounded-none">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-mono text-[#E1E6EB] hover:text-[#111111] hover:bg-[#81D607] transition-colors rounded-none"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#81D607]/20 flex flex-col gap-3">
            <a
              href="tel:+923339072742"
              className="flex items-center gap-3 px-4 py-2.5 text-xs font-mono text-[#E1E6EB] bg-[#1A1A1A] border border-[#81D607]/30 rounded-none"
            >
              <Phone className="w-4 h-4 text-[#81D607]" />
              <span>+92 333 9072742</span>
            </a>

            <a
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center px-5 py-3 font-mono font-bold text-xs text-[#111111] bg-[#81D607] hover:bg-[#72BE06] transition-all rounded-none"
            >
              Get a Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
