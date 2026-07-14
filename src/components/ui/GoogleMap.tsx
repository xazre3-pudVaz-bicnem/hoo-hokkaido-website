import { ExternalLink, MapPin } from "lucide-react";
import { site } from "@/data/site";

/**
 * Googleマップ埋め込みコンポーネント。
 * NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL が未設定でも画面が崩れないよう、
 * 住所と外部マップリンクのフォールバックを表示します。
 */
export default function GoogleMap() {
  if (site.googleMapEmbedUrl) {
    return (
      <div className="overflow-hidden rounded-3xl shadow-card">
        <iframe
          src={site.googleMapEmbedUrl}
          title={`${site.name}の地図`}
          className="h-80 w-full border-0 md:h-96"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div className="flex h-80 flex-col items-center justify-center gap-4 rounded-3xl border border-forest-light bg-gradient-to-br from-water-light via-offwhite to-forest-light p-8 text-center shadow-card md:h-96">
      <MapPin aria-hidden="true" className="h-10 w-10 text-forest" />
      <div>
        <p className="font-bold text-navy">{site.name}</p>
        <p className="mt-1 text-sm text-ink-soft">{site.address.full}</p>
      </div>
      <a
        href={site.googleMapSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-dark"
      >
        Googleマップで見る
        <ExternalLink aria-hidden="true" className="h-4 w-4" />
      </a>
    </div>
  );
}
