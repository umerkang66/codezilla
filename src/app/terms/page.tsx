import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Gavel, Cpu, Code2, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Codzilla Technologies",
  description: "Terms of Service for Codzilla Technologies software, AI/ML models, and KiCad PCB engineering engagements.",
};

export default function TermsOfService() {
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
            Commercial Terms
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#E1E6EB]">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-[#9DA4B0]">
            Effective Date: August 6, 2026 | Codzilla Technologies (`codzilla.company@gmail.com`)
          </p>
        </div>

        {/* Terms Content Sections */}
        <div className="space-y-8 text-sm text-[#9DA4B0] font-sans leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#E1E6EB] flex items-center gap-2 font-mono">
              <Gavel className="w-5 h-5 text-[#81D607]" />
              <span>1. Engagement & Project Scope</span>
            </h2>
            <p>
              All engineering projects executed by Codzilla Technologies (including web development, machine learning model training, MATLAB simulations, and KiCad PCB design) are governed by a mutually agreed proposal specifying scope, fixed milestone deliverables, cost, and timelines.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E1E6EB]/10 pt-6">
            <h2 className="text-xl font-bold text-[#E1E6EB] flex items-center gap-2 font-mono">
              <Code2 className="w-5 h-5 text-[#81D607]" />
              <span>2. Intellectual Property Rights</span>
            </h2>
            <p>
              Upon complete payment of all project milestones, full intellectual property (IP) rights, source code repositories, KiCad Gerber/schematic files, and trained neural model weights are transferred 100% to the client. Codzilla Technologies retains no residual ownership rights in custom client deliverables.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E1E6EB]/10 pt-6">
            <h2 className="text-xl font-bold text-[#E1E6EB] flex items-center gap-2 font-mono">
              <Cpu className="w-5 h-5 text-[#81D607]" />
              <span>3. Revisions & Quality Guarantee</span>
            </h2>
            <p>
              Deliverables are rigorously tested prior to handover. If deliverables deviate from written proposal specifications during the designated post-launch support period, Codzilla Technologies will perform corrections promptly without additional fee. Scope additions outside the initial agreement are quoted separately.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E1E6EB]/10 pt-6">
            <h2 className="text-xl font-bold text-[#E1E6EB] flex items-center gap-2 font-mono">
              <ShieldAlert className="w-5 h-5 text-[#81D607]" />
              <span>4. Contact & Inquiries</span>
            </h2>
            <p>
              For questions regarding our service agreements, engineering terms, or active milestone contracts, please contact us:
            </p>
            <div className="p-4 bg-[#1A1A1A] border border-[#81D607]/40 font-mono text-xs text-[#E1E6EB] space-y-1 rounded-none">
              <p className="font-bold text-[#81D607]">Codzilla Technologies Contracts Office</p>
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
