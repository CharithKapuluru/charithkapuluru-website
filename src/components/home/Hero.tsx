import Button from "@/components/ui/Button";
import Avatar from "@/components/brand/Avatar";

export default function Hero() {
  return (
    <section className="mx-auto grid min-h-[min(calc(100dvh_-_4rem),820px)] max-w-6xl items-center gap-10 px-4 pb-16 pt-16 sm:px-6 md:grid-cols-12 md:pb-24 md:pt-24">
      <div className="md:col-span-7">
        <h1 className="text-display-xl text-fg motion-safe:animate-rise">
          I build cloud infrastructure and explain how it works.
        </h1>
        <p className="mt-5 max-w-[36ch] text-lede text-fg-2 motion-safe:animate-rise motion-safe:[animation-delay:60ms]">
          Cloud and DevOps engineer. Three years shipping microservices on AWS, now finishing an MS in Computer Science at UNT.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-rise motion-safe:[animation-delay:120ms]">
          <Button href="/projects" size="lg">
            View projects
          </Button>
          <Button href="/fundamentals" variant="secondary" size="lg">
            Read the guides
          </Button>
        </div>
      </div>
      <div className="motion-safe:animate-rise motion-safe:[animation-delay:60ms] md:col-span-5">
        <div className="relative mx-auto flex w-full max-w-[420px] items-end justify-center rounded-lg bg-surface-2 px-6 pt-6">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,var(--accent-soft),transparent_70%)] opacity-70" />
          <Avatar pose="laptop" width={380} priority className="relative" />
        </div>
      </div>
    </section>
  );
}
