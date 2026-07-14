import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { phoneFor } from "@/data/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

/**
 * スマートフォン下部の固定CTA（電話・予約）。
 * 営業時間外でもフォームから問い合わせできることを明示。
 */
export default function MobileCta({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const phone = phoneFor(locale);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-light bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <p className="px-3 pt-1.5 text-center text-[10px] leading-tight text-ink-soft">
        {dict.mobileCta.note}
      </p>
      <div className="flex gap-2 px-3 pb-2.5 pt-1.5">
        <a
          href={phone.link}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-forest px-2 text-sm font-bold text-forest-dark"
        >
          <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="truncate">{dict.common.call}</span>
        </a>
        <Link
          href={localePath(locale, "/reservation")}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-water-deep px-2 text-sm font-bold text-white"
        >
          <CalendarCheck aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="truncate">{dict.common.reserve}</span>
        </Link>
      </div>
    </div>
  );
}
