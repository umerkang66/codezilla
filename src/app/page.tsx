import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import TechStack from "@/components/TechStack";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Team from "@/components/Team";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Careers from "@/components/Careers";
import BlogPreview from "@/components/BlogPreview";
import CtaBanner from "@/components/CtaBanner";
import ContactUs from "@/components/ContactUs";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#E1E6EB]">
      {/* 02 // Hero Section */}
      <Hero />

      {/* 03 // Trust Bar / Client Logos */}
      <TrustBar />

      {/* 04 // About Us Section */}
      <AboutUs />

      {/* 05 // Services Section */}
      <Services />

      {/* 06 // Why Choose Us (USPs) */}
      <WhyUs />

      {/* 07 // Technologies & Tools Showcase */}
      <TechStack />

      {/* 08 // Our Process / How We Work */}
      <Process />

      {/* 09 // Portfolio / Case Studies */}
      <Portfolio />

      {/* 10 // Team Showcase */}
      <Team />

      {/* 11 // Stats / Achievements */}
      <Stats />

      {/* 12 // Testimonials */}
      <Testimonials />

      {/* 13 // Pricing / Packages */}
      <Pricing />

      {/* 15 // FAQ Accordion */}
      <Faq />

      {/* 17 // Careers / Join The Team */}
      <Careers />

      {/* 14 // Blog / Insights */}
      <BlogPreview />

      {/* 16 // Call to Action Banner */}
      <CtaBanner />

      {/* 18 // Contact Us Section */}
      <ContactUs />
    </main>
  );
}
