import Button from "@/components/ui/Button";
import CopyEmailButton from "./CopyEmailButton";

export default function ContactBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
      <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center md:py-16">
        <h2 className="text-h2 text-fg">Open to Cloud and DevOps roles.</h2>
        <p className="mx-auto mt-3 max-w-[50ch] text-lede text-fg-2">Based in Denton, Texas. Happy to talk about infrastructure, pipelines or the guides.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <CopyEmailButton email="kapulurucharith@gmail.com" />
          <Button href="/contact" size="lg">
            Contact
          </Button>
        </div>
      </div>
    </section>
  );
}
