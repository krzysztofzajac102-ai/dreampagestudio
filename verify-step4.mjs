import { chromium } from "playwright";

/* Weryfikacja kroku 04: scena ma być w PEŁNI widoczna przez cały zakres,
   kamera zatrzymana na platformie, brak wygaszania */
const run = async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1250, height: 620 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  // progress p kontenera (560vh, sticky 100vh) → scrollY = p * 4.6 * innerHeight
  const ps = [0.74, 0.8, 0.86, 0.92, 0.97, 1.0, 1.04];
  let i = 0;
  for (const p of ps) {
    await page.evaluate((pp) => {
      scrollTo({ top: Math.round(pp * 4.6 * innerHeight), behavior: "instant" });
    }, p);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `shots/s4_${String(i).padStart(2, "0")}_p${p}.png` });
    i++;
  }
  console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
  await browser.close();
};
run();
