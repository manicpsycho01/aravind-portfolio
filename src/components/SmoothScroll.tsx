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
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, syncTouch: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Same-page hash links ("/#work" while on "/", "#main"): Lenis owns the scroll. Letting the router's native
    // hash jump race Lenis's smoothed scroll intermittently left the page at the top.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest("a");
      if (!link || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      if (!url.hash || url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(target, { force: true });
      if (window.location.hash !== url.hash) window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
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
