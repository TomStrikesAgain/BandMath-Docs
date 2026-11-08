import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BandMath Knowledge Base — Touring Math, POS & Closing Room Guides",
  description:
    "Official user guides, interactive workflows, and AI support for BandMath: Merch Stand POS, Multi-Band Closing Room, QR Door Terminals, Bouncer Mode, and Automated Debt Settlement.",
  metadataBase: new URL("https://learn.itsbandmath.com"),
  icons: {
    icon: "/img/logo.png",
    apple: "/img/logo.png",
  },
  openGraph: {
    title: "BandMath Knowledge Base & Interactive Guides",
    description:
      "Master the Merch Stand, Multi-Band Closing Room, Stripe Tap to Pay, and Automated Debt Settlement.",
    url: "https://learn.itsbandmath.com",
    siteName: "BandMath Knowledge Base",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=JetBrains+Mono:wght@400;600&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] antialiased selection:bg-[#E5FE00] selection:text-black">
        {children}
      </body>
    </html>
  );
}
