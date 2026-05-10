import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuECE | Lucknow University ECE Department",
  description: "Interactive guide and chatbot for first-year ECE students at Lucknow University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
