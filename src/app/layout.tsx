import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CHRONOS — The Operating System For Time",
  description:
    "A story in seven breaths. Descend from the birth of time through stone, steam and signal — into the instrument that remembers everything. Observe. Simulate. Navigate.",
  keywords: ["chronos", "time", "civilization", "timeline", "simulation", "deep time"],
  openGraph: {
    title: "CHRONOS — The Operating System For Time",
    description: "A story in seven breaths. Observe. Simulate. Navigate.",
    siteName: "Chronos",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CHRONOS — The Operating System For Time",
    description: "A story in seven breaths. Observe. Simulate. Navigate.",
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
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="chronos-grain chronos-vignette min-h-full bg-[#0A0A0A] text-[#F5F5F5]">
        {children}
      </body>
    </html>
  );
}
