# Hokkaido Outdoor Organization（HOO）公式サイト

富良野・美瑛・旭川のリバーアクティビティを提供する HOO のコーポレートサイト兼予約サイトです。

- フレームワーク: Next.js（App Router）+ TypeScript + Tailwind CSS v4
- アニメーション: Framer Motion（`prefers-reduced-motion` 対応）
- アイコン: Lucide Icons
- メール送信: Resend（環境変数で有効化）
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
| `npm run generate:images` | プレースホルダー画像の再生成 |

## サイト構成

```
/                          トップページ
/activities                アクティビティ一覧
/activities/[slug]         詳細（furano / biei / asahikawa -relax-downriver, organize-program）
/furano-activity           富良野のアクティビティSEOページ
/furano-rafting            富良野のラフティング・川体験SEOページ
/about                     HOOについて（MISSION・VISION・代表紹介）
/projects                  プロジェクト（河川管理・場づくり・地域活性化）
/safety                    安全への取り組み
/faq                       よくある質問
/access                    アクセス・運営情報
/reservation               予約フォーム（?activity=<slug> で初期選択）
/contact                   お問い合わせフォーム
/column, /column/[slug]    コラム（Markdown）
/privacy, /terms, /sitemap プライバシーポリシー・利用案内・HTMLサイトマップ
/sitemap.xml, /robots.txt  自動生成
```

## データの一元管理（重要）

**料金・人数・営業時間などをページに直接書かない**方針です。以下のファイルを変更すると、サイト全体（表示・予約フォーム・構造化データ）に反映されます。

| ファイル | 管理する内容 |
| --- | --- |
| `src/data/site.ts` | 名称・住所・電話・メール・営業時間・ナビゲーション・地図URL |
| `src/data/activities.ts` | **アクティビティの料金・最少催行人数・所要時間・画像・FAQ・注意事項** |
| `src/data/guide.ts` | 代表プロフィール・保有資格・「選ばれる理由」 |
| `src/data/projects.ts` | プロジェクト3本の内容 |
| `src/data/faq.ts` | よくある質問 |
| `src/data/safety.ts` | 安全への取り組み・当日の流れ・目的別カード・お客様の声 |

### 料金の変更方法

`src/data/activities.ts` の該当アクティビティの `price` を書き換えるだけです。

```ts
price: {
  amount: 7700,          // 構造化データ用の数値
  display: "7,700円",    // 画面表示用
  unit: "1人あたり（税込）",
  note: "…",
},
```

### 未確定情報の更新

所要時間・開催期間・対象年齢・集合場所・服装持ち物は現在「お問い合わせください」等になっています。確定したら `src/data/activities.ts` の `duration` / `period` / `targetAge` / `meetingPlace` / `clothing` を書き換えてください。

### お客様の声の追加

`src/data/safety.ts` の `testimonials` 配列に追加すると、トップページに自動表示されます（空の間は「準備中」表示）。架空の口コミは追加しないでください。

## 画像の差し替え方法

現在はすべて自動生成のプレースホルダー画像です。**正式写真を同じファイル名で `public/images/` 配下に上書きするだけ**で差し替え完了です（コード変更不要）。

```
public/images/
├── logo/hoo-logo-placeholder.png   ロゴ（正式ロゴ後は src/components/layout/Logo.tsx を画像表示に変更可）
├── hero/hero-rafting.jpg           トップPC用ヒーロー（推奨 2000×1200 以上）
├── hero/hero-mobile.jpg            トップSP用ヒーロー（縦長 1080×1620 目安）
├── activities/*.jpg                各アクティビティ（1200×900 目安）
├── guide/shota-kose.jpg            代表写真（縦 900×1100 目安）
├── projects/*.jpg                  プロジェクト3枚
├── common/*.jpg                    汎用風景
├── column/*.jpg                    コラムのアイキャッチ（1200×675）
└── og/og-image.jpg                 OGP画像（1200×630）
```

- ファイル名を変えたい場合は `src/data/activities.ts` などデータファイル内の `image.src` を変更してください。
- alt属性もデータファイルで管理しています。

## 予約フォームを有効化する方法（メール送信）

1. [Resend](https://resend.com) でアカウントを作成し、APIキーを取得
2. `.env.local`（Vercelなら環境変数設定）に以下を設定

```
RESEND_API_KEY=re_xxxxxxxxxx
MAIL_TO=info@hoohokkaido.com
MAIL_FROM=HOO Website <onboarding@resend.dev>
```

3. 独自ドメインをResendで認証したら、`MAIL_FROM` を `noreply@hoohokkaido.com` などに変更

APIキー未設定でもサイトはクラッシュしません（フォーム送信時にエラーメッセージが表示され、開発環境ではコンソールに詳細が出ます）。

## 必要な環境変数（.env.example 参照）

| 変数 | 必須 | 内容 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 推奨 | 本番URL（canonical / OGP / sitemap 用） |
| `RESEND_API_KEY` | フォーム利用時 | ResendのAPIキー |
| `MAIL_TO` | 任意 | フォームの送信先（既定: info@hoohokkaido.com） |
| `MAIL_FROM` | 任意 | 送信元アドレス |
| `NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL` | 任意 | Googleマップ埋め込みURL（未設定でも崩れません） |

## Vercelへのデプロイ手順

1. GitHubにリポジトリをpush
2. Vercelで「New Project」→ リポジトリをインポート（フレームワークは自動でNext.js判定）
3. Environment Variables に上記の環境変数を設定
4. Deploy
5. 独自ドメイン（hoohokkaido.com）を Project → Domains で接続
6. デプロイ後、`https://ドメイン/sitemap.xml` を Google Search Console に登録

## コラム記事の追加方法

`src/content/column/` に `スラッグ名.md` を追加するだけです。

```md
---
title: 記事タイトル
description: 120文字以内の説明（メタディスクリプションになります）
category: 選び方
publishedAt: "2026-07-14"
updatedAt: "2026-07-14"
image: /images/column/xxx.jpg
imageAlt: 画像の説明
related:
  - 関連記事のスラッグ
---

本文（Markdown）
```
