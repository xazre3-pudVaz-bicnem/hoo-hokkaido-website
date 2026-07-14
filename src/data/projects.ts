/**
 * プロジェクト（河川管理・場づくり・地域活性化）情報の一元管理ファイル。
 */

export type Project = {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  description: string[];
  items: { title: string; body: string }[];
  image: {
    src: string;
    alt: string;
  };
};

export const projects: Project[] = [
  {
    slug: "river-management",
    title: "河川管理と保全活動",
    titleEn: "RIVER MANAGEMENT",
    summary:
      "北海道の川を安心して楽しめる場所として守り、次の世代へつなぐための管理・保全に取り組んでいます。",
    description: [
      "川は、地域の暮らしとアウトドア体験の両方を支える大切なフィールドです。HOOは、川を「使う」だけでなく「守る」立場から、水辺の管理と保全に取り組んでいます。",
    ],
    items: [
      {
        title: "ウォーターフロント利用の相談窓口",
        body: "水辺の利用に関する相談を受け付け、地域・利用者・行政の間をつなぐ窓口としての役割を担います。",
      },
      {
        title: "明確な利用ガイドライン",
        body: "誰もが安心して水辺を利用できるよう、分かりやすい利用ガイドラインづくりに取り組みます。",
      },
      {
        title: "ハードウェアの維持管理・運用",
        body: "水辺の設備・施設の維持管理と運用を通じて、安全で快適なフィールドを保ちます。",
      },
    ],
    image: {
      src: "/images/projects/river-management.jpg",
      alt: "北海道の河川管理と保全活動",
    },
  },
  {
    slug: "community-space",
    title: "くつろぎと交流の場づくり",
    titleEn: "COMMUNITY SPACE",
    summary:
      "水辺を、地域の人と訪れる人がくつろぎ、交流できる場所に。イベントや連携を通じて場を育てます。",
    description: [
      "水辺は、アクティビティのためだけの場所ではありません。地域の人々と訪れる人々が自然に集まり、くつろげる場をつくることも、HOOの大切な仕事です。",
    ],
    items: [
      {
        title: "地域イベントの企画・調整",
        body: "水辺を舞台にした地域イベントの企画・調整を行い、人が集まるきっかけをつくります。",
      },
      {
        title: "住民の声を反映する取り組み",
        body: "地域の声を聞き、場づくりに反映していくプロセスを大切にしています。",
      },
      {
        title: "アトラクションとの連携開発",
        body: "周辺のアトラクションや事業者と連携し、水辺の楽しみ方を広げる取り組みを進めます。",
      },
    ],
    image: {
      src: "/images/projects/community-space.jpg",
      alt: "水辺でのくつろぎと交流の場づくり",
    },
  },
  {
    slug: "regional-tourism",
    title: "観光と地域経済の活性化",
    titleEn: "REGIONAL TOURISM",
    summary:
      "自然体験を入口に、富良野をはじめとする地域の観光と経済を元気にする取り組みを進めています。",
    description: [
      "アウトドア体験は、地域に人を呼び、経済を動かす力を持っています。HOOは体験の提供にとどまらず、地域の観光と経済の活性化に取り組みます。",
    ],
    items: [
      {
        title: "商品プロモーションと販売",
        body: "地域の魅力を伝える商品のプロモーションや販売を通じて、地域経済の循環をつくります。",
      },
      {
        title: "地域成長を支える人材育成",
        body: "地域の未来を担う人材の育成に取り組み、持続的な地域の成長を支えます。",
      },
    ],
    image: {
      src: "/images/projects/regional-tourism.jpg",
      alt: "富良野の観光と地域経済の活性化への取り組み",
    },
  },
];
