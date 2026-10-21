"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const MOTION = "(prefers-reduced-motion: no-preference)";
export const REDUCED = "(prefers-reduced-motion: reduce)";
/** Desktop with a precise pointer, motion allowed. Mirrors the `fx` CSS variant. */
export const FX = `(hover: hover) and (pointer: fine) and (min-width: 1024px) and ${MOTION}`;

export const PRELOADER_DONE = "preloader:done";

/** Resolves once fonts are ready and the first-visit preloader (if any) has left. */
export function whenRevealReady(): Promise<void> {
  const preloader = document.documentElement.hasAttribute("data-preload")
    ? new Promise<void>((resolve) => window.addEventListener(PRELOADER_DONE, () => resolve(), { once: true }))
    : Promise.resolve();
  return Promise.all([document.fonts.ready, preloader]).then(() => undefined);
}
