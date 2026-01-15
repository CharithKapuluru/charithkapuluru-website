import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-paper">
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
