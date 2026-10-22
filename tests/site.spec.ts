import { expect, test, type Page } from "@playwright/test";
import { projects } from "../src/content/site";

const PAGES = ["/", ...projects.map((p) => `/work/${p.slug}`)];

/** Fails the test on any console error or uncaught exception. */
function watchConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

/** Elements sticking out past the right edge (ignores intentionally clipped/hidden ones). */
async function overflowing(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out: string[] = [];
    if (document.documentElement.scrollWidth > vw + 1) out.push(`document ${document.documentElement.scrollWidth}>${vw}`);
    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= vw + 1) continue;
      let p: HTMLElement | null = el.parentElement, clipped = false;
      while (p) { const o = getComputedStyle(p).overflowX; if (o === "hidden" || o === "clip" || o === "auto" || o === "scroll") { clipped = true; break; } p = p.parentElement; }
      const cs = getComputedStyle(el);
      if (!clipped && cs.visibility !== "hidden" && cs.position !== "fixed") out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(r.right)}`);
    }
    return out.slice(0, 5);
  });
}

async function scrollThrough(page: Page, each: (y: number) => Promise<void>) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
    await each(y);
  }
}

for (const path of PAGES) {
  test(`${path}: loads cleanly, one h1, images load, no overflow at any scroll position`, async ({ page }) => {
    const errors = watchConsole(page);
    const res = await page.goto(path, { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    const h1s = await page.locator("h1").evaluateAll((els) => els.map((e) => e.outerHTML.slice(0, 120)));
    expect(h1s, "exactly one h1").toHaveLength(1);
    await expect(page.getByRole("link", { name: /skip to content/i })).toHaveCount(1);
    const problems: string[] = [];
    await scrollThrough(page, async (y) => { for (const o of await overflowing(page)) problems.push(`@${y}: ${o}`); });
    expect(problems, "horizontal overflow").toEqual([]);
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
    expect(broken, "broken images").toEqual([]);
    const noAlt = await page.evaluate(() => [...document.images].filter((i) => !i.hasAttribute("alt")).length);
    expect(noAlt, "images without alt").toBe(0);
    expect(errors, "console errors").toEqual([]);
  });
}

test("home: hero, sections and contact are present", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Aravind/i);
  for (const p of projects) await expect(page.getByText(p.title, { exact: false }).first()).toBeAttached();
  await expect(page.locator(`a[href="mailto:aravindadharsh@gmail.com"]`).first()).toBeAttached();
  await expect(page.locator(`a[href="https://github.com/manicpsycho01"]`).first()).toBeAttached();
  expect(await page.evaluate(() => document.body.innerText.includes("2023"))).toBe(false);
});

test("case studies: every project page shows its facts and links to the next flight", async ({ page }) => {
  for (const [i, p] of projects.entries()) {
    await page.goto(`/work/${p.slug}`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(new RegExp(p.title, "i"));
    for (const r of p.results) await expect(page.getByText(r.label).first()).toBeAttached();
    const next = projects[(i + 1) % projects.length]!;
    await expect(page.locator(`a[href="/work/${next.slug}"]`).first()).toBeAttached();
  }
});

test("404 page uses the board style", async ({ page }) => {
  const res = await page.goto("/work/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByText(/return to gate/i).first()).toBeVisible();
});

test("SEO: robots, sitemap and Open Graph image", async ({ request }) => {
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of projects) expect(sitemap).toContain(`/work/${p.slug}`);
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
});

test("reduced motion: the name and work are visible without animation", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const opacity = await page.getByRole("heading", { level: 1 }).evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(opacity)).toBe(1);
  await ctx.close();
});

test("departures board: rows link to case studies and no floating preview exists", async ({ page, isMobile }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  expect(await page.locator("[data-frame]").count()).toBe(0);
  test.skip(isMobile, "desktop row layout");
  const row = page.locator("[data-row]").first();
  await row.scrollIntoViewIfNeeded();
  await row.click();
  await expect(page).toHaveURL(new RegExp(`/work/${projects[0]!.slug}$`));
});

test.describe("nav anchor links", () => {
  test.skip(({ isMobile }) => isMobile, "header nav links are desktop-only");

  test("(01) Work always scrolls to the work section (regression: intermittently stayed at the top)", async ({ page }) => {
    for (let run = 0; run < 5; run++) {
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      await page.locator("header").getByRole("link", { name: /work/i }).first().click();
      await expect
        .poll(async () => page.evaluate(() => Math.round(document.getElementById("work")!.getBoundingClientRect().top)), { timeout: 5000 })
        .toBeLessThan(160);
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
      await expect(page).toHaveURL(/#work$/);
    }
  });
});

test.describe("gates (pinned horizontal panels)", () => {
  test.skip(({ isMobile }) => isMobile, "pinned gates are desktop-only");

  for (const [w, h] of [[1440, 790], [1280, 680]] as const) {
    test(`every panel's text fits the visible screen while pinned at ${w}x${h}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);
      const { top, dist } = await page.evaluate(() => {
        const wrap = document.getElementById("gates-title")!.closest("section")!.parentElement!;
        const track = document.querySelector<HTMLElement>("[data-track]")!;
        return { top: wrap.getBoundingClientRect().top + window.scrollY, dist: track.scrollWidth - window.innerWidth };
      });
      for (const f of [0.32, 0.62, 0.97]) {
        await page.evaluate((y) => window.scrollTo(0, y), top + dist * f);
        await page.waitForTimeout(1400);
        const clipped = await page.evaluate(() =>
          [...document.querySelectorAll("[data-panel]")].flatMap((panel) => {
            const r = panel.getBoundingClientRect();
            if (r.right < 0 || r.left > innerWidth) return [];
            return [...panel.querySelectorAll("h3, p, ul, a")]
              .filter((e) => { const q = e.getBoundingClientRect(); return q.width > 0 && q.left < innerWidth && q.right > 0 && (q.bottom > innerHeight + 1 || q.top < 0); })
              .map((e) => `${e.tagName}:${(e.textContent ?? "").slice(0, 24)}`);
          }),
        );
        expect(clipped, `clipped at ${Math.round(f * 100)}%`).toEqual([]);
      }
    });
  }
});

test.describe("case-study gallery and shortcuts", () => {
  test("gallery is a carousel: arrows move it and a click opens a lightbox that Esc closes", async ({ page }) => {
    await page.goto("/work/tagmycredit", { waitUntil: "networkidle" });
    const gallery = page.locator("section[aria-label=Gallery]");
    const track = gallery.getByRole("region");
    await gallery.scrollIntoViewIfNeeded();
    await expect(gallery.getByText(/^01$/).first()).toBeAttached();
    await gallery.getByRole("button", { name: "Next screenshot" }).click();
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
    await expect(gallery.locator("p[aria-live]")).toContainText("02");
    await gallery.getByRole("button", { name: /^Open screenshot/ }).nth(1).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("02 / ");
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("03 / ");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    expect(page.url()).toContain("/work/tagmycredit");
  });

  test("keyboard: → / ← switch case studies and Esc returns to the board", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard shortcuts are a desktop affordance");
    const [a, b] = [projects[0]!, projects[1]!];
    await page.goto(`/work/${a.slug}`, { waitUntil: "networkidle" });
    await page.keyboard.press("ArrowRight");
    await page.waitForURL(`**/work/${b.slug}`);
    await page.keyboard.press("ArrowLeft");
    await page.waitForURL(`**/work/${a.slug}`);
    await page.keyboard.press("Escape");
    await page.waitForURL(/\/#work$/);
  });
});

test("floating contact: hidden on the hero, shown while scrolling, steps aside at the contact band", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const pill = page.locator("a[data-cursor=TALK]");
  await expect(pill).toHaveAttribute("aria-hidden", "true");
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await expect(pill).toHaveAttribute("aria-hidden", "false");
  await expect(pill).toHaveAttribute("href", "/#contact");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(pill).toHaveAttribute("aria-hidden", "true");
});

test("home: the numbers section is gone", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByText(/\(0\d\) Numbers/i)).toHaveCount(0);
});

test("case study: one gallery, at the top, before the write-up", async ({ page }) => {
  for (const p of projects) {
    await page.goto(`/work/${p.slug}`, { waitUntil: "networkidle" });
    await expect(page.locator("section[aria-label=Gallery]")).toHaveCount(1);
    await expect(page.locator("section[aria-label=Gallery] [data-slide]")).toHaveCount(p.gallery.length + 1);
    const order = await page.evaluate(() => {
      const g = document.querySelector("section[aria-label=Gallery]")!.getBoundingClientRect().top;
      const s = document.querySelector("section[aria-label=Summary]")!.getBoundingClientRect().top;
      return g < s;
    });
    expect(order, `${p.slug}: gallery comes before the summary`).toBe(true);
  }
});

test("phones: wide screenshots show a readable crop and pan full-height in the lightbox", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone layout");
  await page.goto("/work/crew-ops-advisor", { waitUntil: "networkidle" });
  const first = page.locator("section[aria-label=Gallery] [data-slide='0']");
  const crop = first.locator("img[alt='']");
  await expect(crop).toBeVisible();
  // magnified: the image is about three times the slide width, so its text is legible
  const [img, slide] = await Promise.all([crop.boundingBox(), first.boundingBox()]);
  expect(img!.width / slide!.width).toBeGreaterThan(2.5);
  await first.getByRole("button").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Drag sideways");
  const pan = await dialog.locator(".overflow-x-auto").evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth, left: el.scrollLeft }));
  expect(pan.sw).toBeGreaterThan(pan.cw * 1.5);
  expect(pan.left).toBeGreaterThan(0);
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toHaveCount(0);
});

test("hero: the whole name fits on screen at short laptop heights", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop sizes");
  for (const [w, h] of [[1400, 660], [1280, 600], [1536, 730], [1920, 1080]] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/", { waitUntil: "networkidle" });
    const box = await page.locator("h1 [data-line]").last().boundingBox();
    expect(box!.y + box!.height, `${w}x${h}`).toBeLessThanOrEqual(h);
    expect(box!.x + box!.width, `${w}x${h}`).toBeLessThanOrEqual(w);
  }
});

test("LinkedIn is linked in the contact band and footer", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator('a[href="https://www.linkedin.com/in/aravind-srinivasan07"]')).toHaveCount(2);
});

test("hero: the intro sits beside the name on its baseline when there is room, and never overlaps it", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop sizes");
  for (const [w, h] of [[1400, 660], [1536, 730], [1680, 860], [1440, 900], [1920, 1080], [1366, 768]] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/", { waitUntil: "networkidle" });
    const r = await page.evaluate(() => {
      const lines = [...document.querySelectorAll("h1 [data-line]")];
      const last = lines.at(-1)!.getBoundingClientRect();
      const nameRight = Math.max(...lines.map((l) => l.getBoundingClientRect().right));
      const font = parseFloat(getComputedStyle(lines[0]!).fontSize);
      const intro = [...document.querySelectorAll("section[aria-label=Introduction] p")].find((p) => p.textContent!.startsWith("I build"))!;
      const ib = intro.getBoundingClientRect();
      return { beside: getComputedStyle(intro).position === "absolute", gap: ib.left - nameRight, baselineDelta: ib.bottom - (last.bottom - 0.1 * font), introBottom: ib.bottom, nameTop: lines[0]!.getBoundingClientRect().top };
    });
    if (r.beside) {
      expect(r.gap, `${w}x${h} gap`).toBeGreaterThanOrEqual(24);
      expect(Math.abs(r.baselineDelta), `${w}x${h} baseline`).toBeLessThanOrEqual(10);
    } else {
      expect(r.introBottom, `${w}x${h} intro above name`).toBeLessThanOrEqual(r.nameTop);
    }
  }
});
