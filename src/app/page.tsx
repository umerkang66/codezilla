import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import CtaBanner from "@/components/CtaBanner";
import ContactUs from "@/components/ContactUs";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#E1E6EB]">
      {/* 02 // Hero / Banner Section */}
      <Hero />

      {/* 04 // About Us Section */}
      <AboutUs />

      {/* 05 // Services Section */}
      <Services />

      {/* 16 // Call to Action Banner */}
      <CtaBanner />

      {/* 18 // Contact Us Section */}
      <ContactUs />
    </main>
  );
}
