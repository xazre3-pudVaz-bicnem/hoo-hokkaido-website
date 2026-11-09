import Image from "next/image";
import type { GalleryPhoto } from "@/data/activities";

/**
 * フォトギャラリー（縦長・横長が混ざっても切り抜かない段組み）。
 * 画像の幅・高さを渡すので、読み込み前から領域が確保されレイアウトがずれない。
 */
export default function PhotoGallery({
  photos,
  alts,
  fallbackAlt,
}: {
  photos: readonly GalleryPhoto[];
  /** 写真の説明（photos と同じ順番） */
  alts: readonly string[];
  /** 説明が足りないときの代わり（アクティビティ名など） */
  fallbackAlt: string;
}) {
  return (
    <ul className="columns-2 gap-3 md:columns-3 md:gap-4">
      {photos.map((photo, i) => (
        <li
          key={photo.src}
          className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-forest-light/40 md:mb-4"
        >
          <Image
            src={photo.src}
            alt={alts[i] ?? fallbackAlt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 250px, (min-width: 768px) 33vw, 50vw"
            className="h-auto w-full"
          />
        </li>
      ))}
    </ul>
  );
}
