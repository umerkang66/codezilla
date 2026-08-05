import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ContactUs from "@/components/ContactUs";

export const metadata: Metadata = {
  title: "Contact Us | Codzilla Technologies",
  description:
    "Get in touch with Codzilla Technologies for software development, AI/ML engineering, KiCad PCB design, and custom technical inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen py-16 pt-28 bg-[#111111] text-[#E1E6EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#81D607] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>
      <ContactUs />
    </main>
  );
}
