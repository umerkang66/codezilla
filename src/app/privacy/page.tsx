import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Codzilla Technologies",
  description: "Privacy Policy for Codzilla Technologies covering data collection, form submissions, and privacy protection.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen py-16 pt-28 bg-[#111111] text-[#E1E6EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#81D607] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>

        {/* Title */}
        <div className="space-y-3 border-b border-[#E1E6EB]/10 pb-8">
          <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
            Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB]">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-[#9DA4B0]">
            Last Updated: August 6, 2026 | Codzilla Technologies (`codzilla.company@gmail.com`)
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 text-sm text-[#9DA4B0] font-sans leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#E1E6EB] flex items-center gap-2 font-mono">
              <Eye className="w-5 h-5 text-[#81D607]" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you interact with the Codzilla Technologies website or fill out our project contact form, we collect information that you voluntarily provide to us:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#E1E6EB]">
              <li>Contact details such as your name and email address.</li>
              <li>Selected service preferences (e.g. AI & Automation, Web Development, KiCad PCB Design, MATLAB Engineering).</li>
              <li>Project scope specifications, timelines, and message details submitted via our contact forms.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-[#E1E6EB]/10 pt-6">
            <h2 className="text-xl font-bold text-[#E1E6EB] flex items-center gap-2 font-mono">
              <FileText className="w-5 h-5 text-[#81D607]" />
              <span>2. How We Use Your Data</span>
            </h2>
            <p>
              Codzilla Technologies uses your information strictly for legitimate commercial and engineering purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#E1E6EB]">
              <li>To evaluate project specifications and prepare architectural proposals & price quotes.</li>
              <li>To contact you directly regarding your inquiry via email (`codzilla.company@gmail.com`) or phone (`+92 333 9072742`).</li>
              <li>To execute Non-Disclosure Agreements (NDAs) and project milestone contracts.</li>
              <li>We never sell, rent, or lease client data to third-party advertisers.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-[#E1E6EB]/10 pt-6">
            <h2 className="text-xl font-bold text-[#E1E6EB] flex items-center gap-2 font-mono">
              <Lock className="w-5 h-5 text-[#81D607]" />
              <span>3. Data Security & NDA Protection</span>
            </h2>
            <p>
              We implement industry-standard technical controls to safeguard client communications, proprietary source code, and hardware schematics. Proprietary files shared for engineering evaluation are accessed solely by authorized Codzilla engineers bound by confidentiality obligations.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E1E6EB]/10 pt-6">
            <h2 className="text-xl font-bold text-[#E1E6EB] flex items-center gap-2 font-mono">
              <Shield className="w-5 h-5 text-[#81D607]" />
              <span>4. Your Rights & Contact Information</span>
            </h2>
            <p>
              You have the right to request access to, correction of, or deletion of any personal information held by Codzilla Technologies. For any privacy-related inquiries, please email us directly:
            </p>
            <div className="p-4 bg-[#1A1A1A] border border-[#81D607]/40 font-mono text-xs text-[#E1E6EB] space-y-1 rounded-none">
              <p className="font-bold text-[#81D607]">Codzilla Technologies Privacy Office</p>
              <p>Email: codzilla.company@gmail.com</p>
              <p>Phone: +92 333 9072742</p>
              <p>Location: Lahore, Pakistan</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
