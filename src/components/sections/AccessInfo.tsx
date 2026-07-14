import { Clock, Mail, MapPin, Phone } from "lucide-react";
import GoogleMap from "@/components/ui/GoogleMap";
import { site } from "@/data/site";

/** アクセス情報＋Googleマップ（トップページ・アクセスページで共通利用） */
export default function AccessInfo() {
  const rows = [
    {
      icon: MapPin,
      label: "所在地",
      value: site.address.full,
    },
    {
      icon: Clock,
      label: "営業時間",
      value: site.hours.display,
    },
    {
      icon: Phone,
      label: "電話",
      value: site.tel.display,
      href: site.tel.link,
    },
    {
      icon: Mail,
      label: "メール",
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
              <div>
                <dt className="text-xs font-bold text-ink-soft">{row.label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink">
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
          各アクティビティの集合場所は開催エリアにより異なります。ご予約時に詳しくご案内します。
        </p>
      </div>
      <GoogleMap />
    </div>
  );
}
