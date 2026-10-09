import type { Metadata } from "next";

export const SITE_NAME = "Charith Kapuluru";
export const OG_IMAGES = [{ url: "/og.png", width: 1200, height: 630, alt: "Charith Kapuluru, Cloud and DevOps engineer" }];

/**
 * Open Graph for one page: its own title, description and canonical url, plus the parts every page shares.
 * Next replaces a parent's `openGraph` object instead of merging it, so a page that sets `openGraph` loses the root layout's
 * type, site name and image unless it repeats them; this helper repeats them. `path` is resolved against `metadataBase`.
 */
export function pageOpenGraph({ title, description, path }: { title: string; description: string; path: string }): NonNullable<Metadata["openGraph"]> {
  return { type: "website", siteName: SITE_NAME, title, description, url: path, images: OG_IMAGES };
}
