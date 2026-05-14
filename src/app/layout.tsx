import type { Metadata } from "next";
import "./globals.css";
import GlobalBackground from "@/components/GlobalBackground";

export const metadata: Metadata = {
  title: {
    default: "LuECE | Lucknow University ECE Advisor",
    template: "%s | LuECE"
  },
  description: "The ultimate AI-powered advisor for ECE students at Lucknow University. Explore curriculum, placements, faculty, and student life with precision.",
  keywords: ["Lucknow University", "ECE", "Engineering", "Advisor", "Syllabus", "Placements", "LU ECE", "Advisor AI"],
  authors: [{ name: "LuECE Team" }],
  creator: "LuECE Department",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luece.vercel.app",
    title: "LuECE | Lucknow University ECE Advisor",
    description: "AI-powered guide for Lucknow University ECE students. Real-time answers on curriculum, faculty, and career paths.",
    siteName: "LuECE",
  },
  twitter: {
    card: "summary_large_image",
    title: "LuECE | Lucknow University ECE Advisor",
    description: "AI-powered guide for Lucknow University ECE students.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <GlobalBackground />
        {children}
      </body>
    </html>
  );
}
