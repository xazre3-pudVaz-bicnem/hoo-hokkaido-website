type FlowStep = {
  step: string;
  body: string;
};

/** 番号付きのステップ表示（体験当日の流れなどで共通利用） */
export default function FlowSteps({ steps }: { steps: readonly FlowStep[] }) {
  return (
    <ol className="relative space-y-0">
      {steps.map((item, i) => (
        <li key={item.step} className="relative flex gap-5 pb-8 last:pb-0 md:gap-7">
          {/* 縦のつなぎ線 */}
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[22px] top-12 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-water to-forest-light md:left-[26px]"
            />
          )}
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-water-deep to-forest font-display text-base font-bold text-white shadow-card md:h-[52px] md:w-[52px] md:text-lg">
            {i + 1}
          </span>
          <div className="pt-1.5">
            <h3 className="text-base font-bold text-navy md:text-lg">{item.step}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
