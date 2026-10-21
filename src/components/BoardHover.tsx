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
        let lastX = -1;
        let lastY = -1;
        let active = -1;

        const show = (row: number) => {
          if (row === active) return;
          active = row;
          frames.forEach((f, i) => gsap.to(f, { autoAlpha: i === row ? 1 : 0, duration: 0.25 }));
          gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out", overwrite: true });
        };
        const hide = () => {
          if (active === -1) return;
          active = -1;
          gsap.to(box, { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: "power3.in", overwrite: true });
        };
        // Only a real pointer movement shows the preview. Browsers fire synthetic hover/move events when content
        // scrolls under a still cursor (same coordinates) — those must never bring it back.
        const move = (e: PointerEvent) => {
          if (e.clientX === lastX && e.clientY === lastY) return;
          rot(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
          lastY = e.clientY;
          x(e.clientX);
          y(e.clientY);
          const row = (e.target as Element).closest<HTMLElement>("[data-row]");
          if (row) show(Number(row.dataset.row));
          else hide();
        };

        const el = root.current!;
        const io = new IntersectionObserver(([entry]) => { if (!entry?.isIntersecting) hide(); });
        io.observe(el);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", hide);
        window.addEventListener("scroll", hide, { passive: true });
        return () => {
          io.disconnect();
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", hide);
          window.removeEventListener("scroll", hide);
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
