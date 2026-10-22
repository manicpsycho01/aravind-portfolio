# Portfolio — creative brief: "DEPARTURES"

Owner: Aravind Srinivasan, product engineer. All copy and facts come from `src/content/site.ts`. Never invent anything.

## Concept
The portfolio is an airport departures board. Projects are "flights", the hero announces "Now boarding", and every label reads like flight-board type. The concept ties together the owner's airline-crew hackathon and a builder who keeps shipping. It should feel like an award-winning studio site, close to the references: editorial Swiss layout, a monochrome base with one loud accent, giant grotesk display type, mono micro-labels, and work shown large.

## Design tokens
| Token | Value | Use |
|---|---|---|
| paper | `#EFEDE7` | Main background (warm off-white) |
| ink | `#0D0D0C` | Text and dark sections |
| graphite | `#1A1A18` | Dark cards |
| muted | ink at 60 % | Secondary text |
| line | ink at 12 % | Hairlines |
| **signal** | **`#FF4F00`** (International Orange) | The one accent. Use it for one moment per screen, plus the contact band, which is filled with it. |
| on-signal | `#0D0D0C` | Text on orange |

- **Display type:** "Sofia Sans Extra Condensed" 800–900, uppercase, tight leading (0.82–0.9), for the giant name and section titles.
- **Body type:** "Geist", weights 400 and 500.
- **Labels:** "Geist Mono", uppercase, 11–12 px, +0.08em tracking. Use it for flight-board metadata like `FLT 01`, `GATE`, `STATUS`, `[ 2026 ]` and `(01)`.
- Load all fonts with `next/font/google`.
- Grain: a very subtle SVG noise overlay on the whole page, about 6 % opacity, with no animation on mobile.

## Pages
1. **`/` home**
   - **Hero, full viewport:**
     - Giant two-line name `ARAVIND / SRINIVASAN` filling the width, revealed with GSAP SplitText (masked lines and chars, staggered).
     - A **split-flap ("Solari") board row** that cycles `person.roles` with letter-flip animation and a mono `NOW BOARDING →` prefix. Build this ourselves; it's the signature element.
     - Corner metadata in mono: location plus a live local time (Asia/Kolkata) at top left, an availability pill with a pulsing orange dot at top right, the year and handle at bottom left, and a scroll cue at bottom right.
     - A lightweight interactive **canvas dot-grid** background: dots near the cursor scale up and turn signal orange, and on touch devices they ripple from the tap point. It pauses off-screen and honours reduced motion.
   - **Manifesto:** a large paragraph whose words go from muted to ink as you scroll (GSAP ScrollTrigger scrub), with one phrase underlined in signal.
   - **Departures board, "Selected work":**
     - A table styled as a departures board. Columns: `FLT` (no), `DESTINATION` (title), `TYPE`, `YEAR`, `STATUS`. The status chip blinks orange for "Live".
     - On desktop, hovering a row shows a floating preview image (the cover) that follows the cursor with lag, and the row text shifts.
     - Clicking a row goes to the case study.
     - On mobile, rows become stacked "boarding pass" cards with a perforation line.
   - **Gates, pinned horizontal scroll (desktop only):**
     - One large panel per project (`cover` shot in a browser or phone frame), with the project number in giant outline type, kicker, summary and stack chips. Use ScrollTrigger pin with `containerAnimation` for parallax inside the panels.
     - On mobile, show vertical cards instead.
   - **Capabilities and stack:** two opposite-direction marquees (`capabilities`, `stackMarquee`) whose speed reacts to scroll velocity (ScrollVelocity-style).
   - **Contact:** a full-width **signal orange** band with a giant `LET'S BUILD →` line, a magnetic email button (copy-to-clipboard plus mailto) and a GitHub link. The footer repeats the live time and `© 2026`.
2. **`/work/[slug]` case study** (generate static params from `projects`)
   - Hero: big title, kicker, and a mono meta grid (role, year, type, status, stack) with links.
   - Cover in a device frame, revealed with a clip-path wipe on enter.
   - Sections: Problem, Approach (numbered), What I built, Results (big stat row), Gallery (alternating sizes, each image revealed on scroll), Stack chips.
   - Next flight: a large link to the next project with a hover preview.
   - Use the project `tint` only as a subtle backdrop for the device-frame area. Signal stays the accent.
3. **`not-found`** in the board style: `FLIGHT NOT FOUND — RETURN TO GATE`.

## Interaction system
- **Lenis smooth scroll** synced to the GSAP ticker (see the memory playbook). Native touch on phones (`syncTouch:false`).
- **Custom cursor** (desktop with a fine pointer only): a small ink dot plus a ring that grows into a signal disc with a mono label (`VIEW`, `OPEN`, `COPY`) over interactive targets. Use mix-blend where it reads well.
- **Page transitions:** an orange panel wipes across between routes (short, under 600 ms), and the next page's hero reveals.
- **Preloader** on the first visit only: a mono counter 000→100 in a flap style plus the name, under 1.4 s total, skipped for reduced motion.
- **Magnetic buttons**, link underline animations, and image hover zoom inside clipped frames.
- Every motion is wrapped in `gsap.matchMedia()`. With `prefers-reduced-motion`, show static, fully visible content.

## Quality bar
- Mobile first. No horizontal overflow at 360, 390 or 430 px at any scroll position. 44 px tap targets. Use `dvh` and safe areas.
- **Performance:**
  - Server components by default; motion code in small client components.
  - `next/image` with real width and height, and AVIF/WebP.
  - Only the hero canvas runs continuously.
  - Lighthouse mobile performance should be at least 90 and accessibility at least 95.
- **Accessibility:**
  - Semantic landmarks and a skip link.
  - Split-flap and SplitText keep readable `aria-label`s.
  - Visible focus states (signal outline).
  - Contrast AA. Signal orange on paper isn't enough for body text: use it for large text and fills only, with ink on orange.
- **SEO:** metadata, Open Graph image (generated with `next/og` in the board style), sitemap and robots.
- No UI libraries beyond gsap, @gsap/react, lenis and motion, plus React Bits / Cult UI / Watermelon component patterns rebuilt or copied into `src/components`. Tailwind 4 with the tokens defined in CSS `@theme`.
