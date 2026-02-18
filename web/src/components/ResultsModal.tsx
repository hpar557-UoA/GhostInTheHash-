// GhostInTheHash | "SHADOWS HAVE CHECKSUMS." — Harsh Pardeshi
import { useEffect, useMemo, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { SourceCard } from "./SourceCard";
import { downloadReportTxt } from "../lib/textExport";
import type { ReportPayload } from "../lib/types";

type ResultsModalProps = {
  report: ReportPayload | null;
  open: boolean;
  onClose: () => void;
  accent: string;
  reducedMotion: boolean;
};

export const ResultsModal = ({ report, open, onClose, accent, reducedMotion }: ResultsModalProps) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !report) return;
    setSelectedSource(report.results[0]?.sourceName ?? null);
  }, [open, report]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const selected = useMemo(() => {
    if (!report) return [];
    if (!selectedSource) return report.results;
    return report.results.filter((item) => item.sourceName === selectedSource);
  }, [report, selectedSource]);

  const summary = useMemo(() => {
    if (!report) return null;
    const totalSources = report.results.length;
    const totalFields = report.results.reduce((acc, r) => acc + r.fields.length, 0);
    const totalSensitive = report.results.reduce((acc, r) => acc + r.fields.filter((f) => f.isSensitive).length, 0);

    const focus = selectedSource
      ? report.results.filter((r) => r.sourceName === selectedSource)
      : report.results;
    const focusFields = focus.reduce((acc, r) => acc + r.fields.length, 0);
    const focusSensitive = focus.reduce((acc, r) => acc + r.fields.filter((f) => f.isSensitive).length, 0);

    return {
      totalSources,
      totalFields,
      totalSensitive,
      focusFields,
      focusSensitive,
      focused: Boolean(selectedSource),
      focusedName: selectedSource,
    };
  }, [report, selectedSource]);

  useEffect(() => {
    if (!open) return;
    if (!detailRef.current) return;
    detailRef.current.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [open, reducedMotion, selectedSource]);

  const rawList = useMemo(() => {
    const raw = report?.raw;
    if (!raw || typeof raw !== "object") return null;
    const maybeList = (raw as Record<string, unknown>)["List"];
    if (!maybeList || typeof maybeList !== "object") return null;
    return maybeList as Record<string, unknown>;
  }, [report?.raw]);

  if (!report) return null;

  const overlayTransition: Transition = { duration: 0.18 };
  const modalTransition: Transition = { type: "spring", stiffness: 220, damping: 22 };

  const list = {
    hidden: {},
    show: {
      transition: reducedMotion ? undefined : { staggerChildren: 0.04, delayChildren: 0.06 },
    },
  };

  const listItem = {
    hidden: reducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 },
    show: reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {open && (
        <FocusLock returnFocus>
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reducedMotion ? undefined : overlayTransition}
            className="fixed inset-0 z-[130] bg-black/60 p-4 backdrop-blur-[1px]"
          >
            <motion.div
              initial={{ scale: reducedMotion ? 1 : 0.97, opacity: 0, y: reducedMotion ? 0 : 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: reducedMotion ? 1 : 0.985, opacity: 0, y: reducedMotion ? 0 : 6 }}
              transition={reducedMotion ? undefined : modalTransition}
              className={`report-shell mx-auto flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#07080B]/70 ${
                reducedMotion ? "reduce-motion" : ""
              }`}
            >
              <div className="report-effects" aria-hidden="true" />
              <div className="hud-layer" aria-hidden="true" />
              <div className="flex h-full flex-col overflow-hidden">
                <header className="relative border-b border-white/10 px-4 pt-6 pb-4">
                  <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <h3
                        className={`report-title text-sm font-semibold tracking-[0.2em] text-white ${
                          reducedMotion ? "" : "report-title-flicker"
                        }`}
                      >
                        GHOSTINTHEHASH REPORT
                      </h3>
                      <span className="report-telemetry inline-flex items-center gap-2 rounded-full border border-white/15 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70">
                        <span
                          className={`report-dot ${reducedMotion ? "" : "report-dot-pulse"}`}
                          style={{ backgroundColor: accent }}
                        />
                        Telemetry
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-white/65">Timestamp: {new Date(report.generatedAt).toLocaleString()}</p>
                    <p className="mt-1 text-xs text-white/65">Query: {report.maskedQuery}</p>

                    {summary && (
                      <div className="mt-3 flex flex-wrap justify-center gap-2 text-[11px] text-white/70">
                        <span className="rounded-full border border-white/15 px-2 py-0.5">Sources: {summary.totalSources}</span>
                        <span className="rounded-full border border-white/15 px-2 py-0.5">Fields: {summary.totalFields}</span>
                        <span
                          className="rounded-full border border-white/15 px-2 py-0.5"
                          style={{ borderColor: `${accent}55` }}
                        >
                          Sensitive: {summary.totalSensitive}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute right-4 top-6">
                    <button
                      aria-label="Close report"
                      onClick={onClose}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/40 text-red-300 transition-colors hover:border-red-400/60 hover:text-red-200"
                      type="button"
                    >
                      <span className="text-lg leading-none">×</span>
                    </button>
                  </div>
                </header>

                <div className="grid min-h-0 flex-1 grid-cols-12 gap-3 p-4">
                  <aside className="col-span-12 max-h-full overflow-auto rounded-xl border border-white/10 bg-[#0E1117]/80 p-3 md:col-span-3">
                    <h4 className="mb-2 text-xs uppercase tracking-[0.2em] text-white/65">Sources</h4>
                    <motion.div variants={list} initial="hidden" animate="show" className="space-y-2">
                      {report.results.map((source) => {
                        const fieldCount = source.fields.length;
                        const sensitiveCount = source.fields.filter((field) => field.isSensitive).length;
                        const active = selectedSource === source.sourceName;
                        return (
                          <motion.button
                            variants={listItem}
                            whileHover={reducedMotion ? undefined : { scale: 1.01 }}
                            whileTap={reducedMotion ? undefined : { scale: 0.995 }}
                            aria-label={`Open source ${source.sourceName}`}
                            type="button"
                            key={source.sourceName}
                            onClick={() => setSelectedSource(source.sourceName)}
                            className="w-full rounded-lg border border-white/10 p-2 text-left transition-transform"
                            style={
                              active
                                ? { borderColor: accent, boxShadow: `0 0 12px ${accent}66` }
                                : { boxShadow: "0 0 0 rgba(0,0,0,0)" }
                            }
                          >
                            <p className="text-sm text-white">{source.sourceName}</p>
                            <div className="mt-2 flex gap-2 text-[11px] text-white/70">
                              <span className="rounded-full border border-white/15 px-2 py-0.5">Fields: {fieldCount}</span>
                              <span className="rounded-full border border-white/15 px-2 py-0.5">
                                Sensitive: {sensitiveCount}
                              </span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </aside>

                  <section ref={detailRef} className="col-span-12 min-h-0 space-y-3 overflow-auto pr-1 md:col-span-9">
                    {summary && (
                      <div className="sticky top-0 z-[3] rounded-xl border border-white/10 bg-[#07080B]/85 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/65">
                            {summary.focused ? "Focused view" : "Report summary"}
                          </p>
                          {summary.focused && (
                            <button
                              type="button"
                              onClick={() => setSelectedSource(null)}
                              className="text-xs text-white/70 hover:text-white"
                              aria-label="Show all sources"
                            >
                              Show all
                            </button>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/75">
                          <span className="rounded-full border border-white/15 px-2 py-1">
                            Sources: {summary.totalSources}
                          </span>
                          <span className="rounded-full border border-white/15 px-2 py-1">
                            Fields: {summary.focused ? summary.focusFields : summary.totalFields}
                          </span>
                          <span
                            className="rounded-full border border-white/15 px-2 py-1"
                            style={{ borderColor: `${accent}55` }}
                          >
                            Sensitive: {summary.focused ? summary.focusSensitive : summary.totalSensitive}
                          </span>
                        </div>
                      </div>
                    )}

                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={selectedSource ?? "__all__"}
                        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                        transition={reducedMotion ? undefined : { duration: 0.18, ease: "easeOut" }}
                        className="space-y-3"
                      >
                        {selected.map((source) => (
                          <SourceCard
                            key={source.sourceName}
                            source={source}
                            accent={accent}
                            rawEntry={rawList?.[source.sourceName]}
                            reducedMotion={reducedMotion}
                          />
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </section>
                </div>

                <footer className="border-t border-white/10 p-3">
                  <div className="flex items-center justify-center">
                    <button
                      aria-label="Download report"
                      onClick={() => downloadReportTxt(report)}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white"
                    >
                      Download
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[11px] text-white/50">“Trust is a log file.” — Harsh Pardeshi</p>
                </footer>
              </div>
            </motion.div>
          </motion.div>
        </FocusLock>
      )}
    </AnimatePresence>
  );
};
