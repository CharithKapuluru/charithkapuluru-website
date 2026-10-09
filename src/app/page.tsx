import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ProofStrip from "@/components/home/ProofStrip";
import ProjectRows from "@/components/home/ProjectRows";
import FundamentalsIndex from "@/components/home/FundamentalsIndex";
import AboutSection from "@/components/home/AboutSection";
import ContactBand from "@/components/home/ContactBand";
import PersonJsonLd from "@/components/home/PersonJsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <SiteNav active="home" />
      <main id="main">
        <Hero />
        <ProofStrip />
        <section id="projects" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <span id="workshop" className="sr-only" aria-hidden />
          <h2 className="text-h2 text-fg">Selected projects</h2>
          <p className="mt-3 max-w-[60ch] text-lede text-fg-2">Three production-style walkthroughs, built and documented end to end.</p>
          <ProjectRows className="mt-10" />
          <Link href="/projects" className="mt-6 inline-flex items-center gap-1.5 text-small font-medium text-fg-2 hover:text-fg">
            All projects
            <ArrowRight size={16} weight="regular" aria-hidden />
          </Link>
        </section>
        <FundamentalsIndex />
        <AboutSection />
        <ContactBand />
      </main>
      <Footer />
      <PersonJsonLd />
    </>
  );
}
