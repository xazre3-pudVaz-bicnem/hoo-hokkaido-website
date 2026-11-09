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
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
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
  // ヒーローは高解像度の夏の川下り写真に統一（PC・SP・OGP共通）
  { src: "IMG_9558 (1).HEIC", out: "hero/hero-rafting.jpg", size: [1600, 740], note: "川を下るラフトと十勝岳連峰（PC用ヒーロー・高解像度）" },
  { src: "IMG_1850 (1).jpg", out: "hero/hero-river.jpg", size: [1600, 740], trimBlack: true, note: "空撮：真上から見た川とラフト（未使用の予備）" },
  { src: "IMG_9558 (1).HEIC", out: "hero/hero-mobile.jpg", size: [1080, 1620], note: "川を下るラフトと十勝岳連峰（SP用ヒーロー・高解像度）" },

  // ── アクティビティ ──
  // 2026-27 シーズンから、ツアーごとの写真は下の TOURS で生成します（public/images/tours/<slug>/）。

  // ── ガイド ──
  { src: "IMG_8056 2 (1).heic", out: "guide/shota-kose.jpg", size: [900, 1100], pos: "top", note: "代表・小瀬祥太" },
  { src: "IMG_9600 (1).HEIC", out: "guide/safety-guide.jpg", size: [1400, 1050], note: "ガイドが漕ぐラフト" },

  // ── プロジェクト ──
  { src: "IMG_2523 (1).heic", out: "projects/river-management.jpg", size: [1400, 875], note: "水辺の艇・装備の管理" },
  { src: "IMG_9464 (1).HEIC", out: "projects/community-space.jpg", size: [1400, 875], note: "森の中の交流スペース" },
  { src: "IMG_9442 (1).HEIC", out: "projects/regional-tourism.jpg", size: [1400, 875], note: "富良野のラベンダー畑と山並み" },

  // ── 共通風景 ──
  { src: "IMG_1821 (1).HEIC", out: "common/river-landscape.jpg", size: [1600, 1000], note: "透明度の高い川をパックラフトで下る" },
  { src: "IMG_1045 (1).HEIC", out: "common/hokkaido-forest.jpg", size: [1600, 1000], note: "北海道の森（霧氷）" },
  { src: "IMG_1085 (1).HEIC", out: "common/furano-landscape.jpg", size: [1600, 1000], note: "富良野盆地と十勝岳連峰" },

  // ── OGP ──
  { src: "IMG_9558 (1).HEIC", out: "og/og-image.jpg", size: [1200, 630], note: "OGP：川を下るラフトと十勝岳連峰（ヒーローと統一）" },

  // ── コラム アイキャッチ ──
  { src: "IMG_1803 (1).HEIC", out: "column/choose-activity.jpg", size: [1200, 675], note: "団体でのラフティング" },
  { src: "IMG_1788 (1).JPG", out: "column/clothing-guide.jpg", size: [1200, 675], note: "ライフジャケットを着た参加者" },
  { src: "IMG_9433 (1).heic", out: "column/furano-trip.jpg", size: [1200, 675], note: "富良野の田園風景" },
  { src: "IMG_1787 (1).JPG", out: "column/before-booking.jpg", size: [1200, 675], note: "ラフトを漕ぐガイド" },
  { src: "IMG_9966 (1).HEIC", out: "column/biei-nature.jpg", size: [1200, 675], note: "美瑛・青い池" },
  { src: "IMG_4505 (1).JPG", out: "column/asahikawa-river.jpg", size: [1200, 675], note: "旭川市街地のカヌー" },

  // ── コラム増補用アイキャッチ（50記事対応） ──
  { src: "IMG_0167 (1).JPG", out: "column/river-kayak.jpg", size: [1200, 675], note: "森を流れる川" },
  { src: "IMG_0207 (1).HEIC", out: "column/lake-canoe.jpg", size: [1200, 675], note: "湖に浮かぶカヌー" },
  { src: "IMG_1848 (1).jpg", out: "column/river-aerial.jpg", size: [1200, 675], trimBlack: true, note: "空から見た富良野の川" },
  { src: "IMG_9108 (1).HEIC", out: "column/canoe-pov.jpg", size: [1200, 675], note: "カヌーから眺める川" },
  { src: "IMG_9550 (1).heic", out: "column/lavender.jpg", size: [1200, 675], note: "富良野のラベンダー畑" },
  { src: "IMG_9400 (1).heic", out: "column/summer-field.jpg", size: [1200, 675], note: "富良野の夏の花畑" },
  { src: "IMG_9440 (1).heic", out: "column/blue-pond.jpg", size: [1200, 675], note: "美瑛の青い池" },
  { src: "IMG_1749 (1).heic", out: "column/waterfall.jpg", size: [1200, 675], note: "美瑛の滝" },
  { src: "IMG_0347 (1).heic", out: "column/mountain-view.jpg", size: [1200, 675], note: "山からの眺め" },
  { src: "IMG_0451 (1).HEIC", out: "column/furano-autumn.jpg", size: [1200, 675], note: "秋の富良野と山並み" },
  { src: "IMG_0508 (1).heic", out: "column/autumn-road.jpg", size: [1200, 675], note: "秋の富良野の道と山" },
  { src: "IMG_0412 (1).HEIC", out: "column/vineyard.jpg", size: [1200, 675], note: "富良野のぶどう畑" },
];

/**
 * ツアーごとの写真（2026-27 シーズン〜）。
 *
 * 施主から Google ドライブのフォルダ単位（ツアー名ごと）で届いた写真を
 * photos-original/2026-27/<フォルダ名>/ に置き、ここで割り当てます。
 *
 * 出力（ファイル名に版を含めない代わりに、写真を差し替えるときは TOUR_PHOTO_VERSION を上げる。
 *  next/image の最適化キャッシュは URL が鍵のため、同じ名前で中身を替えると古い写真が残る）:
 *   public/images/tours/<版>/<slug>/card.jpg     … カード用 4:3（1200×900）
 *   public/images/tours/<版>/<slug>/hero.jpg     … 詳細ページ上部 3:2（1920×1280）
 *   public/images/tours/<版>/<slug>/photo-NN.jpg … ギャラリー（元の縦横比・長辺1400）
 *   src/data/tour-photos.generated.json          … 上記のパスと寸法（src/data/activities.ts が読み込む）
 *
 * main.card / main.hero: 切り抜きの基準。"attention"（被写体を自動判定）か、
 *   { y: 0〜1 }（縦長の写真で、上端0〜下端1 のどこを残すか）／{ x: 0〜1 }（横長の写真の左右）。
 * trimBlack: 動画から書き出した写真の黒帯を除去する
 * ギャラリーの説明文（alt）は各言語の activities.<slug>.gallery に、ここと同じ順番で置く。
 */
const TOUR_DIR = "2026-27";
const TOUR_PHOTO_VERSION = "v1";
const TOURS = [
  {
    slug: "furano-relax-downriver",
    folder: "富良野リラックスダウンリバー",
    main: { src: "IMG_9973 2.heic", card: "attention", hero: "attention" },
    gallery: ["IMG_9973 2.heic", "IMG_1788.JPG", "IMG_1787.JPG", "IMG_1749.heic", { src: "IMG_1848.jpg", trimBlack: true }, { src: "IMG_1850.jpg", trimBlack: true }],
  },
  {
    slug: "biei-relax-downriver",
    folder: "美瑛リラックスダウンリバー",
    main: { src: "IMG_9558.HEIC", card: "attention", hero: "attention" },
    gallery: ["IMG_9558.HEIC", "IMG_2886.jpg"],
  },
  {
    slug: "asahikawa-relax-downriver",
    folder: "旭川リラックスダウンリバー",
    main: { src: "IMG_0237.heic", card: "attention", hero: { y: 0.47 } },
    gallery: ["IMG_0237.heic", "IMG_0233.heic"],
  },
  {
    slug: "kamuikotan-sup",
    folder: "神居古潭SUPツアー",
    // IMG_6355 に写っているのは SUP ではなく小型ボートのため、メインは神居古潭の吊り橋（IMG_3027）にする
    main: { src: "IMG_3027.heic", card: "attention", hero: { y: 0.55 } },
    gallery: ["IMG_3027.heic", { src: "IMG_0374.PNG", trimBlack: true }, "IMG_6355.heic"],
  },
  {
    slug: "kamuikotan-rafting",
    folder: "神居古潭ラフティング",
    main: { src: "IMG_2230.heic", card: "attention", hero: { x: 0.5, y: 0.75 } },
    gallery: ["IMG_2230.heic", "IMG_0838.heic", "IMG_3004.jpg", "IMG_3013 2.heic", "IMG_3027.heic のコピー.heic"],
  },
  {
    slug: "furano-rafting",
    folder: "富良野ラフティング",
    main: { src: "IMG_2007.HEIC", card: "attention", hero: "attention" },
    gallery: ["IMG_2007.HEIC", "IMG_1803.heic"],
  },
  {
    slug: "organize-river",
    folder: "オーガナイズリバー",
    main: { src: "IMG_3212.heic", card: "attention", hero: "attention" },
    gallery: ["IMG_3212.heic", "IMG_0347.heic", "IMG_0480.HEIC"],
  },
  {
    slug: "organize-lake",
    folder: "オーガナイズレイク",
    main: { src: "IMG_0009 2.heic", card: "attention", hero: { y: 0.4 } },
    gallery: ["IMG_0009 2.heic", "IMG_0381.heic", "IMG_0383.HEIC", "IMG_0039.HEIC", "IMG_2523.heic"],
  },
  {
    slug: "organize-tour",
    folder: "オーガナイズサマー",
    main: { src: "IMG_0414.HEIC", card: "attention", hero: { y: 0.3 } },
    gallery: [
      "IMG_0414.HEIC", "IMG_9440.heic", "IMG_0412.heic", "IMG_9552.heic", "IMG_2952.heic", "IMG_0449.heic", "IMG_0451.HEIC",
      "IMG_9465.HEIC", "IMG_0416.HEIC", "IMG_0385.heic", "IMG_9432.heic", "IMG_0413.HEIC", "IMG_0464.HEIC", "IMG_0508.heic",
    ],
  },
  {
    slug: "sup-rental",
    folder: "SUPレンタル",
    main: { src: "IMG_2027.heic", card: "attention", hero: "attention" },
    gallery: ["IMG_2027.heic"],
  },
  {
    slug: "snowshoe-tour",
    folder: "スノーシューツアー",
    main: { src: "IMG_1253.HEIC", card: "attention", hero: "attention" },
    gallery: ["IMG_1253.HEIC", "IMG_1080.HEIC", "IMG_0573.HEIC", "IMG_0998.heic", "IMG_1290.heic"],
  },
  {
    slug: "organize-winter",
    folder: "オーガナイズウィンター",
    // IMG_3112 2.jpg（紅葉のリフト）は冬のツアーと季節が合わないため使っていない（施主に確認中）
    main: { src: "IMG_1085.HEIC", card: "attention", hero: "attention" },
    gallery: ["IMG_1085.HEIC", "IMG_1045.HEIC", "IMG_0888.heic", "IMG_1166.HEIC", "IMG_1241.HEIC"],
  },
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

/** 読み込み＋（必要なら）黒帯除去をして、向きを確定したバッファにする */
async function loadBuffer(file, { trimBlack = false } = {}) {
  let img = await load(file);
  if (trimBlack) {
    img = sharp(await img.trim({ background: "#000000", threshold: 25 }).toBuffer());
  }
  // raw（HEIC）→ PNG に一度固めて、寸法を確定させる
  return img.png({ compressionLevel: 1 }).toBuffer();
}

/**
 * 縦横比 ratio（幅/高さ）で切り抜く。focus が "attention" なら sharp の自動判定、
 * { x, y } なら残す位置（0〜1）を指定する。
 */
async function cropTo(buffer, width, height, focus) {
  if (focus === "attention" || !focus) {
    return sharp(buffer).resize(width, height, {
      fit: "cover",
      position: focus === "attention" ? sharp.strategy.attention : "centre",
    });
  }
  const meta = await sharp(buffer).metadata();
  const ratio = width / height;
  let cw = meta.width;
  let ch = Math.round(cw / ratio);
  if (ch > meta.height) {
    ch = meta.height;
    cw = Math.round(ch * ratio);
  }
  const fx = focus.x ?? 0.5;
  const fy = focus.y ?? 0.5;
  const left = Math.round(Math.min(Math.max(0, fx * meta.width - cw / 2), meta.width - cw));
  const top = Math.round(Math.min(Math.max(0, fy * meta.height - ch / 2), meta.height - ch));
  return sharp(buffer).extract({ left, top, width: cw, height: ch }).resize(width, height);
}

async function buildTours() {
  const manifest = {};
  const jpeg = { quality: 80, mozjpeg: true, progressive: true };
  for (const tour of TOURS) {
    const base = `tours/${TOUR_PHOTO_VERSION}/${tour.slug}`;
    const outDir = path.join(OUT_DIR, base);
    await mkdir(outDir, { recursive: true });
    const srcOf = (f) => path.join(TOUR_DIR, tour.folder, f);

    const mainBuf = await loadBuffer(srcOf(tour.main.src));
    await (await cropTo(mainBuf, 1200, 900, tour.main.card)).jpeg(jpeg).toFile(path.join(outDir, "card.jpg"));
    await (await cropTo(mainBuf, 1920, 1280, tour.main.hero)).jpeg(jpeg).toFile(path.join(outDir, "hero.jpg"));

    const gallery = [];
    for (const [i, entry] of tour.gallery.entries()) {
      const item = typeof entry === "string" ? { src: entry } : entry;
      const buf = await loadBuffer(srcOf(item.src), { trimBlack: item.trimBlack });
      const name = `photo-${String(i + 1).padStart(2, "0")}.jpg`;
      const info = await sharp(buf)
        .resize(1400, 1400, { fit: "inside", withoutEnlargement: true })
        .jpeg(jpeg)
        .toFile(path.join(outDir, name));
      gallery.push({ src: `/images/${base}/${name}`, width: info.width, height: info.height });
    }

    manifest[tour.slug] = {
      card: `/images/${base}/card.jpg`,
      hero: `/images/${base}/hero.jpg`,
      gallery,
    };
    console.log(`✓ ${base}（ギャラリー ${gallery.length}枚） ← ${tour.folder}/${tour.main.src}`);
  }
  const manifestPath = path.join(root, "src", "data", "tour-photos.generated.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("✓ src/data/tour-photos.generated.json");
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
  // 差し替え時はこのファイル名を変更してください（photos-original/ に置いた元ロゴ）
  const source = path.join(SRC_DIR, "ロゴ.png");
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

  // ファビコン（icon.png / favicon.ico）
  // 小さいサイズでも見えるよう、余白ぎりぎりまでトリミングしてから正方形に収める
  const trimmed = await sharp(normal, raw).trim().png().toBuffer();
  const tm = await sharp(trimmed).metadata();
  const side = Math.round(Math.max(tm.width, tm.height) * 1.18);
  const mark = await sharp(trimmed)
    .resize(Math.round(side * 0.9), Math.round(side * 0.9), { fit: "inside" })
    .png()
    .toBuffer();
  const square = await sharp({
    create: {
      width: side,
      height: side,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toBuffer();

  await sharp(square)
    .resize(512, 512, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(root, "src", "app", "icon.png"));
  console.log("✓ src/app/icon.png");

  // favicon.ico は複数解像度を束ねるため png-to-ico で生成
  try {
    const mod = await import("png-to-ico");
    const pngToIco = mod.default ?? mod;
    const sizes = await Promise.all(
      [16, 32, 48].map((s) => sharp(square).resize(s, s).png().toBuffer())
    );
    const ico = await pngToIco(sizes);
    await writeFile(path.join(root, "src", "app", "favicon.ico"), ico);
    console.log("✓ src/app/favicon.ico");
  } catch {
    console.log(
      "- favicon.ico はスキップしました（生成するには `npm i -D png-to-ico` を実行してください）"
    );
  }
}

// `npm run photos -- --only=tours` でツアー写真だけを作り直す
const onlyTours = process.argv.includes("--only=tours");

const files = await readdir(SRC_DIR);
const tourFiles = TOURS.flatMap((t) =>
  [t.main.src, ...t.gallery.map((g) => (typeof g === "string" ? g : g.src))].map((f) =>
    path.join(TOUR_DIR, t.folder, f)
  )
);
const missing = [
  ...(onlyTours ? [] : [...new Set(MAPPING.map((m) => m.src)), "ロゴ.png"].filter((f) => !files.includes(f))),
  ...tourFiles.filter((f) => !existsSync(path.join(SRC_DIR, f))),
];
if (missing.length) {
  console.error("photos-original/ に見つからないファイル:\n" + missing.join("\n"));
  process.exit(1);
}

if (!onlyTours) {
  await buildPhotos();
  await buildLogo();
}
await buildTours();
console.log("\n完了しました。");
