import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";
const root = fileURLToPath(new URL("../", import.meta.url));
const html = await readFile(path.join(root, "index.html"), "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, "IDs must be unique");
assert.equal((html.match(/<h1\b/g) || []).length, 1, "Exactly one H1");
assert.deepEqual(
  [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]),
  ["hero", "about", "services", "barbers", "gallery", "contact"],
);
assert.ok(html.includes("<footer"), "Footer retained");
assert.ok(!/<style[\s>]/.test(html), "Styles must be external");
assert.ok(
  !/\son(?:click|error|load)=/.test(html),
  "Inline event handlers are forbidden",
);
for (const [, attrs, body] of html.matchAll(
  /<script([^>]*)>([\s\S]*?)<\/script>/g,
))
  if (!attrs.includes("application/ld+json"))
    assert.equal(body.trim(), "", "Executable JS must be external");
const schema = JSON.parse(
  html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
);
assert.equal(schema["@type"], "HairSalon");
assert.equal(schema.telephone, "+79107111112");
assert.deepEqual(
  schema.hasOfferCatalog.itemListElement.map((o) => Number(o.price)),
  [1500, 800, 1000, 600, 2200],
);
const displayed = [...html.matchAll(/class="service-price">([\d ]+) ₽/g)].map(
  (m) => Number(m[1].replaceAll(" ", "")),
);
assert.deepEqual(
  displayed,
  schema.hasOfferCatalog.itemListElement.map((o) => Number(o.price)),
  "Visible and structured prices must match",
);
assert.equal((html.match(/class="work-link"/g) || []).length, 9);
let count = 0;
for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (url.startsWith("#"))
    assert.ok(ids.includes(url.slice(1)), "Missing anchor " + url);
  else if (!/^(?:https?:|tel:|data:)/.test(url)) {
    await access(path.join(root, url));
    count++;
  }
}
for (const [, url] of html.matchAll(/\b(?:href|src)="(https:[^"]+)"/g))
  new URL(url);
for (const file of await readdir(path.join(root, "src/scripts")))
  execFileSync(process.execPath, [
    "--check",
    path.join(root, "src/scripts", file),
  ]);
console.log(
  "PASS: structure, unique IDs, anchors, " +
    count +
    " local references, 9 photos, prices/schema, external URL syntax, JS syntax.",
);
