import { chromium } from "playwright";

/* Weryfikacja na NISKIM viewporcie (jak przeglądarka w VS Code u użytkownika) */
const run = async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1250, height: 620 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  // koncentracja na sekcji procesu: hero, 01, 02, 03, 03→04, 04, koniec/outro, statement
  const fracs = [0, 0.04, 0.09, 0.14, 0.185, 0.21, 0.235, 0.25, 0.27];
  const total = await page.evaluate(() => document.body.scrollHeight - innerHeight);
  let i = 0;
  for (const f of fracs) {
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), Math.round(total * f));
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `shots/short_${String(i).padStart(2, "0")}.png` });
    i++;
  }
  console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
  await browser.close();
};
run();
