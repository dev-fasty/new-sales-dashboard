import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Sales Monitoring Dashboard",
  description: "Modern, Premium Dark Mode Sales Monitoring Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex overflow-hidden bg-[#1c202b] text-white selection:bg-cyan-500/30">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
