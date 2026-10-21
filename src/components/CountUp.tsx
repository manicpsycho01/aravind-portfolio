"use client";

import { useRef } from "react";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";

/** Counts the first number in `value` up from zero when scrolled into view; the rest is kept as is. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const match = value.match(/\d+/);
      if (!match) return;
      const end = Number(match[0]);
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const el = ref.current!;
        const counter = { n: 0 };
        const render = () => (el.textContent = value.replace(match[0], String(Math.round(counter.n))));
        render();
        gsap.to(counter, {
          n: end,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: render,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        return () => (el.textContent = value);
      });
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} aria-label={value} className={`tabular-nums ${className ?? ""}`}>
      {value}
    </span>
  );
}
