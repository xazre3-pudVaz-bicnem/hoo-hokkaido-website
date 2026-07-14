import { Plus } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * details/summary ベースのFAQアコーディオン。
 * JavaScript不要でキーボード操作にも対応。
 */
export default function FaqAccordion({ faqs }: { faqs: readonly FaqItem[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="faq-item group rounded-2xl border border-forest-light bg-white shadow-card transition-shadow hover:shadow-card-hover"
        >
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 md:px-6">
            <span className="flex items-start gap-3 text-sm font-bold text-navy md:text-base">
              <span aria-hidden="true" className="mt-0.5 font-display text-water-deep">
                Q.
              </span>
              {faq.question}
            </span>
            <Plus
              aria-hidden="true"
              className="faq-icon h-5 w-5 shrink-0 text-forest"
            />
          </summary>
          <div className="px-5 pb-5 md:px-6">
            <p className="whitespace-pre-line border-t border-forest-light pt-4 text-sm leading-loose text-ink-soft md:text-[15px]">
              {faq.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
