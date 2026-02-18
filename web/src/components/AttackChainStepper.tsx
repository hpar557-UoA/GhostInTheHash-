// GhostInTheHash | "THE WIRE REMEMBERS." — Harsh Pardeshi
const STEPS = [
  {
    title: "Breach",
    description: "A service leak exposes identity fragments and stale credentials.",
  },
  {
    title: "Credential dump",
    description: "Records are bundled into lists sold or traded in underground channels.",
  },
  {
    title: "Password reuse",
    description: "Attackers test reused passwords against unrelated accounts.",
  },
  {
    title: "Automated login attempts",
    description: "Bots run high-volume sign-in attempts to find weak entry points.",
  },
  {
    title: "Account takeover",
    description: "Recovered access is monetized through fraud, spam, or extortion.",
  },
];

export const AttackChainStepper = ({ accent }: { accent: string }) => {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0E1117]/80 p-4 backdrop-blur">
      <h3 className="text-sm uppercase tracking-[0.2em] text-white/80">Attack chain</h3>
      <ol className="mt-3 space-y-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span
              className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full text-xs font-semibold text-black"
              style={{ backgroundColor: accent }}
            >
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-white">{step.title}</p>
              <p className="text-xs text-white/70">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
