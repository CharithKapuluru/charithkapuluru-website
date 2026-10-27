async (page) => {
  const base = "http://localhost:4173";
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.setCacheDisabled", { cacheDisabled: true });
  await client.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.setViewportSize({ width: 390, height: 844 });
  const results = {};
  for (const [name, route] of [["home", "/"], ["article", "/fundamentals/computing-basics/"], ["project", "/projects/devsecops-pipeline/"]]) {
    await page.goto("about:blank");
    await page.goto(base + route, { waitUntil: "load", timeout: 90000 }).catch(() => {});
    await page.waitForTimeout(4000);
    results[name] = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const res = performance.getEntriesByType("resource");
      const totalKB = Math.round((res.reduce((a, r) => a + (r.transferSize || 0), 0) + (nav?.transferSize || 0)) / 1024);
      const fcp = performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint");
      let lcp = null;
      let cls = 0;
      const long = [];
      try {
        const po = new PerformanceObserver(() => {});
        po.observe({ type: "largest-contentful-paint", buffered: true });
        const e = po.takeRecords();
        if (e.length) lcp = Math.round(e[e.length - 1].startTime);
        const po2 = new PerformanceObserver(() => {});
        po2.observe({ type: "layout-shift", buffered: true });
        for (const s of po2.takeRecords()) if (!s.hadRecentInput) cls += s.value;
        const po3 = new PerformanceObserver(() => {});
        po3.observe({ type: "longtask", buffered: true });
        for (const t of po3.takeRecords()) long.push(t.duration);
      } catch {}
      return { totalKB, fcpMs: fcp ? Math.round(fcp.startTime) : null, lcpMs: lcp, cls: Math.round(cls * 1000) / 1000, tbtMs: Math.round(long.reduce((a, d) => a + Math.max(0, d - 50), 0)) };
    });
  }
  await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await client.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  return JSON.stringify(results, null, 1);
}
