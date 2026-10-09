import Link from "next/link";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import GuidesGrid from "@/components/fundamentals/GuidesGrid";
import { categories, topics } from "@/lib/fundamentalsData";

export default function FundamentalsPage() {
  return (
    <>
      <SiteNav active="fundamentals" />
      <main id="main" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <h1 className="text-display-lg text-fg">Fundamentals</h1>
        <p className="mt-4 max-w-[60ch] text-lede text-fg-2">Plain-language guides to how servers, Linux and networks actually work. Zero assumptions, real analogies.</p>
        <div className="mt-10">
          <GuidesGrid topics={topics} categories={categories} />
        </div>
        <p className="mt-12 text-small text-fg-2">
          Not sure where to start?{" "}
          <Link href="/fundamentals/computing-basics" className="font-medium text-accent hover:text-accent-strong">
            Begin with Computing Basics
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
