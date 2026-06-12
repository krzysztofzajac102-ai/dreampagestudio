import { chromium } from "playwright";

const run = async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  const fracs = [0, 0.15, 0.3, 0.45, 0.6, 0.8];
  const total = await page.evaluate(() => document.body.scrollHeight - innerHeight);
  let i = 0;
  for (const f of fracs) {
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), Math.round(total * f));
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `shots/mob_${String(i).padStart(2, "0")}.png` });
    i++;
  }
  console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
  await browser.close();
};
run();
