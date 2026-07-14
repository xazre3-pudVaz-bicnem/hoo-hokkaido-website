import type { Metadata } from "next";
import { site } from "@/data/site";

type PageMeta = {
  title: string;
  description: string;
  /** 先頭スラッシュ付きのパス（例: "/activities"） */
  path: string;
  ogImage?: string;
};

/**
 * 各ページ共通のmetadata生成ヘルパー。
 * title / description / canonical / OGP / X用メタデータを一括設定します。
 */
export function pageMetadata({
  title,
  description,
  path,
  ogImage = "/images/og/og-image.jpg",
}: PageMeta): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
