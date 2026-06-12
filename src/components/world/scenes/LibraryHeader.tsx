import Avatar from "@/components/world/Avatar";
import SpeechBubble from "@/components/world/SpeechBubble";

interface LibraryHeaderProps {
  title: string;
  subtitle?: string;
  avatarLine?: string;
}

export default function LibraryHeader({ title, subtitle, avatarLine }: LibraryHeaderProps) {
  return (
    <header className="relative overflow-hidden">
      <img
        src="/world/scenes/library-1920.webp"
        srcSet="/world/scenes/library-768.webp 768w, /world/scenes/library-1280.webp 1280w, /world/scenes/library-1920.webp 1920w"
        sizes="100vw"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-text-charcoal/10 to-text-charcoal/45" />
      <div className="relative mx-auto flex min-h-[320px] max-w-5xl items-end justify-between gap-6 px-5 pb-8 pt-28 md:px-8">
        <div className="max-w-2xl rounded-2xl bg-bg-paper/95 p-6 paper-shadow">
          <h1 className="font-serif text-3xl font-semibold text-text-charcoal md:text-5xl" style={{ textWrap: "balance" }}>
            {title}
          </h1>
          {subtitle && <p className="mt-2 font-sans text-text-taupe">{subtitle}</p>}
        </div>
        {avatarLine && (
          <div className="hidden flex-col items-center gap-2 lg:flex">
            <SpeechBubble tail="bottom">{avatarLine}</SpeechBubble>
            <Avatar pose="read" width={140} />
          </div>
        )}
      </div>
    </header>
  );
}
