/**
 * 提供写真（photos-original/）をサイト用画像（public/images/）へ書き出すスクリプト。
 *   npm run photos
 *
 * - HEIC は WASM デコーダ（heic-decode）で読み込み、JPEG に変換します。
 * - 出力先のファイル名は data ファイルが参照しているパスと一致しています。
 * - 写真を差し替えたい場合は、下の MAPPING の `src` を変更して再実行してください。
 *
 * 事前準備: npm install --no-save heic-decode
 */
import { mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import decodeHeic from "heic-decode";

const root = path.join(import.meta.dirname, "..");
const SRC_DIR = path.join(root, "photos-original");
const OUT_DIR = path.join(root, "public", "images");

/**
 * 写真の配置マップ。
 * src: photos-original/ 内のファイル名
 * out: public/images/ 配下の出力パス
 * size: [幅, 高さ]（トリミングあり）／ null なら元のアスペクト比のまま
 * pos: トリミング基準位置（sharp の position。既定は center）
 * trimBlack: 動画から書き出した写真の左右の黒帯を除去する
 */
const MAPPING = [
  // ── ヒーロー ──
  { src: "IMG_1848 (1).jpg", out: "hero/hero-rafting.jpg", size: [1600, 740], trimBlack: true, note: "空撮：富良野の川とラフト（PC用ヒーロー）" },
  { src: "IMG_1850 (1).jpg", out: "hero/hero-river.jpg", size: [1600, 740], trimBlack: true, note: "空撮：真上から見た川とラフト" },
  { src: "IMG_2007 (1).HEIC", out: "hero/hero-mobile.jpg", size: [1080, 1620], note: "川を下るラフト（SP用ヒーロー）" },

  // ── アクティビティ ──
  { src: "IMG_9558 (1).HEIC", out: "activities/furano-downriver.jpg", size: [1400, 1050], note: "富良野：川を下るラフトと十勝岳連峰" },
  { src: "IMG_1821 (1).HEIC", out: "activities/biei-downriver.jpg", size: [1400, 1050], note: "美瑛：透明度の高い川をパックラフトで下る" },
  { src: "IMG_0237 (1).heic", out: "activities/asahikawa-downriver.jpg", size: [1400, 1050], note: "旭川：市街地の川を下るラフト" },
  { src: "IMG_1803 (1).HEIC", out: "activities/organize-program.jpg", size: [1400, 1050], note: "団体でのラフティング" },

  // ── ガイド ──
  { src: "IMG_8056 2 (1).heic", out: "guide/shota-kose.jpg", size: [900, 1100], pos: "top", note: "代表・小瀬祥太" },
  { src: "IMG_9600 (1).HEIC", out: "guide/safety-guide.jpg", size: [1400, 1050], note: "ガイドが漕ぐラフト" },

  // ── プロジェクト ──
  { src: "IMG_2523 (1).heic", out: "projects/river-management.jpg", size: [1400, 875], note: "水辺の艇・装備の管理" },
  { src: "IMG_9464 (1).HEIC", out: "projects/community-space.jpg", size: [1400, 875], note: "森の中の交流スペース" },
  { src: "IMG_9442 (1).HEIC", out: "projects/regional-tourism.jpg", size: [1400, 875], note: "富良野のラベンダー畑と山並み" },

  // ── 共通風景 ──
  { src: "IMG_9973 2 (1).heic", out: "common/river-landscape.jpg", size: [1600, 1000], note: "夕暮れの川を下るグループ" },
  { src: "IMG_1045 (1).HEIC", out: "common/hokkaido-forest.jpg", size: [1600, 1000], note: "北海道の森（霧氷）" },
  { src: "IMG_1085 (1).HEIC", out: "common/furano-landscape.jpg", size: [1600, 1000], note: "富良野盆地と十勝岳連峰" },

  // ── OGP ──
  { src: "IMG_1848 (1).jpg", out: "og/og-image.jpg", size: [1200, 630], trimBlack: true, note: "OGP：空撮の川とラフト" },

  // ── コラム アイキャッチ ──
  { src: "IMG_0009 2 (1).heic", out: "column/choose-activity.jpg", size: [1200, 675], note: "湖に浮かぶカヌー・カヤック" },
  { src: "IMG_1788 (1).JPG", out: "column/clothing-guide.jpg", size: [1200, 675], note: "ライフジャケットを着た参加者" },
  { src: "IMG_9433 (1).heic", out: "column/furano-trip.jpg", size: [1200, 675], note: "富良野の田園風景" },
  { src: "IMG_1787 (1).JPG", out: "column/before-booking.jpg", size: [1200, 675], note: "ラフトを漕ぐガイド" },
  { src: "IMG_9966 (1).HEIC", out: "column/biei-nature.jpg", size: [1200, 675], note: "美瑛・青い池" },
  { src: "IMG_4505 (1).JPG", out: "column/asahikawa-river.jpg", size: [1200, 675], note: "旭川市街地のカヌー" },
];

/** 元ファイル（HEIC含む）を sharp インスタンスとして読み込む */
async function load(file) {
  const full = path.join(SRC_DIR, file);
  if (/\.(heic|heif)$/i.test(file)) {
    const { width, height, data } = await decodeHeic({ buffer: await readFile(full) });
    return sharp(Buffer.from(data), { raw: { width, height, channels: 4 } });
  }
  return sharp(full, { unlimited: true }).rotate();
}

async function buildPhotos() {
  for (const item of MAPPING) {
    const dest = path.join(OUT_DIR, item.out);
    await mkdir(path.dirname(dest), { recursive: true });
    let img = await load(item.src);
    if (item.trimBlack) {
      // 動画から書き出した写真に残る黒帯（レターボックス）を除去
      img = sharp(
        await img.trim({ background: "#000000", threshold: 25 }).toBuffer()
      );
    }
    if (item.size) {
      img = img.resize(item.size[0], item.size[1], {
        fit: "cover",
        position: item.pos ?? "centre",
      });
    }
    await img.jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(dest);
    console.log(`✓ ${item.out}  ← ${item.src}`);
  }
}

/**
 * ロゴ処理。
 * 提供ロゴは白背景・不透明なので、白背景を透過に変換し、
 * 濃色の文字を白へ置き換えた「反転版（暗い背景用）」も生成します。
 */
async function buildLogo() {
  const source = path.join(SRC_DIR, "ロゴ_0.png");
  const logoDir = path.join(OUT_DIR, "logo");
  await mkdir(logoDir, { recursive: true });

  const base = sharp(source).ensureAlpha();
  const { data, info } = await base
    .raw()
    .toBuffer({ resolveWithObject: true });

  const normal = Buffer.from(data);
  const inverted = Buffer.from(data);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const isBackground = mx - mn <= 18 && mn >= 236; // 無彩色かつ白に近い＝背景
    if (isBackground) {
      normal[i + 3] = 0;
      inverted[i + 3] = 0;
      continue;
    }
    // 反転版：濃色（ロゴの文字部分）を白へ
    if (mx < 130) {
      inverted[i] = 255;
      inverted[i + 1] = 255;
      inverted[i + 2] = 255;
    }
  }

  const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
  await sharp(normal, raw).png().toFile(path.join(logoDir, "hoo-logo.png"));
  await sharp(inverted, raw).png().toFile(path.join(logoDir, "hoo-logo-white.png"));
  console.log("✓ logo/hoo-logo.png, logo/hoo-logo-white.png");

  // ファビコン（正方形・白背景にロゴを配置）
  const mark = await sharp(normal, raw).resize(400, null, { fit: "inside" }).png().toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(path.join(root, "src", "app", "icon.png"));
  console.log("✓ src/app/icon.png");
}

const files = await readdir(SRC_DIR);
const missing = [...new Set(MAPPING.map((m) => m.src)), "ロゴ_0.png"].filter(
  (f) => !files.includes(f)
);
if (missing.length) {
  console.error("photos-original/ に見つからないファイル:\n" + missing.join("\n"));
  process.exit(1);
}

await buildPhotos();
await buildLogo();
console.log("\n完了しました。");
