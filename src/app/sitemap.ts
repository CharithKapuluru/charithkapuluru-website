// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { projects } from "@/lib/projectsData";
import { topics } from "@/lib/fundamentalsData";

export const dynamic = "force-static";

const BASE = "https://charithkapuluru.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, priority: 1 },
    { url: `${BASE}/projects/`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/fundamentals/`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/contact/`, lastModified: now, priority: 0.5 },
    ...projects.map((p) => ({ url: `${BASE}/projects/${p.slug}/`, lastModified: now, priority: 0.8 })),
    ...topics.map((t) => ({ url: `${BASE}/fundamentals/${t.slug}/`, lastModified: now, priority: 0.7 })),
  ];
}
