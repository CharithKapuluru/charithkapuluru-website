import type { ReactElement } from "react";
import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  AppleLogo, AppWindow, ArrowCounterClockwise, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen,
  BookmarkSimple, Books, Broadcast, Broom, Buildings, Car, CaretDown, CaretRight, CastleTurret,
  ChartBar, ChatCenteredText, ChatCircleText, Check, CheckCircle, ClipboardText, Clock, CloudArrowUp,
  Code, Confetti, CookingPot, Copy, Cpu, Database, Desktop, DeviceMobile, EnvelopeSimple, Export, Eye,
  FileText, Flame, Flask, FloppyDisk, Folder, ForkKnife, Gear, GitBranch, GithubLogo, Globe, Hammer,
  Handshake, HardDrives, House, HouseLine, Info, Key, Laptop, Lightbulb, Lightning, LinkedinLogo,
  LinuxLogo, List, Lock, MagnifyingGlass, Monitor, Moon, Note, Package, PencilSimple, Play, Plugs,
  PushPin, Question, RocketLaunch, Scales, Scroll, ShareNetwork, ShieldCheck, ShoppingCart, Shuffle,
  SkipForward, Sparkle, Storefront, Sun, Tag, Target, Television, Terminal, Ticket, Timer, Trash, Tree,
  TrendUp, Truck, User, Users, Warning, Wrench, X, XCircle, XLogo,
} from "@phosphor-icons/react/dist/ssr";

export const ICONS = {
  "apple-logo": AppleLogo, "app-window": AppWindow, "arrow-counter-clockwise": ArrowCounterClockwise,
  "arrow-left": ArrowLeft, "arrow-right": ArrowRight, "arrow-up-right": ArrowUpRight, "book-open": BookOpen,
  bookmark: BookmarkSimple, books: Books, broadcast: Broadcast, broom: Broom, buildings: Buildings, car: Car,
  "caret-down": CaretDown, "caret-right": CaretRight, castle: CastleTurret, "chart-bar": ChartBar,
  "chat-centered": ChatCenteredText, "chat-circle": ChatCircleText, check: Check, "check-circle": CheckCircle,
  "clipboard-text": ClipboardText, clock: Clock, "cloud-arrow-up": CloudArrowUp, code: Code, confetti: Confetti,
  "cooking-pot": CookingPot, copy: Copy, cpu: Cpu, database: Database, desktop: Desktop,
  "device-mobile": DeviceMobile, envelope: EnvelopeSimple, export: Export, eye: Eye, "file-text": FileText,
  flame: Flame, flask: Flask, "floppy-disk": FloppyDisk, folder: Folder, "fork-knife": ForkKnife, gear: Gear,
  "git-branch": GitBranch, github: GithubLogo, globe: Globe, hammer: Hammer, handshake: Handshake,
  "hard-drives": HardDrives, house: House, "house-line": HouseLine, info: Info, key: Key, laptop: Laptop,
  lightbulb: Lightbulb, lightning: Lightning, linkedin: LinkedinLogo, linux: LinuxLogo, list: List, lock: Lock,
  search: MagnifyingGlass, monitor: Monitor, moon: Moon, note: Note, package: Package, pencil: PencilSimple,
  play: Play, plugs: Plugs, pin: PushPin, question: Question, "rocket-launch": RocketLaunch, scales: Scales,
  scroll: Scroll, share: ShareNetwork, "shield-check": ShieldCheck, "shopping-cart": ShoppingCart,
  shuffle: Shuffle, "skip-forward": SkipForward, sparkle: Sparkle, storefront: Storefront, sun: Sun, tag: Tag,
  target: Target, television: Television, terminal: Terminal, ticket: Ticket, timer: Timer, trash: Trash,
  tree: Tree, "trend-up": TrendUp, truck: Truck, user: User, users: Users, warning: Warning, wrench: Wrench,
  x: X, "x-circle": XCircle, "x-logo": XLogo,
} satisfies Record<string, Icon>;

export type IconName = keyof typeof ICONS;

export function isIconName(name: string | undefined): name is IconName {
  return !!name && Object.prototype.hasOwnProperty.call(ICONS, name);
}

/** Render a registry icon by name. Unknown names render the Info icon so nothing ever renders as text. */
export function iconFor(name: string | undefined, props: IconProps = {}): ReactElement {
  const Cmp: Icon = isIconName(name) ? ICONS[name] : Info;
  return <Cmp size={20} weight="regular" aria-hidden {...props} />;
}
