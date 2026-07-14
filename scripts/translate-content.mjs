/**
 * コラム記事の翻訳支援スクリプト（Claude API）。
 *
 *   npm run translate:content -- --file=src/content/ja/columns/example.md
 *   npm run translate:content -- --file=src/content/ja/columns/example.md --locales=en,ko
 *   npm run translate:content -- --file=src/content/ja/columns/example.md --force
 *
 * 動作：
 *  1. 日本語の記事ファイル（Markdown）を読み込む
 *  2. 英語・繁体字中国語・簡体字中国語・韓国語の翻訳下書きを生成
 *  3. src/content/<locale>/columns/<同じファイル名>.md として保存
 *  4. 元記事と同じ translationKey を付与し、frontmatter の構造を維持する
 *  5. 内部リンク・画像パス・固有名詞・料金は書き換えない
 *  6. 既存の翻訳ファイルは上書きしない（--force 指定時のみ上書き）
 *  7. 生成した下書きは draft: true で保存され、人間が確認して draft を外すまで公開されない
 *
 * 注意：翻訳はこのスクリプト実行時（記事作成時）にのみ行われます。
 *       サイト閲覧時に翻訳APIを呼び出すことはありません（静的な翻訳ファイルを使用）。
 *
 * 必要な環境変数：
 *   ANTHROPIC_API_KEY   … Claude APIキー（https://console.anthropic.com で取得）
 *   ANTHROPIC_MODEL     … 省略可。既定は claude-opus-4-8
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

const root = path.join(import.meta.dirname, "..");

const TARGETS = {
  en: {
    name: "English",
    guide: `Natural, idiomatic English written by a native travel copywriter. Avoid stiff literal translation of Japanese.
Category examples: "Choosing", "Preparation", "Trip Planning", "Area Guide".`,
  },
  "zh-tw": {
    name: "繁體中文（台灣・香港）",
    guide: `台灣・香港旅客能自然閱讀的繁體中文。不可只是把日文漢字照搬（「予約」→「預約」，「案内」→「介紹」）。
分類範例：「如何選擇」「行前準備」「行程規劃」「地區導覽」。`,
  },
  "zh-cn": {
    name: "简体中文（中国大陆・新加坡）",
    guide: `中国大陆读者习惯的简体中文。不可只是把繁体机械转换成简体，用词要符合大陆表达（「泛舟」→「漂流」，「嚮導」→「向导」）。
分类示例：「如何选择」「行前准备」「行程规划」「地区指南」。`,
  },
  ko: {
    name: "한국어",
    guide: `한국인 여행자가 읽기 자연스러운 한국어. 일본어 어순을 그대로 옮긴 직역체는 금지.
분류 예시: "선택 가이드", "준비", "여행 계획", "지역 가이드".`,
  },
};

const SYSTEM_PROMPT = `あなたは、北海道・富良野を拠点にリバーアクティビティを提供する
Hokkaido Outdoor Organization（HOO）の公式サイトの記事を翻訳する、プロの旅行系コピーライター兼翻訳者です。

【最重要ルール】
1. 直訳せず、対象言語圏の旅行者が自然に読める文章にすること。
2. 事実を創作しないこと。原文にない サービス・年齢制限・送迎・保険・開催期間・所要時間・集合場所・料金 を追加してはいけません。
   原文が「お問い合わせください」「予約時にご案内します」なら、訳文も同じ意味を保つこと。
3. HOOのサービスは激流ラフティングではありません。
   「激流」「スリル満点」「アドレナリン」等の表現は禁止です。
   正しい表現：リバーアクティビティ／ゆったり川を下るダウンリバー体験／ガイドと楽しむリバーツアー。
   「ラフティング」という語はSEO目的で使ってよいが、実際のサービスが穏やかなダウンリバーであることを誤解させないこと。
4. 固有名詞は表記を統一：Hokkaido Outdoor Organization / HOO / Furano（富良野）/ Biei（美瑛）/ Asahikawa（旭川）/ Shota Kose（小瀬 祥太）/ Rescue3 SRT-1
   サービス名：Furano Relax Downriver / Biei Relax Downriver / Asahikawa Relax Downriver / Organize Program
5. Markdown の内部リンク（/activities/... , /reservation , /contact , /faq など）は**絶対に書き換えない**。
   言語プレフィックスはアプリ側が自動で付与します。
6. 画像パス（image:）・publishedAt・updatedAt・translationKey・related は原文のままコピーすること。
7. 料金の数字を本文へ書かないこと。

【出力形式】
frontmatter を含む完全な Markdown ファイルのみを出力してください。
コードフェンス（\`\`\`）や説明文は一切付けないでください。`;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { file: "", locales: Object.keys(TARGETS), force: false };
  for (const arg of args) {
    if (arg.startsWith("--file=")) opts.file = arg.slice(7);
    else if (arg.startsWith("--locales=")) opts.locales = arg.slice(10).split(",");
    else if (arg === "--force") opts.force = true;
  }
  return opts;
}

const opts = parseArgs();

if (!opts.file) {
  console.error(`
使い方:
  npm run translate:content -- --file=src/content/ja/columns/<記事>.md [--locales=en,ko] [--force]

オプション:
  --file      翻訳元の日本語記事（必須）
  --locales   翻訳先の言語（省略時: en,zh-tw,zh-cn,ko）
  --force     既存の翻訳ファイルを上書きする（既定では上書きしません）
`);
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(`
✖ 環境変数 ANTHROPIC_API_KEY が設定されていません。

  1. https://console.anthropic.com でAPIキーを取得してください
  2. プロジェクトルートの .env.local に次の行を追加してください:

     ANTHROPIC_API_KEY=sk-ant-...

  3. 実行時に読み込ませる場合の例（PowerShell）:

     $env:ANTHROPIC_API_KEY="sk-ant-..."; npm run translate:content -- --file=...
`);
  process.exit(1);
}

const sourcePath = path.isAbsolute(opts.file)
  ? opts.file
  : path.join(root, opts.file);

if (!fs.existsSync(sourcePath)) {
  console.error(`✖ ファイルが見つかりません: ${sourcePath}`);
  process.exit(1);
}

const filename = path.basename(sourcePath);
const source = fs.readFileSync(sourcePath, "utf-8");
const { data: frontmatter } = matter(source);

if (!frontmatter.translationKey) {
  console.error(
    `✖ 元記事に translationKey がありません: ${filename}\n  frontmatter に translationKey を追加してください。`
  );
  process.exit(1);
}

const client = new Anthropic();
const model = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";

console.log(`\n翻訳元: ${opts.file}`);
console.log(`translationKey: ${frontmatter.translationKey}`);
console.log(`使用モデル: ${model}\n`);

let created = 0;
let skipped = 0;

for (const locale of opts.locales) {
  const target = TARGETS[locale];
  if (!target) {
    console.warn(`⚠ 未対応の言語のためスキップ: ${locale}`);
    continue;
  }

  const outDir = path.join(root, "src", "content", locale, "columns");
  const outPath = path.join(outDir, filename);

  // 既存の翻訳ファイルを無断で上書きしない
  if (fs.existsSync(outPath) && !opts.force) {
    console.log(
      `- ${locale}: 既存ファイルがあるためスキップしました（上書きするには --force を指定）`
    );
    skipped++;
    continue;
  }

  const userPrompt = `次の日本語記事を ${target.name} に翻訳してください。

【この言語の方針】
${target.guide}

【frontmatter の扱い】
- title / description / category / imageAlt … 翻訳する
- locale … "${locale}" にする
- translationKey … "${frontmatter.translationKey}" のまま（変更禁止）
- image / publishedAt / updatedAt / related … 原文のままコピー
- draft … true を必ず追加する（人間の確認前に公開しないため）

【翻訳元の記事】
${source}`;

  process.stdout.write(`- ${locale}: 翻訳中…`);

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    if (response.stop_reason === "refusal") {
      process.stdout.write(" 失敗（モデルが応答を拒否しました）\n");
      continue;
    }

    let text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    // 念のためコードフェンスを除去
    text = text.replace(/^```(?:markdown|md)?\n/, "").replace(/\n```$/, "");

    // 生成物の検証：frontmatter が壊れていないか、必須項目が保たれているか
    const { data: out } = matter(text);
    if (out.translationKey !== frontmatter.translationKey) {
      process.stdout.write(" 失敗（translationKey が一致しません）\n");
      continue;
    }
    if (out.image !== frontmatter.image) {
      process.stdout.write(" 失敗（image のパスが変更されています）\n");
      continue;
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, text.endsWith("\n") ? text : `${text}\n`, "utf-8");
    process.stdout.write(` 完了 → src/content/${locale}/columns/${filename}\n`);
    created++;
  } catch (error) {
    process.stdout.write(` 失敗（${error.message}）\n`);
  }
}

console.log(`
─────────────────────────────
生成: ${created}件 ／ スキップ: ${skipped}件

生成された翻訳は draft: true の下書きです。
内容を確認し、公開してよければ frontmatter の draft を削除（または false に）してください。
draft: true のままの記事は、一覧にも詳細ページにも表示されません。
`);
