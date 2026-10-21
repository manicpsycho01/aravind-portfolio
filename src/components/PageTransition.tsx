"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { gsap, REDUCED, useGSAP } from "@/lib/gsap";

const HIDDEN_LEFT = "inset(0% 100% 0% 0%)";
const FULL = "inset(0% 0% 0% 0%)";
const HIDDEN_RIGHT = "inset(0% 0% 0% 100%)";

/** Signal panel wipes across between internal routes (~550 ms). Skipped with reduced motion. */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const covering = useRef(false);

  useGSAP(
    (_, contextSafe) => {
      const reduced = window.matchMedia(REDUCED);
      const onClick = contextSafe!((e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduced.matches) return;
        const link = (e.target as Element).closest("a");
        if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
        e.preventDefault();
        covering.current = true;
        gsap.fromTo(
          panel.current,
          { clipPath: HIDDEN_LEFT, visibility: "visible" },
          { clipPath: FULL, duration: 0.28, ease: "power3.in", onComplete: () => router.push(url.pathname + url.search + url.hash) },
        );
      });
      document.addEventListener("click", onClick, true);
      return () => document.removeEventListener("click", onClick, true);
    },
    { dependencies: [router] },
  );

  useGSAP(
    () => {
      if (!covering.current) return;
      covering.current = false;
      gsap.to(panel.current, {
        clipPath: HIDDEN_RIGHT,
        duration: 0.3,
        delay: 0.05,
        ease: "power3.out",
        onComplete: () => void gsap.set(panel.current, { visibility: "hidden" }),
      });
    },
    { dependencies: [pathname] },
  );

  return (
    <div
      ref={panel}
      aria-hidden
      className="on-signal invisible fixed inset-0 z-[90] flex items-end bg-signal p-6 text-ink"
      style={{ clipPath: HIDDEN_LEFT }}
    >
      <span className="label">Now boarding →</span>
    </div>
  );
}
