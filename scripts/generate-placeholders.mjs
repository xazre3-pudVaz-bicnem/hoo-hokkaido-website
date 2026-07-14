/**
 * プレースホルダー画像の生成スクリプト。
 *   npm run generate:images
 *
 * 正式な写真が用意できたら、public/images/ 配下の同名ファイルを
 * 上書きするだけで差し替え完了です（コード変更は不要）。
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = (p) => join(root, "public", "images", p);

const palette = {
  forestDark: "#164C3B",
  forest: "#24765B",
  forestLight: "#DDEDE4",
  water: "#43AFC7",
  waterLight: "#DDF4F7",
  sky: "#8FD4E4",
  navy: "#17364A",
  offWhite: "#F7FAF7",
};

/** 山・川・空を模したシンプルな風景プレースホルダーSVG */
function landscapeSvg({ w, h, label, from, to, accent }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <linearGradient id="river" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${palette.waterLight}" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <path d="M0 ${h * 0.55} L${w * 0.22} ${h * 0.3} L${w * 0.42} ${h * 0.52} L${w * 0.6} ${h * 0.34} L${w * 0.8} ${h * 0.55} L${w} ${h * 0.42} L${w} ${h} L0 ${h} Z"
    fill="${palette.forestDark}" opacity="0.5"/>
  <path d="M0 ${h * 0.68} L${w * 0.18} ${h * 0.5} L${w * 0.38} ${h * 0.66} L${w * 0.58} ${h * 0.48} L${w * 0.78} ${h * 0.68} L${w} ${h * 0.56} L${w} ${h} L0 ${h} Z"
    fill="${palette.forestDark}" opacity="0.75"/>
  <path d="M${w * 0.32} ${h} C ${w * 0.42} ${h * 0.86} ${w * 0.36} ${h * 0.78} ${w * 0.5} ${h * 0.72} C ${w * 0.62} ${h * 0.67} ${w * 0.6} ${h * 0.62} ${w * 0.72} ${h * 0.6} L${w * 0.62} ${h * 0.6} C ${w * 0.52} ${h * 0.63} ${w * 0.54} ${h * 0.68} ${w * 0.44} ${h * 0.74} C ${w * 0.32} ${h * 0.81} ${w * 0.36} ${h * 0.88} ${w * 0.24} ${h} Z"
    fill="url(#river)"/>
  <path d="M0 ${h * 0.94} C ${w * 0.25} ${h * 0.9} ${w * 0.5} ${h * 0.98} ${w * 0.75} ${h * 0.94} C ${w * 0.88} ${h * 0.92} ${w * 0.95} ${h * 0.93} ${w} ${h * 0.94} L${w} ${h} L0 ${h} Z"
    fill="${accent}" opacity="0.35"/>
  <text x="${w / 2}" y="${h / 2}" text-anchor="middle" font-family="Arial, sans-serif"
    font-size="${Math.round(w / 34)}" font-weight="bold" letter-spacing="4"
    fill="#FFFFFF" opacity="0.85">${label}</text>
  <text x="${w / 2}" y="${h / 2 + Math.round(w / 22)}" text-anchor="middle" font-family="Arial, sans-serif"
    font-size="${Math.round(w / 60)}" letter-spacing="3" fill="#FFFFFF" opacity="0.6">PLACEHOLDER IMAGE</text>
</svg>`;
}

function logoSvg(size) {
  const s = size;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${s * 0.2}" fill="${palette.forestDark}"/>
  <path d="M${s * 0.25} ${s * 0.42} L${s * 0.5} ${s * 0.2} L${s * 0.75} ${s * 0.42}" stroke="${palette.forestLight}" stroke-width="${s * 0.05}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M${s * 0.15} ${s * 0.62} q ${s * 0.09} -${s * 0.07} ${s * 0.18} 0 t ${s * 0.18} 0 t ${s * 0.18} 0 t ${s * 0.18} 0" stroke="${palette.sky}" stroke-width="${s * 0.05}" fill="none" stroke-linecap="round"/>
  <path d="M${s * 0.15} ${s * 0.76} q ${s * 0.09} -${s * 0.07} ${s * 0.18} 0 t ${s * 0.18} 0 t ${s * 0.18} 0 t ${s * 0.18} 0" stroke="${palette.waterLight}" stroke-width="${s * 0.05}" fill="none" stroke-linecap="round"/>
</svg>`;
}

const images = [
  // ヒーロー
  { path: "hero/hero-rafting.jpg", w: 2000, h: 1200, label: "FURANO RIVER", from: palette.navy, to: palette.forest, accent: palette.water },
  { path: "hero/hero-river.jpg", w: 2000, h: 1200, label: "HOKKAIDO RIVER", from: palette.forestDark, to: palette.water, accent: palette.sky },
  { path: "hero/hero-mobile.jpg", w: 1080, h: 1620, label: "FURANO RIVER", from: palette.navy, to: palette.forest, accent: palette.water },
  // アクティビティ
  { path: "activities/furano-downriver.jpg", w: 1200, h: 900, label: "FURANO DOWNRIVER", from: palette.forest, to: palette.water, accent: palette.sky },
  { path: "activities/biei-downriver.jpg", w: 1200, h: 900, label: "BIEI DOWNRIVER", from: palette.forestDark, to: palette.sky, accent: palette.water },
  { path: "activities/asahikawa-downriver.jpg", w: 1200, h: 900, label: "ASAHIKAWA DOWNRIVER", from: palette.navy, to: palette.water, accent: palette.sky },
  { path: "activities/organize-program.jpg", w: 1200, h: 900, label: "ORGANIZE PROGRAM", from: palette.forestDark, to: palette.forest, accent: palette.sky },
  // ガイド
  { path: "guide/shota-kose.jpg", w: 900, h: 1100, label: "GUIDE", from: palette.forest, to: palette.forestDark, accent: palette.sky },
  { path: "guide/safety-guide.jpg", w: 1200, h: 900, label: "SAFETY", from: palette.navy, to: palette.forest, accent: palette.water },
  // プロジェクト
  { path: "projects/river-management.jpg", w: 1200, h: 900, label: "RIVER MANAGEMENT", from: palette.water, to: palette.forestDark, accent: palette.sky },
  { path: "projects/community-space.jpg", w: 1200, h: 900, label: "COMMUNITY SPACE", from: palette.forest, to: palette.sky, accent: palette.waterLight },
  { path: "projects/regional-tourism.jpg", w: 1200, h: 900, label: "REGIONAL TOURISM", from: palette.forestDark, to: palette.water, accent: palette.sky },
  // 共通風景
  { path: "common/river-landscape.jpg", w: 1600, h: 1000, label: "RIVER LANDSCAPE", from: palette.sky, to: palette.forest, accent: palette.water },
  { path: "common/hokkaido-forest.jpg", w: 1600, h: 1000, label: "HOKKAIDO FOREST", from: palette.forestDark, to: palette.forest, accent: palette.forestLight },
  { path: "common/furano-landscape.jpg", w: 1600, h: 1000, label: "FURANO LANDSCAPE", from: palette.navy, to: palette.sky, accent: palette.water },
  // OGP
  { path: "og/og-image.jpg", w: 1200, h: 630, label: "HOKKAIDO OUTDOOR ORGANIZATION", from: palette.forestDark, to: palette.water, accent: palette.sky },
  // コラム アイキャッチ
  { path: "column/choose-activity.jpg", w: 1200, h: 675, label: "COLUMN", from: palette.forest, to: palette.water, accent: palette.sky },
  { path: "column/clothing-guide.jpg", w: 1200, h: 675, label: "COLUMN", from: palette.navy, to: palette.forest, accent: palette.sky },
  { path: "column/furano-trip.jpg", w: 1200, h: 675, label: "COLUMN", from: palette.forestDark, to: palette.sky, accent: palette.water },
  { path: "column/before-booking.jpg", w: 1200, h: 675, label: "COLUMN", from: palette.water, to: palette.forestDark, accent: palette.sky },
  { path: "column/biei-nature.jpg", w: 1200, h: 675, label: "COLUMN", from: palette.forest, to: palette.sky, accent: palette.waterLight },
  { path: "column/asahikawa-river.jpg", w: 1200, h: 675, label: "COLUMN", from: palette.navy, to: palette.water, accent: palette.sky },
];

for (const img of images) {
  const dest = out(img.path);
  await mkdir(dirname(dest), { recursive: true });
  const svg = landscapeSvg(img);
  await sharp(Buffer.from(svg)).jpeg({ quality: 78, mozjpeg: true }).toFile(dest);
  console.log("generated:", img.path);
}

// ロゴ（PNG）
const logoDest = out("logo/hoo-logo-placeholder.png");
await mkdir(dirname(logoDest), { recursive: true });
await sharp(Buffer.from(logoSvg(512))).png().toFile(logoDest);
console.log("generated: logo/hoo-logo-placeholder.png");

console.log("done.");
