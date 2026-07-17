import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/auth/login", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "HRD" }).click();
await page.getByText("Coba Akses Cepat (Demo)").click();
await page.waitForTimeout(1200);
await page.click('a[href="/hrd/cross-role"]');
await page.waitForTimeout(1000);
await page.screenshot({ path: "cr-1-top.png" });

// analytics toggle
const analisisBtn = page.getByRole("button", { name: /Lihat Analisis/ });
if (await analisisBtn.count()) {
  await analisisBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "cr-2-analytics.png" });
  await analisisBtn.click();
  await page.waitForTimeout(300);
}

// empty state via search
await page.fill('input[placeholder="Cari nama atau posisi usulan..."]', "zzzznotfound");
await page.waitForTimeout(400);
await page.screenshot({ path: "cr-3-empty.png" });
await page.fill('input[placeholder="Cari nama atau posisi usulan..."]', "");

await page.mouse.wheel(0, 800);
await page.waitForTimeout(400);
await page.screenshot({ path: "cr-4-scroll.png" });

await browser.close();
