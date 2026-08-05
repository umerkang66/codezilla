"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "AI & Automation",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceOptions = [
    { label: "AI & Automation", value: "AI & Automation" },
    { label: "Machine Learning & Computer Vision", value: "Machine Learning" },
    { label: "Dynamic Web Development (Next.js/React)", value: "Web Development" },
    { label: "KiCad PCB Design & Embedded Hardware", value: "KiCad PCB Design" },
    { label: "MATLAB & Simulink Engineering", value: "MATLAB & Simulink" },
    { label: "Full-Stack Software Development", value: "Full-Stack Software" },
    { label: "Hardware R&D & Prototyping", value: "Hardware R&D" },
    { label: "Other / Custom Inquiry", value: "Other" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate asynchronous contact form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        service: "AI & Automation",
        message: "",
      });
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Direct Info & Location */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <div className="space-y-3">
            <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
              Let&apos;s Work Together
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E1E6EB] tracking-tight">
              Get in Touch with Our Engineering Team
            </h2>
            <p className="text-sm text-[#9DA4B0] leading-relaxed">
              Have a project in mind or need technical advice? Send us your requirements and we will respond with a tailored proposal.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-[#1A1A1A] border border-[#E1E6EB]/10 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] shrink-0 rounded-none">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#9DA4B0] uppercase font-mono">Email Address</div>
                <a
                  href="mailto:codzilla.company@gmail.com"
                  className="text-sm font-bold text-[#E1E6EB] hover:text-[#81D607] transition-colors break-all"
                >
                  codzilla.company@gmail.com
                </a>
              </div>
            </div>

            <div className="p-4 bg-[#1A1A1A] border border-[#E1E6EB]/10 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] shrink-0 rounded-none">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#9DA4B0] uppercase font-mono">Phone / WhatsApp</div>
                <a
                  href="tel:+923339072742"
                  className="text-sm font-bold text-[#E1E6EB] hover:text-[#81D607] transition-colors"
                >
                  +92 333 9072742
                </a>
              </div>
            </div>

            <div className="p-4 bg-[#1A1A1A] border border-[#E1E6EB]/10 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] shrink-0 rounded-none">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#9DA4B0] uppercase font-mono">Headquarters</div>
                <div className="text-sm font-bold text-[#E1E6EB]">Lahore, Pakistan</div>
              </div>
            </div>

            <div className="p-4 bg-[#1A1A1A] border border-[#E1E6EB]/10 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#111111] border border-[#81D607]/60 flex items-center justify-center text-[#81D607] shrink-0 rounded-none">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#9DA4B0] uppercase font-mono">Response Time</div>
                <div className="text-sm font-bold text-[#E1E6EB]">Guaranteed within 24 Hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-[#1A1A1A] border border-[#E1E6EB]/15 p-6 sm:p-8 rounded-none">
            <h3 className="text-xl font-bold text-[#E1E6EB] mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#81D607]" />
              <span>Send Us a Message</span>
            </h3>

            {isSubmitted ? (
              <div className="p-6 bg-[#111111] border border-[#81D607] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#81D607] mx-auto" />
                <h4 className="text-lg font-bold text-[#E1E6EB]">Message Sent Successfully!</h4>
                <p className="text-xs text-[#9DA4B0]">
                  Thank you for contacting Codzilla Technologies. Our engineering lead will review your message and reach out shortly at your email.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-5 py-2 bg-[#81D607] text-[#111111] font-bold text-xs rounded-none"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-mono text-[#E1E6EB]">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#111111] border border-[#E1E6EB]/15 text-sm text-[#E1E6EB] focus:border-[#81D607] focus:outline-none rounded-none"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-mono text-[#E1E6EB]">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#111111] border border-[#E1E6EB]/15 text-sm text-[#E1E6EB] focus:border-[#81D607] focus:outline-none rounded-none"
                    />
                  </div>
                </div>

                <CustomSelect
                  label="Service Needed *"
                  options={serviceOptions}
                  value={formData.service}
                  onChange={(val) => setFormData({ ...formData, service: val })}
                />

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-mono text-[#E1E6EB]">Project Details / Scope *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Briefly describe your project requirements, goals, or timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#111111] border border-[#E1E6EB]/15 text-sm text-[#E1E6EB] focus:border-[#81D607] focus:outline-none rounded-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 font-bold text-sm text-[#111111] bg-[#81D607] hover:bg-[#72BE06] transition-colors rounded-none disabled:opacity-50"
                  id="contact-submit-btn"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Sending Request..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
