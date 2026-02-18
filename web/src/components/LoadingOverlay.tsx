// GhostInTheHash | "THE DARK DOESN'T SLEEP — IT AUTOMATES." — Harsh Pardeshi
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MatrixRain } from "./MatrixRain";

type LoadingOverlayProps = {
  visible: boolean;
  reducedMotion: boolean;
  accent: string;
};

const STATUS = [
  "Tracing hashes…",
  "Listening for echoes…",
  "Indexing shadows…",
  "Assembling fragments…",
  "Checking reuse patterns…",
  "Simulating attacker automation…",
];

export const LoadingOverlay = ({ visible, reducedMotion, accent }: LoadingOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [feed, setFeed] = useState<string[]>([]);
  const [hudTick, setHudTick] = useState(0);

  const hackerFigure = useMemo(
    () =>
      [
        "      .---.",
        "     /     \\",
        "    | 0 _ 0 |",
        "    |   ^   |",
        "     \\  -  /",
        "   .-`---'-. ",
        "  /  [===]  \\",
        " /__/|___|\\__\\",
        "    /_/ \\_\\",
      ].join("\n"),
    []
  );

  const progress = useMemo(() => {
    const max = STATUS[statusIndex]?.length ?? 1;
    if (reducedMotion) return 1;
    if (max <= 0) return 0;
    return Math.min(1, typedLength / max);
  }, [reducedMotion, statusIndex, typedLength]);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS.length);
      setTypedLength(0);
    }, 700);
    return () => window.clearInterval(timer);
  }, [visible]);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      setTypedLength((prev) => {
        const max = STATUS[statusIndex]?.length ?? 0;
        return prev >= max ? max : prev + 1;
      });
    }, 26);
    return () => window.clearInterval(timer);
  }, [statusIndex, visible, reducedMotion]);

  useEffect(() => {
    if (!visible || !reducedMotion) return;
    setTypedLength(STATUS[statusIndex]?.length ?? 0);
  }, [statusIndex, visible, reducedMotion]);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      setGlitch(true);
      window.setTimeout(() => setGlitch(false), 150);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [visible, reducedMotion]);

  useEffect(() => {
    if (!visible) return;
    const mkLine = () => {
      const now = new Date();
      const t = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      const pool = "abcdef0123456789";
      const hash = new Array(28)
        .fill(0)
        .map(() => pool[(Math.random() * pool.length) | 0])
        .join("");
      const tags = ["TRACE", "HOOK", "SPOOF", "SCAN", "MIRROR", "ECHO"] as const;
      const tag = tags[(Math.random() * tags.length) | 0];
      return `${t} ${tag} ${hash}`;
    };

    setFeed((prev) => (prev.length ? prev : [mkLine(), mkLine(), mkLine()]));

    const timer = window.setInterval(() => {
      setFeed((prev) => [...prev.slice(-7), mkLine()]);
    }, reducedMotion ? 0 : 260);

    return () => window.clearInterval(timer);
  }, [reducedMotion, visible]);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setInterval(() => setHudTick((prev) => prev + 1), 900);
    return () => window.clearInterval(timer);
  }, [reducedMotion, visible]);

  const hud = useMemo(() => {
    const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));
    const coordA = `${rand(10, 99)}.${rand(100, 999)}N ${rand(10, 99)}.${rand(100, 999)}E`;
    const coordB = `${rand(100, 999)}.${rand(10, 99)}.${rand(100, 999)}`;
    const ports = `${rand(2000, 65000)}→${rand(2000, 65000)}`;
    const sig = `${rand(40, 98)}%`;
    return { coordA, coordB, ports, sig };
  }, [hudTick]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[110] overflow-hidden bg-[#07080B]/95 ${glitch ? "animate-pulse" : ""}`}
        >
          <div ref={overlayRef} className="absolute inset-0">
            <MatrixRain containerRef={overlayRef} accent={accent} enabled={!reducedMotion} />
          </div>
          <div className="absolute inset-0 fog-layer opacity-20" />
          <div className="absolute inset-0 noise-layer opacity-10" />

          {!reducedMotion && (
            <>
              <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.path
                    d="M5 18 L32 18 L45 28 L72 28 L95 12"
                    fill="none"
                    stroke={`${accent}55`}
                    strokeWidth="0.35"
                    strokeDasharray="2 1.6"
                    animate={{ strokeDashoffset: [0, -18] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.path
                    d="M8 72 L28 62 L52 62 L70 78 L92 78"
                    fill="none"
                    stroke={`${accent}44`}
                    strokeWidth="0.28"
                    strokeDasharray="1.6 1.4"
                    animate={{ strokeDashoffset: [0, 16] }}
                    transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.path
                    d="M12 40 L26 40 L40 50 L58 50 L74 44 L88 44"
                    fill="none"
                    stroke={`${accent}3a`}
                    strokeWidth="0.24"
                    strokeDasharray="1.4 1.2"
                    animate={{ strokeDashoffset: [0, -14] }}
                    transition={{ duration: 5.4, repeat: Infinity, ease: "linear" }}
                  />
                </svg>
              </div>

              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-6 top-6 z-[2] font-mono text-[10px] tracking-[0.22em]"
                animate={{ opacity: [0.2, 0.55, 0.2] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: `${accent}cc` }}
              >
                <div className="rounded-md border border-white/10 bg-black/20 px-3 py-2 backdrop-blur">
                  <div className="text-white/60">COORD</div>
                  <div style={{ color: accent }}>{hud.coordA}</div>
                </div>
              </motion.div>

              <motion.div
                aria-hidden
                className="pointer-events-none absolute right-6 top-6 z-[2] text-right font-mono text-[10px] tracking-[0.22em]"
                animate={{ opacity: [0.2, 0.55, 0.2] }}
                transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: `${accent}cc` }}
              >
                <div className="rounded-md border border-white/10 bg-black/20 px-3 py-2 backdrop-blur">
                  <div className="text-white/60">ROUTE</div>
                  <div style={{ color: accent }}>{hud.ports}</div>
                </div>
              </motion.div>

              <motion.div
                aria-hidden
                className="pointer-events-none absolute bottom-6 left-1/2 z-[2] -translate-x-1/2 font-mono text-[10px] tracking-[0.22em]"
                animate={{ opacity: [0.14, 0.34, 0.14] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 backdrop-blur">
                  <span className="text-white/60">SIGNAL</span>
                  <span className="mx-2 text-white/30">•</span>
                  <span style={{ color: accent }}>{hud.sig}</span>
                  <span className="mx-2 text-white/30">•</span>
                  <span className="text-white/60">NODE</span>
                  <span className="ml-2" style={{ color: `${accent}cc` }}>
                    {hud.coordB}
                  </span>
                </div>
              </motion.div>

              {/* Corner brackets */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-5 top-5 z-[2] h-10 w-10"
                animate={{ opacity: [0.12, 0.32, 0.12] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ borderLeft: `2px solid ${accent}55`, borderTop: `2px solid ${accent}55` }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute right-5 top-5 z-[2] h-10 w-10"
                animate={{ opacity: [0.12, 0.32, 0.12] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ borderRight: `2px solid ${accent}55`, borderTop: `2px solid ${accent}55` }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-5 bottom-5 z-[2] h-10 w-10"
                animate={{ opacity: [0.12, 0.32, 0.12] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ borderLeft: `2px solid ${accent}55`, borderBottom: `2px solid ${accent}55` }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute right-5 bottom-5 z-[2] h-10 w-10"
                animate={{ opacity: [0.12, 0.32, 0.12] }}
                transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut" }}
                style={{ borderRight: `2px solid ${accent}55`, borderBottom: `2px solid ${accent}55` }}
              />

              {/* Glitch blocks */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-[14%] top-[22%] z-[1] h-10 w-24 rounded-md"
                animate={{ opacity: [0, 0.22, 0], x: [0, 12, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
                style={{ background: `linear-gradient(90deg, transparent 0%, ${accent}2a 50%, transparent 100%)`, mixBlendMode: "screen" }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute right-[12%] top-[38%] z-[1] h-8 w-28 rounded-md"
                animate={{ opacity: [0, 0.18, 0], x: [0, -10, 0] }}
                transition={{ duration: 0.55, repeat: Infinity, repeatDelay: 3.4, ease: "easeInOut" }}
                style={{ background: `linear-gradient(90deg, transparent 0%, ${accent}22 50%, transparent 100%)`, mixBlendMode: "screen" }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-[28%] bottom-[22%] z-[1] h-9 w-20 rounded-md"
                animate={{ opacity: [0, 0.16, 0], y: [0, -8, 0] }}
                transition={{ duration: 0.58, repeat: Infinity, repeatDelay: 3.1, ease: "easeInOut" }}
                style={{ background: `linear-gradient(180deg, transparent 0%, ${accent}24 50%, transparent 100%)`, mixBlendMode: "screen" }}
              />
            </>
          )}

          {!reducedMotion && (
            <>
              <motion.pre
                aria-hidden
                className="pointer-events-none absolute bottom-8 left-8 z-[2] whitespace-pre font-mono text-[10px] leading-[1.15] tracking-[0.18em]"
                animate={{ opacity: [0.16, 0.32, 0.16], y: [0, -6, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  color: accent,
                  textShadow: `0 0 10px ${accent}40, 0 0 22px ${accent}18`,
                  filter: "saturate(1.1)",
                }}
              >
                {hackerFigure}
              </motion.pre>

              <motion.div
                aria-hidden
                className="pointer-events-none absolute bottom-10 right-10 z-[2] w-[22rem] max-w-[60vw] rounded-xl border border-white/10 bg-black/25 p-3 backdrop-blur"
                animate={{ opacity: [0.22, 0.36, 0.22] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ boxShadow: `0 0 26px ${accent}14` }}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] tracking-[0.22em] text-white/70">root@ghost:~$</span>
                  <span className="font-mono text-[10px] tracking-[0.22em]" style={{ color: accent }}>
                    live
                  </span>
                </div>
                <div className="space-y-1 font-mono text-[10px] leading-snug tracking-[0.18em]" style={{ color: `${accent}cc` }}>
                  {feed.slice(-6).map((line) => (
                    <div key={line} className="truncate">
                      {line}
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {!reducedMotion && (
            <>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                animate={{ rotate: -360, opacity: [0.08, 0.16, 0.08] }}
                transition={{ rotate: { duration: 26, repeat: Infinity, ease: "linear" }, opacity: { duration: 4.6, repeat: Infinity, ease: "easeInOut" } }}
                style={{ borderColor: `${accent}28`, borderStyle: "dashed" }}
              />
              <motion.div
                aria-hidden
                className="absolute left-1/2 top-1/2 z-[1] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                style={{ boxShadow: `0 0 38px ${accent}14` }}
              />
              <motion.div
                aria-hidden
                className="absolute left-1/2 top-1/2 z-[1] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                animate={{ scale: [1, 1.08, 1], opacity: [0.28, 0.55, 0.28] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ borderColor: `${accent}55`, boxShadow: `0 0 28px ${accent}18` }}
              />

              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-px w-[30rem] -translate-x-1/2 -translate-y-1/2"
                animate={{ opacity: [0.06, 0.18, 0.06] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: `linear-gradient(90deg, transparent 0%, ${accent}55 50%, transparent 100%)` }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[30rem] w-px -translate-x-1/2 -translate-y-1/2"
                animate={{ opacity: [0.05, 0.16, 0.05] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: `linear-gradient(180deg, transparent 0%, ${accent}44 50%, transparent 100%)` }}
              />

              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-72 w-72 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 8.5, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
                  style={{ background: accent, boxShadow: `0 0 16px ${accent}` }}
                />
              </motion.div>

              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-56 w-56 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: -360 }}
                transition={{ duration: 6.4, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full opacity-70"
                  style={{ background: `${accent}cc`, boxShadow: `0 0 14px ${accent}` }}
                />
              </motion.div>
            </>
          )}

          <div className="relative z-[2] flex h-full flex-col items-center justify-center gap-4 px-6">
            <div className="text-center">
              <p className="font-mono text-lg tracking-widest" style={{ color: accent }}>
                {(reducedMotion ? STATUS[statusIndex] : STATUS[statusIndex].slice(0, typedLength))}
                {!reducedMotion && <span className="ml-1 opacity-70">_</span>}
              </p>

              <div className="relative mt-4 h-2 w-64 overflow-hidden rounded-full bg-white/10">
                <div
                  className="relative h-full rounded-full"
                  style={{ width: `${Math.max(0.06, progress) * 100}%`, background: accent, boxShadow: `0 0 18px ${accent}66` }}
                >
                  {!reducedMotion && (
                    <>
                      <motion.div
                        aria-hidden
                        className="absolute inset-0 opacity-30"
                        animate={{ x: [-28, 28] }}
                        transition={{ duration: 1.15, repeat: Infinity, ease: "linear" }}
                        style={{
                          background:
                            "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0, rgba(255,255,255,0.22) 7px, rgba(0,0,0,0) 14px)",
                          mixBlendMode: "overlay",
                        }}
                      />
                      <motion.div
                        aria-hidden
                        className="absolute inset-y-0 left-0 w-24 opacity-70 blur-sm"
                        animate={{ x: [0, 256] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                          background: `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`,
                          mixBlendMode: "screen",
                        }}
                      />
                      <motion.div
                        aria-hidden
                        className="absolute inset-0"
                        animate={{ opacity: [0.12, 0.28, 0.12], scaleY: [1, 1.2, 1] }}
                        transition={{ duration: 0.22, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
                        style={{
                          background: `linear-gradient(180deg, transparent 0%, ${accent}30 45%, transparent 100%)`,
                          mixBlendMode: "screen",
                        }}
                      />
                    </>
                  )}
                </div>

                {!reducedMotion && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 opacity-20"
                    animate={{ opacity: [0.12, 0.22, 0.12] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      background:
                        "repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0, rgba(255,255,255,0.10) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)",
                      mixBlendMode: "overlay",
                    }}
                  />
                )}
              </div>

              {!reducedMotion && (
                <motion.p
                  className="mt-3 font-mono text-[11px] tracking-[0.22em] text-white/55"
                  animate={{ opacity: [0.35, 0.75, 0.35] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  SYNCHRONIZING SIGNAL
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
