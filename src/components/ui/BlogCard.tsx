import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Tag } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import type { BlogPost } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

/**
 * ブログ一覧のカード。
 * 一覧（/blog）と2ページ目以降（/blog/page/[n]）で共有します。
 *
 * priority は先頭数枚だけ true にし、それ以外は next/image の
 * 既定の遅延読み込みに任せて LCP を軽く保ちます。
 */
export default function BlogCard({
  locale,
  post,
  index = 0,
  priority = false,
}: {
  locale: Locale;
  post: BlogPost;
  index?: number;
  priority?: boolean;
}) {
  return (
    <FadeIn delay={(index % 3) * 0.06}>
      <article className="group h-full overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
        <Link
          href={localePath(locale, `/blog/${post.slug}`)}
          className="flex h-full flex-col"
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-2.5 py-1 font-bold text-forest-dark">
                <Tag aria-hidden="true" className="h-3 w-3 shrink-0" />
                {post.category}
              </span>
              <time dateTime={post.date} className="inline-flex items-center gap-1">
                <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                {formatDate(post.date, locale)}
              </time>
            </div>
            <h2 className="mt-3 text-base font-bold leading-relaxed text-navy transition-colors group-hover:text-water-deep">
              {post.title}
            </h2>
            <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
              {post.description}
            </p>
          </div>
        </Link>
      </article>
    </FadeIn>
  );
}
