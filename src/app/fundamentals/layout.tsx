import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fundamentals",
  description:
    "Plain-language guides to computing fundamentals: virtual machines, Linux, operating systems, servers, SSH and more. Built for beginners and for professionals refreshing the basics.",
  alternates: { canonical: "/fundamentals/" },
};

export default function FundamentalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
