import type { Metadata } from "next";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import CopyEmailButton from "@/components/home/CopyEmailButton";
import ContactForm from "@/components/contact/ContactForm";
import { pageOpenGraph } from "@/lib/seo";

const TITLE = "Contact";
const DESCRIPTION = "Get in touch with Charith Kapuluru about Cloud and DevOps roles, collaborations, or the guides.";
const CANONICAL = "/contact/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: pageOpenGraph({ title: TITLE, description: DESCRIPTION, path: CANONICAL }),
};

export default function ContactPage() {
  return (
    <>
      <SiteNav active="contact" />
      <main id="main" tabIndex={-1} className="mx-auto grid max-w-6xl gap-12 px-4 py-14 outline-none sm:px-6 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <h1 className="text-display-lg text-fg">Contact</h1>
          <p className="mt-4 max-w-[40ch] text-lede text-fg-2">I read every message and reply to all of them.</p>
          <div className="mt-8">
            <CopyEmailButton email="kapulurucharith@gmail.com" />
          </div>
          <p className="mt-6 text-small text-fg-2">Denton, Texas</p>
          <p className="mt-2 flex gap-5 text-small font-medium">
            <a href="https://github.com/CharithKapuluru" target="_blank" rel="noopener noreferrer" className="text-fg-2 hover:text-fg">
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href="https://www.linkedin.com/in/charith-kapuluru-159456329/" target="_blank" rel="noopener noreferrer" className="text-fg-2 hover:text-fg">
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
        <div className="md:col-span-7">
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
