import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import { ChatWidget } from "@/components/chat/ChatWidget";
import "./globals.css";

const coremontSans = Manrope({
  variable: "--font-coremont-sans",
  subsets: ["latin"],
  display: "swap",
});

const coremontSerif = Source_Serif_4({
  variable: "--font-coremont-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coremont | Premium Fitness Equipment",
  description: "Coremont is a premium European fitness equipment brand for home and studio training.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${coremontSans.variable} ${coremontSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
