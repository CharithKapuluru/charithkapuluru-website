// Pure, testable rewrite rules for the redesign codemod. No file IO here.

export const ALIAS_MAP = {
  "bg-paper": "surface",
  "bg-cream": "bg",
  "bg-stone": "surface-2",
  "text-charcoal": "fg",
  "text-taupe": "fg-2",
  "text-olive": "fg-3",
  "accent-moss": "accent",
  "accent-terracotta": "danger",
  "accent-sand": "accent",
  "accent-sage": "success",
};

const VARIANT = "((?:[a-z-]+:)*)";
const UTIL = "(bg|text|border(?:-[xytrbls]|-[se])?|from|via|to|ring|fill|stroke|divide(?:-[xy])?|outline|shadow|placeholder|decoration|accent|caret)";
const ALIAS_TOKENS = Object.keys(ALIAS_MAP).join("|");

export function mapAliasClasses(src) {
  const re = new RegExp(`\\b${VARIANT}${UTIL}-(${ALIAS_TOKENS})(?![\\w-])`, "g");
  return src.replace(re, (_, variant, util, token) => `${variant}${util}-${ALIAS_MAP[token]}`);
}

export function mapAliasVars(src) {
  return src.replace(new RegExp(`--color-(${ALIAS_TOKENS})\\b`, "g"), (_, token) => `--color-${ALIAS_MAP[token]}`);
}

const FAMILY_TONE = {
  amber: "tip", yellow: "tip", orange: "tip",
  blue: "info", sky: "info", indigo: "info",
  purple: "accent", violet: "accent", pink: "accent",
  emerald: "success", green: "success", teal: "success",
  red: "danger", rose: "danger",
};
const GRAYS = new Set(["gray", "slate", "zinc", "neutral", "stone"]);
const TERMINAL = { tip: "terminal-accent", accent: "terminal-accent", info: "terminal-info", success: "terminal-ok", danger: "terminal-danger" };

/** Returns the semantic replacement for `<util>-<family>-<shade>`, or null for unknown families. */
export function paletteReplacement(util, family, shade) {
  const base = util.replace(/^(border|divide)-.*$/, "$1");
  if (GRAYS.has(family)) {
    if (base === "bg") return shade >= 700 ? "terminal" : "surface-2";
    if (base === "text") return shade <= 300 ? "terminal-fg" : shade === 400 ? "terminal-fg/70" : "fg-3";
    return "border";
  }
  const tone = FAMILY_TONE[family];
  if (!tone) return null;
  switch (base) {
    case "bg":
      return shade <= 200 ? `${tone}-soft` : tone;
    case "text":
      return shade <= 400 ? TERMINAL[tone] : tone;
    case "from":
    case "via":
    case "to":
      return shade <= 200 ? `${tone}-soft` : tone;
    case "border":
    case "ring":
    case "divide":
    case "outline":
      return shade <= 200 ? `${tone}/30` : tone;
    default:
      return tone;
  }
}

const FAMILIES = [...Object.keys(FAMILY_TONE), ...GRAYS].join("|");
const SOFT_SUFFIX = "/30";
const SOFT_UTIL = /^(?:border|ring|divide|outline)/;

export function mapPaletteClasses(src) {
  const re = new RegExp(`\\b${VARIANT}${UTIL}-(${FAMILIES})-(\\d{2,3})(/\\d+)?(?![\\w-])`, "g");
  return src.replace(re, (whole, variant, util, family, shade, opacity) => {
    const replacement = paletteReplacement(util, family, Number(shade));
    if (!replacement) return whole;
    if (!replacement.includes("/")) return `${variant}${util}-${replacement}${opacity ?? ""}`;
    // The 30% default on pale borders and rings yields to an opacity written in the source; a computed one (terminal-fg/70) wins.
    if (opacity && SOFT_UTIL.test(util) && replacement.endsWith(SOFT_SUFFIX)) return `${variant}${util}-${replacement.slice(0, -SOFT_SUFFIX.length)}${opacity}`;
    return `${variant}${util}-${replacement}`;
  });
}

export const EMOJI_ICON = {
  "🏢": "buildings", "🏠": "house", "📋": "clipboard-text", "📦": "package", "💾": "floppy-disk", "🎉": "confetti",
  "⚡": "lightning", "🚗": "car", "🔧": "wrench", "🔒": "lock", "🔑": "key", "📄": "file-text", "💡": "lightbulb",
  "🐳": "package", "🏨": "buildings", "🌍": "globe", "🧹": "broom", "🧪": "flask", "🛡️": "shield-check", "🛡": "shield-check",
  "🚀": "rocket-launch", "😱": "warning", "🔥": "flame", "🔌": "plugs", "📜": "scroll", "📚": "books", "📖": "book-open",
  "📊": "chart-bar", "📁": "folder", "💻": "laptop", "💥": "lightning", "👥": "users", "👤": "user", "🏷️": "tag",
  "🏙️": "buildings", "🎯": "target", "🌙": "moon", "🌐": "globe", "✨": "sparkle", "🪟": "app-window", "🤯": "sparkle",
  "🤝": "handshake", "🤔": "question", "🛒": "shopping-cart", "🚛": "truck", "🗣️": "chat-circle", "🗑️": "trash",
  "🖥️": "desktop", "🔨": "hammer", "🔐": "lock", "🔀": "shuffle", "📺": "television", "📱": "device-mobile",
  "📤": "export", "📡": "broadcast", "📝": "file-text", "📌": "pin", "📈": "trend-up", "💽": "hard-drives",
  "💯": "check-circle", "💭": "chat-circle", "💬": "chat-circle", "💪": "lightning", "👨": "user", "👔": "user",
  "👏": "check-circle", "👍": "check-circle", "👁️": "eye", "🐧": "linux", "🐍": "code", "🏰": "castle",
  "🏪": "storefront", "🏘️": "house-line", "🏗️": "buildings", "🎫": "ticket", "🍽️": "fork-knife", "🍳": "cooking-pot",
  "🍎": "apple-logo", "🌳": "tree", "✏️": "pencil", "✉️": "envelope", "⚠️": "warning", "⚖️": "scales", "☀️": "sun",
  "⚙️": "gear", "✅": "check-circle", "❌": "x-circle",
  "🆓": "tag", "⏰": "clock", "▶️": "play",
};

// Pictographs and symbols, with optional variation selector / ZWJ sequences. U+2713 and U+2717 (check and ballot marks) are kept.
// Also matches enclosed alphanumerics (U+1F100-1F2FF), the clock and media block (U+23E9-23FA), and U+25B6 only when followed by U+FE0F, so plain triangles stay.
const EMOJI_SEQ = "(?:[\\u{1F100}-\\u{1F2FF}]|[\\u{1F300}-\\u{1FAFF}]|[\\u{23E9}-\\u{23FA}]|\\u25B6(?=\\uFE0F)|[\\u{2600}-\\u{27BF}](?<![\\u2713\\u2717]))(?:\\uFE0F|\\u200D[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}])*";

export function stripEmoji(src) {
  const iconProp = new RegExp(`icon:\\s*"(${EMOJI_SEQ})"`, "gu");
  const withIcons = src.replace(iconProp, (_, emoji) => `icon: "${EMOJI_ICON[emoji] ?? EMOJI_ICON[emoji.replace(/\uFE0F/g, "")] ?? "info"}"`);
  return withIcons.replace(new RegExp(`[ \\t]?${EMOJI_SEQ}[ \\t]?`, "gu"), (m) => (m.startsWith(" ") && m.endsWith(" ") ? " " : ""));
}

export function transformFontSerif(src) {
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes("font-serif")) continue;
    let tag = null;
    for (let j = i; j >= Math.max(0, i - 8); j--) {
      const m = lines[j].match(/<(motion\.)?([a-zA-Z][\w.]*)\b/);
      if (m) {
        tag = m[2];
        break;
      }
    }
    const heading = tag !== null && /^h[1-4]$/.test(tag);
    lines[i] = heading ? lines[i].replace(/\bfont-serif\b/g, "font-display") : lines[i].replace(/ ?\bfont-serif\b/g, "").replace(/className=" /g, 'className="');
  }
  return lines.join("\n");
}

export function transformPhaseWrappers(src) {
  return src.replace(/data-phase="(\d+)"(\s*)className="mb-16 scroll-mt-32"/g, 'data-phase="$1" id="phase-$1"$2className="scroll-mt-24 border-t border-border py-12 first:border-t-0 first:pt-0"');
}

export function transformSectionTags(src) {
  return src.replace(/<Section id="([^"]+)" index=\{\d+\} sectionRef=/g, '<ArticleSection id="$1" ref=').replace(/<\/Section>/g, "</ArticleSection>");
}

export function transformMisc(src) {
  return src
    .replace(/scroll-mt-(?:14|32)/g, "scroll-mt-24")
    .replace(/useRef<\(HTMLDivElement \| null\)\[\]>/g, "useRef<(HTMLElement | null)[]>")
    .replace(/className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl py-16 lg:mr-64"/g, 'className="min-w-0"');
}

export function transformSource(src) {
  return [mapAliasClasses, mapAliasVars, mapPaletteClasses, stripEmoji, transformFontSerif, transformPhaseWrappers, transformSectionTags, transformMisc].reduce((acc, fn) => fn(acc), src);
}
