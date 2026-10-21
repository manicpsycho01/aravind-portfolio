/** Flight-board status; "Live" statuses blink in signal. */
export function StatusChip({ status }: { status: string }) {
  const live = status.toLowerCase().startsWith("live");
  return (
    <span
      className={`label inline-flex items-center gap-2 rounded-full px-3 py-1.5 whitespace-nowrap ${
        live ? "bg-signal text-ink" : "border border-current/25"
      }`}
    >
      {live && <span className="blink size-1.5 rounded-full bg-ink" aria-hidden />}
      {status}
    </span>
  );
}
