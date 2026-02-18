// GhostInTheHash | "TRUST IS A LOG FILE." — Harsh Pardeshi
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { ReportSource } from "../lib/types";

type SourceCardProps = {
  source: ReportSource;
  accent: string;
  rawEntry?: unknown;
  reducedMotion?: boolean;
};

export const SourceCard = ({ source, accent, rawEntry, reducedMotion = false }: SourceCardProps) => {
  const container = {
    hidden: {},
    show: {
      transition: reducedMotion ? undefined : { staggerChildren: 0.03, delayChildren: 0.05 },
    },
  };

  const item = {
    hidden: reducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 },
    show: reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
  };

  const rawText = useMemo(() => JSON.stringify(rawEntry ?? { note: "No raw source entry available" }, null, 2), [rawEntry]);

  const criticalValues = useMemo(() => {
    return source.fields
      .filter((field) => field.isSensitive)
      .map((field) => field.value)
      .filter((value) => typeof value === "string" && value.trim().length >= 3)
      .slice(0, 24);
  }, [source.fields]);

  const highlightedRaw = useMemo(() => {
    if (!criticalValues.length) return rawText;

    let nodes: Array<string | JSX.Element> = [rawText];
    for (const value of criticalValues) {
      nodes = nodes.flatMap((node, nodeIndex) => {
        if (typeof node !== "string") return [node];
        const parts = node.split(value);
        if (parts.length === 1) return [node];

        const out: Array<string | JSX.Element> = [];
        for (let i = 0; i < parts.length; i += 1) {
          if (parts[i]) out.push(parts[i]);
          if (i < parts.length - 1) {
            out.push(
              <span key={`crit-${nodeIndex}-${i}-${value}`} className="text-red-300">
                {value}
              </span>
            );
          }
        }
        return out;
      });
    }
    return nodes;
  }, [criticalValues, rawText]);

  return (
    <motion.article
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reducedMotion ? undefined : { duration: 0.22, ease: "easeOut" }}
      className="cv-auto rounded-xl border border-white/10 bg-[#0E1117]/80 p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-white">
          <span className="mr-2">{source.sourceIcon}</span>
          {source.sourceName}
        </h4>
        <span
          className="rounded-md border border-white/20 px-2 py-1 text-[11px] text-white/75"
          style={{ borderColor: `${accent}55` }}
        >
          API Values
        </span>
      </div>

      <p className="mt-2 text-xs text-white/70">{source.summary}</p>

      <motion.div variants={container} initial="hidden" animate="show" className="mt-3 grid gap-2 sm:grid-cols-2">
        {source.fields.map((field) => (
          <motion.div
            variants={item}
            whileHover={reducedMotion ? undefined : { y: -1 }}
            key={`${source.sourceName}-${field.label}`}
            className="rounded-lg border border-white/10 p-2"
            style={field.isSensitive ? { borderColor: `${accent}33` } : undefined}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.15em] text-white/60">{field.label}</span>
              <button
                type="button"
                aria-label={`Copy ${field.label}`}
                onClick={() => navigator.clipboard.writeText(field.value)}
                className="text-[11px] text-white/60 hover:text-white"
              >
                Copy
              </button>
            </div>
            <p
              className={`text-sm ${
                field.isSensitive ? "text-red-300" : "text-white/85"
              } ${field.monospace ? "font-mono text-xs" : ""}`}
            >
              {field.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/65">Exact API response (raw)</p>
        <pre
          className="mt-2 max-h-64 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-xs"
          style={{ color: `color-mix(in srgb, ${accent} 88%, white)` }}
        >
          {highlightedRaw}
        </pre>
      </div>
    </motion.article>
  );
};
