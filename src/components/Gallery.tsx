"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Shot } from "@/content/site";
import { DeviceFrame } from "./DeviceFrame";
import { lenisStore } from "./SmoothScroll";

const pad = (n: number) => String(n).padStart(2, "0");
/** How far a wide screenshot is magnified on phones (3.5 = under a third of its width is visible at once). */
const ZOOM = 3.5;

/**
 * The case-study gallery: one tinted panel at the top of the page holding every screenshot as a
 * snap-scrolling carousel (swipe, trackpad, arrow buttons, ←/→ when focused) with a counter and a
 * full-screen lightbox. Phone shots sit side by side; wide web shots get one slide each and, on
 * phones, a readable zoomed crop around `shot.focus` instead of a tiny full frame.
 */
export function Gallery({ shots, tint, title }: { shots: Shot[]; tint: string; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const slides = [...el.querySelectorAll<HTMLElement>("[data-slide]")];
      const start = slides[0]?.offsetLeft ?? 0;
      let i = 0;
      slides.forEach((s, n) => { if (s.offsetLeft - start <= el.scrollLeft + 8) i = n; });
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      setCurrent(end ? slides.length - 1 : i);
      setAtEnd(end);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const go = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const slides = [...el.querySelectorAll<HTMLElement>("[data-slide]")];
    const target = slides[Math.min(Math.max(current + dir, 0), slides.length - 1)];
    if (target) el.scrollTo({ left: target.offsetLeft - slides[0]!.offsetLeft, behavior: "smooth" });
  }, [current]);

  return (
    <div
      className="overflow-hidden rounded-xl py-5 text-paper md:py-8"
      style={{ background: `linear-gradient(160deg, ${tint} 0%, color-mix(in srgb, ${tint} 70%, black) 100%)` }}
    >
      <div className="flex items-center justify-between gap-4 px-4 md:px-8">
        <p className="label min-w-0 truncate text-paper/70" aria-live="polite">
          <span className="text-paper">{pad(current + 1)}</span> / {pad(shots.length)}
          <span className="hidden md:inline"> · {shots[current]?.alt}</span>
        </p>
        <div className="flex shrink-0 gap-2">
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
        className="no-scrollbar mt-5 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto scroll-px-4 px-4 outline-none md:mt-8 md:scroll-px-8 md:gap-8 md:px-8"
      >
        {shots.map((shot, i) => {
          const phone = shot.device === "phone";
          return (
            <figure
              key={shot.src}
              data-slide={i}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${shots.length}: ${shot.alt}`}
              className={`shrink-0 snap-start ${phone ? "w-[min(64vw,260px)]" : "w-[86%] md:w-[min(78%,1100px)]"}`}
            >
              <button
                type="button"
                data-cursor="OPEN"
                onClick={() => setOpen(i)}
                aria-label={`Open screenshot: ${shot.alt}`}
                className="group relative block w-full cursor-zoom-in text-left"
              >
                {phone || !shot.focus ? (
                  <DeviceFrame shot={shot} sizes={phone ? "260px" : "(min-width: 768px) 78vw, 86vw"} priority={i === 0} />
                ) : (
                  <>
                    <DeviceFrame shot={shot} sizes="(min-width: 768px) 78vw, 86vw" priority={i === 0} className="hidden md:block" />
                    <Crop shot={shot} />
                  </>
                )}
              </button>
              <figcaption className="label mt-3 text-paper/70">{shot.alt}</figcaption>
            </figure>
          );
        })}
      </div>

      {open !== null && <Lightbox shots={shots} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

/** Phone view of a wide screenshot: its full height, magnified and cropped sideways around its focus point. */
function Crop({ shot }: { shot: Shot }) {
  const fx = shot.focus?.[0] ?? 50;
  const left = Math.min(0, Math.max(1 - ZOOM, 0.5 - (fx / 100) * ZOOM));
  return (
    <div className="overflow-hidden rounded-lg bg-graphite p-1 shadow-2xl shadow-ink/25 md:hidden">
      <div className="relative overflow-hidden rounded-md">
        <Image
          src={shot.src}
          alt=""
          width={shot.w}
          height={shot.h}
          sizes="260vw"
          className="block h-auto max-w-none"
          style={{ width: `${ZOOM * 100}%`, marginLeft: `${left * 100}%` }}
        />
        <span className="label absolute right-2 bottom-2 rounded-full bg-ink/80 px-2.5 py-1.5 text-paper backdrop-blur-sm">Tap to explore ↗</span>
      </div>
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
      className="grid size-11 place-items-center rounded-full border border-paper/30 transition-colors hover:border-paper hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-30"
    >
      <span aria-hidden>{dir === "prev" ? "←" : "→"}</span>
    </button>
  );
}

/**
 * Full-screen viewer: ←/→ to browse, Esc or the backdrop to close; page scroll is paused while open.
 * On portrait screens a wide screenshot fills the height and pans sideways, so its text is readable.
 */
function Lightbox({ shots, index, onIndex, onClose }: { shots: Shot[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const pan = useRef<HTMLDivElement>(null);
  const shot = shots[index]!;
  const [portrait, setPortrait] = useState(false);
  const panning = portrait && shot.w > shot.h;
  const prev = () => onIndex((index - 1 + shots.length) % shots.length);
  const next = () => onIndex((index + 1) % shots.length);

  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 1/1)");
    const sync = () => setPortrait(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const opener = document.activeElement as HTMLElement | null;
    lenisStore.current?.stop();
    document.documentElement.style.overflow = "hidden";
    close.current?.focus();
    return () => {
      mq.removeEventListener("change", sync);
      lenisStore.current?.start();
      document.documentElement.style.overflow = "";
      opener?.focus();
    };
  }, []);

  // Start a panned screenshot at its focus point.
  useEffect(() => {
    const el = pan.current;
    if (!el || !panning) return;
    const img = el.querySelector("img");
    const place = () => { el.scrollLeft = ((shot.focus?.[0] ?? 0) / 100) * el.scrollWidth - el.clientWidth / 2; };
    place();
    img?.addEventListener("load", place, { once: true });
  }, [panning, shot]);

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
      <div className="gutter flex items-center justify-between gap-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <p className="label min-w-0 text-paper/70">
          {pad(index + 1)} / {pad(shots.length)} · {shot.alt}
        </p>
        <button ref={close} type="button" onClick={onClose} aria-label="Close" className="label min-h-11 shrink-0 rounded-full border border-paper/30 px-4 hover:bg-paper hover:text-ink">
          Close<span className="hidden md:inline"> · Esc</span>
        </button>
      </div>

      {panning ? (
        <div ref={pan} className="no-scrollbar min-h-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain">
          <Image key={shot.src} src={shot.src} alt={shot.alt} width={shot.w} height={shot.h} sizes="300vw" priority className="h-full w-auto max-w-none" />
        </div>
      ) : (
        <div className="relative min-h-0 flex-1" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <Image key={shot.src} src={shot.src} alt={shot.alt} fill sizes="100vw" priority className="object-contain px-4 pb-4 md:px-20 md:pb-6" />
        </div>
      )}

      <div className="gutter flex items-center justify-between gap-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="label text-paper/50">{panning ? "Drag sideways to read ↔" : ""}</p>
        {shots.length > 1 && (
          <div className="flex gap-2">
            <button type="button" aria-label="Previous screenshot" onClick={prev} className="grid size-12 place-items-center rounded-full bg-paper/10 hover:bg-paper hover:text-ink">
              ←
            </button>
            <button type="button" aria-label="Next screenshot" onClick={next} className="grid size-12 place-items-center rounded-full bg-paper/10 hover:bg-paper hover:text-ink">
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
