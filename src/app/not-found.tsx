import Link from "next/link";
import WorldNav from "@/components/world/WorldNav";
import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

export default function NotFound() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <WorldNav />
      <img
        src="/world/scenes/woods-1920.webp"
        srcSet="/world/scenes/woods-768.webp 768w, /world/scenes/woods-1280.webp 1280w, /world/scenes/woods-1920.webp 1920w"
        sizes="100vw"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-4xl flex-col items-center justify-center gap-6 px-5 text-center">
        <div className="rounded-2xl bg-bg-paper/95 px-8 py-6 paper-shadow">
          <h1 className="font-serif text-5xl font-semibold text-text-charcoal">404</h1>
          <p className="mt-2 font-sans text-lg text-text-taupe">
            This page does not exist. We are both lost now.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-text-charcoal px-7 py-3.5 font-sans text-base font-bold text-white transition-colors hover:bg-accent-moss active:scale-[0.98]"
          >
            Take me back
          </Link>
        </div>
        <div className="flex items-end gap-2">
          <SpeechBubble tail="right">this is fine</SpeechBubble>
          <Avatar pose="lost" width={170} />
        </div>
      </div>
    </main>
  );
}
