"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/content/site";
import { FX, gsap, useGSAP } from "@/lib/gsap";

/** Big link to the next case study. On desktop the cover preview follows the pointer inside the link, so it never sits on top of fixed text. */
export function NextFlight({ project }: { project: Project }) {
  const root = useRef<HTMLAnchorElement>(null);
  const preview = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FX, () => {
        const el = root.current!;
        const pv = preview.current!;
        const x = gsap.quickTo(pv, "x", { duration: 0.6, ease: "power3" });
        const y = gsap.quickTo(pv, "y", { duration: 0.6, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const w = pv.offsetWidth;
          const h = pv.offsetHeight;
          // Sit to the right of the pointer, flip left near the edge, stay inside the link.
          let px = e.clientX - r.left + 32;
          if (px + w > r.width - 16) px = e.clientX - r.left - w - 32;
          const py = Math.min(Math.max(e.clientY - r.top - h / 2, 16), r.height - h - 16);
          x(Math.max(16, px));
          y(py);
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <Link
      ref={root}
      href={`/work/${project.slug}`}
      data-cursor="VIEW"
      className="group gutter relative block overflow-hidden border-t border-line py-16 md:py-24"
    >
      <span className="label flex flex-col gap-1 text-muted">
        <span>Next flight · Flt {project.no}</span>
        <span className="max-w-xl">{project.kicker}</span>
      </span>
      <span className="display mt-8 block text-[clamp(3rem,12vw,8.5rem)] transition-transform duration-700 ease-out-expo group-hover:translate-x-4">
        {project.title}&nbsp;<span aria-hidden>→</span>
      </span>
      <span
        ref={preview}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-10 hidden w-[22vw] max-w-[22rem] overflow-hidden rounded-lg bg-graphite shadow-2xl shadow-ink/30 [clip-path:inset(50%_0_50%_0)] transition-[clip-path] duration-500 ease-out-expo group-hover:[clip-path:inset(0_0_0_0)] desk:block"
      >
        <Image
          src={project.cover.src}
          alt=""
          width={project.cover.w}
          height={project.cover.h}
          sizes="22vw"
          className={`h-auto w-full ${project.cover.device === "none" ? "p-6" : ""} ${project.cover.device === "phone" ? "max-h-[60vh] object-cover object-top" : ""}`}
        />
      </span>
    </Link>
  );
}
