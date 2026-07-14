import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { site } from "@/data/site";

/**
 * スマートフォン下部の固定CTA（電話・予約）。
 * PCでは非表示。営業時間外でもフォームから問い合わせできることを明示。
 */
export default function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-light bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <p className="pt-1.5 text-center text-[10px] leading-tight text-ink-soft">
        営業時間 {site.hours.display} ／ 時間外はフォームから受付中
      </p>
      <div className="flex gap-2 px-3 pb-2.5 pt-1.5">
        <a
          href={site.tel.link}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-forest text-sm font-bold text-forest-dark"
        >
          <Phone aria-hidden="true" className="h-4 w-4" />
          電話する
        </a>
        <Link
          href="/reservation"
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-water-deep text-sm font-bold text-white"
        >
          <CalendarCheck aria-hidden="true" className="h-4 w-4" />
          予約する
        </Link>
      </div>
    </div>
  );
}
