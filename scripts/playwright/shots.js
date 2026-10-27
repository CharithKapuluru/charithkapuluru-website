async (page) => {
  const base = "http://localhost:4173";
  const routes = ["/", "/projects/", "/projects/devsecops-pipeline/", "/projects/terraform-ecs-deployment/", "/projects/linux-sysadmin-deep-dive/", "/fundamentals/", "/fundamentals/computing-basics/", "/fundamentals/cron-jobs/", "/contact/", "/this-page-does-not-exist/"];
  const sizes = [[390, 844], [768, 1024], [1440, 900]];
  const saved = [];
  for (const theme of ["light", "dark"]) {
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      for (const route of routes) {
        await page.goto(base + route, { waitUntil: "load" });
        await page.evaluate((t) => localStorage.setItem("theme", t), theme);
        await page.reload({ waitUntil: "load" });
        await page.waitForTimeout(500);
        const long = route.startsWith("/projects/") && route !== "/projects/";
        const name = `${theme}-${width}${route === "/" ? "-home" : route.replace(/\/$/, "").replace(/\//g, "-")}`;
        if (!long) {
          // Lazy images only load once they are scrolled near, so pass down the page and back before a full-page capture.
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(400);
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(200);
        }
        await page.screenshot({ path: `.playwright-mcp/final/${name}.jpg`, type: "jpeg", quality: 70, fullPage: !long });
        if (long) {
          await page.evaluate(() => window.scrollTo(0, 2200));
          await page.waitForTimeout(400);
          await page.screenshot({ path: `.playwright-mcp/final/${name}-mid.jpg`, type: "jpeg", quality: 70 });
        }
        saved.push(name);
      }
    }
  }
  return saved.join("\n");
}
