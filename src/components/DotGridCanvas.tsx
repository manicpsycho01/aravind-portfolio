"use client";

import { useEffect, useRef } from "react";

const INK: [number, number, number] = [13, 13, 12];
const SIGNAL: [number, number, number] = [255, 79, 0];
const RADIUS = 150; // pointer influence, px
const RIPPLE_SPEED = 0.55; // px per ms
const RIPPLE_LIFE = 1400; // ms

type Ripple = { x: number; y: number; t: number };

/**
 * Hero dot grid. Dots near the pointer grow and turn signal; taps send a ripple.
 * Only redraws while something is changing, pauses off-screen, static with reduced motion.
 */
export function DotGridCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let gap = 26;
    let dots: { x: number; y: number }[] = [];
    const target = { x: -9999, y: -9999 };
    const pointer = { x: -9999, y: -9999 };
    const ripples: Ripple[] = [];
    let visible = true;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 768 ? 22 : 28;
      dots = [];
      const ox = ((w % gap) + gap) / 2;
      const oy = ((h % gap) + gap) / 2;
      for (let y = oy; y < h; y += gap) for (let x = ox; x < w; x += gap) dots.push({ x, y });
      draw(performance.now());
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t > RIPPLE_LIFE) ripples.splice(i, 1);

      ctx.fillStyle = `rgba(${INK.join(",")},0.16)`;
      ctx.beginPath();
      const hot: { x: number; y: number; k: number }[] = [];
      for (const d of dots) {
        let k = 0;
        const pd = Math.hypot(d.x - pointer.x, d.y - pointer.y);
        if (pd < RADIUS) k = (1 - pd / RADIUS) ** 2;
        for (const r of ripples) {
          const age = now - r.t;
          const ring = Math.abs(Math.hypot(d.x - r.x, d.y - r.y) - age * RIPPLE_SPEED);
          if (ring < 36) k = Math.max(k, (1 - ring / 36) * (1 - age / RIPPLE_LIFE));
        }
        if (k > 0.02) hot.push({ x: d.x, y: d.y, k });
        else {
          ctx.moveTo(d.x + 1, d.y);
          ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      for (const { x, y, k } of hot) {
        const c = INK.map((v, i) => Math.round(v + (SIGNAL[i] - v) * Math.min(1, k * 1.6)));
        ctx.fillStyle = `rgba(${c.join(",")},${0.16 + 0.84 * Math.min(1, k * 1.4)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1 + 3.2 * k, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      raf = 0;
      pointer.x += (target.x - pointer.x) * 0.18;
      pointer.y += (target.y - pointer.y) * 0.18;
      draw(now);
      const settling = Math.abs(target.x - pointer.x) + Math.abs(target.y - pointer.y) > 0.5;
      if (visible && (settling || ripples.length)) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf && visible && !reduced) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      if (pointer.x < -999) Object.assign(pointer, target);
      wake();
    };
    const onLeave = () => {
      target.x = target.y = pointer.x = pointer.y = -9999;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
      wake();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(canvas);

    const host = canvas.parentElement!;
    if (!reduced) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
