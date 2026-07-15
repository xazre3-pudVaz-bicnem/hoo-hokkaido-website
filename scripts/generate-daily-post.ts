/**
 * 毎日1記事の完全自動ブログ生成スクリプト（Claude API）。
 *
 *   npx tsx scripts/generate-daily-post.ts
 *
 * - モデルは既定で claude-haiku-4-5-20251001（コスト重視）。
 *   環境変数 ANTHROPIC_MODEL が設定されていればそちらを優先します。
 * - 生成した日本語記事を src/content/blog/ja/<slug>.md に保存します。
 * - トピックプールから、まだ扱っていないテーマを選んで重複を避けます。
 * - GitHub Actions から呼び出し、main へ直接コミット → Vercel が自動公開します。
 *
 * 必要な環境変数: ANTHROPIC_API_KEY（GitHub Secret）
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

// ─────────────────────────────────────────────────────────────
// 設定
// ─────────────────────────────────────────────────────────────

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
const MODEL = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog", "ja");

/** サイト情報（HOO） */
const SITE = {
  name: "Hokkaido Outdoor Organization",
  shortName: "HOO",
  area: "富良野・北海道",
  business: "アウトドアアクティビティ・ラフティング・自然体験",
};

/** 実在する内部リンク（存在するページのみ） */
const INTERNAL_LINKS = [
  "/furano-activity", // 富良野のアクティビティ（ピラー）
  "/furano-rafting", // 富良野のラフティング・川体験
  "/activities", // アクティビティ一覧
  "/reservation", // 予約フォーム
  "/access", // アクセス
  "/contact", // お問い合わせ
  "/faq", // よくある質問
];

/** アイキャッチ画像プール（既存の画像を日替わりで割り当てる） */
const IMAGE_POOL: { image: string; alt: string }[] = [
  { image: "/images/column/river-kayak.jpg", alt: "富良野の川を進むリバーアクティビティ" },
  { image: "/images/column/river-aerial.jpg", alt: "上空から見た富良野の川と自然" },
  { image: "/images/column/canoe-pov.jpg", alt: "川面から見た富良野の景色" },
  { image: "/images/column/clothing-guide.jpg", alt: "ライフジャケットを着けて富良野の川を下る" },
  { image: "/images/column/summer-field.jpg", alt: "夏の富良野の風景" },
  { image: "/images/column/mountain-view.jpg", alt: "富良野の山並みの景色" },
  { image: "/images/column/lavender.jpg", alt: "富良野のラベンダー畑" },
  { image: "/images/column/blue-pond.jpg", alt: "北海道・美瑛の青い池の水辺" },
  { image: "/images/column/furano-autumn.jpg", alt: "秋の富良野の風景" },
  { image: "/images/common/river-landscape.jpg", alt: "富良野の川の風景" },
];

/** 記事テーマのプール（重複を避けて日替わりで選ぶ） */
const TOPICS = [
  { key: "富良野 アクティビティ", brief: "富良野で楽しめるアクティビティの全体像と選び方" },
  { key: "富良野 ラフティング", brief: "富良野のラフティング・川下りの種類と楽しみ方" },
  { key: "富良野 観光 アクティビティ", brief: "富良野観光に自然体験を組み合わせる楽しみ方" },
  { key: "北海道 アクティビティ", brief: "北海道旅行で楽しめる自然アクティビティと富良野の位置づけ" },
  { key: "富良野 自然体験", brief: "富良野で自然を五感で味わう体験の魅力" },
  { key: "富良野 夏 アクティビティ", brief: "夏の富良野で楽しむアクティビティと過ごし方" },
  { key: "富良野 家族 アクティビティ", brief: "家族で楽しむ富良野の自然体験の選び方" },
  { key: "富良野 子供 アクティビティ", brief: "子どもと一緒に楽しむ富良野の川遊び・自然体験" },
  { key: "富良野 カップル アクティビティ", brief: "カップル・ふたり旅で楽しむ富良野のアクティビティ" },
  { key: "富良野 団体 アクティビティ", brief: "団体・グループで楽しむ富良野のアクティビティ" },
  { key: "富良野 修学旅行 アクティビティ", brief: "修学旅行で富良野の自然体験を取り入れる魅力" },
  { key: "富良野 社員旅行 アクティビティ", brief: "社員旅行・研修で富良野のアクティビティを楽しむ" },
  { key: "富良野 川遊び", brief: "富良野で楽しむ川遊びの魅力と安全に楽しむコツ" },
  { key: "北海道 ラフティング", brief: "北海道でのラフティング・川下りの楽しみ方" },
  { key: "空知川 ラフティング", brief: "富良野を流れる空知川での川下り体験の魅力" },
  { key: "富良野 アウトドア", brief: "富良野で楽しむアウトドアの入門と選び方" },
  { key: "富良野 旅行 体験", brief: "富良野旅行に体験の時間を加える価値" },
  { key: "富良野 観光 モデルコース", brief: "富良野観光にアクティビティを組み込むモデルコースの考え方" },
  { key: "富良野で自然を楽しむ方法", brief: "富良野で自然をより深く楽しむための方法" },
  { key: "初めてのラフティング", brief: "初めてのラフティング・川下りで知っておきたいこと" },
  { key: "ラフティングの服装", brief: "ラフティング・川下りに適した服装の考え方" },
  { key: "ラフティングの持ち物", brief: "ラフティング・川下りに用意したい持ち物" },
  { key: "子供と楽しむラフティング", brief: "子どもと一緒に川下りを楽しむための準備と心構え" },
  { key: "雨の日のラフティング", brief: "雨の日の川のアクティビティの考え方と過ごし方" },
  { key: "夏休みの富良野観光", brief: "夏休みの富良野観光にアクティビティを取り入れる" },
  { key: "富良野で半日楽しめる体験", brief: "半日で楽しめる富良野のアクティビティの組み込み方" },
  { key: "旅行者向けアウトドア体験", brief: "旅行者が気軽に楽しめる富良野のアウトドア体験" },
  { key: "富良野で家族旅行におすすめの体験", brief: "家族旅行におすすめの富良野の自然体験" },
  { key: "北海道旅行で自然体験を入れるメリット", brief: "北海道旅行に自然体験を加えるメリット" },
  { key: "富良野観光とアウトドア体験の組み合わせ", brief: "富良野観光とアウトドア体験を組み合わせる楽しみ方" },
];

// ─────────────────────────────────────────────────────────────
// ユーティリティ
// ─────────────────────────────────────────────────────────────

/** JST（UTC+9）の当日日付 YYYY-MM-DD */
function jstDate(): string {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

/** slug を英数字とハイフンのみに正規化 */
function sanitizeSlug(raw: string): string {
  const s = String(raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "furano-activity";
}

function readExistingPosts(): { slug: string; title: string; tags: string[] }[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf-8"));
      return {
        slug: String(data.slug ?? f.replace(/\.md$/, "")),
        title: String(data.title ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      };
    });
}

/** まだ扱っていないテーマを選ぶ（無ければ最も古く扱ったものを再利用してローテーション） */
function pickTopic(existing: { title: string; tags: string[] }[]) {
  const usedText = existing.map((p) => `${p.title} ${p.tags.join(" ")}`);
  const isUsed = (topicKey: string) =>
    usedText.some((t) => t.includes(topicKey));

  const unused = TOPICS.filter((t) => !isUsed(t.key));
  if (unused.length > 0) {
    // 未使用の先頭から、日付でずらして選ぶ（毎日同じ順序に偏らないように）
    const idx = new Date().getUTCDate() % unused.length;
    return unused[idx];
  }
  // すべて一巡したら、記事数に応じてローテーション
  return TOPICS[existing.length % TOPICS.length];
}

function buildSystemPrompt(): string {
  return [
    `あなたは「${SITE.name}（${SITE.shortName}）」の公式ブログを執筆する、富良野在住のプロのアウトドアガイド兼SEOライターです。`,
    `${SITE.shortName}は北海道・富良野を拠点に、美瑛・旭川エリアも含めて川のアクティビティを開催しています。`,
    `主力は、川をゆったり下る「リラックスダウンリバー」。激しさやスリルを売りにするのではなく、川面から景色や水の音を楽しむ穏やかな体験です。事前予約制で、2名から参加できます。`,
    ``,
    `【文章の方針】`,
    `- 対象読者は、富良野・北海道への旅行を検討している人。観光・アウトドア体験らしい、自然で読みやすい日本語で書く。`,
    `- 地域名（富良野・北海道）、アクティビティ、ラフティング、川下り、自然体験といった語を自然に含める（SEOを意識しつつ、詰め込みすぎない）。`,
    `- 本文は2000〜3000文字程度。H2（##）とH3（###）で構成し、導入文・本文（複数の見出し）・まとめを入れる。`,
    `- AIっぽい定型的な言い回し（「いかがでしたか」等）や、過剰な煽りは使わない。`,
    ``,
    `【事実・安全に関する厳守事項】`,
    `- ${SITE.shortName}の体験は「ゆったり川を下る」もの。「激流」「絶叫」「スリル満点」などの表現は使わない。`,
    `- 「必ず開催」「絶対安全」「富良野で一番」「No.1」など、根拠のない断定・最上級表現は禁止。`,
    `- 料金・集合時間・所要時間・開催可否・対象年齢を具体的な数値で断定しない（「予約時にご案内」「事前にご相談ください」と表現）。`,
    `- 川のアクティビティは天候・水量・河川の状況により変更・中止になる可能性があることを、安全のプロセスとして自然に触れる。`,
    `- 架空の口コミ・評価・受賞・実績数を書かない。`,
    ``,
    `【内部リンク】`,
    `- 本文中に、次の実在ページへの内部リンクを2〜4個、文脈に合わせて自然に挿入する（Markdownのリンク記法）。`,
    `- 使用できるパスはこれだけ（ロケール接頭辞は付けない・末尾スラッシュ不要）：`,
    INTERNAL_LINKS.map((l) => `    - ${l}`).join("\n"),
    `- まとめの段落には、少なくとも [富良野のアクティビティ](/furano-activity) と [予約フォーム](/reservation) への導線を含める。`,
    ``,
    `【出力形式】`,
    `- 出力は次のキーを持つJSONオブジェクトのみ。前後に説明文やコードフェンスを付けない。`,
    `  {`,
    `    "title": "記事タイトル（30〜45文字程度、キーワードを含む）",`,
    `    "slug": "英小文字とハイフンのみのスラッグ（例: furano-summer-river-activity）",`,
    `    "description": "120文字以内のメタ description",`,
    `    "category": "カテゴリ（例: アクティビティ / ラフティング / 家族・子ども / 季節 / 旅行計画 / 準備・服装）",`,
    `    "tags": ["キーワード", "関連キーワード", "..."] (3〜5個),`,
    `    "body": "本文（Markdown。## と ### の見出しを使い、導入・本文・まとめを含む。frontmatterは含めない)"`,
    `  }`,
  ].join("\n");
}

function buildUserPrompt(
  topic: { key: string; brief: string },
  existingTitles: string[]
): string {
  return [
    `今日のブログ記事のテーマは「${topic.key}」です。`,
    `狙い: ${topic.brief}`,
    ``,
    `次の既存記事とテーマ・タイトルが重複しないようにしてください（言い回しや切り口を変える）:`,
    existingTitles.length
      ? existingTitles.map((t) => `- ${t}`).join("\n")
      : "- （まだ記事はありません）",
    ``,
    `上記の方針・厳守事項に従い、JSONオブジェクトだけを出力してください。`,
  ].join("\n");
}

/** モデル出力から JSON を安全に取り出す */
function extractJson(text: string): Record<string, unknown> {
  let t = text.trim();
  // コードフェンスを除去
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  // 最初の { から最後の } までを取り出す
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("JSONが見つかりませんでした");
  return JSON.parse(t.slice(start, end + 1));
}

function toYamlList(items: string[]): string {
  return items.map((t) => `  - ${JSON.stringify(t)}`).join("\n");
}

// ─────────────────────────────────────────────────────────────
// メイン
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log("=== HOO 毎日ブログ生成 ===");
  console.log(`使用モデル (model): ${MODEL}${process.env.ANTHROPIC_MODEL ? " (ANTHROPIC_MODELで指定)" : " (既定)"}`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: 環境変数 ANTHROPIC_API_KEY が設定されていません。");
    process.exit(1);
  }

  fs.mkdirSync(BLOG_DIR, { recursive: true });

  const existing = readExistingPosts();
  const topic = pickTopic(existing);
  console.log(`選択テーマ (topic): ${topic.key}`);

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 8000,
    system: buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: buildUserPrompt(
          topic,
          existing.map((p) => p.title)
        ),
      },
    ],
  });
  const message = await stream.finalMessage();
  const raw = message.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");

  const data = extractJson(raw);

  const title = String(data.title ?? "").trim();
  const description = String(data.description ?? "").trim();
  const category = String(data.category ?? "アクティビティ").trim();
  const body = String(data.body ?? "").trim();
  const tags = Array.isArray(data.tags) && data.tags.length
    ? data.tags.map(String)
    : [topic.key];

  if (!title || !body) {
    console.error("ERROR: 生成結果に title / body が不足しています。");
    process.exit(1);
  }

  // slug を正規化し、既存と重複しないようにする
  const existingSlugs = new Set(existing.map((p) => p.slug));
  let slug = sanitizeSlug(String(data.slug ?? title));
  if (existingSlugs.has(slug)) {
    let n = 2;
    while (existingSlugs.has(`${slug}-${n}`)) n++;
    slug = `${slug}-${n}`;
  }

  // アイキャッチ画像を日替わりで割り当てる
  const img = IMAGE_POOL[existing.length % IMAGE_POOL.length];
  const date = jstDate();

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `slug: ${JSON.stringify(slug)}`,
    `description: ${JSON.stringify(description)}`,
    `date: ${JSON.stringify(date)}`,
    `category: ${JSON.stringify(category)}`,
    "tags:",
    toYamlList(tags),
    "locale: ja",
    `image: ${JSON.stringify(img.image)}`,
    `imageAlt: ${JSON.stringify(img.alt)}`,
    "---",
    "",
  ].join("\n");

  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, `${frontmatter}${body}\n`, "utf-8");

  console.log(`生成ファイル (file): src/content/blog/ja/${slug}.md`);
  console.log(`タイトル (title): ${title}`);
  console.log(`本文文字数 (chars): ${body.replace(/\s/g, "").length}`);
  console.log("=== 生成完了 ===");
}

main().catch((err) => {
  console.error("生成に失敗しました:", err);
  process.exit(1);
});
