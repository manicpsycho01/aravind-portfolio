"use client";

import { gsap, MOTION, useGSAP } from "@/lib/gsap";

const FROM = {
  up: { y: 48, opacity: 0, duration: 1.1 },
  clip: { clipPath: "inset(100% 0% 0% 0%)", duration: 1.3 },
  wipe: { clipPath: "inset(0% 100% 0% 0%)", duration: 1.4 },
} as const;

/**
 * Scroll reveals for every `[data-reveal="up|clip|wipe"]` on the page. Mount once per page,
 * after its content. Without motion nothing is hidden.
 */
export function Reveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      for (const el of gsap.utils.toArray<HTMLElement>("main [data-reveal]")) {
        const variant = (el.dataset.reveal as keyof typeof FROM) || "up";
        gsap.from(el, {
          ...FROM[variant],
          ease: "expo.out",
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      }
    });
  });
  return null;
}
