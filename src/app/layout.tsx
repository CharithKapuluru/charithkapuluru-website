import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import SkipLink from "@/components/layout/SkipLink";
import Konami from "@/components/brand/Konami";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});

const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const SITE = "https://charithkapuluru.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Charith Kapuluru | Cloud & DevOps Engineer",
    template: "%s | Charith Kapuluru",
  },
  description:
    "Cloud and DevOps engineer. Project walkthroughs on DevSecOps pipelines, AWS ECS with Terraform and Linux administration, plus plain-language guides to how servers actually work.",
  keywords: ["DevOps", "Cloud", "AWS", "Terraform", "Linux", "Docker", "Portfolio"],
  openGraph: {
    type: "website",
    siteName: "Charith Kapuluru",
    title: "Charith Kapuluru | Cloud & DevOps Engineer",
    description:
      "Cloud and DevOps engineer. Project walkthroughs and plain-language guides to how servers actually work.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Charith Kapuluru, Cloud and DevOps engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charith Kapuluru | Cloud & DevOps Engineer",
    description:
      "Cloud and DevOps engineer. Project walkthroughs and plain-language guides to how servers actually work.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-bg font-sans text-fg antialiased">
        <Providers>
          <SkipLink />
          {children}
          <Konami />
        </Providers>
      </body>
    </html>
  );
}
