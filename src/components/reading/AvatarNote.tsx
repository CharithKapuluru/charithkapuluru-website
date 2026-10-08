import Avatar, { type PoseName } from "@/components/brand/Avatar";

/** The one avatar moment on a reading page: a small pose with the page's one-liner as a muted caption. */
export default function AvatarNote({ pose = "read", line, width = 120 }: { pose?: PoseName; line?: string; width?: number }) {
  return (
    <figure className="flex flex-col items-center gap-2 lg:w-[160px]">
      <Avatar pose={pose} width={width} pokeable={false} />
      {line && <figcaption className="max-w-[22ch] text-center text-caption text-fg-3">{line}</figcaption>}
    </figure>
  );
}
