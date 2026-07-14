"use client";

import { useState } from "react";
import { Copy, Mail, Phone, Check } from "lucide-react";

export type MailtoPayload = {
  to: string;
  subject: string;
  body: string;
};

export type MailtoStrings = {
  title: string;
  lead: string;
  notice: string;
  longWarning: string;
  noMailTitle: string;
  noMailBody: string;
  copy: string;
  copied: string;
  showContent: string;
  back: string;
};

/**
 * Outlook など一部のメールソフトは mailto: のURLを約2000文字で打ち切る。
 * 日本語は1文字が %XX%XX%XX に展開されるため、URLは驚くほど長くなる。
 */
const MAILTO_SAFE_LENGTH = 2000;

export function mailtoHref({ to, subject, body }: MailtoPayload): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * mailto:（訪問者のメールソフトを開く方式）で送信したあとに表示するパネル。
 *
 * ■ 重要
 * mailto: は「メールソフトを開く」だけで、送信そのものは訪問者が行う。
 * したがって「送信完了しました」とは書かない。
 *
 * また、次の場合は mailto: が機能しないことがある。
 *   ・端末にメールソフトが設定されていない
 *   ・本文が長く、メールソフト側でURLが途中で切れる
 * そのため、内容をコピーして手動で送れる手段と、電話番号を必ず併記する。
 */
export default function MailtoPanel({
  strings,
  payload,
  phone,
  onBack,
}: {
  strings: MailtoStrings;
  payload: MailtoPayload;
  phone: { display: string; link: string };
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const fullText = `${payload.subject}\n\n${payload.body}`;
  const mayBeTruncated = mailtoHref(payload).length > MAILTO_SAFE_LENGTH;

  async function copy() {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // クリップボードが使えない環境では、下のテキスト欄から手動でコピーしてもらう
      setCopied(false);
    }
  }

  return (
    <div role="status" className="rounded-3xl bg-white p-7 shadow-card md:p-10">
      <Mail aria-hidden="true" className="h-10 w-10 text-water-deep" />
      <h2 className="mt-4 font-display text-xl font-bold text-navy md:text-2xl">
        {strings.title}
      </h2>
      <p className="mt-4 text-sm leading-loose text-ink md:text-[15px]">
        {strings.lead}
      </p>
      <p className="mt-3 rounded-2xl bg-water-light/60 p-4 text-sm leading-relaxed text-ink">
        {strings.notice}
      </p>

      {mayBeTruncated && (
        <p className="mt-4 rounded-2xl border border-forest-light bg-offwhite p-4 text-xs leading-relaxed text-ink-soft">
          {strings.longWarning}
        </p>
      )}

      {/* メールソフトが開かない場合の受け皿 */}
      <div className="mt-8 border-t border-forest-light pt-8">
        <h3 className="text-[15px] font-bold text-navy">{strings.noMailTitle}</h3>
        <p className="mt-3 text-sm leading-loose text-ink-soft">
          {strings.noMailBody}
        </p>

        <a
          href={`mailto:${payload.to}`}
          className="mt-4 inline-block break-all text-sm font-bold text-water-deep underline underline-offset-4 hover:text-navy"
        >
          {payload.to}
        </a>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-forest px-6 text-sm font-bold text-forest-dark transition-colors hover:bg-forest hover:text-white"
          >
            {copied ? (
              <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
            ) : (
              <Copy aria-hidden="true" className="h-4 w-4 shrink-0" />
            )}
            {copied ? strings.copied : strings.copy}
          </button>

          <a
            href={phone.link}
            className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap text-sm font-bold text-water-deep hover:text-navy"
          >
            <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
            {phone.display}
          </a>
        </div>

        <details className="mt-5">
          <summary className="cursor-pointer text-xs text-ink-soft underline underline-offset-4">
            {strings.showContent}
          </summary>
          <textarea
            readOnly
            value={fullText}
            rows={12}
            aria-label={strings.showContent}
            className="mt-3 w-full resize-y rounded-2xl border border-forest-light bg-offwhite p-4 font-mono text-xs leading-relaxed text-ink-soft"
          />
        </details>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-8 inline-flex min-h-12 items-center rounded-full border border-forest-light bg-white px-6 text-sm font-medium text-ink transition-colors hover:border-forest hover:text-forest-dark"
      >
        {strings.back}
      </button>
    </div>
  );
}
