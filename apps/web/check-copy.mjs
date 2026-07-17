import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/auth/login", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "HRD" }).click();
await page.getByText("Coba Akses Cepat (Demo)").click();
await page.waitForTimeout(1200);
await page.screenshot({ path: "cp-1-dashboard.png" });

await page.click('a[href="/hrd/jobs"]');
await page.waitForTimeout(800);
await page.screenshot({ path: "cp-2-jobs.png" });

await page.click('a[href="/hrd/cross-role"]');
await page.waitForTimeout(800);
await page.screenshot({ path: "cp-3-crossrole.png" });

await page.click('a[href="/hrd/ai-assistant"]');
await page.waitForTimeout(800);
await page.screenshot({ path: "cp-4-ai.png" });

await page.click('a[href="/hrd/settings"]');
await page.waitForTimeout(800);
await page.screenshot({ path: "cp-5-settings.png" });

await page.click('a[href="/hrd/help"]');
await page.waitForTimeout(800);
await page.screenshot({ path: "cp-6-help.png" });

await page.getByText("Yuni Shara").first().click().catch(async () => {
  await page.goto("http://localhost:3000/hrd", { waitUntil: "networkidle" });
  await page.getByText("Yuni Shara").first().click();
});
await page.waitForTimeout(800);
await page.getByRole("button", { name: /Lihat Analisis Penuh/ }).click();
await page.waitForTimeout(1000);
await page.screenshot({ path: "cp-7-candidate-detail.png" });

await browser.close();
