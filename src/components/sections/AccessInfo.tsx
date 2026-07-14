import { Clock, Mail, MapPin, Phone } from "lucide-react";
import GoogleMap from "@/components/ui/GoogleMap";
import { phoneFor, site } from "@/data/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";

/** アクセス情報＋Googleマップ（トップページ・アクセスページで共通利用） */
export default function AccessInfo({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const phone = phoneFor(locale);

  const rows = [
    { icon: MapPin, label: dict.common.addressLabel, value: dict.common.addressFull },
    { icon: Clock, label: dict.common.hoursLabel, value: dict.common.hoursNote },
    {
      icon: Phone,
      label: dict.common.phoneLabel,
      value: phone.display,
      href: phone.link,
    },
    {
      icon: Mail,
      label: dict.common.emailLabel,
      value: site.email,
      href: `mailto:${site.email}`,
    },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      <div className="rounded-3xl bg-white p-7 shadow-card md:p-9">
        <p className="font-display text-lg font-bold text-navy">{site.name}</p>
        <dl className="mt-6 space-y-4">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <row.icon aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-water-deep" />
              <div className="min-w-0">
                <dt className="text-xs font-bold text-ink-soft">{row.label}</dt>
                <dd className="mt-0.5 break-words text-sm font-medium text-ink">
                  {row.href ? (
                    <a href={row.href} className="transition-colors hover:text-water-deep">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>
        <p className="mt-6 border-t border-forest-light pt-4 text-xs leading-relaxed text-ink-soft">
          {dict.access.mapNote}
        </p>
      </div>
      <GoogleMap dict={dict} />
    </div>
  );
}
