"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import type { Shot } from "@/content/site";
import { FX, gsap, useGSAP } from "@/lib/gsap";

/**
 * Wraps the departures rows; on desktop a preview of the hovered row's cover
 * (rows carry `data-row={index}`) follows the pointer with a little lag.
 */
export function BoardHover({ covers, children }: { covers: Shot[]; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FX, () => {
        const box = preview.current!;
        const frames = gsap.utils.toArray<HTMLElement>("[data-frame]", box);
        const x = gsap.quickTo(box, "x", { duration: 0.7, ease: "power3.out" });
        const y = gsap.quickTo(box, "y", { duration: 0.7, ease: "power3.out" });
        const rot = gsap.quickTo(box, "rotate", { duration: 0.9, ease: "power3.out" });
        gsap.set(box, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
        let lastX = 0;
        let lastY = 0;
        let shown = false;

        const move = (e: PointerEvent) => {
          x(e.clientX);
          y(e.clientY);
          rot(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
          lastY = e.clientY;
        };
        const enter = (e: PointerEvent) => {
          const row = (e.target as Element).closest<HTMLElement>("[data-row]");
          if (!row) return;
          const active = Number(row.dataset.row);
          frames.forEach((f, i) => gsap.to(f, { autoAlpha: i === active ? 1 : 0, duration: 0.25 }));
          gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" });
          shown = true;
        };
        const leave = () => {
          if (!shown) return;
          shown = false;
          gsap.to(box, { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: "power3.in" });
        };

        const el = root.current!;
        // Scrolling moves the board out from under a still pointer without any pointer event: hide the preview then.
        const scrolled = () => {
          if (!shown) return;
          const under = document.elementFromPoint(lastX, lastY);
          if (!under || !el.contains(under) || !under.closest("[data-row]")) leave();
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerover", enter);
        el.addEventListener("pointerleave", leave);
        window.addEventListener("scroll", scrolled, { passive: true });
        return () => {
          window.removeEventListener("scroll", scrolled);
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerover", enter);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {children}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden aspect-[16/10] w-[min(30vw,440px)] overflow-hidden rounded-md bg-graphite fx:block"
      >
        {covers.map((c) => (
          <div key={c.src} data-frame className="invisible absolute inset-0 opacity-0">
            <Image src={c.src} alt="" fill sizes="440px" className={c.device === "none" ? "object-contain p-6" : "object-cover object-top"} />
          </div>
        ))}
      </div>
    </div>
  );
}
