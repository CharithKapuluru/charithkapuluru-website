import Link from "next/link";

export default function GrassFooter() {
  return (
    <footer className="sky-gradient relative pt-20">
      <div className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-serif text-2xl font-semibold text-text-charcoal">
            Want to talk? <Link href="/contact" className="text-accent-moss underline underline-offset-4 hover:no-underline">Visit the mailbox</Link>
          </p>
          <div className="flex gap-8 font-sans text-sm font-bold text-text-olive">
            <a href="https://github.com/CharithKapuluru" target="_blank" rel="noopener noreferrer" className="hover:text-accent-moss">GitHub</a>
            <a href="https://www.linkedin.com/in/charith-kapuluru-159456329/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-moss">LinkedIn</a>
            <a href="mailto:kapulurucharith@gmail.com" className="hover:text-accent-moss">Email</a>
          </div>
          <p className="font-sans text-xs text-text-olive" suppressHydrationWarning>
            built with too many tabs open. {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
