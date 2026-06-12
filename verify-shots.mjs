import { chromium } from "playwright";

const run = async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("CONSOLE: " + m.text().slice(0, 200));
  });

  await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  // hero, kroki 01-04, statement, features, showcase, portfolio header,
  // zoom parallax start/mid/end, karty, CTA, oferta, faq, footer
  const fracs = [0, 0.05, 0.1, 0.16, 0.22, 0.28, 0.33, 0.38, 0.43, 0.48, 0.53, 0.58, 0.64, 0.7, 0.78, 0.86, 0.94, 1];
  const total = await page.evaluate(() => document.body.scrollHeight - innerHeight);
  let i = 0;
  for (const f of fracs) {
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), Math.round(total * f));
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `shots/shot_${String(i).padStart(2, "0")}.png` });
    i++;
  }
  console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
  await browser.close();
};
run();
