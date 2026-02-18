// GhostInTheHash | "ECHOES DON'T NEED PERMISSION." — Harsh Pardeshi
import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";

type MatrixRainProps = {
  containerRef: RefObject<HTMLElement>;
  accent: string;
  enabled: boolean;
};

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+@<>[]{}?/\\";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const raw = hex.trim();
  const match = /^#?([0-9a-fA-F]{6})$/.exec(raw);
  if (!match) return null;
  const value = match[1];
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return { r, g, b };
};

const toRgba = (hex: string, alpha: number) => {
  const rgb = hexToRgb(hex);
  const safeAlpha = clamp(alpha, 0, 1);
  if (!rgb) return `rgba(255, 255, 255, ${safeAlpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${safeAlpha})`;
};

export const MatrixRain = ({ containerRef, accent, enabled }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const accentBody = useMemo(() => toRgba(accent, 0.14), [accent]);
  const accentHead = useMemo(() => toRgba(accent, 0.46), [accent]);
  const accentGlow = useMemo(() => toRgba(accent, 0.18), [accent]);

  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });
  const boostTarget = useRef(0);
  const boostCurrent = useRef(0);
  const lastMove = useRef({ x: 0, y: 0, t: 0 });
  const lastMoveAt = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    const fontSize = 13;
    const xStep = Math.max(10, Math.floor(fontSize * 0.9));
    let columns = 0;
    let drops: number[] = [];
    let speeds: number[] = [];

    const setFont = () => {
      ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace`;
      ctx.textBaseline = "top";
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      // Keep DPR lower for performance on large canvases.
      dpr = clamp(window.devicePixelRatio || 1, 1, 1.5);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setFont();

      columns = Math.ceil(width / xStep);
      drops = new Array(columns).fill(0).map(() => -Math.random() * height);
      speeds = new Array(columns).fill(0).map(() => 0.9 + Math.random() * 1.6);

      pointerTarget.current = { x: width * 0.5, y: height * 0.5 };
      pointerCurrent.current = { x: width * 0.5, y: height * 0.5 };
    };

    resize();

    const onMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointerTarget.current = { x, y };

      const now = performance.now();
      const dt = Math.max(8, now - lastMove.current.t);
      const dx = x - lastMove.current.x;
      const dy = y - lastMove.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speedPxPerSec = (dist / dt) * 1000;
      boostTarget.current = clamp(speedPxPerSec / 1800, 0, 1);
      lastMove.current = { x, y, t: now };
      lastMoveAt.current = now;
    };

    const onLeave = () => {
      boostTarget.current = 0;
    };

    if (!isTouch) {
      container.addEventListener("mousemove", onMove);
      container.addEventListener("mouseleave", onLeave);
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    let frame = 0;
    let lastPaintAt = 0;
    const targetFrameMs = 45; // ~22fps cap to reduce CPU/GPU load
    let phase = 0;
    const tick = () => {
      const now = performance.now();
      if (now - lastPaintAt < targetFrameMs) {
        frame = requestAnimationFrame(tick);
        return;
      }
      lastPaintAt = now;

      if (document.visibilityState === "hidden") {
        frame = requestAnimationFrame(tick);
        return;
      }
      if (now - lastMoveAt.current > 90) boostTarget.current *= 0.86;

      boostCurrent.current += (boostTarget.current - boostCurrent.current) * 0.08;
      pointerCurrent.current.x += (pointerTarget.current.x - pointerCurrent.current.x) * 0.12;
      pointerCurrent.current.y += (pointerTarget.current.y - pointerCurrent.current.y) * 0.12;

      // Trail fade.
      // Higher alpha => less smear / sharper trails.
      ctx.fillStyle = "rgba(7, 8, 11, 0.30)";
      ctx.fillRect(0, 0, width, height);

      const boost = boostCurrent.current;
      const stepBase = fontSize * (0.95 + boost * 2.1);

      ctx.shadowColor = accentGlow;

      phase = (phase + 1) & 1;
      for (let col = phase; col < columns; col += 2) {
        const x = col * xStep;
        const y = drops[col];
        const ch = CHARS[(Math.random() * CHARS.length) | 0];

        const isHead = Math.random() > 0.962;
        const isSpark = Math.random() > 0.996;

        ctx.shadowBlur = isSpark ? 10 : isHead ? 6 : 0;
        if (isSpark) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
        } else {
          ctx.fillStyle = isHead ? accentHead : accentBody;
        }
        ctx.fillText(ch, x, y);

        // Extra glyph for density (subtle) — makes the rain feel fuller.
        if (Math.random() > 0.82) {
          const ch2 = CHARS[(Math.random() * CHARS.length) | 0];
          const y2 = y - fontSize * (1.2 + Math.random() * 1.6);
          ctx.shadowBlur = Math.max(3, ctx.shadowBlur - 2);
          ctx.fillStyle = accentBody;
          ctx.fillText(ch2, x, y2);
        }

        const speed = speeds[col] ?? 1;
        drops[col] = y + stepBase * speed;
        if (drops[col] > height + fontSize * 10 && Math.random() > 0.97) {
          drops[col] = -Math.random() * height * 0.6;
          speeds[col] = 0.9 + Math.random() * 1.6;
        }
      }

      // Interactive zoom based on cursor movement.
      const scale = 1 + boost * 0.06;
      const ox = clamp(pointerCurrent.current.x, 0, width);
      const oy = clamp(pointerCurrent.current.y, 0, height);
      const tx = (ox / width - 0.5) * 12 * boost;
      const ty = (oy / height - 0.5) * 12 * boost;

      canvas.style.transformOrigin = `${ox}px ${oy}px`;
      canvas.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      if (!isTouch) {
        container.removeEventListener("mousemove", onMove);
        container.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [accentBody, accentHead, containerRef, enabled]);

  return <canvas ref={canvasRef} aria-hidden className="matrix-layer absolute inset-0" />;
};
