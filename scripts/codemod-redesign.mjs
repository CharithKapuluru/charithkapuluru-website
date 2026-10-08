#!/usr/bin/env node
// Applies the redesign rewrite rules to the given files or directories, in place.
// Usage: node scripts/codemod-redesign.mjs src/components/fundamentals src/components/projects src/components/ui/ArchitectureDiagram.tsx
import { readFileSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { transformSource } from "./lib/codemod-rules.mjs";

function collect(target) {
  const st = statSync(target);
  if (st.isFile()) return target.endsWith(".tsx") ? [target] : [];
  return readdirSync(target).flatMap((name) => collect(join(target, name)));
}

const files = process.argv.slice(2).flatMap(collect);
if (files.length === 0) {
  console.error("No .tsx files given");
  process.exit(1);
}

let changed = 0;
for (const file of files) {
  const before = readFileSync(file, "utf8");
  const after = transformSource(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed += 1;
    console.log(`rewrote ${file}`);
  }
}
console.log(`${changed} of ${files.length} files changed`);
