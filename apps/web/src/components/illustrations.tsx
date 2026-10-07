/** Empty board: outline, mounting holes, unplaced footprints and one dashed trace waiting for parts. */
export function EmptyBoardIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 104" className={className} aria-hidden fill="none">
      <rect
        x="4"
        y="4"
        width="152"
        height="96"
        rx="10"
        className="fill-raised stroke-hairline-strong"
        strokeWidth="1.5"
      />
      {[
        [14, 14],
        [146, 14],
        [14, 90],
        [146, 90],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="3.5"
          className="stroke-hairline-strong"
          strokeWidth="1.5"
        />
      ))}
      <rect
        x="62"
        y="34"
        width="36"
        height="36"
        rx="3"
        className="stroke-border-input"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      {[40, 46, 52, 58, 64].map((y) => (
        <g key={y}>
          <rect
            x="55"
            y={y - 1.5}
            width="5"
            height="3"
            rx="0.75"
            className="fill-hairline-strong"
          />
          <rect
            x="100"
            y={y - 1.5}
            width="5"
            height="3"
            rx="0.75"
            className="fill-hairline-strong"
          />
        </g>
      ))}
      <rect
        x="28"
        y="30"
        width="12"
        height="7"
        rx="1.5"
        className="stroke-border-input"
        strokeWidth="1.5"
        strokeDasharray="2.5 2.5"
      />
      <rect
        x="28"
        y="66"
        width="12"
        height="7"
        rx="1.5"
        className="stroke-border-input"
        strokeWidth="1.5"
        strokeDasharray="2.5 2.5"
      />
      <rect
        x="120"
        y="44"
        width="8"
        height="16"
        rx="1.5"
        className="stroke-border-input"
        strokeWidth="1.5"
        strokeDasharray="2.5 2.5"
      />
      <path
        d="M40 33.5h10v12.5h5M40 69.5h10V58h5M105 52h15"
        className="stroke-accent"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 3"
      />
      <circle cx="40" cy="33.5" r="2" className="fill-accent" />
      <circle cx="120" cy="52" r="2" className="fill-accent" />
    </svg>
  );
}
