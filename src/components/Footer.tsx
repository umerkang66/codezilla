import Link from "next/link";
import {
  Code2,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Clock,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0D0D] border-t border-[#E1E6EB]/10 pt-16 pb-8 text-[#E1E6EB] relative overflow-hidden rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E1E6EB]/10">
          {/* Column 1: Brand & Bio (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 bg-[#1A1A1A] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] group-hover:border-[#81D607] transition-all rounded-none">
                <Code2 className="w-6 h-6 stroke-[2.5]" />
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
              {/* LinkedIn SVG */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 bg-[#1A1A1A] border border-[#E1E6EB]/10 flex items-center justify-center text-[#E1E6EB]/80 hover:text-[#81D607] hover:border-[#81D607]/60 transition-all duration-200 rounded-none"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>

              {/* Instagram SVG */}
              <a
                href="https://instagram.com"
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

              {/* GitHub SVG */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 bg-[#1A1A1A] border border-[#E1E6EB]/10 flex items-center justify-center text-[#E1E6EB]/80 hover:text-[#81D607] hover:border-[#81D607]/60 transition-all duration-200 rounded-none"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
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
                { name: "Our Team", href: "/#team" },
                { name: "Blog / Insights", href: "/#blog" },
                { name: "Contact", href: "/#contact" },
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
