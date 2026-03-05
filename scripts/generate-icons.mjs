/**
 * Generates PWA icons (192x192 and 512x512) using sharp + inline SVG.
 * Run: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "fs";

const ACCENT = "#51bdcb";
const sizes = [192, 512];

mkdirSync("public/icons", { recursive: true });

for (const size of sizes) {
  const fontSize = Math.round(size * 0.14);
  const subFontSize = Math.round(size * 0.065);
  const circleR = Math.round(size * 0.18);
  const cx = size / 2;
  const cy = Math.round(size * 0.4);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.15)}" fill="${ACCENT}"/>
    <circle cx="${cx}" cy="${cy}" r="${circleR}" fill="white"/>
    <text x="${cx}" y="${cy + Math.round(fontSize * 0.35)}" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="${fontSize}" fill="${ACCENT}">IC</text>
    <text x="${cx}" y="${Math.round(size * 0.72)}" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="${subFontSize}" fill="white" opacity="0.9">IPACOINCHE</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(`public/icons/icon-${size}x${size}.png`);
  console.log(`Created icon-${size}x${size}.png`);
}

// Apple touch icon (180x180)
const appleSize = 180;
const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${appleSize}" height="${appleSize}" viewBox="0 0 ${appleSize} ${appleSize}">
  <rect width="${appleSize}" height="${appleSize}" rx="27" fill="${ACCENT}"/>
  <circle cx="90" cy="72" r="32" fill="white"/>
  <text x="90" y="81" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="25" fill="${ACCENT}">IC</text>
  <text x="90" y="130" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="white" opacity="0.9">IPACOINCHE</text>
</svg>`;

await sharp(Buffer.from(appleSvg)).png().toFile("public/icons/apple-touch-icon.png");
console.log("Created apple-touch-icon.png");

console.log("Done!");
