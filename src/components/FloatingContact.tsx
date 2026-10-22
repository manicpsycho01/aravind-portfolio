"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Always-reachable contact pill. The header scrolls away (and has no nav on phones), so this
 * appears once the hero is passed and steps aside while the contact band or footer is on screen.
 */
export function FloatingContact() {
  const pathname = usePathname();
  const [past, setPast] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const targets = [...document.querySelectorAll("#contact, footer")];
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? seen.add(e.target) : seen.delete(e.target);
      setCovered(seen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [pathname]);

  const shown = past && !covered;
  return (
    <Link
      href="/#contact"
      data-cursor="TALK"
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
      className={`group label fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex min-h-12 items-center gap-2.5 rounded-full bg-ink py-2 pr-5 pl-4 text-paper shadow-xl shadow-ink/20 ring-1 ring-paper/20 transition-[translate,opacity,background-color] duration-500 ease-out-expo hover:bg-signal hover:text-ink md:right-6 md:bottom-6 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="pulse-dot size-2 shrink-0 rounded-full bg-signal transition-colors group-hover:bg-ink" aria-hidden />
      Let&apos;s talk
    </Link>
  );
}
