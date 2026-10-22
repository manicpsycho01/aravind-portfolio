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
