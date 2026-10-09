import { AuthProvider } from "@/context/AuthContext";

// Auth lives at the segment, so it stays mounted while a reader moves from walkthrough to walkthrough. The home, contact and 404 pages are outside it and ship no Firebase.
export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
