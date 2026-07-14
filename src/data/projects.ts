/**
 * プロジェクトの「言語に依存しない共通データ」。
 * タイトル・説明文は src/i18n/messages/<locale>.json の projects.items に置いています。
 */

export type Project = {
  slug: string;
  /** 英字ラベル（全言語共通） */
  titleEn: string;
  image: string;
};

export const projects: Project[] = [
  {
    slug: "river-management",
    titleEn: "RIVER MANAGEMENT",
    image: "/images/projects/river-management.jpg",
  },
  {
    slug: "community-space",
    titleEn: "COMMUNITY SPACE",
    image: "/images/projects/community-space.jpg",
  },
  {
    slug: "regional-tourism",
    titleEn: "REGIONAL TOURISM",
    image: "/images/projects/regional-tourism.jpg",
  },
];
