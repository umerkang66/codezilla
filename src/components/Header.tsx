"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Phone, Menu, X, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import "./PillNav.css";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((box, index) => {
        if (!box?.parentElement) return;

        const pill = box.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { height: h } = rect;

        gsap.set(box, {
          scaleY: 0,
          transformOrigin: '50% 100%'
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(box, { scaleY: 1, duration: 2, ease: 'power3.easeOut', overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease: 'power3.easeOut', overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease: 'power3.easeOut', overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => window.removeEventListener('resize', onResize);
  }, [navLinks.length]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: 'power3.easeOut',
      overwrite: 'auto'
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: 'power3.easeOut',
      overwrite: 'auto'
    });
  };

  // Hide header completely on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 border-b border-[#81D607]/20 bg-[#111111]/30 backdrop-blur-xs"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform duration-200 cursor-pointer"
            id="header-logo"
          >
            <div className="w-10 h-10 bg-[#1A1A1A] border border-[#81D607]/60 flex items-center justify-center group-hover:border-[#81D607] transition-colors rounded-xl overflow-hidden relative">
              <Image
                src="/logo.jpg"
                alt="Codzilla Technologies Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
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

          {/* Desktop Navigation with PillNav GSAP hover animation */}
          <nav
            className="hidden lg:flex items-center gap-0.5 xl:gap-1 px-2.5 xl:px-3.5 py-1.5 border border-[#81D607]/40 rounded-full shadow-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
            }}
          >
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  role="menuitem"
                  className={`pill px-2.5 xl:px-3.5 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap rounded-full relative overflow-hidden inline-flex items-center justify-center select-none cursor-pointer ${
                    isActive ? "is-active text-[#81D607]" : "text-[#E1E6EB]"
                  }`}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{link.name}</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {link.name}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Header CTA & Quick Contact */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5">
            <a
              href="tel:+923339072742"
              className="flex items-center gap-2 text-xs font-mono text-[#E1E6EB] hover:text-[#81D607] transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 bg-[#1A1A1A] border border-[#81D607]/40 flex items-center justify-center group-hover:border-[#81D607] transition-colors rounded-lg">
                <Phone className="w-3.5 h-3.5 text-[#81D607]" />
              </div>
              <span className="hidden xl:inline">+92 333 9072742</span>
            </a>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-4 xl:px-5 py-2.5 font-mono font-bold text-xs text-[#111111] bg-[#81D607] hover:bg-[#72BE06] transition-colors rounded-xl cursor-pointer whitespace-nowrap"
              id="header-cta-btn"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile / Tablet Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 bg-[#1A1A1A] border border-[#81D607]/40 text-[#E1E6EB] hover:text-[#81D607] hover:border-[#81D607] transition-all rounded-xl cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#81D607]" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-header border-b border-[#81D607]/30 px-4 sm:px-6 pt-4 pb-6 mt-3 space-y-4 rounded-2xl max-h-[calc(100vh-5rem)] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-mono text-[#E1E6EB] hover:text-[#111111] hover:bg-[#81D607] border border-transparent hover:border-[#81D607] transition-all rounded-xl cursor-pointer flex items-center justify-between"
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 text-[#81D607] opacity-60 group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#81D607]/20 flex flex-col gap-3">
            <a
              href="tel:+923339072742"
              className="flex items-center justify-center gap-3 px-4 py-3 text-xs font-mono text-[#E1E6EB] bg-[#1A1A1A] border border-[#81D607]/30 rounded-xl cursor-pointer active:bg-[#81D607] active:text-[#111111]"
            >
              <Phone className="w-4 h-4 text-[#81D607]" />
              <span>+92 333 9072742</span>
            </a>

            <a
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 font-mono font-bold text-xs text-[#111111] bg-[#81D607] hover:bg-[#72BE06] transition-all rounded-xl cursor-pointer"
            >
              <span>Get a Free Quote</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

