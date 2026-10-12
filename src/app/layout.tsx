import type { Metadata } from "next"
import { Bodoni_Moda, Instrument_Sans, DM_Mono } from "next/font/google"
import "./globals.css"

const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
})

const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
})

const mono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "CHRONOS — The Operating System For Time",
  description:
    "Navigate 13.8 billion years of events — searchable, simulatable, explorable like a space. Observe. Simulate. Navigate.",
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
      "Navigate 13.8 billion years of events. Observe. Simulate. Navigate.",
    siteName: "Chronos",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CHRONOS — The Operating System For Time",
    description:
      "Navigate 13.8 billion years of events. Observe. Simulate. Navigate.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="thread-grain thread-vignette min-h-full bg-[#03040A] text-[#E9ECF8]">
        <a href="#chronos-instrument" className="skip-link">
          Skip to the instrument
        </a>
        {children}
        <noscript>
          <div className="noscript-note">
            CHRONOS works without scripts: the seven chapters are presented as
            stacked sections below. Enable JavaScript for the animated thread.
          </div>
        </noscript>
      </body>
    </html>
  )
}
