import type { Metadata } from "next";

export const SITE_NAME = "Charith Kapuluru";
export const OG_IMAGES = [{ url: "/og.png", width: 1200, height: 630, alt: "Charith Kapuluru, Cloud and DevOps engineer" }];
export const TWITTER_IMAGES = OG_IMAGES.map((image) => image.url);

/**
 * Open Graph for one page: its own title, description and canonical url, plus the parts every page shares.
 * Next replaces a parent's `openGraph` object instead of merging it, so a page that sets `openGraph` loses the root layout's
 * type, site name and image unless it repeats them; this helper repeats them. `path` is resolved against `metadataBase`.
 */
export function pageOpenGraph({ title, description, path }: { title: string; description: string; path: string }): NonNullable<Metadata["openGraph"]> {
  return { type: "website", siteName: SITE_NAME, title, description, url: path, images: OG_IMAGES };
}

/**
 * Twitter/X card for one page. The root layout's `twitter` object would otherwise be inherited whole, so every page would share the
 * home page's title and description; like `openGraph`, a page-level `twitter` replaces it, so the large-image card and the shared image are repeated here.
 */
export function pageTwitter({ title, description }: { title: string; description: string }): NonNullable<Metadata["twitter"]> {
  return { card: "summary_large_image", title, description, images: TWITTER_IMAGES };
}
