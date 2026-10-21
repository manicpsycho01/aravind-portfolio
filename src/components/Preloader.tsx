"use client";

import { useRef } from "react";
import { gsap, PRELOADER_DONE, useGSAP } from "@/lib/gsap";
import { PRELOAD_KEY } from "@/lib/preload";

/** First-visit only: flap-style 000→100 counter, then the curtain lifts (≈1.4 s total). */
export function Preloader({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.hasAttribute("data-preload")) return;
      const digits = gsap.utils.toArray<HTMLElement>("[data-digit]", ref.current);
      const counter = { n: 0 };
      gsap
        .timeline({
          onComplete: () => {
            html.removeAttribute("data-preload");
            try {
              sessionStorage.setItem(PRELOAD_KEY, "1");
            } catch {}
          },
        })
        .to(counter, {
          n: 100,
          duration: 0.85,
          ease: "power2.inOut",
          onUpdate: () => {
            const text = String(Math.round(counter.n)).padStart(3, "0");
            digits.forEach((d, i) => (d.textContent = text[i]));
          },
        })
        .call(() => window.dispatchEvent(new Event(PRELOADER_DONE)), [], "+=0.05")
        .to(ref.current, { yPercent: -100, duration: 0.5, ease: "expo.inOut" }, "<");
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="preloader gutter fixed inset-0 z-[95] flex-col justify-between bg-ink py-6 text-paper">
      <div className="label flex justify-between text-paper-muted">
        <span>Departures</span>
        <span>Now boarding</span>
      </div>
      <div className="flex gap-1.5 md:gap-2">
        {["0", "0", "0"].map((d, i) => (
          <span
            key={i}
            className="flap-cell relative flex aspect-[0.72] w-[22vw] max-w-40 items-center justify-center rounded-md bg-graphite font-mono text-[16vw] leading-none font-medium md:text-[7.5rem]"
          >
            <span data-digit>{d}</span>
          </span>
        ))}
      </div>
      <div className="label flex justify-between">
        <span>{name}</span>
        <span className="text-signal">●</span>
      </div>
    </div>
  );
}
