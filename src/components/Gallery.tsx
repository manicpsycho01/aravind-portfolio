"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Shot } from "@/content/site";
import { DeviceFrame } from "./DeviceFrame";
import { lenisStore } from "./SmoothScroll";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Screenshot carousel: native horizontal scroll with snap (swipe, trackpad, arrows, ←/→ when focused),
 * a counter, and a full-screen lightbox on click. Phone shots sit side by side on the page;
 * browser shots get one slide each on the project tint with the caption inside the frame.
 */
export function Gallery({ shots, tint, title }: { shots: Shot[]; tint: string; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const phones = shots.every((s) => s.device === "phone");

  // Which slide is most in view → counter + disabled states.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const slides = [...el.querySelectorAll<HTMLElement>("[data-slide]")];
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setCurrent(Number((best.target as HTMLElement).dataset.slide));
      },
      { root: el, threshold: [0.55, 0.8, 1] },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-slide]");
    const step = slide ? slide.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const last = shots.length - 1;
  const atEnd = phones ? (track.current ? track.current.scrollLeft + track.current.clientWidth >= track.current.scrollWidth - 4 : false) : current >= last;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="label text-muted" aria-live="polite">
          <span className="text-ink">{pad(current + 1)}</span> / {pad(shots.length)}
        </p>
        <div className="flex gap-2">
          <ArrowButton label="Previous screenshot" onClick={() => go(-1)} disabled={current === 0} dir="prev" />
          <ArrowButton label="Next screenshot" onClick={() => go(1)} disabled={atEnd} dir="next" />
        </div>
      </div>

      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} screenshots`}
        tabIndex={0}
        data-lenis-prevent-wheel-horizontal
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        }}
        className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[var(--gutter)] pb-2 outline-none md:gap-8"
        style={{ scrollPaddingInline: "var(--gutter)" }}
      >
        {shots.map((shot, i) => (
          <figure
            key={shot.src}
            data-slide={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${shots.length}: ${shot.alt}`}
            className={`relative shrink-0 snap-start ${phones ? "w-[min(68vw,280px)]" : "w-[min(86vw,1080px)]"}`}
          >
            <button
              type="button"
              data-cursor="OPEN"
              onClick={() => setOpen(i)}
              aria-label={`Open screenshot: ${shot.alt}`}
              className={`group block w-full cursor-zoom-in text-left ${
                phones ? "" : "overflow-hidden rounded-xl px-3 pt-12 pb-3 md:px-14 md:pt-20 md:pb-12"
              }`}
              style={phones ? undefined : { background: `linear-gradient(160deg, ${tint} 0%, color-mix(in srgb, ${tint} 72%, black) 100%)` }}
            >
              {!phones && (
                <figcaption className="label absolute top-4 left-4 right-4 flex justify-between gap-4 text-paper/80 md:top-7 md:left-8 md:right-8">
                  <span>{shot.alt}</span>
                  <span className="shrink-0">{pad(i + 1)}</span>
                </figcaption>
              )}
              <DeviceFrame shot={shot} sizes={phones ? "280px" : "(min-width: 768px) 75vw, 86vw"} />
            </button>
            {phones && <figcaption className="label mt-4 text-muted">{shot.alt}</figcaption>}
          </figure>
        ))}
      </div>

      {open !== null && <Lightbox shots={shots} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function ArrowButton({ label, onClick, disabled, dir }: { label: string; onClick: () => void; disabled: boolean; dir: "prev" | "next" }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-11 place-items-center rounded-full border border-ink/25 transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
    >
      <span aria-hidden>{dir === "prev" ? "←" : "→"}</span>
    </button>
  );
}

/** Full-screen viewer: ←/→ to browse, Esc or the backdrop to close; page scroll is paused while open. */
function Lightbox({ shots, index, onIndex, onClose }: { shots: Shot[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const shot = shots[index]!;
  const prev = () => onIndex((index - 1 + shots.length) % shots.length);
  const next = () => onIndex((index + 1) % shots.length);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    lenisStore.current?.stop();
    document.documentElement.style.overflow = "hidden";
    close.current?.focus();
    return () => {
      lenisStore.current?.start();
      document.documentElement.style.overflow = "";
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
      data-lenis-prevent
      className="fixed inset-0 z-[90] flex flex-col bg-ink/95 text-paper backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="gutter flex items-center justify-between gap-4 py-4">
        <p className="label text-paper/70">
          {pad(index + 1)} / {pad(shots.length)} · {shot.alt}
        </p>
        <button ref={close} type="button" onClick={onClose} aria-label="Close" className="label min-h-11 rounded-full border border-paper/30 px-4 hover:bg-paper hover:text-ink">
          Close · Esc
        </button>
      </div>
      <div className="relative min-h-0 flex-1" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <Image
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="100vw"
          className="object-contain px-4 pb-6 md:px-20"
          priority
        />
        {shots.length > 1 && (
          <>
            <button type="button" aria-label="Previous screenshot" onClick={prev} className="absolute top-1/2 left-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 hover:bg-paper hover:text-ink md:left-6">
              ←
            </button>
            <button type="button" aria-label="Next screenshot" onClick={next} className="absolute top-1/2 right-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 hover:bg-paper hover:text-ink md:right-6">
              →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
