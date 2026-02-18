// GhostInTheHash | "SIGNAL IN. SHADOW OUT." — Harsh Pardeshi
import { useMemo, useState } from "react";
import { RiskGauge } from "./RiskGauge";

const ITEMS = ["Unique passwords", "Password manager", "MFA", "Breach alerts", "Rate limiting"] as const;

type DefenseChecklistProps = {
  baseRisk: number;
  accent: string;
};

export const DefenseChecklist = ({ baseRisk, accent }: DefenseChecklistProps) => {
  const [checked, setChecked] = useState<string[]>([]);

  const adjustedRisk = useMemo(() => {
    const reduction = checked.length * 12;
    return Math.max(0, Math.min(100, baseRisk - reduction));
  }, [baseRisk, checked]);

  const meaning = useMemo(() => {
    if (adjustedRisk >= 70) return "This pattern is what attackers love…";
    if (adjustedRisk >= 40) return "You’re safer than most, but reuse is still deadly…";
    return "You’ve removed the easy wins…";
  }, [adjustedRisk]);

  const toggle = (item: string) => {
    setChecked((prev) => (prev.includes(item) ? prev.filter((entry) => entry !== item) : [...prev, item]));
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#0E1117]/80 p-4 backdrop-blur">
      <h3 className="text-sm uppercase tracking-[0.2em] text-white/80">Defense checklist</h3>
      <div className="mt-3 grid gap-2">
        {ITEMS.map((item) => {
          const active = checked.includes(item);
          return (
            <label key={item} className="flex items-center gap-2 text-sm text-white/85">
              <input
                aria-label={item}
                type="checkbox"
                checked={active}
                onChange={() => toggle(item)}
                className="h-4 w-4 rounded border-white/30 bg-transparent"
                style={{ accentColor: accent }}
              />
              {item}
            </label>
          );
        })}
      </div>
      <div className="mt-4">
        <RiskGauge value={adjustedRisk} accent={accent} />
      </div>
      <p className="mt-3 text-sm text-white/75">{meaning}</p>
    </section>
  );
};
