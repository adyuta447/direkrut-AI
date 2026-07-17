import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/auth/login", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "HRD" }).click();
await page.getByText("Coba Akses Cepat (Demo)").click();
await page.waitForTimeout(1200);
await page.click('a[href="/hrd/cross-role"]');
await page.waitForTimeout(1000);

await page.locator('button:has-text("Lihat Analisis")').first().click({ timeout: 10000 }).catch(e => console.log("toggle click failed:", e.message.slice(0,120)));
await page.waitForTimeout(600);
await page.screenshot({ path: "cr-2-analytics.png" });

await page.fill('input[placeholder="Cari nama atau posisi usulan..."]', "zzzznotfound");
await page.waitForTimeout(400);
await page.screenshot({ path: "cr-3-empty.png" });

await browser.close();
