// GhostInTheHash | "EVERY TRACE TELLS A STORY." — Harsh Pardeshi
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type CursorGlowProps = {
  containerRef: RefObject<HTMLElement>;
  color: string;
  enabled: boolean;
};

export const CursorGlow = ({ containerRef, color, enabled }: CursorGlowProps) => {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: -200, y: -200 });
  const current = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!enabled || isTouch) return;

    const container = containerRef.current;
    if (!container || !glowRef.current) return;

    const onMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      target.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const onLeave = () => {
      target.current = { x: -200, y: -200 };
    };

    let frame = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.15;
      current.current.y += (target.current.y - current.current.y) * 0.15;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef, enabled]);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-[2] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-2xl"
      style={{ background: color }}
    />
  );
};
