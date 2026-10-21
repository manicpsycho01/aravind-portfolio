"use client";

import { useRef, type ReactNode } from "react";
import { FX, gsap, useGSAP } from "@/lib/gsap";

/**
 * Desktop: pins the section and scrolls its panels horizontally, with parallax on
 * `[data-parallax]` (value = drift in percent) driven through `containerAnimation`.
 * Elsewhere the panels simply stack (layout handled by the `fx:` CSS variant).
 */
export function GatesTrack({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FX, () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 1,
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        for (const el of gsap.utils.toArray<HTMLElement>("[data-parallax]", track)) {
          const drift = Number(el.dataset.parallax);
          gsap.fromTo(
            el,
            { xPercent: drift },
            {
              xPercent: -drift,
              ease: "none",
              scrollTrigger: { trigger: el.closest("[data-panel]"), containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            },
          );
        }
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
