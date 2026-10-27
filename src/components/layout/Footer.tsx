import Link from "next/link";

const SITE_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/fundamentals", label: "Fundamentals" },
  { href: "/contact", label: "Contact" },
];

const ELSEWHERE = [
  { href: "https://github.com/CharithKapuluru", label: "GitHub" },
  { href: "https://www.linkedin.com/in/charith-kapuluru-159456329/", label: "LinkedIn" },
  { href: "mailto:kapulurucharith@gmail.com", label: "Email" },
];

const YEAR = new Date().getFullYear(); // evaluated at build time (static export)

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-body font-semibold text-fg">Charith Kapuluru</p>
          <p className="mt-1 text-small text-fg-3">Cloud and DevOps engineer</p>
        </div>
        <nav aria-label="Footer" className="flex gap-16">
          <div>
            <p id="footer-site" className="text-caption font-medium text-fg-3">Site</p>
            <ul aria-labelledby="footer-site" className="mt-3 space-y-2">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-small text-fg-2 hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p id="footer-elsewhere" className="text-caption font-medium text-fg-3">Elsewhere</p>
            <ul aria-labelledby="footer-elsewhere" className="mt-3 space-y-2">
              {ELSEWHERE.map((l) => {
                const external = l.href.startsWith("http");
                return (
                  <li key={l.href}>
                    <a href={l.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="text-small text-fg-2 hover:text-fg">
                      {l.label}
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-caption text-fg-3 sm:flex-row sm:justify-between sm:px-6">
          <p>© {YEAR} Charith Kapuluru</p>
          <p>Built with Next.js. Hosted on Firebase.</p>
        </div>
      </div>
    </footer>
  );
}
