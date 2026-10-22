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
        const bar = gsap.fromTo("[data-bar]", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.inOut", paused: true });
        whenRevealReady().then(() => {
          ready = true;
          tween?.play();
          bar.delay(0.55).play();
        });
        return () => {
          split.revert();
          bar.kill();
        };
      });
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} aria-label={lines.join(" ")} className={className}>
      {lines.map((line, i) => (
        <span key={line} className="relative isolate block w-fit">
          {/* The hero's one signal moment: a departure-row highlight behind the first name. */}
          {i === 0 && <span data-bar aria-hidden className="absolute -inset-x-[0.03em] top-[-0.01em] bottom-[0.06em] -z-10 origin-left bg-signal" />}
          <span data-line aria-hidden className="block">
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
