import type { Metadata } from "next";
import { Noto_Sans_JP, Shippori_Mincho_B1 } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileCta from "@/components/layout/MobileCta";
import JsonLd from "@/components/ui/JsonLd";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { site } from "@/data/site";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const shippori = Shippori_Mincho_B1({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `富良野のアクティビティ・リバー体験｜${site.name}`,
    template: `%s｜${site.shortName}`,
  },
  description:
    "富良野・美瑛・旭川で北海道の自然を楽しむリバーアクティビティ。Hokkaido Outdoor Organizationでは、経験豊富なガイドがリラックスダウンリバーなどの自然体験をご案内します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} ${shippori.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
        <Header />
        {/* モバイル固定CTAの高さ分だけ下部に余白を確保 */}
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
        <Footer />
        <MobileCta />
      </body>
    </html>
  );
}
