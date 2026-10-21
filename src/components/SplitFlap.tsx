"use client";

import { useRef } from "react";
import { gsap, MOTION, REDUCED, useGSAP } from "@/lib/gsap";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&-";
const HOLD = 3.2;
const FLIP = 0.05;

const pad = (word: string, size: number) => word.toUpperCase().padEnd(size, " ").split("");

/**
 * Solari-style split-flap row. Cycles through `words`, flipping each cell through a few
 * glyphs before landing. Screen readers get the plain words via `label`; the cells are hidden.
 */
export function SplitFlap({ words, label, className }: { words: string[]; label?: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const size = Math.max(...words.map((w) => w.length));

  useGSAP(
    () => {
      if (words.length < 2) return;
      const cells = gsap.utils.toArray<HTMLElement>("[data-glyph]", root.current);
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION, reduced: REDUCED }, (ctx) => {
        const animate = Boolean(ctx.conditions?.motion);
        let index = 0;
        let visible = true;
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
        io.observe(root.current!);

        const flipTo = (cell: HTMLElement, target: string, delay: number) => {
          if (cell.textContent === target) return;
          if (!animate) {
            cell.textContent = target;
            return;
          }
          const steps = [...Array.from({ length: 3 }, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]), target];
          const tl = gsap.timeline({ delay });
          for (const glyph of steps) {
            tl.to(cell, { rotateX: -90, duration: FLIP, ease: "power1.in" })
              .call(() => {
                cell.textContent = glyph;
              })
              .set(cell, { rotateX: 90 })
              .to(cell, { rotateX: 0, duration: FLIP, ease: "power1.out" });
          }
        };

        const advance = () => {
          if (visible && !document.hidden) {
            index = (index + 1) % words.length;
            pad(words[index], size).forEach((glyph, i) => flipTo(cells[i], glyph, i * 0.035));
          }
          call = gsap.delayedCall(HOLD, advance);
        };
        let call = gsap.delayedCall(HOLD, advance);

        return () => {
          call.kill();
          io.disconnect();
          gsap.killTweensOf(cells);
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`[container-type:inline-size] ${className ?? ""}`}>
      {label && <span className="sr-only">{label}</span>}
      <div
        aria-hidden
        className="grid w-full gap-[3px] md:gap-1"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, fontSize: `${88 / size}cqw` }}
      >
        {pad(words[0], size).map((glyph, i) => (
          <span
            key={i}
            className="flap-cell relative flex aspect-[0.72] items-center justify-center overflow-hidden rounded-[3px] bg-ink font-mono font-medium text-paper shadow-[inset_0_-1px_0_rgb(255_255_255/0.06)]"
          >
            <span data-glyph className="block leading-none [backface-visibility:hidden]">
              {glyph}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
