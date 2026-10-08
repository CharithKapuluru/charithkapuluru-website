export const NAV_LINKS = [
  { key: "projects", href: "/projects", label: "Projects" },
  { key: "fundamentals", href: "/fundamentals", label: "Fundamentals" },
  { key: "contact", href: "/contact", label: "Contact" },
] as const;

export type NavKey = (typeof NAV_LINKS)[number]["key"] | "home";
