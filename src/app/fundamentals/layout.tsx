import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { pageOpenGraph } from "@/lib/seo";

const TITLE = "Fundamentals";
const DESCRIPTION =
  "Plain-language guides to computing fundamentals: virtual machines, Linux, operating systems, servers, SSH and more. Built for beginners and for professionals refreshing the basics.";
const CANONICAL = "/fundamentals/";

// The index page's metadata; each guide sets its own title, canonical and openGraph.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: pageOpenGraph({ title: TITLE, description: DESCRIPTION, path: CANONICAL }),
};

// Auth lives at the segment, so it stays mounted while a reader moves from guide to guide. The home, contact and 404 pages are outside it and ship no Firebase.
export default function FundamentalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
