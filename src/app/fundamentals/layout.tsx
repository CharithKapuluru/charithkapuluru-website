import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fundamentals | Charith Kapuluru",
  description:
    "Learn the fundamentals of computing — virtual machines, Linux, operating systems, servers, SSH, and more. Built for beginners and professionals refreshing their basics.",
};

export default function FundamentalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
