"use client";

import { useEffect, useState } from "react";

const format = (zone: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: zone }).format(new Date());

/** Live local time for a timezone; renders a placeholder on the server to avoid hydration mismatch. */
export function LocalTime({ zone, suffix = "IST" }: { zone: string; suffix?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(format(zone));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, [zone]);

  return (
    <time suppressHydrationWarning className="tabular-nums">
      {time ?? "--:--"} {suffix}
    </time>
  );
}
