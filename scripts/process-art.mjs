// scripts/process-art.mjs
// One-time art pipeline: poses (transparent) -> trimmed webp,
// scenes -> 3 responsive webp sizes, photo -> webp.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const POSES = ["master", "wave", "laptop", "peek", "point", "read", "bored", "lost", "head"];
const SCENES = ["hill", "workshop", "library", "mailbox", "woods"];
const SCENE_WIDTHS = [1920, 1280, 768];

await mkdir("public/world/poses", { recursive: true });
await mkdir("public/world/scenes", { recursive: true });

for (const name of POSES) {
  await sharp(`avatar-art/cut/${name}.png`)
    .trim()
    .resize({ width: name === "head" ? 800 : 600, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(`public/world/poses/${name}.webp`);
  console.log("pose:", name);
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
console.log("photo done");
