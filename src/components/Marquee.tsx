"use client";

import { useRef } from "react";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Endless row whose speed (and direction) follows scroll velocity, ScrollVelocity-style.
 * With reduced motion the items simply wrap and stay put.
 */
export function Marquee({
  items,
  direction = 1,
  speed = 0.02,
  className,
  itemClassName,
  separator = "/",
}: {
  items: string[];
  direction?: 1 | -1;
  /** Base speed in percent of one copy per frame. */
  speed?: number;
  className?: string;
  itemClassName?: string;
  separator?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const track = ref.current!.querySelector<HTMLElement>("[data-track]")!;
        const wrap = gsap.utils.wrap(-50, 0);
        const setX = gsap.quickSetter(track, "xPercent");
        let x = direction > 0 ? -50 : 0;
        let velocity = 0;
        let heading = 1;
        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            velocity = self.getVelocity();
            heading = self.direction;
          },
        });
        const tick = (_: number, dt: number) => {
          velocity *= 0.92;
          const boost = 1 + Math.min(Math.abs(velocity) / 300, 8);
          x = wrap(x + speed * boost * direction * heading * (dt / 16.67));
          setX(x);
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
        };
      });
    },
    { scope: ref },
  );

  const copy = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className={`flex shrink-0 items-center ${hidden ? "motion-reduce:hidden" : "motion-reduce:flex-wrap"}`}>
      {items.map((item) => (
        <li key={item} className={`flex items-center whitespace-nowrap ${itemClassName ?? ""}`}>
          {item}
          <span aria-hidden className="px-[0.4em] opacity-30">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <div data-track className="flex w-max motion-reduce:w-full will-change-transform">
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}
