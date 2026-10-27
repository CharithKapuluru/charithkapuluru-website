// scripts/process-art.mjs
// One-time art pipeline: poses (transparent) -> trimmed webp plus smaller variants for small slots,
// scenes -> 3 responsive webp sizes, photo -> webp plus a 720 px variant.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const POSES = ["master", "wave", "laptop", "peek", "point", "read", "bored", "lost", "head"];
const SCENES = ["woods"];
const SCENE_WIDTHS = [1920, 1280, 768];

// <pose>-<w>.webp next to each full-size pose, so a 36 px nav head or a 110 px peek does not download the full sprite.
// A variant is only written when it is at least 10% narrower than the full-size file: a sprite is never enlarged, and a file within a few
// pixels of the original saves nothing (wave is 489 px wide, so a 480 px copy would weigh the same). Avatar.tsx builds its srcSet with the same rule.
const POSE_VARIANTS = [240, 480];
const HEAD_VARIANTS = [96, 192];
const worthKeeping = (variantWidth, fullWidth) => variantWidth <= Math.floor(fullWidth * 0.9);

await mkdir("public/world/poses", { recursive: true });
await mkdir("public/world/scenes", { recursive: true });

const trimmedPose = (name) => sharp(`avatar-art/cut/${name}.png`).trim();

for (const name of POSES) {
  const { width: fullWidth } = await trimmedPose(name)
    .resize({ width: name === "head" ? 800 : 600, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(`public/world/poses/${name}.webp`);
  console.log("pose:", name);

  for (const w of name === "head" ? HEAD_VARIANTS : POSE_VARIANTS) {
    if (!worthKeeping(w, fullWidth)) continue;
    await trimmedPose(name).resize({ width: w }).webp({ quality: 88 }).toFile(`public/world/poses/${name}-${w}.webp`);
    console.log("  variant:", `${name}-${w}`);
  }
}

for (const name of SCENES) {
  for (const w of SCENE_WIDTHS) {
    await sharp(`avatar-art/scene-${name}.png`)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(`public/world/scenes/${name}-${w}.webp`);
  }
  console.log("scene:", name);
}

await sharp("avatar-art/photo.png")
  .resize({ width: 800, withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile("public/world/charith-photo.webp");
await sharp("avatar-art/photo.png")
  .resize({ width: 720, withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile("public/world/charith-photo-720.webp");
console.log("photo done");
