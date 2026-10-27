import { AuthProvider } from "@/context/AuthContext";

// The guides share this one provider, so auth stays mounted while a reader moves from one guide to the next.
// The fundamentals index sits outside the (reading) group, so it and the home, contact and 404 pages ship no Firebase.
export default function FundamentalsReadingLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
