import WorldNav from "@/components/world/WorldNav";
import HillScene from "@/components/world/scenes/HillScene";
import WorkshopSection from "@/components/home/WorkshopSection";
import LibrarySection from "@/components/home/LibrarySection";
import AboutSection from "@/components/home/AboutSection";
import GrassFooter from "@/components/home/GrassFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-paper">
      <WorldNav />
      <HillScene />
      <WorkshopSection />
      <LibrarySection />
      <AboutSection />
      <GrassFooter />
    </main>
  );
}
