"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Case-study keyboard shortcuts: ← / → previous / next project, Esc back to the departures board. */
export function CaseKeys({ prev, next }: { prev: string; next: string }) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      // Leave keys alone in fields, carousels, and while a dialog is open.
      if (t?.closest("input, textarea, select, [contenteditable], [role=region], [role=dialog]")) return;
      if (document.querySelector("[role=dialog][aria-modal=true]")) return;
      if (e.key === "ArrowRight") router.push(next);
      else if (e.key === "ArrowLeft") router.push(prev);
      else if (e.key === "Escape") router.push("/#work");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev, next]);

  return (
    <p aria-hidden className="label pointer-events-none fixed bottom-6 left-6 z-40 hidden rounded-full bg-ink/85 px-3 py-2 text-paper/80 backdrop-blur-sm desk:block">
      ← → flights · Esc board
    </p>
  );
}
