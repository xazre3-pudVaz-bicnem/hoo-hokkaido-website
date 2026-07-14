import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import AccessInfo from "@/components/sections/AccessInfo";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata = pageMetadata({
  title: "アクセス・運営情報",
  description: `${site.name}のアクセス・運営情報。所在地は${site.address.full}、営業時間は${site.hours.display}。各アクティビティの集合場所はご予約時にご案内します。`,
  path: "/access",
});

export default function AccessPage() {
  return (
    <>
      <PageHeader
        eyebrow="Access"
        title="アクセス・運営情報"
        lead="HOOの拠点情報とお問い合わせ先のご案内です。"
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "アクセス", path: "/access" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <FadeIn>
          <AccessInfo />
        </FadeIn>

        <FadeIn>
          <div className="mt-10 rounded-3xl border border-forest-light bg-white p-7 md:p-9">
            <h2 className="font-display text-xl font-bold text-navy">
              集合場所について
            </h2>
            <p className="mt-3 text-sm leading-loose text-ink-soft md:text-[15px]">
              各アクティビティの集合場所は、開催エリア（富良野・美瑛・旭川）や当日の河川状況によって異なります。上記の所在地とは異なる場合がありますので、
              ご予約時のご案内をご確認ください。ご不明な点は、お電話（
              <a href={site.tel.link} className="font-bold text-water-deep hover:text-navy">
                {site.tel.display}
              </a>
              ）またはお問い合わせフォームからご連絡ください。
            </p>
          </div>
        </FadeIn>
      </section>

      <FinalCta />
    </>
  );
}
