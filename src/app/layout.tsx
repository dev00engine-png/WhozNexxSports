import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";

export const metadata: Metadata = {
  title: "WhozNexxSports | Elevate Your Game",
  description: "Premier youth sports registration — Football, Baseball, Soccer & Basketball. Where the next generation of champions begins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-body antialiased bg-black text-white min-h-screen flex flex-col">
        <ParticleField color="#ff1a1a" count={40} />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
