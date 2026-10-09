import SiteNav from "@/components/layout/SiteNav";
import Button from "@/components/ui/Button";
import Avatar from "@/components/brand/Avatar";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main" className="relative min-h-[calc(100dvh_-_4rem)] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/world/scenes/woods-1920.webp"
          srcSet="/world/scenes/woods-768.webp 768w, /world/scenes/woods-1280.webp 1280w, /world/scenes/woods-1920.webp 1920w"
          sizes="100vw"
          fetchPriority="low"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgb(11_11_13_/_0.4))]" />
        <div className="relative mx-auto flex min-h-[calc(100dvh_-_4rem)] max-w-4xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
          <div className="rounded-lg border border-border bg-surface px-8 py-6 shadow-float">
            <h1 className="font-display text-display-lg text-fg">404</h1>
            <p className="mt-2 text-body text-fg-2">This page does not exist.</p>
            <Button href="/" className="mt-6">
              Back to home
            </Button>
          </div>
          <Avatar pose="lost" width={170} pokeable={false} />
        </div>
      </main>
    </>
  );
}
