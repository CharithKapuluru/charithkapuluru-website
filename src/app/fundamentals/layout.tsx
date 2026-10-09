import type { Metadata } from "next";
import { pageOpenGraph, pageTwitter } from "@/lib/seo";

const TITLE = "Fundamentals";
const DESCRIPTION =
  "Plain-language guides to computing fundamentals: virtual machines, Linux, operating systems, servers, SSH and more. Built for beginners and for professionals refreshing the basics.";
const CANONICAL = "/fundamentals/";

// The index page's metadata; each guide sets its own title, canonical, openGraph and twitter. Auth is provided by (reading)/layout.tsx, not here.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: pageOpenGraph({ title: TITLE, description: DESCRIPTION, path: CANONICAL }),
  twitter: pageTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function FundamentalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
