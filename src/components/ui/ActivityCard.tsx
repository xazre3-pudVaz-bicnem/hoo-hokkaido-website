import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Users } from "lucide-react";
import type { Activity } from "@/data/activities";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";
import {
  formatAmount,
  formatMinParticipantsShort,
  priceUnitLabel,
} from "@/lib/format";

type ActivityCardProps = {
  locale: Locale;
  dict: Dictionary;
  activity: Activity;
  /** trueの場合、大型カードとして表示（主力アクティビティ用） */
  large?: boolean;
  priority?: boolean;
};

/** アクティビティ紹介カード（写真・エリア・料金・導線） */
export default function ActivityCard({
  locale,
  dict,
  activity,
  large = false,
  priority = false,
}: ActivityCardProps) {
  const t = dict.activities[activity.slug as keyof Dictionary["activities"]];
  const detailHref = localePath(locale, `/activities/${activity.slug}`);
  const reserveHref = localePath(
    locale,
    `/reservation?activity=${activity.slug}`
  );

  return (
    <article
      className={`group overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
        large ? "md:grid md:grid-cols-2" : ""
      }`}
    >
      <Link
        href={detailHref}
        className={`relative block overflow-hidden ${
          large ? "aspect-[4/3] md:aspect-auto md:min-h-full" : "aspect-[4/3]"
        }`}
        aria-label={t.name}
      >
        <Image
          src={activity.image}
          alt={t.imageAlt}
          fill
          priority={priority}
          sizes={
            large
              ? "(min-width: 768px) 50vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-bold tracking-wider text-white backdrop-blur-sm">
          <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-sky" />
          {t.area}
        </span>
      </Link>

      <div className={`flex flex-col p-6 ${large ? "md:justify-center md:p-10" : ""}`}>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-water-deep">
          {activity.areaCode}
        </p>
        <h3
          className={`mt-2 font-display font-semibold leading-snug text-navy ${
            large ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {t.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.summary}</p>

        <dl className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-forest-light pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <dt className="text-xs text-ink-soft">{dict.common.priceLabel}</dt>
            <dd className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="font-display text-xl font-bold text-forest-dark">
                {formatAmount(activity.price.amount, locale, dict)}
              </span>
              <span className="text-xs text-ink-soft">
                {priceUnitLabel(activity, dict)}
              </span>
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">{dict.common.minParticipantsLabel}</dt>
            <dd className="flex items-center gap-1 text-xs font-medium text-ink-soft">
              <Users aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-forest" />
              {formatMinParticipantsShort(activity, dict)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={detailHref}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-forest px-5 py-2 text-sm font-bold text-forest transition-colors hover:bg-forest hover:text-white"
          >
            {dict.common.viewDetails}
            <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Link>
          <Link
            href={reserveHref}
            className="inline-flex min-h-11 items-center rounded-full bg-water-deep px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-navy"
          >
            {dict.common.reserve}
          </Link>
        </div>
      </div>
    </article>
  );
}
