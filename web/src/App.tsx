// GhostInTheHash | "SHADOWS HAVE CHECKSUMS." — Harsh Pardeshi
import { useEffect, useRef, useState } from "react";
import { BootOverlay } from "./components/BootOverlay";
import { CursorGlow } from "./components/CursorGlow";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { MatrixRain } from "./components/MatrixRain";
import { ResultsModal } from "./components/ResultsModal";
import { SearchPanel } from "./components/SearchPanel";
import { fetchReport } from "./lib/fetchReport";
import { usePrefersReducedMotion } from "./lib/motionPrefs";
import type { ReportPayload } from "./lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s()\-]{7,20}$/;

const isValidQuery = (value: string) => EMAIL_RE.test(value.trim()) || PHONE_RE.test(value.trim());

const GREEN = "#18FF6D";

const QUOTES = [
  "THE WIRE REMEMBERS.",
  "SOMEWHERE, A BOT IS TRYING PASSWORDS.",
  "ECHOES DON’T NEED PERMISSION.",
  "YOUR IDENTIFIER IS A FOOTPRINT.",
  "TRUST IS A LOG FILE.",
  "THE DARK DOESN’T SLEEP — IT AUTOMATES.",
] as const;

function App() {
  const reducedMotion = usePrefersReducedMotion();
  const appRef = useRef<HTMLDivElement | null>(null);

  const [bootVisible, setBootVisible] = useState(true);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setBootVisible(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const accent = GREEN;
  const backgroundFxEnabled = !reducedMotion && !bootVisible && !loading && !modalOpen;

  const onSearch = async () => {
    setError(null);
    const clean = query.trim();

    if (!isValidQuery(clean)) {
      setError("Enter a valid email or phone number.");
      return;
    }

    setLoading(true);
    try {
      const payload = await fetchReport(clean);
      setReport(payload);
      setModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={appRef} className="app-shell relative min-h-screen overflow-hidden text-white" style={{ ["--accent" as string]: accent }}>
      <MatrixRain containerRef={appRef} accent={accent} enabled={backgroundFxEnabled} />
      {backgroundFxEnabled && <div className="neon-layer absolute inset-0 opacity-25" />}
      <div className="vignette-layer absolute inset-0" />

      <CursorGlow containerRef={appRef} color={accent} enabled={false} />

      <main className="relative z-[3] mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6">
        <header className="header-sheen header-float mt-14 mb-8 flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0E1117]/35 p-4 text-center">
          <div className="flex flex-col items-center">
            <h1 className={`text-2xl font-bold tracking-wide ${reducedMotion ? "" : "logo-flicker"}`}>GhostInTheHash</h1>
            <p className={`mt-1 font-mono text-xs tracking-[0.22em] text-white/65 ${reducedMotion ? "" : "ghost-quote"}`}>
              {QUOTES[quoteIndex]}
              <span className="ml-1 opacity-70">▮</span>
            </p>
            <span className="mt-1 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs tracking-[0.2em] text-white/80">
              LIVE API MODE
            </span>
          </div>
        </header>

        <section className="relative flex flex-1 items-center justify-center">
          <SearchPanel
            query={query}
            setQuery={setQuery}
            onSearch={onSearch}
            error={error}
            loading={loading}
            accent={accent}
            reducedMotion={reducedMotion}
          />
        </section>
      </main>

      <footer className="creator-credit pointer-events-none fixed bottom-3 left-0 right-0 z-[4] px-4 text-center text-xs text-white/55">
        “Trust is a log file.” — Harsh Pardeshi
      </footer>

      <BootOverlay visible={bootVisible} reducedMotion={reducedMotion} />
      <LoadingOverlay visible={loading} reducedMotion={reducedMotion} accent={accent} />
      <ResultsModal
        report={report}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        accent={accent}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}

export default App;
