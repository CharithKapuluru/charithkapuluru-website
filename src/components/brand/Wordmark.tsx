import Link from "next/link";
import AvatarHead from "./AvatarHead";
import { cn } from "@/lib/utils";

export default function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="Charith Kapuluru, home">
      <AvatarHead width={36} />
      <span className={cn("font-display text-[1.0625rem] font-semibold tracking-tight text-fg", compact && "hidden sm:inline")}>
        Charith Kapuluru
      </span>
    </Link>
  );
}
