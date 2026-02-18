// GhostInTheHash | "SILENCE IS A PACKET TOO." — Harsh Pardeshi
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type BootOverlayProps = {
  visible: boolean;
  reducedMotion: boolean;
};

const BOOT_LINES = [
  "SYSTEM ONLINE",
  "CALIBRATING SENSOR GRID",
  "LOADING SAFE SIMULATION ENGINE",
];

export const BootOverlay = ({ visible, reducedMotion }: BootOverlayProps) => {
  const [text, setText] = useState(BOOT_LINES.map(() => ""));

  useEffect(() => {
    if (!visible) return;
    if (reducedMotion) {
      setText(BOOT_LINES);
      return;
    }

    let line = 0;
    let char = 0;
    const working = [...BOOT_LINES.map(() => "")];

    const timer = window.setInterval(() => {
      working[line] = BOOT_LINES[line].slice(0, char + 1);
      setText([...working]);
      char += 1;

      if (char >= BOOT_LINES[line].length) {
        line += 1;
        char = 0;
      }

      if (line >= BOOT_LINES.length) window.clearInterval(timer);
    }, 18);

    return () => window.clearInterval(timer);
  }, [visible, reducedMotion]);

  const transition = useMemo(() => (reducedMotion ? { duration: 0 } : { duration: 0.45 }), [reducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black"
        >
          <div className="boot-shell w-full max-w-2xl px-6 text-center font-mono text-sm text-[#18FF6D]">
            {text.map((line, index) => (
              <p key={BOOT_LINES[index]} className={`boot-line mb-2 tracking-[0.2em] ${reducedMotion ? "" : "boot-flicker"}`}>
                {line}
                <span className={`boot-caret ml-0.5 ${reducedMotion ? "" : "boot-caret-blink"}`}>_</span>
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
