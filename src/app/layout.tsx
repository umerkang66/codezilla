import type { Metadata } from "next";
import { JetBrains_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codzilla.com"),
  title: "Codzilla Technologies | AI, Web & Hardware Engineering",
  description:
    "Codzilla Technologies delivers software, AI/ML models, dynamic web apps, and embedded engineering (KiCad PCB & MATLAB) for startups and enterprises.",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  keywords: [
    "Codzilla Technologies",
    "Software House",
    "AI & Machine Learning",
    "Web Development",
    "KiCad PCB Design",
    "MATLAB Simulink",
    "Embedded Systems",
    "Lahore Pakistan",
  ],
  authors: [{ name: "Codzilla Technologies", url: "https://codzilla.com" }],
  openGraph: {
    title: "Codzilla Technologies | AI, Web & Hardware Engineering",
    description:
      "Enterprise software development, AI/ML models, Next.js web applications, and embedded KiCad PCB hardware design.",
    url: "https://codzilla.com",
    siteName: "Codzilla Technologies",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "Codzilla Technologies Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codzilla Technologies | AI, Web & Hardware Engineering",
    description:
      "Enterprise software development, AI/ML models, Next.js web applications, and embedded KiCad PCB hardware design.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${roboto.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#111111] text-[#E1E6EB] selection:bg-[#81D607] selection:text-[#111111]">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
