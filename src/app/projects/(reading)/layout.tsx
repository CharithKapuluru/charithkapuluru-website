import { AuthProvider } from "@/context/AuthContext";

// The walkthroughs share this one provider, so auth stays mounted while a reader moves from one to the next.
// The projects index sits outside the (reading) group, so it and the home, contact and 404 pages ship no Firebase.
export default function ProjectsReadingLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
