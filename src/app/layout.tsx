import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import MotionProvider from "@/components/providers/MotionProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

import { Playfair_Display, Inter } from "next/font/google";

const serifFont = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable}`}>
      <body
        className={`antialiased bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col`}
      >
        {/* Ambient Background Gradient - Removed for Clean White Aesthetic */}
        {/* <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px] dark:bg-blue-900/10" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-[120px] dark:bg-purple-900/10" />
        </div> */}

        <ThemeProvider>
          <AuthProvider>
            <MotionProvider>
              <Header />
              <main className="pt-16 flex-grow">
                {children}
              </main>
              <Footer />
            </MotionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
