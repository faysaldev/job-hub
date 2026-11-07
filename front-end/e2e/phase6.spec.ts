import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** No fixtures are mutated; tests exercise public pages and anonymous access boundaries. */
test("landing and discovery render with a primary heading", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main").first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  await expect(page).toHaveTitle(/jobhub/i);
});

test("job-search route renders functional loading, data or empty/error state", async ({ page }) => {
  await page.goto("/job", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).not.toBeEmpty();
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
});

test("administrator workspace is not visible to an anonymous visitor", async ({ page }) => {
  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Platform administrator access required")).toBeVisible();
  await expect(page.getByRole("heading", { name: /platform operations/i })).toHaveCount(0);
});

test("private administrator metadata is not indexable", async ({ page }) => {
  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
});

test("page supports keyboard navigation with a visible focus target", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toHaveCount(1);
  const tag = await focused.evaluate(element => element.tagName.toLowerCase());
  expect(["a", "button", "input", "select", "textarea"]).toContain(tag);
});

test("layout does not overflow screen width on the selected device", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const { viewport, content } = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(content - viewport, `Horizontal overflow: viewport=${viewport}, content=${content}`).toBeLessThanOrEqual(3);
});

test("public site has no serious or critical axe accessibility violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const important = result.violations.filter(v => ["critical", "serious"].includes(v.impact || ""));
  expect(important, JSON.stringify(important.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })), null, 2)).toEqual([]);
});
