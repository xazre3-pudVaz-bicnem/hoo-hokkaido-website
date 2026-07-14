import { Mail, Phone } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ContactForm from "@/components/forms/ContactForm";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata = pageMetadata({
  title: "お問い合わせ",
  description:
    "HOOへのお問い合わせフォーム。アクティビティの内容・日程のご相談、団体利用、プロジェクトに関するご相談など、お気軽にご連絡ください。24時間受付、営業時間内に順次ご返信します。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="お問い合わせ"
        lead={
          "アクティビティのご相談、団体利用、プロジェクトへのご相談など、\nお気軽にお問い合わせください。フォームは24時間受け付けています。"
        }
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "お問い合わせ", path: "/contact" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <ContactForm />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-forest-light bg-white p-6 text-center">
            <Phone aria-hidden="true" className="mx-auto h-6 w-6 text-water-deep" />
            <h2 className="mt-2 text-sm font-bold text-navy">お電話</h2>
            <a
              href={site.tel.link}
              className="mt-1.5 block font-display text-xl font-bold text-forest-dark transition-colors hover:text-water-deep"
            >
              {site.tel.display}
            </a>
            <p className="mt-1 text-xs text-ink-soft">受付時間 {site.hours.display}</p>
          </div>
          <div className="rounded-3xl border border-forest-light bg-white p-6 text-center">
            <Mail aria-hidden="true" className="mx-auto h-6 w-6 text-water-deep" />
            <h2 className="mt-2 text-sm font-bold text-navy">メール</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-1.5 block break-all text-sm font-bold text-forest-dark transition-colors hover:text-water-deep"
            >
              {site.email}
            </a>
            <p className="mt-1 text-xs text-ink-soft">24時間受付</p>
          </div>
        </div>
      </section>
    </>
  );
}
