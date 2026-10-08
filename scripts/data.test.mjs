import { test } from "node:test";
import assert from "node:assert/strict";
import { projects, getProjectProgressKey, getNextProject } from "../src/lib/projectsData.ts";
import { topics, categories, getNextTopic } from "../src/lib/fundamentalsData.ts";

test("every project has a GitHub repo, a lede, an outcome, a time estimate and an icon", () => {
  for (const p of projects) {
    assert.match(p.repo, /^https:\/\/github\.com\/CharithKapuluru\/[\w-]+$/, p.slug);
    for (const field of ["lede", "outcome", "estimatedTime", "whatYouBuild"]) assert.ok(p[field]?.length > 10, `${p.slug}.${field}`);
    assert.ok(["git-branch", "cloud-arrow-up", "terminal"].includes(p.icon), p.slug);
    assert.equal("gradient" in p, false, "gradient removed");
  }
});

test("the Linux project keeps its historical Firestore progress key", () => {
  const linux = projects.find((p) => p.slug === "linux-sysadmin-deep-dive");
  assert.equal(getProjectProgressKey(linux), "linux-sysadmin");
  assert.equal(getProjectProgressKey(projects.find((p) => p.slug === "devsecops-pipeline")), "devsecops-pipeline");
});

test("every topic has a lede, belongs to a known category and has no gradient or icon", () => {
  const ids = new Set(categories.map((c) => c.id));
  for (const t of topics) {
    assert.ok(t.lede.length > 20, t.slug);
    assert.ok(ids.has(t.category), `${t.slug} category`);
    assert.equal("gradient" in t, false);
    assert.equal("icon" in t, false);
  }
});

test("no shell copy in the data files contains an em-dash or en-dash", () => {
  for (const t of topics) assert.doesNotMatch(t.lede + t.description, /[\u2013\u2014]/, t.slug);
  for (const p of projects) assert.doesNotMatch(p.lede + p.outcome + p.whatYouBuild + p.description, /[\u2013\u2014]/, p.slug);
});

test("next helpers wrap around", () => {
  assert.equal(getNextTopic(topics[topics.length - 1].slug).slug, topics[0].slug);
  assert.equal(getNextProject(projects[projects.length - 1].slug).slug, projects[0].slug);
});
