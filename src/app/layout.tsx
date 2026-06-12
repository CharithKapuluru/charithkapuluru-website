import type { Metadata } from "next";
import { Fredoka, Nunito, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { WorldProvider } from "@/components/world/WorldProvider";
import EasterEggs from "@/components/world/EasterEggs";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Charith Kapuluru | Cloud & DevOps Engineer",
  description:
    "Charith builds cloud infrastructure, DevSecOps pipelines, and friendly explanations of how computers actually work. Come say hi to the cartoon version of him.",
  keywords: ["DevOps", "Cloud", "AWS", "Linux", "Software Engineer", "Portfolio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ThemeProvider>
            <WorldProvider>
              <SmoothScroll />
              {children}
              <EasterEggs />
            </WorldProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
