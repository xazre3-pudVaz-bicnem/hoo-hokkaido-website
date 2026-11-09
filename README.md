# Hokkaido Outdoor Organization（HOO）公式サイト

富良野・美瑛・旭川のリバーアクティビティを提供する HOO のコーポレートサイト兼予約サイトです。
**日本語・英語・繁体字中国語・簡体字中国語・韓国語の5言語**に対応しています。

- フレームワーク: Next.js（App Router）+ TypeScript + Tailwind CSS v4
- 多言語化: 外部ライブラリ不使用（App Router の `[locale]` セグメント＋型付き辞書による自作構成）
- アニメーション: Framer Motion（`prefers-reduced-motion` 対応）
- アイコン: Lucide Icons
- メール送信: Resend（環境変数で有効化）
- 記事翻訳支援: Claude API（`@anthropic-ai/sdk`。ビルド前・記事作成時のみ実行）
- デプロイ想定: Vercel

## セットアップ

```bash
npm install
cp .env.example .env.local   # 値を設定
npm run dev                  # http://localhost:3000
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー |
| `npm run lint` | ESLint |
| `npm run i18n:check` | **翻訳漏れ・キー不一致・メタデータ重複の検出** |
| `npm run translate:content` | **コラム記事の翻訳下書き生成（Claude API）** |
| `npm run photos` | 提供写真からサイト用画像を生成 |
| `npm run generate:images` | プレースホルダー画像の生成（写真が無い場合） |

---

## 多言語構成

### 対応言語とURL

| 言語 | ロケール | URL | `<html lang>` | hreflang |
| --- | --- | --- | --- | --- |
| 日本語 | `ja` | `/...`（プレフィックスなし） | `ja` | `ja` |
| 英語 | `en` | `/en/...` | `en` | `en` |
| 繁体字中国語 | `zh-tw` | `/zh-tw/...` | `zh-Hant` | `zh-Hant` |
| 簡体字中国語 | `zh-cn` | `/zh-cn/...` | `zh-Hans` | `zh-Hans` |
| 韓国語 | `ko` | `/ko/...` | `ko` | `ko` |

- `x-default` は日本語ページ（サイトの原本言語）を指します。
- **canonical は各言語ページ自身**を指します（英語ページを日本語ページに向けていません）。

### 既存URLの扱い（リダイレクト）

`src/middleware.ts` が担当します。

| アクセス | 挙動 |
| --- | --- |
| `/activities` など | 日本語ページを表示（内部で `/ja/activities` を描画。アドレス欄はそのまま） |
| `/` | 日本語トップを表示。ただしサイトの外から来て、日本語以外の言語cookieがあるときはその言語へ **307**（一時） |
| `/ja/...` 旧URL | プレフィックスなしのURLへ **308**（恒久）— 旧URLの検索評価を引き継ぐ |
| `/会社概要` など旧WixのURL | 対応するページへ **308**（恒久）— `src/lib/legacy-redirects.ts` |
| `/en/...` など | そのまま通す |

初回訪問時の言語判定は**自動リダイレクトではなく、画面右下の控えめな案内バナー**（`LanguageBanner`）で行います。検索エンジンをブラウザ言語で強制リダイレクトしません。ユーザーが一度選択した言語は cookie（`hoo_locale`・1年）に保存され、以降優先されます。

### ページ構成（全5言語 × 17ページ = 85ページ）

```
/[locale]                          トップページ
/[locale]/activities               アクティビティ一覧
/[locale]/activities/[slug]        詳細（12件：下の「アクティビティ一覧」を参照）
/[locale]/furano-activity          富良野のアクティビティSEOページ
/[locale]/furano-rafting           富良野のラフティング・川体験SEOページ
/[locale]/about                    HOOについて（MISSION・VISION・代表紹介・多言語対応の案内）
/[locale]/projects                 プロジェクト
/[locale]/safety                   安全への取り組み
/[locale]/faq                      よくある質問
/[locale]/access                   アクセス
/[locale]/reservation              予約フォーム（?activity=<slug> で初期選択）
/[locale]/contact                  お問い合わせ
/[locale]/column, /column/[slug]   コラム
/[locale]/privacy, /terms, /sitemap
/sitemap.xml, /robots.txt          自動生成（全言語 + hreflang付き）
```

---

## 翻訳ファイルの場所

| 種類 | 場所 |
| --- | --- |
| **UI文言・ページ本文・アクティビティ説明・FAQ・メタデータ** | `src/i18n/messages/{ja,en,zh-tw,zh-cn,ko}.json` |
| **メール本文（管理者宛・自動返信）** | `src/i18n/emails.ts` |
| **コラム記事** | `src/content/{locale}/columns/*.md` |
| 言語定義（ラベル・lang属性・hreflang） | `src/i18n/locales.ts` |

`ja.json` が**基準（型の定義元）**です。他言語で未翻訳のキーがあっても、自動的に日本語へフォールバックするため、**翻訳キー（例: `home.hero.title`）が画面に出ることはありません**。開発環境では不足キーがコンソールに警告されます。

### 文章を修正する方法

該当言語の JSON を編集するだけです。例：英語トップページの見出しを変えるなら

```jsonc
// src/i18n/messages/en.json
{
  "home": {
    "hero": {
      "title": "Hokkaido's rivers,\nhours you won't forget."   // \n は意図的な改行
    }
  }
}
```

編集後は `npm run i18n:check` で整合性を確認してください。

### 新しい翻訳キーを追加する方法

1. `src/i18n/messages/ja.json` にキーを追加する（**必ず日本語が先**。ここが型の定義元です）
2. 他の4言語の JSON に同じキーを追加する
3. コンポーネントから型付きで参照する（文字列キーではなくプロパティアクセスなので、TypeScriptが存在を保証します）

```tsx
const dict = await getDictionary(locale);
<h2>{dict.home.hero.title}</h2>
```

4. `npm run i18n:check` を実行して漏れがないか確認

### 新しい多言語ページを追加する方法

`src/app/[locale]/<新ページ>/page.tsx` を作成し、次の型を守ります。

```tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.meta.newPage.title,          // ja.json に meta.newPage を追加しておく
    description: dict.meta.newPage.description,
    path: "/new-page",                       // ロケールを含まないパス
  });
}
```

- 内部リンクは必ず `localePath(locale, "/xxx")` を使ってください（日本語は `/xxx`、それ以外は `/en/xxx` のように言語プレフィックスが付きます）。
- `src/app/sitemap.ts` の `staticPaths` にパスを追加すると、全言語ぶんがサイトマップに載ります。
- ヘッダー/フッターに出す場合は `src/data/site.ts` の `navigation` / `footerLinks` にキーを追加し、5言語の `nav` / `footer.links` にラベルを追加します。

---

## 記事を翻訳する方法（翻訳支援スクリプト）

日本語の記事を書いたあと、Claude API で4言語の**下書き**を生成できます。

```bash
# 全4言語ぶんの下書きを生成
npm run translate:content -- --file=src/content/ja/columns/example.md

# 言語を指定
npm run translate:content -- --file=src/content/ja/columns/example.md --locales=en,ko

# 既存の翻訳ファイルを上書きする（既定では上書きしません）
npm run translate:content -- --file=src/content/ja/columns/example.md --force
```

スクリプトの挙動：

- 元記事と同じ `translationKey` を付与し、frontmatter の構造を維持します
- 内部リンク・画像パス・固有名詞・料金は書き換えません（生成後に検証し、壊れていれば保存しません）
- **既存の翻訳ファイルは上書きしません**（`--force` 指定時のみ）
- 生成物は **`draft: true`** で保存されます。人間が内容を確認し、`draft` を外すまで一覧にも詳細ページにも表示されません
- `ANTHROPIC_API_KEY` が未設定の場合は、設定方法を示すエラーメッセージを表示して終了します

> **重要**: 翻訳はこのスクリプト実行時（記事作成時）にのみ行われます。**サイト閲覧時に翻訳APIを呼び出すことはありません。**生成された Markdown は静的コンテンツとしてビルドに含まれます。

### 記事の frontmatter

```md
---
title: "記事タイトル"
description: "説明（コロンを含む場合は必ずダブルクォートで囲む）"
locale: ja
translationKey: example-article     # 言語間で記事を紐づけるキー
category: 選び方
publishedAt: "2026-07-14"
updatedAt: "2026-07-14"
image: /images/column/example.jpg
imageAlt: 画像の説明
related:
  - other-article
# draft: true                       # 下書き（一覧・詳細に表示されない）
---
```

未翻訳の記事にアクセスされても404にはならず、「この記事は現在この言語では利用できません」と表示してその言語のコラム一覧へ誘導します。

---

## 料金・共通データの管理

**料金・人数・電話番号・営業時間・画像パスは、言語ごとに重複して持ちません。**

| ファイル | 管理する内容 |
| --- | --- |
| `src/data/activities.ts` | **料金（税込・日本円）・プラン（半日／1日）・所要時間・開催時間・開催期間・対象年齢・最少催行人数・集合場所と地図URL・シーズン／種別・掲載順** |
| `src/data/tour-photos.generated.json` | ツアー写真のパスと寸法（`npm run photos -- --only=tours` が自動生成。手で編集しない） |
| `src/data/site.ts` | 名称・住所・電話番号（国内/国番号付き）・メール・営業時間・ナビゲーション定義 |
| `src/data/guide.ts` | 代表の氏名（固有名詞）・画像パス |
| `src/data/projects.ts` | プロジェクトのslug・英字ラベル・画像パス |

### アクティビティ一覧（2026-27 シーズン）

出典は施主提供の「2026-27 ツアー情報.xlsx」です（原本は `photos-original/2026-27/` に保管）。

| slug | 名称 | シーズン・種別 |
| --- | --- | --- |
| `furano-relax-downriver` | 富良野リラックスダウンリバー（主力・ホテル送迎） | グリーン・ガイドツアー |
| `biei-relax-downriver` | 美瑛川リラックスダウンリバー | グリーン・ガイドツアー |
| `asahikawa-relax-downriver` | 旭川リラックスダウンリバー | グリーン・ガイドツアー |
| `kamuikotan-sup` | 神居古潭SUPツアー | グリーン・ガイドツアー |
| `kamuikotan-rafting` | 神居古潭ラフティング | グリーン・ガイドツアー |
| `furano-rafting` | 富良野ラフティング（南富良野） | グリーン・ガイドツアー |
| `organize-river` / `organize-lake` / `organize-tour` | オーガナイズ（貸切・ホテル送迎） | グリーン・オーガナイズ |
| `sup-rental` | SUPレンタル | グリーン・レンタル |
| `snowshoe-tour` | スノーシューツアー | ウィンター・ガイドツアー |
| `organize-winter` | オーガナイズウィンター | ウィンター・オーガナイズ |

旧URL `/activities/organize-program` は `/activities#private` へ 308 で転送しています（`src/lib/legacy-redirects.ts`）。
トップと一覧は「今のシーズン」（日本時間の11〜3月はウィンター、4〜10月はグリーン）を先に表示し、1日1回描き直します（`revalidate`）。

### 料金の変更方法

`src/data/activities.ts` の `plans[].price` を書き換えるだけで、**全5言語に自動反映**されます（カード・詳細ページの料金表・一覧の料金表・予約フォームの選択肢・管理者宛メール・構造化データ）。

```ts
plans: [
  {
    kind: "standard", hours: 2, approx: true,              // 約2時間
    sessions: ["9:30-11:30", "13:30-15:30"],               // 開催時間（各回）
    price: { unit: "perPerson", adult: 8000, child: 8000, infant: 0 },
  },
],
```

| `price.unit` | 意味 | 表示例（日本語） |
| --- | --- | --- |
| `perPerson` | 1名あたり。`adult`＝大人（12歳以上）、`child`＝小人（2〜11歳。対象年齢が上なら自動で「4〜11歳」等）、`infant`＝0〜1歳（0 は「無料」） | 大人（12歳以上）8,000円／小人（2〜11歳）8,000円／0〜1歳 無料 |
| `perGroup` | 1グループ貸切（オーガナイズ）。`kind` は `halfDay`／`fullDay` | 半日（約2.5時間）30,000円／1日（約7時間）50,000円 |
| `perBoard` | レンタル（1艇・1日） | 3,500円 1艇・1日（税込） |

表示形式は言語ごとに切り替わります（為替換算はせず、常に日本円で表示します）。表示テンプレートは各言語の `price.*` と `activityDetail.*`（期間・時間・年齢）にあります。
翻訳ファイルに金額の数字を直接書くと `npm run i18n:check` がエラーにします（チェックする金額は `activities.ts` から自動で読み取ります）。

### 開催期間・対象年齢・集合場所の変更方法

`src/data/activities.ts` の `period`（`endApr` などの区切り。表示文言は `activityDetail.periods`）、`minAge`（0＝年齢制限なし）、`minParticipants`、`meeting`（`place` と `mapUrl`。場所の名前は各言語の `activityDetail.meeting`）を書き換えます。服装・持ち物は全アクティビティ「予約時にご案内します」です。

---

## 翻訳漏れ防止（`npm run i18n:check`）

CIでも実行できます。以下を検出します。

- 日本語に存在するキーが他言語に存在するか
- 日本語に存在しない未使用キーがないか（警告）
- 空文字の値がないか
- 配列の要素数が日本語と一致しているか
- **料金・電話番号・メールアドレスが翻訳ファイルへ重複記載されていないか**
- 各ページの `meta.title` / `meta.description` が全言語に存在し、重複がないか
- 各言語のFAQ・アクティビティFAQが存在するか
- コラム記事の `locale` / `translationKey` が正しいか、未翻訳記事はどれか（警告）

---

## 予約・お問い合わせフォーム

**何も設定しなくても、そのまま使えます。** 送信手段は2段階になっています。

| 状態 | 挙動 |
| --- | --- |
| **`RESEND_API_KEY` 未設定（既定）** | 送信ボタンを押すと、訪問者のメールソフトが開き、入力内容が入ったメールが用意されます（mailto方式）。訪問者がそのまま送信すればHOOに届きます。サーバー設定も外部サービスの契約も不要です。 |
| **`RESEND_API_KEY` 設定済み** | フォーム送信だけで自動的にHOOへメールが届き、送信者にも**その言語で自動返信**が届きます。 |

どちらの場合も、管理者に届くメールの本文は同一（日本語・閲覧言語と希望連絡言語を明記）です。本文はサーバー側で組み立てているため、mailto方式でも内容がずれません。

### mailto方式のときの画面

「送信完了」とは表示しません（メールを送るのは訪問者自身のため）。代わりに次を案内します。

- メールを送信するまでHOOには届かないという注意書き
- メールソフトが開かない環境向けに、**入力内容をコピーするボタン**と送信先アドレス
- 電話番号（営業時間つき）
- 入力内容の全文表示（`details` で開閉）
- 本文が長い場合は「メールソフトによっては途中で切れる可能性がある」旨の警告

これらはすべて5言語に対応しています。

### 自動送信（Resend）を有効にする場合

1. [Resend](https://resend.com) でAPIキーを取得
2. `.env.local`（Vercelなら環境変数）に設定

```
RESEND_API_KEY=re_xxxxxxxxxx
MAIL_TO=info@hoohokkaido.com
MAIL_FROM=HOO Website <onboarding@resend.dev>
```

3. 独自ドメインをResendで認証したら `MAIL_FROM` を `noreply@hoohokkaido.com` などに変更

送信に失敗した場合も、mailto方式へ自動的に切り替わるため、問い合わせを取りこぼしません。

### 多言語フォームの仕様

- **フリガナは外国語ページでは必須ではありません**（「ローマ字表記のお名前」として任意項目）
- 電話番号は国番号（`+81` / `+82` / `+886` / `+86` など）を入力できます。特定の国に限定しません
- 海外旅行者向けに「国・地域」「希望する連絡言語」「宿泊エリア」を追加しています
- **管理者宛メールは日本語**で届き、`閲覧言語 / 希望連絡言語 / 送信元ページ / 希望アクティビティ` を確認できます
- **ユーザーへの自動返信は、フォームを送信した言語**で送られます（`src/i18n/emails.ts`）
- 「フォーム送信時点では予約確定ではありません」の注意書きは5言語すべてに表示されます

---

## 必要な環境変数

| 変数 | 必須 | 内容 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 推奨 | 本番URL（canonical / hreflang / OGP / sitemap 用） |
| `RESEND_API_KEY` | **任意** | 設定するとフォームが自動送信になる。未設定でも mailto 方式でフォームは使える |
| `MAIL_TO` | 任意 | フォームの送信先（既定: info@hoohokkaido.com） |
| `MAIL_FROM` | 任意 | 送信元アドレス |
| `NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL` | 任意 | Googleマップ埋め込みURL（未設定でも崩れません） |
| `ANTHROPIC_API_KEY` | 翻訳スクリプト利用時 | Claude APIキー（**サイト閲覧時には使用しません**） |
| `ANTHROPIC_MODEL` | 任意 | 翻訳に使うモデル（既定: `claude-opus-4-8`） |

---

## Vercelへのデプロイ手順

1. GitHubにリポジトリをpush
2. Vercelで「New Project」→ リポジトリをインポート（Next.jsを自動判定）
3. Environment Variables に上記の環境変数を設定
4. Deploy
5. 独自ドメイン（hoohokkaido.com）を Project → Domains で接続
6. デプロイ後、`https://ドメイン/sitemap.xml` を Google Search Console に登録
   （全5言語のURLが hreflang 付きで含まれます）

---

## 画像の差し替え方法

正式写真を `photos-original/` に置き、`scripts/place-photos.mjs` の `MAPPING` を編集して `npm run photos` を実行すると、`public/images/` 配下のサイト用画像が再生成されます。ファイル名を変えない限り、コードの変更は不要です。alt属性は各言語の翻訳ファイルで管理しています。

### ツアーごとの写真（2026-27 シーズン〜）

施主から Google ドライブのフォルダ単位（ツアー名ごと）で届いた写真を `photos-original/2026-27/<フォルダ名>/` に置き、`scripts/place-photos.mjs` の `TOURS` で割り当てます。

```bash
npm run photos -- --only=tours   # ツアー写真だけを作り直す（1〜2分）
```

- 出力：`public/images/tours/<版>/<slug>/card.jpg`（カード 4:3）・`hero.jpg`（詳細ページ上部 3:2）・`photo-NN.jpg`（ギャラリー）と `src/data/tour-photos.generated.json`
- 切り抜き位置は `main.card` / `main.hero`（`"attention"`＝自動、`{ y: 0〜1 }`＝縦の位置）で調整します
- **写真を差し替えるときは `TOUR_PHOTO_VERSION` を上げてください**（同じURLのまま中身を替えると、next/image の最適化キャッシュに古い写真が残るため）
- ギャラリーの説明文（alt）は各言語の `activities.<slug>.gallery` に、`TOURS` の `gallery` と同じ順番で置きます
- 施主のフォルダにあって使っていない写真：オーガナイズウィンターの `IMG_3112 2.jpg`（紅葉のリフト。冬のツアーと季節が合わないため）

---

## フォント

大容量のCJK Webフォントは読み込まず、言語別のシステムフォントスタックへフォールバックさせています（`src/app/globals.css` の `html[lang="..."]`）。

| 言語 | フォントスタック |
| --- | --- |
| 日本語 | Noto Sans JP（`next/font`・latin subset）→ ヒラギノ / 游ゴシック |
| 英語 | Noto Sans JP（latin）→ system serif（見出し） |
| 繁体字 | PingFang TC → Noto Sans TC → Microsoft JhengHei |
| 簡体字 | PingFang SC → Noto Sans SC → Microsoft YaHei |
| 韓国語 | Apple SD Gothic Neo → Noto Sans KR → Malgun Gothic |
