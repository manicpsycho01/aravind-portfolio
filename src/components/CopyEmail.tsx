"use client";

import { useState } from "react";

/** Copies the address to the clipboard; falls back to opening the mail app if copying is unavailable. */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button type="button" onClick={copy} data-cursor="COPY" className={className}>
      <span className="break-all">{email}</span>
      <span className="label shrink-0 opacity-60" aria-live="polite">
        {copied ? "Copied ✓" : "Copy"}
      </span>
    </button>
  );
}
