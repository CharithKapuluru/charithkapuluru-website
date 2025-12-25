import Navigation from "@/components/sections/Navigation";
import VideoSlideshow from "@/components/sections/VideoSlideshow";
import StickyVideoSection from "@/components/sections/StickyVideoSection";
import ParallaxSection from "@/components/sections/ParallaxSection";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Slideshow with Video Backgrounds */}
      <VideoSlideshow />

      {/* Sticky Video Section - Portfolio Showcase */}
      <StickyVideoSection
        videoSrc="/videos/work.mp4"
        poster="/images/work-poster.jpg"
        title="Crafted with Precision"
        description="Every project is a journey of innovation, design, and technology coming together to create something extraordinary."
        features={[
          "User-Centered Design",
          "Scalable Architecture",
          "Performance Optimized"
        ]}
      />

      {/* Parallax About Section */}
      <ParallaxSection
        backgroundVideoSrc="/videos/about.mp4"
        poster="/images/about-poster.jpg"
        className="min-h-screen flex items-center"
        speed={0.3}
      >
        <About />
      </ParallaxSection>

      {/* Skills Section */}
      <Skills />

      {/* Projects with Parallax */}
      <ParallaxSection
        backgroundVideoSrc="/videos/projects.mp4"
        poster="/images/projects-poster.jpg"
        speed={0.4}
      >
        <Projects />
      </ParallaxSection>

      {/* Contact Section */}
      <Contact />

      <Footer />
    </main>
  );
}
