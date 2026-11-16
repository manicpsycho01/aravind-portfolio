/**
 * Every fact on the site lives here. Sources: the owner's GitHub repos and READMEs (checked 2026-10-22).
 * Do not invent clients, employers, awards or numbers — only what is below.
 */

export const person = {
  name: "Aravind Srinivasan",
  first: "Aravind",
  last: "Srinivasan",
  handle: "manicpsycho01",
  role: "Product engineer",
  roles: ["Product engineer", "AI builder", "Full-stack developer", "Mobile developer"],
  location: "India",
  timezone: "Asia/Kolkata",
  email: "aravindadharsh@gmail.com",
  github: "https://github.com/manicpsycho01",
  linkedin: "https://www.linkedin.com/in/aravind-srinivasan07",
  available: "Open to collaborations",
  intro:
    "I build products end to end — from the problem and the rules, to the interface people touch. Fintech platforms, AI decision tools and mobile apps, designed to be trusted and built to ship.",
  manifesto:
    "Software should earn trust. Let the deterministic parts compute, let the AI explain, and design every screen so a real person can make a real decision with it.",
};

export type Shot = {
  src: string;
  alt: string;
  w: number;
  h: number;
  device?: "browser" | "phone" | "none";
  /** Phones: the point (x%, y% of the image) the magnified view centres on, so wide screenshots stay readable. */
  focus?: [number, number];
}

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
    kicker: "Personal project · Trade-credit intelligence for the Gulf",
    year: "2026",
    status: "Live · MVP",
    type: "Personal project",
    role: "Solo — product, design and engineering",
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
    cover: { src: "/work/tagmycredit/home.jpg", alt: "TagMyCredit dashboard for a supplier credit manager", w: 1600, h: 950, device: "browser", focus: [30, 40] },
    gallery: [
      { src: "/work/tagmycredit/website.jpg", alt: "TagMyCredit marketing website hero", w: 1600, h: 950, device: "browser", focus: [28, 45] },
      { src: "/work/tagmycredit/score-red.jpg", alt: "Trade Risk Score card for a buyer in default", w: 1600, h: 950, device: "browser", focus: [35, 45] },
      { src: "/work/tagmycredit/map.jpg", alt: "Supply-chain project map with tiers and risk lights", w: 1600, h: 950, device: "browser", focus: [40, 62] },
      { src: "/work/tagmycredit/confirm.jpg", alt: "CFO confirming a credit line with a one-time code", w: 1600, h: 950, device: "browser", focus: [30, 45] },
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
    cover: { src: "/work/aircrew/04-ranked-cover.png", alt: "Ranked cover options for a pairing after a captain is lost", w: 1600, h: 950, device: "browser", focus: [42, 28] },
    gallery: [
      { src: "/work/aircrew/01-landing.png", alt: "Crew Ops Advisor workspace landing", w: 1600, h: 950, device: "browser", focus: [14, 24] },
      { src: "/work/aircrew/05-exclusions.png", alt: "Ruled-out candidates with the rule that stopped each one", w: 1600, h: 950, device: "browser", focus: [42, 35] },
      { src: "/work/aircrew/09-duty-timeline.png", alt: "Duty-week timeline showing the rest gap", w: 1600, h: 950, device: "browser", focus: [42, 45] },
      { src: "/work/aircrew/12-joint-plan.png", alt: "Joint plan for two simultaneous sick calls", w: 1600, h: 950, device: "browser", focus: [42, 22] },
      { src: "/work/aircrew/02-boundary.png", alt: "Boundary diagram: what the engine computes vs what the model may say", w: 1600, h: 950, device: "browser", focus: [46, 32] },
    ],
    tint: "#1B2A4A",
  },
  {
    slug: "fridgemate-ai",
    no: "03",
    title: "FridgeMate AI",
    kicker: "Personal project · AI kitchen assistant for iPhone",
    year: "2026",
    status: "Live",
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
      { value: "iOS + web", label: "one Expo codebase: iPhone app and a live web app" },
    ],
    stack: ["React Native", "Expo SDK 57", "TypeScript", "Expo Router", "Reanimated", "Supabase", "Edge Functions", "Google Gemini"],
    links: [
      { label: "Live web app", href: "https://fridgemate-ai.vercel.app" },
      { label: "GitHub", href: "https://github.com/manicpsycho01/fridgemate-ai" },
    ],
    cover: { src: "/work/fridgemate/home.jpg", alt: "FridgeMate AI home: 6 items, 1 to use soon", w: 780, h: 1688, device: "phone" },
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
  {
    slug: "statement-autopsy",
    no: "04",
    title: "Statement Autopsy",
    kicker: "Personal project · In-browser bank statement analyser for India",
    year: "2026",
    status: "Live",
    type: "Personal project",
    role: "Solo — product, design and engineering",
    summary:
      "Drop an Indian bank statement — CSV, Excel or PDF — and get a plain-English report of forgotten subscriptions, bank fees, double charges and the habits that quietly cost you, with what to do about each. The file never leaves the browser.",
    problem:
      "Bank statements hold the answer to 'where does my money go?', but they're a wall of cryptic UPI narrations. The tools that read them want your login or your data on their servers — a lot to ask for something this personal.",
    approach: [
      "Privacy as the architecture, not a policy: parsing and every check run in the browser — no server, no database, no account, no AI service.",
      "Read real bank exports: header detection, wrapped narrations, newest-first files, Dr/Cr columns, card statements — and the running balance double-checks every sign.",
      "Only honest numbers: the headline adds up concrete fixes (avoidable fees, overlapping subscriptions, two home-cooked meals a week), never 'all your delivery spend'.",
      "Every finding is traceable — one click shows the exact payments behind it, and re-labelling a merchant re-runs the whole report.",
    ],
    built: [
      "Readers for CSV, Excel and PDF (pdf.js, rows rebuilt from text positions), including password-protected e-statements.",
      "Merchant recognition for ~120 Indian merchants plus UPI, NEFT, IMPS, ACH and POS narration parsing; unknown merchants still group by name.",
      "Six checks: subscriptions (overlaps, price rises), bank fees, double charges, food delivery, small spends and cash — each with a next step and a yearly saving.",
      "Report with vitals, charts, an evidence locker (search, filter, re-label), categorised CSV export and print-to-PDF, in light and dark mode.",
    ],
    results: [
      { value: "0", label: "bytes of your statement uploaded — it's read on your device" },
      { value: "3", label: "file formats: CSV, Excel and PDF (incl. password-protected)" },
      { value: "118", label: "automated tests: 51 engine and 67 browser" },
      { value: "17", label: "screen sizes audited for overflow and overlaps" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "GSAP + Lenis", "pdf.js", "SheetJS", "Papa Parse", "Vitest", "Playwright", "Vercel"],
    links: [
      { label: "Live app", href: "https://statement-autopsy-teal.vercel.app" },
      { label: "GitHub", href: "https://github.com/manicpsycho01/statement-autopsy" },
    ],
    cover: { src: "/work/statement-autopsy/verdict-v4.jpg", alt: "Autopsy report verdict: you could save about ₹55,200 a year", w: 1600, h: 950, device: "browser", focus: [27, 40] },
    gallery: [
      { src: "/work/statement-autopsy/findings-v3.jpg", alt: "Findings: subscriptions renewing and a possible double charge", w: 1600, h: 950, device: "browser", focus: [40, 40] },
      { src: "/work/statement-autopsy/charts-v3.jpg", alt: "Where the money went, by category and month", w: 1600, h: 950, device: "browser", focus: [22, 45] },
      { src: "/work/statement-autopsy/locker-v3.jpg", alt: "Evidence locker: re-labelling a merchant updates the report", w: 1600, h: 950, device: "browser", focus: [45, 40] },
      { src: "/work/statement-autopsy/password-v3.jpg", alt: "Opening a password-protected PDF statement", w: 1600, h: 950, device: "browser", focus: [24, 72] },
      { src: "/work/statement-autopsy/phone-landing-v3.jpg", alt: "Drop zone on a phone", w: 780, h: 1688, device: "phone" },
      { src: "/work/statement-autopsy/phone-verdict-v4.jpg", alt: "Report verdict and vitals on a phone", w: 780, h: 1688, device: "phone" },
      { src: "/work/statement-autopsy/phone-finding-v3.jpg", alt: "A bank-fee finding with what to do", w: 780, h: 1688, device: "phone" },
    ],
    tint: "#4A1D1A",
  },
  {
    slug: "recon",
    no: "05",
    title: "Recon",
    kicker: "Personal project · Bank reconciliation for Indian businesses",
    year: "2026",
    status: "Live",
    type: "Personal project",
    role: "Solo — product, design and engineering",
    summary:
      "Drop a bank statement and an invoice list, and Recon matches every payment to its invoice — TDS deductions, bank charges, split and combined payments included — then shows what's still unpaid and drafts the reminder. It runs entirely in the browser.",
    problem:
      "Small businesses reconcile by hand in Excel every month: ₹2,12,400 arrives against a ₹2,36,000 invoice (10% TDS), 'BRIGHTLOOP DSGN' is Brightloop Design LLP, one transfer settles two invoices. Accounting tools want a bank integration and a subscription before they'll even try.",
    approach: [
      "Explainable scoring, not a black box: amount (exact, TDS rate, bank charges), invoice number in the narration, fuzzy party name and payment timing — every signal shown on the match.",
      "Conservative automation: only confident pairs with no close rival match on their own; an amount with no name or reference is capped below the review line.",
      "The awkward cases are first-class — one payment for several invoices, one invoice paid in parts, payments net of TDS.",
      "It learns from review: confirmed payers become aliases, rejected pairs are never suggested again, and progress is saved on the device.",
    ],
    built: [
      "Readers for bank statements (CSV, Excel, PDF incl. password-protected) and invoice lists from Zoho Books, Tally, QuickBooks, Vyapar or any spreadsheet.",
      "A matcher with Jaro-Winkler and abbreviation-aware name similarity, TDS detection at 1/2/5/10%, subset search for grouped and split payments, and rival detection.",
      "A review queue with keyboard shortcuts, manual matching from either side with ranked candidates, and a 'what Recon learned' panel you can undo.",
      "Unpaid view with receivables/payables aging, reminder text and WhatsApp share, plus CSV exports of the reconciled statement and open invoices.",
    ],
    results: [
      { value: "9/13", label: "sample matches made automatically; the 4 judgement calls go to review" },
      { value: "0", label: "false auto-matches on the planted ambiguous payment" },
      { value: "97", label: "automated tests: 31 engine and 66 browser" },
      { value: "17", label: "screen sizes audited for overflow and overlaps" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "GSAP + Lenis", "pdf.js", "SheetJS", "Papa Parse", "Vitest", "Playwright", "Vercel"],
    links: [
      { label: "Live app", href: "https://recon-manicpsycho01.vercel.app" },
      { label: "GitHub", href: "https://github.com/manicpsycho01/recon" },
    ],
    cover: { src: "/work/recon/landing-v3.jpg", alt: "Recon landing: a green-bar printout matching bank lines to invoices", w: 1600, h: 950, device: "browser", focus: [50, 45] },
    gallery: [
      { src: "/work/recon/review-v3.jpg", alt: "Review queue: a payment net of 10% TDS, with the reasons for the match", w: 1600, h: 950, device: "browser", focus: [32, 45] },
      { src: "/work/recon/unpaid-v3.jpg", alt: "Unpaid invoices with aging and payment reminders", w: 1600, h: 950, device: "browser", focus: [40, 50] },
      { src: "/work/recon/picker-v3.jpg", alt: "Matching a payment by hand, candidates ranked by fit", w: 1600, h: 950, device: "browser", focus: [38, 55] },
      { src: "/work/recon/summary-v3.jpg", alt: "Reconciliation summary: ₹5,07,400 of ₹9,61,621 received is matched", w: 1600, h: 950, device: "browser", focus: [26, 30] },
      { src: "/work/recon/phone-landing-v3.jpg", alt: "Recon on a phone: two inputs and sample data", w: 780, h: 1688, device: "phone" },
      { src: "/work/recon/phone-summary-v3.jpg", alt: "Reconciliation summary on a phone", w: 780, h: 1688, device: "phone" },
      { src: "/work/recon/phone-review-v3.jpg", alt: "A review card on a phone", w: 780, h: 1688, device: "phone" },
    ],
    tint: "#12261B",
  },
  {
    slug: "split-settle",
    no: "06",
    title: "Split & Settle",
    kicker: "Personal project · Bill splitting for friends in India, settled by UPI",
    year: "2026",
    status: "Live",
    type: "Personal project",
    role: "Solo — product, design and engineering",
    summary:
      "Add what everyone paid; Split & Settle works out who owes whom to the paisa and turns it into UPI payments friends make in a tap — a QR on a laptop. Friends join with a WhatsApp link, no sign-up, and every phone updates live. It also imports a group straight from a Splitwise export.",
    problem:
      "Splitting a Goa trip means a spreadsheet, a calculator and twelve 'who paid for the cab?' messages. Splitwise needs everyone to sign up, rounds to the rupee, and stops at 'you owe ₹4,655' — the actual payment still happens somewhere else.",
    approach: [
      "Money in integer paise with largest-remainder rounding, so every split adds up exactly; settle-up suggestions in at most n−1 payments, stable so recording one doesn't reshuffle the rest.",
      "Guest sign-in with personal, single-use invite links — after debating the plan with a second AI reviewer, who caught that a shared link lets anyone claim a friend's name.",
      "Trust built into the database: Postgres row-level security, server functions for joining and importing, a trigger that rejects shares that don't add up, and an audit log of every change.",
      "Splitwise import from the official spreadsheet export rather than an API login — its terms require a commercial licence — rebuilt row by row and checked against Splitwise's own totals.",
    ],
    built: [
      "Expo (React Native) app shipped first as an installable web app on Vercel, ready for the App Store later; Supabase with realtime sync and guest auth.",
      "Equal, exact, shares and percentage splits with live validation; edit, delete and restore with author/admin permissions; activity feed.",
      "Settle-up with UPI intent links (GPay, PhonePe, Paytm), a scannable QR on desktop, copy-UPI-ID fallback, and payment records anyone involved can undo.",
      "Personal and group invite links with QR and WhatsApp share, admin link reset and unlinking, plus an on-device demo group for visitors.",
    ],
    results: [
      { value: "₹0.00", label: "rounding drift — splits checked across 2,300 randomised cases" },
      { value: "12", label: "live access-rule tests with four guest users against the real database" },
      { value: "65", label: "browser tests, incl. two friends syncing live and a Splitwise import" },
      { value: "17", label: "screen sizes audited for overflow and overlaps" },
    ],
    stack: ["Expo SDK 57", "React Native Web", "TypeScript", "Supabase (Postgres, RLS, Realtime, anonymous auth)", "Reanimated", "Vitest", "Playwright", "Vercel"],
    links: [
      { label: "Live app", href: "https://split-settle-iota.vercel.app" },
      { label: "Try the demo", href: "https://split-settle-iota.vercel.app/demo" },
      { label: "GitHub", href: "https://github.com/manicpsycho01/split-settle" },
    ],
    cover: { src: "/work/split-settle/landing-v2.jpg", alt: "Split & Settle: split the bill, settle in one UPI tap", w: 1600, h: 950, device: "browser", focus: [25, 40] },
    gallery: [
      { src: "/work/split-settle/group-v2.jpg", alt: "A group: your balance and the expense list", w: 1600, h: 950, device: "browser", focus: [50, 40] },
      { src: "/work/split-settle/settle-v2.jpg", alt: "Suggested payments that settle everyone", w: 1600, h: 950, device: "browser", focus: [50, 62] },
      { src: "/work/split-settle/pay-v2.jpg", alt: "Pay sheet with a scannable UPI QR on desktop", w: 1600, h: 950, device: "browser", focus: [42, 70] },
      { src: "/work/split-settle/expense-v2.jpg", alt: "Adding an expense split by shares", w: 1600, h: 950, device: "browser", focus: [50, 60] },
      { src: "/work/split-settle/import-v2.jpg", alt: "Splitwise import preview, checked against Splitwise's own totals", w: 1600, h: 950, device: "browser", focus: [50, 50] },
      { src: "/work/split-settle/phone-landing-v2.jpg", alt: "Split & Settle on a phone", w: 780, h: 1688, device: "phone" },
      { src: "/work/split-settle/phone-group-v2.jpg", alt: "A group on a phone", w: 780, h: 1688, device: "phone" },
      { src: "/work/split-settle/phone-settle-v2.jpg", alt: "Settle up on a phone", w: 780, h: 1688, device: "phone" },
    ],
    tint: "#2A2410",
  },
  {
    slug: "kaudi",
    no: "07",
    title: "Kaudi",
    kicker: "Personal project · A blockchain built from scratch that you can watch — and try to rob",
    year: "2026",
    status: "Live",
    type: "Personal project",
    role: "Solo — product, design and engineering",
    summary:
      "A coin and blockchain written from the bytes up — real SHA-256 proof of work, Schnorr signatures and a UTXO ledger — running as a live network of eight Indian Ocean ports in the browser. You send coins, split the sea, watch forks resolve, and try six classic ways to rob it: five get caught by name, one works.",
    problem:
      "Blockchains get explained with words like 'trustless', 'consensus' and '51% attack' that most people can repeat but not picture — me included when I started. The usual first project, launching a token, is fifteen lines on someone else's chain and teaches almost nothing about how the chain itself agrees, or how it breaks.",
    approach: [
      "Build the real mechanics, not an animation: byte-exact serialisation, a validator with named rules, a block tree that follows the most cumulative work, and a mempool that handles reorgs.",
      "Make the network visible. Ports sit on a real sea chart and every message is a boat crossing a lane in simulated time, so propagation delay — the cause of forks — is something you can see.",
      "Teach by trying to break it: seven short voyages, and a heist board where every cheat is run against the live network and refused with the exact rule it broke.",
      "Deterministic by design: a seeded simulation in a Web Worker with mining on a fixed time grid, so any run can be shared as a link that replays it exactly.",
    ],
    built: [
      "A chain core in TypeScript: 80-byte headers and compact targets like Bitcoin's, BIP340 Schnorr signatures, bech32m addresses, Merkle trees and proofs, coinbase maturity, median-time rules and a supply cap.",
      "Eight full nodes in one background thread, each validating independently, with gossip, chain sync after partitions, orphan handling, private (withheld) mining and forged blocks.",
      "Seven voyages — hashes, keys, UTXOs, the mining race, a monsoon partition, a 51% double spend with the whitepaper's odds, Merkle proofs — plus a free-play sea and a block inspector.",
      "A rules page generated from the validator itself and a 'What's real' page that draws the line between real cryptography and the simulated network.",
    ],
    results: [
      { value: "5/6", label: "heist tricks caught by name — the one that works is the 51% double spend" },
      { value: "127", label: "automated tests: 33 engine and 94 browser" },
      { value: "1:1", label: "shared runs replay byte-for-byte, however time is chunked" },
      { value: "17", label: "screen sizes audited for overflow and overlaps" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Web Workers", "@noble/hashes", "@noble/curves", "Natural Earth", "Vitest", "fast-check", "Playwright", "Vercel"],
    links: [
      { label: "Live site", href: "https://kaudi-eta.vercel.app" },
      { label: "Try to rob it", href: "https://kaudi-eta.vercel.app/heist" },
      { label: "GitHub", href: "https://github.com/manicpsycho01/kaudi" },
    ],
    cover: { src: "/work/kaudi/landing.jpg", alt: "Kaudi: a live network of Indian Ocean ports on a night sea chart", w: 1600, h: 950, device: "browser", focus: [24, 38] },
    gallery: [
      { src: "/work/kaudi/heist.jpg", alt: "The heist: forged blocks refused by Calicut, each naming the rule it broke", w: 1600, h: 950, device: "browser", focus: [28, 35] },
      { src: "/work/kaudi/sea-v2.jpg", alt: "The monsoon splits the network and the chain forks into two branches", w: 1600, h: 950, device: "browser", focus: [34, 45] },
      { src: "/work/kaudi/port.jpg", alt: "Opening a port: its chain, balances and queue during the monsoon, as it sees them", w: 1600, h: 950, device: "browser", focus: [80, 35] },
      { src: "/work/kaudi/tamper.jpg", alt: "Tampering with an old payment breaks its proof of work and the next block's link", w: 1600, h: 950, device: "browser", focus: [30, 40] },
      { src: "/work/kaudi/merkle.jpg", alt: "A Merkle proof: three hashes prove one payment is in the block", w: 1600, h: 950, device: "browser", focus: [40, 40] },
      { src: "/work/kaudi/phone-landing.jpg", alt: "Kaudi on a phone: the hook and the live chart", w: 780, h: 1688, device: "phone" },
      { src: "/work/kaudi/phone-heist.jpg", alt: "A heist trick caught, on a phone", w: 780, h: 1688, device: "phone" },
      { src: "/work/kaudi/phone-keys.jpg", alt: "Making a key and deriving its address, on a phone", w: 780, h: 1688, device: "phone" },
    ],
    tint: "#0D1D2D",
  },
  {
    slug: "kuri",
    no: "08",
    title: "Kuri",
    kicker: "Personal project · India's chit fund as Solidity smart contracts",
    year: "2026",
    status: "Live",
    type: "Personal project",
    role: "Solo — product, design and engineering",
    summary:
      "A kuri — a chit fund, chitty or committee — rebuilt as smart contracts: monthly instalments, a sealed-bid auction for the pot, the discount shared out as dividends, and an organiser who can't touch the money. The real compiled contracts run in an Ethereum virtual machine inside the page, so anyone can play a circle with simulated neighbours, no wallet needed.",
    problem:
      "Chit funds are how many Indian families save and borrow, and their weak point is the organiser who holds everyone's money. Putting one on a blockchain is a good test of whether smart contracts can replace that trust — and it forces the hard parts: sealed bids on a public ledger, defaults, rounding, and an organiser with no backdoor.",
    approach: [
      "Real chit mechanics from the Chit Funds Act, 1982: the commission is a share of the pot, so the minimum bid equals it; the discount cap and commission are configurable within hard limits.",
      "Sealed bids by commit–reveal: only a hash goes on chain, bound to the chain, circle, round and bidder; a small bond is lost if you don't reveal; ties go to the lower seat so transaction ordering can't decide an auction.",
      "An honest answer to defaults: code can hold money but can't make people pay. Each circle chooses trust mode (full prize, one instalment of security) or escrow mode (a winner's own future dues are held back).",
      "Reviewed adversarially for exploits, then proven with invariant tests: thousands of random actions, and the contract must always hold exactly what it owes.",
    ],
    built: [
      "KuriCircle, KuriFactory (EIP-1167 clones) and a test-rupee token in Solidity 0.8 with OpenZeppelin: no admin powers, pull payments, reentrancy guards, fee-on-transfer tokens rejected.",
      "34 Hardhat tests in Solidity: every rule and revert, a fuzz test, and six invariants over 512 random runs each — solvency, no money from nowhere, one prize per round.",
      "A playable sandbox running the compiled bytecode in EthereumJS inside the browser, with neighbours who bid by motive and an under-the-hood log of every call, its gas and events.",
      "Explainers for learners: an interactive sealed-bid demo, a Solidity glossary, the contract annotated, design decisions and what it doesn't solve.",
    ],
    results: [
      { value: "34", label: "contract tests incl. fuzz and invariants × 512 runs" },
      { value: "0", label: "admin powers once a circle starts — no withdrawals, no rule changes" },
      { value: "100", label: "automated tests across contracts, the in-page EVM and the browser" },
      { value: "17", label: "screen sizes audited for overflow and overlaps" },
    ],
    stack: ["Solidity 0.8", "OpenZeppelin 5", "Hardhat 3", "forge-std", "EthereumJS VM", "viem", "Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Vitest", "Playwright", "Vercel"],
    links: [
      { label: "Live site", href: "https://kuri-six.vercel.app" },
      { label: "Play a circle", href: "https://kuri-six.vercel.app/play" },
      { label: "GitHub", href: "https://github.com/manicpsycho01/kuri" },
    ],
    cover: { src: "/work/kuri/home.jpg", alt: "Kuri: the chit fund nobody can run away with, with the circle of members under an aurora", w: 1600, h: 950, device: "browser", focus: [30, 45] },
    gallery: [
      { src: "/work/kuri/bid.jpg", alt: "Sealing a bid: what you'd get if you win, and what everyone else gets back", w: 1600, h: 950, device: "browser", focus: [70, 40] },
      { src: "/work/kuri/round.jpg", alt: "A round settled on chain: the winner, the revealed bids and the dividend", w: 1600, h: 950, device: "browser", focus: [70, 40] },
      { src: "/work/kuri/results.jpg", alt: "Circle complete: who borrowed and who saved, in rupees", w: 1600, h: 950, device: "browser", focus: [72, 50] },
      { src: "/work/kuri/code.jpg", alt: "The contract, annotated: sealed bids with commit–reveal", w: 1600, h: 950, device: "browser", focus: [60, 45] },
      { src: "/work/kuri/phone-home.jpg", alt: "Kuri on a phone", w: 780, h: 1688, device: "phone" },
      { src: "/work/kuri/phone-play.jpg", alt: "Playing a circle on a phone", w: 780, h: 1688, device: "phone" },
      { src: "/work/kuri/phone-seal.jpg", alt: "The sealed-bid demo on a phone", w: 780, h: 1688, device: "phone" },
    ],
    tint: "#06120F",
  },
  {
    slug: "complyflow",
    no: "09",
    title: "ComplyFlow",
    kicker: "Personal project · A multi-tenant workspace for Oman's move to e‑invoicing",
    year: "2026",
    status: "Live",
    type: "Personal project",
    role: "Solo — product, design and engineering",
    summary:
      "A workspace where accounting firms and the businesses they serve get invoice data ready for e-invoicing: upload a spreadsheet export, map its columns once, run a versioned Oman rule pack, and work every problem to resolution — with the client fixing values through a correction portal instead of email. Each business decides exactly what its accountant can see and do.",
    problem:
      "Oman is moving to mandatory e-invoicing (Fawtara), and the hard part isn't sending invoices — it's that everyday invoice data lives in messy exports from Tally, Excel and a dozen other tools. Firms find and chase the problems client by client over email and personal spreadsheets, with no shared record of who owns what or what changed.",
    approach: [
      "Model the real relationship: firms and businesses are separate tenants, linked only when the business approves specific permissions — and able to change or revoke them at any moment.",
      "Put security in the database, not the screens: row-level security on every table, write paths only through checked functions, and tests that act as each of eight roles trying to reach what they shouldn't.",
      "Never overwrite the original: imports are kept as uploaded, checks are re-run before anything is saved, and client corrections are stored as revisions next to the imported values.",
      "Be honest about scope: data-quality checks, not compliance claims — the regulatory rules ship switched off until a qualified professional reviews them.",
    ],
    built: [
      "A CSV/XLSX import wizard with column auto-mapping, saved templates and a purpose-built XLSX reader that's linear-time and refuses zip bombs; every import payload is signed by the server so the database can't be fed data that didn't come from the file.",
      "A versioned Oman rule pack (16 checks: totals, VAT maths, dates, duplicates, repeats of earlier imports), issues with owners, status, comments and history, and client readiness at a glance.",
      "A correction portal, private documents behind access-checked downloads, tasks, in-app notifications, CSV and print-to-PDF reports, and an activity log in every workspace.",
      "Plans with limits enforced in the database, a billing page, support tickets, an audited platform-admin area that can't see tenant data, and a resettable demo with fictional Omani firms.",
    ],
    results: [
      { value: "176", label: "automated tests — 19 unit, 71 database, 86 browser — all passing on the live site" },
      { value: "8", label: "roles, each tested against the database for what it can and can't reach" },
      { value: "16", label: "data-quality checks in a versioned, source-referenced Oman rule pack" },
      { value: "AA", label: "WCAG 2.2 checks pass on every public page and main app screen" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Supabase", "PostgreSQL", "Row-level security", "Zod", "fflate", "Papa Parse", "Vitest", "Playwright", "axe-core", "Vercel"],
    links: [
      { label: "Live site", href: "https://complyflow-nine.vercel.app" },
      { label: "Features", href: "https://complyflow-nine.vercel.app/features" },
    ],
    cover: { src: "/work/complyflow/home.jpg", alt: "ComplyFlow: every client, every invoice, every issue, under control — with a client readiness card", w: 1600, h: 950, device: "browser", focus: [30, 45] },
    gallery: [
      { src: "/work/complyflow/checks.jpg", alt: "Reviewing an import: errors and warnings by check, with the exact row and what's wrong, before anything is saved", w: 1600, h: 950, device: "browser", focus: [60, 45] },
      { src: "/work/complyflow/overview.jpg", alt: "A firm's overview: client readiness from needs fixes to ready, with open issues", w: 1600, h: 950, device: "browser", focus: [50, 40] },
      { src: "/work/complyflow/issues.jpg", alt: "Issues across clients, each with severity, invoice, row, owner and status", w: 1600, h: 950, device: "browser", focus: [55, 45] },
      { src: "/work/complyflow/mapping.jpg", alt: "Matching a spreadsheet's columns to invoice fields, with sample values", w: 1600, h: 950, device: "browser", focus: [55, 40] },
      { src: "/work/complyflow/reports.jpg", alt: "Data-quality report by check and severity, downloadable as CSV or PDF", w: 1600, h: 950, device: "browser", focus: [55, 45] },
      { src: "/work/complyflow/features.jpg", alt: "The features page", w: 1600, h: 950, device: "browser", focus: [40, 40] },
      { src: "/work/complyflow/phone-home.jpg", alt: "ComplyFlow on a phone", w: 780, h: 1688, device: "phone" },
      { src: "/work/complyflow/phone-overview.jpg", alt: "Client readiness on a phone", w: 780, h: 1688, device: "phone" },
      { src: "/work/complyflow/phone-issues.jpg", alt: "Issues on a phone", w: 780, h: 1688, device: "phone" },
    ],
    tint: "#2A1A0F",
  },
];

export const capabilities = [
  "Product strategy", "Full-stack web", "Mobile apps", "AI agents & LLM safety", "Data privacy & RLS",
  "Design systems", "Motion & interaction", "Testing & QA",
];

export const stackMarquee = [
  "Next.js", "React", "TypeScript", "React Native", "Expo", "PostgreSQL", "Supabase", "Python", "Gemini", "Drizzle", "Tailwind", "GSAP", "Playwright", "Vercel",
];
