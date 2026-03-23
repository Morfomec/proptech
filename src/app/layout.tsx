import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proptech MVP | Find Your Dream Home",
  description: "A modern property rental and sales platform.",
};

import { PreferencesProvider } from "@/context/PreferencesContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}>
      <body className="flex flex-col min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <PreferencesProvider>
          <main className="flex-grow">
            {children}
          </main>
        </PreferencesProvider>
        <Footer />
      </body>
    </html>
  );
}
