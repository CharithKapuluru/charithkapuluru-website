import Navigation from "@/components/sections/Navigation";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-cloud">
      <Navigation />

      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
