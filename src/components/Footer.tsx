"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Clock,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer completely on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#0D0D0D] border-t border-[#E1E6EB]/10 pt-16 pb-8 text-[#E1E6EB] relative overflow-hidden rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E1E6EB]/10">
          {/* Column 1: Brand & Bio (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 bg-[#1A1A1A] border border-[#81D607]/60 flex items-center justify-center group-hover:border-[#81D607] transition-all rounded-none overflow-hidden relative">
                <Image
                  src="/logo.jpg"
                  alt="Codzilla Technologies Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-none">
                  CODZILLA
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-[#9DA4B0] uppercase">
                  Technologies
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#9DA4B0] leading-relaxed max-w-sm">
              Codzilla Technologies delivers software, AI/ML models, dynamic web apps, and embedded hardware engineering for startups and enterprises worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram SVG */}
              <a
                href="https://www.instagram.com/_codzilla/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 bg-[#1A1A1A] border border-[#E1E6EB]/10 flex items-center justify-center text-[#E1E6EB]/80 hover:text-[#81D607] hover:border-[#81D607]/60 transition-all duration-200 rounded-none"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#E1E6EB] tracking-wide relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-8 after:h-0.5 after:bg-[#81D607]">
              Quick Links
            </h4>
            <ul className="space-y-2.5 pt-2">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/#about" },
                { name: "Services", href: "/#services" },
                { name: "Portfolio", href: "/#portfolio" },
                { name: "Our Team", href: "/team" },
                { name: "Careers / Talent", href: "/talent-acquisition" },
                { name: "Blog / Insights", href: "/blog" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9DA4B0] hover:text-[#81D607] flex items-center gap-1 group transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#81D607] transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#E1E6EB] tracking-wide relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-8 after:h-0.5 after:bg-[#81D607]">
              Core Services
            </h4>
            <ul className="space-y-2.5 pt-2">
              {[
                "AI & Automation",
                "Machine Learning",
                "Web Development",
                "KiCad PCB Design",
                "MATLAB & Simulink",
                "Embedded Systems",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/#services"
                    className="text-sm text-[#9DA4B0] hover:text-[#81D607] transition-colors block"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#E1E6EB] tracking-wide relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-8 after:h-0.5 after:bg-[#81D607]">
              Get In Touch
            </h4>
            <ul className="space-y-3 pt-2 text-sm text-[#9DA4B0]">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#81D607] mt-1 shrink-0" />
                <a
                  href="mailto:codzilla.company@gmail.com"
                  className="hover:text-[#81D607] transition-colors break-all"
                >
                  codzilla.company@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#81D607] mt-1 shrink-0" />
                <a
                  href="tel:+923339072742"
                  className="hover:text-[#81D607] transition-colors"
                >
                  +92 333 9072742
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#81D607] mt-1 shrink-0" />
                <span>Lahore, Pakistan</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#81D607] mt-1 shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM (PKT)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9DA4B0]">
          <p>© {currentYear} Codzilla Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-[#81D607] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-[#E1E6EB]/20">•</span>
            <Link
              href="/terms"
              className="hover:text-[#81D607] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
