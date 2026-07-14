import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ActivityCard from "@/components/ui/ActivityCard";
import FadeIn from "@/components/ui/FadeIn";
import FinalCta from "@/components/sections/FinalCta";
import JsonLd from "@/components/ui/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { serviceJsonLd } from "@/lib/jsonld";
import { sortedActivities } from "@/data/activities";

export const metadata = pageMetadata({
  title: "アクティビティ一覧｜富良野・美瑛・旭川のリバー体験",
  description:
    "HOOのアクティビティ一覧。富良野・美瑛・旭川のリラックスダウンリバー、団体向けオーガナイズプログラムをご紹介。料金・最少催行人数・予約方法はこちら。",
  path: "/activities",
});

export default function ActivitiesPage() {
  const [featured, ...others] = sortedActivities;

  return (
    <>
      <JsonLd data={sortedActivities.map(serviceJsonLd)} />
      <PageHeader
        eyebrow="Activities"
        title="アクティビティ"
        lead={
          "富良野を中心に、美瑛・旭川エリアで開催しているリバーアクティビティの一覧です。\nすべて事前予約制・2名からご参加いただけます。"
        }
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "アクティビティ", path: "/activities" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 md:px-6">
        <FadeIn>
          <ActivityCard activity={featured} large priority />
        </FadeIn>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {others.map((activity, i) => (
            <FadeIn key={activity.slug} delay={i * 0.08}>
              <ActivityCard activity={activity} />
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-14 rounded-3xl bg-forest-light/50 p-7 md:p-10">
            <h2 className="font-display text-xl font-bold text-navy md:text-2xl">
              どれにするか迷ったら
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-loose text-ink-soft md:text-[15px]">
              初めての方には、HOOの主力プログラムである
              <strong className="font-bold text-forest-dark">富良野リラックスダウンリバー</strong>
              がおすすめです。旅程や人数に合わせたご提案もできますので、迷ったらお気軽にご相談ください。
            </p>
          </div>
        </FadeIn>
      </section>

      <FinalCta />
    </>
  );
}
