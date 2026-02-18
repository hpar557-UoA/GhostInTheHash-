// GhostInTheHash | "YOUR IDENTIFIER IS A FOOTPRINT." — Harsh Pardeshi
type RiskGaugeProps = {
  value: number;
  accent: string;
};

export const RiskGauge = ({ value, accent }: RiskGaugeProps) => {
  const safe = Math.max(0, Math.min(100, value));

  return (
    <div className="rounded-xl border border-white/10 bg-[#0E1117]/80 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.25em] text-white/65">Risk Score</p>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${safe}%`, backgroundColor: accent, boxShadow: `0 0 20px ${accent}` }}
        />
      </div>
      <p className="mt-2 text-sm text-white/85">{safe}/100</p>
    </div>
  );
};
