import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/ui/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export type Crumb = {
  name: string;
  path: string;
};

/** パンくずリスト（BreadcrumbList構造化データ付き） */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="パンくずリスト" className="mx-auto w-full max-w-6xl px-4 py-4">
      <JsonLd data={breadcrumbJsonLd(items)} />
      <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-soft">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight aria-hidden="true" className="h-3 w-3 text-ink-soft/60" />
              )}
              {isLast ? (
                <span aria-current="page" className="font-medium text-forest-dark">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="transition-colors hover:text-water-deep"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
