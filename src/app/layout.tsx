import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHRONOS — The Operating System For Time",
  description:
    "Observe, simulate, and navigate through the timeline of civilization. Chronos is the operating system for time itself.",
  keywords: [
    "chronos",
    "time",
    "civilization",
    "timeline",
    "history",
    "simulation",
  ],
  openGraph: {
    title: "CHRONOS — The Operating System For Time",
    description:
      "Observe, simulate, and navigate through the timeline of civilization.",
    siteName: "Chronos",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CHRONOS — The Operating System For Time",
    description:
      "Observe, simulate, and navigate through the timeline of civilization.",
  },
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
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F5F5F5]">
        {children}
      </body>
    </html>
  );
}
