/**
 * Every fact on the site lives here. Sources: the owner's GitHub repos and READMEs (checked 2026-10-22).
 * Do not invent clients, employers, awards or numbers — only what is below.
 */

export const person = {
  name: "Aravind Srinivasan",
  first: "Aravind",
  last: "Srinivasan",
  handle: "manicpsycho01",
  role: "Founder & product engineer",
  roles: ["Founder", "Product engineer", "AI builder", "Mobile developer"],
  location: "India",
  timezone: "Asia/Kolkata",
  email: "aravindadharsh@gmail.com",
  github: "https://github.com/manicpsycho01",
  available: "Open to collaborations",
  intro:
    "I build products end to end — from the problem and the rules, to the interface people touch. Fintech platforms, AI decision tools and mobile apps, designed to be trusted and built to ship.",
  manifesto:
    "Software should earn trust. Let the deterministic parts compute, let the AI explain, and design every screen so a real person can make a real decision with it.",
};

export type Shot = { src: string; alt: string; w: number; h: number; device?: "browser" | "phone" | "none" };

export type Project = {
  slug: string;
  no: string;
  title: string;
  kicker: string;
  year: string;
  status: string;
  type: string;
  role: string;
  summary: string;
  problem: string;
  approach: string[];
  built: string[];
  results: { value: string; label: string }[];
  stack: string[];
  links: { label: string; href: string }[];
  cover: Shot;
  gallery: Shot[];
  /** Per-project accent used only inside its case study. */
  tint: string;
};

export const projects: Project[] = [
  {
    slug: "tagmycredit",
    no: "01",
    title: "TagMyCredit",
    kicker: "Trade-credit intelligence for the Gulf",
    year: "2026",
    status: "Live · MVP",
    type: "Startup · Founder",
    role: "Founder — product, design and engineering",
    summary:
      "A shared, anonymous record of B2B trade credit. Suppliers tag the credit they give, the buyer's CFO confirms it by SMS code, and the network turns everyone's monthly reports into a risk score, a capacity traffic light and default alerts.",
    problem:
      "Businesses in Saudi Arabia and the UAE sell on 30–90 day terms, but nobody tracks that trade credit. A supplier can verify a buyer's licence and references — never that the buyer already owes ten other suppliers and is paying them late.",
    approach: [
      "Give-to-get network: suppliers contribute monthly aging reports and receive intelligence in return.",
      "Privacy by design: nothing about a buyer is shown until at least three suppliers report, and alerts never name the filer.",
      "Explainable, versioned score (300–1000) from four factors plus bad-debt caps — no black-box ML before there is data to justify it.",
      "Dual verification: only the buyer's designated CFO can confirm a credit line, with a one-time code tied to that exact version of the terms.",
    ],
    built: [
      "Marketing website with an interactive NEOM-style supply-chain cascade map, deployed on Vercel.",
      "Full-stack MVP: company onboarding with instant TMC-IDs, credit-line lifecycle (amend, close, dispute, closure, default reports), CFO OTP confirmation, monthly snapshots with data-quality quarantine, ops review console and a monthly score release.",
      "Postgres row-level security so one company can never read another's data — enforced by the database, not just the app.",
      "Supply-chain project map on real scores, Arabic right-to-left layout, dark mode and a native-feeling mobile web app.",
    ],
    results: [
      { value: "271", label: "automated tests passing (rules, database privacy, flows)" },
      { value: "3", label: "supplier privacy floor before any score is shown" },
      { value: "7", label: "demo personas for investor and customer pitches" },
      { value: "2", label: "languages, English and Arabic (RTL)" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL 17 · RLS", "Drizzle ORM", "Better Auth", "Zod", "Vitest", "Playwright", "Vercel"],
    links: [
      { label: "Live MVP demo", href: "https://tagmycredit-app.vercel.app/demo" },
      { label: "Live website", href: "https://tagmycredit-deploy.vercel.app" },
      { label: "GitHub (MVP)", href: "https://github.com/manicpsycho01/tagmycredit-app" },
    ],
    cover: { src: "/work/tagmycredit/home.jpg", alt: "TagMyCredit dashboard for a supplier credit manager", w: 1600, h: 950, device: "browser" },
    gallery: [
      { src: "/work/tagmycredit/website.jpg", alt: "TagMyCredit marketing website hero", w: 1600, h: 950, device: "browser" },
      { src: "/work/tagmycredit/score-red.jpg", alt: "Trade Risk Score card for a buyer in default", w: 1600, h: 950, device: "browser" },
      { src: "/work/tagmycredit/map.jpg", alt: "Supply-chain project map with tiers and risk lights", w: 1600, h: 950, device: "browser" },
      { src: "/work/tagmycredit/confirm.jpg", alt: "CFO confirming a credit line with a one-time code", w: 1600, h: 950, device: "browser" },
      { src: "/work/tagmycredit/phone-home.jpg", alt: "TagMyCredit mobile web app home screen", w: 780, h: 1688, device: "phone" },
    ],
    tint: "#0B3D3A",
  },
  {
    slug: "crew-ops-advisor",
    no: "02",
    title: "Crew Ops Advisor",
    kicker: "Air Crew hackathon · airline crew-control decision support",
    year: "2026",
    status: "Hackathon · Team",
    type: "Hackathon project",
    role: "Team member — engine, agent loop and workspace",
    summary:
      "A controller describes a disruption in plain words; the system says who can legally cover it, what each option costs, and why everyone else was ruled out.",
    problem:
      "When a captain is lost two hours before report, a crew-control desk has minutes to find a legal, affordable replacement — and an AI that invents a single number in that moment is worse than no AI at all.",
    approach: [
      "Deterministic Python computes every figure; the language model only chooses which question to ask and explains the result.",
      "A claim gate — enforced in code, not in a prompt — lets the model state only what a validator returned.",
      "Every excluded candidate carries the rule that stopped them, and 'not callable' is kept distinct from 'illegal'.",
      "Zero dependencies anywhere, including the chat pane: the standard library talks to any OpenAI-compatible endpoint.",
    ],
    built: [
      "Ranked cover recommendations with cost and the rules that cleared each option.",
      "'Why not them?' drill-downs for all ruled-out crew, duty-week timeline with rest gaps, joint plans for simultaneous sick calls.",
      "A CLI and a browser workspace that both work without a model key — every recovery is still reachable.",
      "Scoreboards and tests that grade the engine, the agent loop and the UI separately, with honest caveats.",
    ],
    results: [
      { value: "36/36", label: "gradable questions answered by the engine" },
      { value: "19/19", label: "scenario checks, incl. 19 exclusions byte-for-byte" },
      { value: "28/28", label: "agent-loop and claim-gate tests" },
      { value: "119/119", label: "headless-browser checks of the workspace" },
    ],
    stack: ["Python 3.10+ (stdlib only)", "LLM agent loop", "Claim gate", "Vanilla JS workspace", "jsdom tests", "OpenAI-compatible API"],
    links: [{ label: "GitHub", href: "https://github.com/manicpsycho01/vista-crew" }],
    cover: { src: "/work/aircrew/04-ranked-cover.png", alt: "Ranked cover options for a pairing after a captain is lost", w: 1600, h: 950, device: "browser" },
    gallery: [
      { src: "/work/aircrew/01-landing.png", alt: "Crew Ops Advisor workspace landing", w: 1600, h: 950, device: "browser" },
      { src: "/work/aircrew/05-exclusions.png", alt: "Ruled-out candidates with the rule that stopped each one", w: 1600, h: 950, device: "browser" },
      { src: "/work/aircrew/09-duty-timeline.png", alt: "Duty-week timeline showing the rest gap", w: 1600, h: 950, device: "browser" },
      { src: "/work/aircrew/12-joint-plan.png", alt: "Joint plan for two simultaneous sick calls", w: 1600, h: 950, device: "browser" },
      { src: "/work/aircrew/02-boundary.png", alt: "Boundary diagram: what the engine computes vs what the model may say", w: 1600, h: 950, device: "browser" },
    ],
    tint: "#1B2A4A",
  },
  {
    slug: "fridgemate-ai",
    no: "03",
    title: "FridgeMate AI",
    kicker: "Personal project · AI kitchen assistant for iPhone",
    year: "2026",
    status: "Personal project",
    type: "Mobile app",
    role: "Solo — product, design, mobile and backend",
    summary:
      "An AI kitchen assistant that knows what's in your fridge, tells you what to use first, and turns it into recipes you can actually cook tonight.",
    problem:
      "People throw away food they forgot they had, and 'what can I cook with this?' is a daily question nobody has time to answer.",
    approach: [
      "Make stocking effortless: snap the fridge — or the grocery receipt — and Gemini lists the food, then confirm in one tap.",
      "Know what to use first without typing expiry dates: freshness is estimated from typical shelf life and the day each item was added.",
      "Recipes that feel instant: offline ideas appear immediately and Gemini's ideas, built around what's expiring, replace them as soon as they're ready.",
      "Keep AI and secrets on the server: Supabase Edge Functions call Gemini, and row-level security keeps every fridge private.",
    ],
    built: [
      "\"Fresh Market\" design: warm cream canvas, herb-green ink, one tomato action per screen, Fraunces + Inter type, a consistent food icon set and colour-block recipe cards.",
      "Fridge scan with a viewfinder, staged progress and a confirm checklist; fridge list grouped by urgency with freshness rings and quick steppers.",
      "AI recipe ideas from the items you pick, recipe detail with what you have vs. need, and an 'I cooked this' sheet that updates the fridge and history.",
      "App Store-ready basics: email sign-in with password reset, in-app account deletion, haptics, reduced-motion support and a real app icon.",
    ],
    results: [
      { value: "Gemini", label: "powers fridge and receipt scanning, and recipe ideas" },
      { value: "~1s", label: "to stock the fridge or log a cooked meal (batched writes)" },
      { value: "iOS", label: "running on iPhone via Expo, one codebase for Android" },
    ],
    stack: ["React Native", "Expo SDK 58", "TypeScript", "Expo Router", "Reanimated", "Supabase", "Edge Functions", "Google Gemini"],
    links: [{ label: "GitHub", href: "https://github.com/manicpsycho01/fridgemate-ai" }],
    cover: { src: "/work/fridgemate/home.jpg", alt: "FridgeMate AI home: 6 items, 1 to use soon, Use first card for chicken", w: 780, h: 1688, device: "phone" },
    gallery: [
      { src: "/work/fridgemate/welcome.jpg", alt: "Welcome screen: Cook what you already have", w: 780, h: 1688, device: "phone" },
      { src: "/work/fridgemate/scan.jpg", alt: "Scan your fridge viewfinder with Freo's tip", w: 780, h: 1688, device: "phone" },
      { src: "/work/fridgemate/cook.jpg", alt: "AI recipe ideas built from the selected ingredients", w: 780, h: 1688, device: "phone" },
      { src: "/work/fridgemate/recipe.jpg", alt: "Recipe detail with time, level, energy and protein", w: 780, h: 1688, device: "phone" },
      { src: "/work/fridgemate/cooked.jpg", alt: "How much did you use? sheet that updates the fridge", w: 780, h: 1688, device: "phone" },
      { src: "/work/fridgemate/history.jpg", alt: "History of meals cooked today", w: 780, h: 1688, device: "phone" },
    ],
    tint: "#1F4D3F",
  },
];

export const capabilities = [
  "Product strategy", "Full-stack web", "Mobile apps", "AI agents & LLM safety", "Data privacy & RLS",
  "Design systems", "Motion & interaction", "Testing & QA",
];

export const stackMarquee = [
  "Next.js", "React", "TypeScript", "React Native", "Expo", "PostgreSQL", "Supabase", "Python", "Gemini", "Drizzle", "Tailwind", "GSAP", "Playwright", "Vercel",
];
