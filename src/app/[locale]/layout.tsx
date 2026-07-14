import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Noto_Sans_JP, Shippori_Mincho_B1 } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileCta from "@/components/layout/MobileCta";
import LanguageBanner, {
  type BannerStrings,
} from "@/components/layout/LanguageBanner";
import JsonLd from "@/components/ui/JsonLd";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { getDictionary } from "@/i18n/dictionary";
import {
  isLocale,
  localeConfig,
  locales,
  type Locale,
} from "@/i18n/locales";
import { site } from "@/data/site";

/**
 * 欧文＋和文のラテン部分のみ読み込む軽量構成。
 * 中国語（繁体・簡体）・韓国語の字形は、言語別のシステムフォントスタック
 * （globals.css の html[lang="..."]）にフォールバックさせ、
 * 大容量のCJKフォントをダウンロードしないことで表示速度を維持します。
 */
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

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: {
      default: dict.meta.home.title,
      template: `%s｜${site.shortName}`,
    },
    description: dict.meta.home.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = await getDictionary(locale);

  // 言語案内バナー用に、各言語の短い案内文だけをクライアントへ渡す
  // （全言語の辞書をクライアントへ送ることはしない）
  const bannerStrings = {} as BannerStrings;
  for (const item of locales) {
    const d = await getDictionary(item);
    bannerStrings[item] = {
      message: d.language.bannerMessage,
      switch: d.language.bannerSwitch,
      dismiss: d.language.bannerDismiss,
    };
  }

  return (
    <html
      lang={localeConfig[locale].htmlLang}
      className={`${notoSansJp.variable} ${shippori.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={[localBusinessJsonLd(locale, dict), websiteJsonLd(locale)]}
        />
        <Header
          locale={locale}
          strings={{
            nav: dict.nav as unknown as Record<string, string>,
            reserve: dict.common.reserve,
            menuOpen: dict.nav.menuOpen,
            menuClose: dict.nav.menuClose,
            mainNav: dict.nav.mainNav,
            mobileNav: dict.nav.mobileNav,
            hoursHint: dict.nav.hoursHint,
            languageSwitch: dict.language.switchLabel,
            languageMenu: dict.language.menuLabel,
          }}
        />
        {/* モバイル固定CTAの高さ分だけ下部に余白を確保 */}
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
        <Footer locale={locale} dict={dict} />
        <MobileCta locale={locale} dict={dict} />
        <LanguageBanner locale={locale} strings={bannerStrings} />
      </body>
    </html>
  );
}
