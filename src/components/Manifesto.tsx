"use client";

import { useRef } from "react";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";

/** Large statement whose words go from muted to ink as it scrolls through; `highlight` is underlined in signal. */
export function Manifesto({ text, highlight }: { text: string; highlight: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [before, after] = text.split(highlight);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.from("[data-w]", {
          opacity: 0.16,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  // Wrap each word in a span; whitespace stays as plain text so punctuation spacing is untouched.
  const render = (chunk: string) =>
    chunk.split(/(\s+)/).map((part, i) => (part.trim() ? <span key={i} data-w>{part}</span> : part));

  return (
    <p ref={ref} className="text-[clamp(1.9rem,4.6vw,4.75rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance">
      {render(before)}
      <span className="underline decoration-signal decoration-[0.09em] underline-offset-[0.12em]">
        {render(highlight)}
      </span>
      {render(after)}
    </p>
  );
}
