import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Charith Kapuluru | Digital Craftsman",
  description: "Crafting digital experiences at the edge of AI. Software Engineer specializing in intelligent systems and cloud architecture.",
  keywords: ["Software Engineer", "AI", "Cloud Computing", "Cybersecurity", "Creative Developer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-paper text-text-charcoal font-sans antialiased selection:bg-accent-moss/20 selection:text-text-charcoal">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
