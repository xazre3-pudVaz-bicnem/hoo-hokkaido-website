type WaveDividerProps = {
  /** 波の下側（次のセクション側）の色 */
  fill?: string;
  flip?: boolean;
  className?: string;
};

/** 川の流れをイメージしたセクション境界の波形 */
export default function WaveDivider({
  fill = "var(--color-offwhite)",
  flip = false,
  className = "",
}: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full overflow-hidden leading-none ${
        flip ? "rotate-180" : ""
      } ${className}`}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block h-10 w-full md:h-[72px]"
      >
        <path
          d="M0,40 C180,72 360,8 560,28 C760,48 900,70 1100,52 C1260,38 1370,20 1440,32 L1440,72 L0,72 Z"
          fill={fill}
        />
        <path
          d="M0,52 C200,80 420,24 640,40 C860,56 1020,76 1220,60 C1340,50 1410,38 1440,44 L1440,72 L0,72 Z"
          fill={fill}
          opacity="0.55"
        />
      </svg>
    </div>
  );
}
