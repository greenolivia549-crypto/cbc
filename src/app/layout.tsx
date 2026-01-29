import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import MotionProvider from "@/components/providers/MotionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Playfair_Display, Inter } from "next/font/google";

const serifFont = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenBlog - Professional Blogging Platform",
  description: "Trending articles, latest news, and expert insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${serifFont.variable} ${sansFont.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <MotionProvider>
            <Header />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            <Footer />
          </MotionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
