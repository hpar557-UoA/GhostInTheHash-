// GhostInTheHash | "LOGS DON'T LIE." — Harsh Pardeshi
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

type SearchPanelProps = {
  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;
  error: string | null;
  loading: boolean;
  accent: string;
  reducedMotion: boolean;
};

export const SearchPanel = ({
  query,
  setQuery,
  onSearch,
  error,
  loading,
  accent,
  reducedMotion,
}: SearchPanelProps) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      onMouseMove={(event) => {
        if (reducedMotion) return;
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        setTilt({ x: (0.5 - py) * 8, y: (px - 0.5) * 8 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 160, damping: 14 }}
      className="scanner-panel relative z-[3] w-full max-w-xl rounded-2xl border border-white/10 bg-[#0E1117]/80 p-6 backdrop-blur-xl"
      style={{ transformStyle: "preserve-3d", boxShadow: `0 0 24px ${accent}26` }}
    >
      <div className="mb-4">
        <p className="font-mono text-[11px] tracking-[0.22em] text-white/55">root@ghost:~$</p>
        <h2 className="mt-2 text-lg font-semibold tracking-widest text-white">Echo Scanner Console</h2>
      </div>

      <label className="block text-sm text-white/80" htmlFor="query-input">
        Email or phone (international)
      </label>
      <div className="input-shell relative mt-2 overflow-hidden rounded-xl border border-white/20 bg-black/30">
        <input
          id="query-input"
          aria-label="Email or phone"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="name@domain.com or +1 (555) 123-4567"
          className="relative z-[2] w-full bg-transparent px-4 py-3 text-white outline-none"
        />
      </div>
      <p className="mt-2 text-xs text-white/65">
        Paste an identifier → run scan → render upstream results into structured cards.
      </p>
      <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-white/45">
        FOR EDUCATIONAL / AUDITING USE ONLY — DO NOT ABUSE.
      </p>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      <button
        type="submit"
        aria-label="Run API search"
        disabled={loading}
        className="btn-neon mt-4 block rounded-lg px-4 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70 mx-auto"
        style={{ backgroundColor: accent, boxShadow: `0 0 16px ${accent}` }}
      >
        {loading ? "Scanning..." : "Search"}
      </button>
    </motion.form>
  );
};
