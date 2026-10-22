"use client";

import { useRef, useState } from "react";
import { FX, gsap, useGSAP } from "@/lib/gsap";

const INTERACTIVE = "a, button, [data-cursor]";

/**
 * Ink dot + ring that grows into a signal disc with a label (from `data-cursor`) over targets.
 * Desktop with a fine pointer only; the native cursor stays everywhere else.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FX, () => {
        const html = document.documentElement;
        const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 });
        const dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
        const rx = gsap.quickTo([ring.current, disc.current], "x", { duration: 0.45, ease: "power3.out" });
        const ry = gsap.quickTo([ring.current, disc.current], "y", { duration: 0.45, ease: "power3.out" });
        let shown = false;
        gsap.set([dot.current, ring.current, disc.current], { xPercent: -50, yPercent: -50 });

        const move = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          if (!shown) {
            shown = true;
            gsap.set([dot.current, ring.current, disc.current], { x: e.clientX, y: e.clientY });
            gsap.to(root.current, { autoAlpha: 1, duration: 0.2 });
          }
          dx(e.clientX);
          dy(e.clientY);
          rx(e.clientX);
          ry(e.clientY);
        };
        const over = (e: PointerEvent) => {
          const target = (e.target as Element).closest<HTMLElement>(INTERACTIVE);
          setHovering(!!target);
          setLabel(target?.dataset.cursor ?? null);
        };
        const leave = () => {
          shown = false;
          gsap.to(root.current, { autoAlpha: 0, duration: 0.2 });
        };

        html.classList.add("has-cursor");
        window.addEventListener("pointermove", move, { passive: true });
        document.addEventListener("pointerover", over, { passive: true });
        document.documentElement.addEventListener("pointerleave", leave);
        return () => {
          html.classList.remove("has-cursor");
          window.removeEventListener("pointermove", move);
          document.removeEventListener("pointerover", over);
          document.documentElement.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  const active = label !== null;
  // The ring and dot sit in a `mix-blend-difference` layer so they invert against whatever is underneath
  // (dark on light paper, light on ink) and never disappear. The labelled disc lives in a normal layer
  // so the signal orange stays true.
  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden opacity-0 fx:block">
      <div className="absolute inset-0 mix-blend-difference">
        <div
          ref={ring}
          className={`absolute top-0 left-0 rounded-full border-[1.5px] border-white transition-[width,height,opacity] duration-300 ease-out-expo ${
            active ? "h-10 w-10 opacity-0" : hovering ? "h-14 w-14" : "h-10 w-10"
          }`}
        />
        <div ref={dot} className={`absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-white ${active ? "opacity-0" : ""}`} />
      </div>
      <div
        ref={disc}
        className={`absolute top-0 left-0 flex items-center justify-center rounded-full bg-signal transition-[width,height,opacity] duration-300 ease-out-expo ${
          active ? "h-22 w-22 opacity-100" : "h-10 w-10 opacity-0"
        }`}
      >
        {active && <span className="label font-medium text-ink">{label}</span>}
      </div>
    </div>
  );
}
