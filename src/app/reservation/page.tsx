import { Phone } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ReservationForm from "@/components/forms/ReservationForm";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata = pageMetadata({
  title: "予約フォーム｜リバーアクティビティの予約",
  description:
    "HOOのリバーアクティビティ予約フォーム。富良野・美瑛・旭川のリラックスダウンリバー、オーガナイズプログラムの予約リクエストを受け付けています。お電話でのご相談も可能です。",
  path: "/reservation",
});

export default async function ReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ activity?: string }>;
}) {
  const { activity } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Reservation"
        title="予約フォーム"
        lead={
          "ご希望のアクティビティ・日程をお知らせください。\n内容確認後、担当者からの連絡をもって予約確定となります。"
        }
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "予約", path: "/reservation" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <ReservationForm initialActivity={activity} />

        <div className="mt-8 rounded-3xl border border-forest-light bg-white p-6 text-center md:p-8">
          <h2 className="text-base font-bold text-navy">お電話でのご予約・ご相談</h2>
          <a
            href={site.tel.link}
            className="mt-3 inline-flex items-center gap-2 font-display text-2xl font-bold text-forest-dark transition-colors hover:text-water-deep"
          >
            <Phone aria-hidden="true" className="h-5 w-5" />
            {site.tel.display}
          </a>
          <p className="mt-2 text-xs text-ink-soft">
            受付時間 {site.hours.display} ／ 営業時間外はフォームをご利用ください
          </p>
        </div>
      </section>
    </>
  );
}
