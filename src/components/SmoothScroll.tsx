"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Single root Lenis instance driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: true, syncTouch: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
    const { hash } = window.location;
    const anchor = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    lenisRef.current?.scrollTo(anchor ?? 0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
