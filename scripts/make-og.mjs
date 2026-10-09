// scripts/make-og.mjs
// Generates public/og.png (1200x630): dark surface, avatar head, name and role. Run once; commit the output.
import sharp from "sharp";

const W = 1200;
const H = 630;
const font = "Helvetica Neue, Helvetica, Arial, sans-serif";

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0b0b0d"/>
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#eb9b63"/>
  <text x="520" y="285" font-family="${font}" font-size="64" font-weight="700" fill="#f2f2f4">Charith Kapuluru</text>
  <text x="520" y="345" font-family="${font}" font-size="30" fill="#a7a7b0">Cloud and DevOps engineer</text>
  <text x="520" y="405" font-family="${font}" font-size="24" fill="#7c7c86">charithkapuluru.com</text>
</svg>`;

const head = await sharp("public/world/poses/head.webp").resize({ width: 340, withoutEnlargement: true }).png().toBuffer();
const meta = await sharp(head).metadata();

await sharp(Buffer.from(svg))
  .composite([{ input: head, left: 120, top: Math.round((H - (meta.height ?? 340)) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile("public/og.png");

console.log("wrote public/og.png");
