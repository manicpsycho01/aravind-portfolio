import { ImageResponse } from "next/og";
import { person, projects } from "@/content/site";

export const alt = `${person.name} — ${person.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0d0d0c";
const PAPER = "#efede7";
const SIGNAL = "#ff4f00";

/** Departures-board share card. */
export default function OpengraphImage() {
  const cells = "NOW BOARDING".split("");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: INK, color: PAPER, padding: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 3, opacity: 0.6 }}>
          <span>DEPARTURES</span>
          <span>{person.location.toUpperCase()} · {projects.length} FLIGHTS</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {cells.map((c, i) => (
            <div
              key={i}
              style={{ width: 62, height: 86, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a18", borderRadius: 6, fontSize: 52, fontWeight: 700 }}
            >
              {c}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4 }}>{person.name.toUpperCase()}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28, fontSize: 30 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: SIGNAL }} />
            <span>{person.role}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
