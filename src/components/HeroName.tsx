"use client";

import { useRef } from "react";
import { gsap, MOTION, SplitText, useGSAP, whenRevealReady } from "@/lib/gsap";

/**
 * Giant display heading revealed with masked, staggered characters once the preloader
 * (if any) has left. Each entry in `lines` is its own block. Fully visible without motion.
 */
export function HeroName({ lines, className }: { lines: string[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        let tween: gsap.core.Tween | undefined;
        let ready = false;
        const split = SplitText.create(gsap.utils.toArray<HTMLElement>("[data-line]", ref.current), {
          type: "chars",
          mask: "chars",
          autoSplit: true,
          aria: "none",
          onSplit: (self) => {
            tween = gsap.from(self.chars, {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.035,
              paused: !ready,
            });
            return tween;
          },
        });
        whenRevealReady().then(() => {
          ready = true;
          tween?.play();
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} aria-label={lines.join(" ")} className={className}>
      {lines.map((line) => (
        <span key={line} data-line aria-hidden className="block">
          {line}
        </span>
      ))}
    </h1>
  );
}
