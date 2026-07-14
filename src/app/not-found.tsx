import Link from "next/link";
import { Compass } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center bg-offwhite px-4 pt-20 text-center">
      <Compass aria-hidden="true" className="h-14 w-14 text-water-deep" />
      <p className="mt-6 font-display text-5xl font-bold text-navy">404</p>
      <h1 className="mt-3 font-display text-xl font-bold text-navy md:text-2xl">
        ページが見つかりませんでした
      </h1>
      <p className="mt-4 max-w-md text-sm leading-loose text-ink-soft">
        お探しのページは移動または削除された可能性があります。
        <br />
        トップページ、またはアクティビティ一覧からお探しください。
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/" variant="primary">
          トップページへ
        </Button>
        <Button href="/activities" variant="outline">
          アクティビティを探す
        </Button>
      </div>
      <Link
        href="/sitemap"
        className="mt-6 text-sm font-bold text-water-deep underline underline-offset-2 hover:text-navy"
      >
        サイトマップを見る
      </Link>
    </div>
  );
}
