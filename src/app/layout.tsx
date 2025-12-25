import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Charith Kapuluru | Software Engineer",
  description: "Software Engineer specializing in AI, Cloud Computing, and Cybersecurity. Building innovative solutions at the intersection of cutting-edge technology.",
  keywords: ["Software Engineer", "AI", "Cloud Computing", "Cybersecurity", "Machine Learning", "AWS", "Full Stack Developer"],
  authors: [{ name: "Charith Kapuluru" }],
  openGraph: {
    title: "Charith Kapuluru | Software Engineer",
    description: "Software Engineer specializing in AI, Cloud Computing, and Cybersecurity.",
    url: "https://charithkapuluru.com",
    siteName: "Charith Kapuluru",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charith Kapuluru | Software Engineer",
    description: "Software Engineer specializing in AI, Cloud Computing, and Cybersecurity.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
