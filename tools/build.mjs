import {
  cp,
  mkdir,
  readdir,
  unlink,
  readFile,
  writeFile,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
if (path.dirname(output) !== path.resolve(root))
  throw Error("Unsafe output directory");
await mkdir(output, { recursive: true });
const entries = [
  "index.html",
  "favicon.png",
  "robots.txt",
  "sitemap.xml",
  "src",
  "assets",
];
const allowed = (src) =>
  !src.endsWith("hero-original.png") && !/original-\d+\.jpg$/.test(src);
const expected = new Set();
async function collect(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name),
      relative = path.join(prefix, entry.name);
    if (!allowed(full)) continue;
    if (entry.isDirectory()) await collect(full, relative);
    else expected.add(relative);
  }
}
for (const entry of entries) {
  if (entry === "src" || entry === "assets")
    await collect(path.join(root, entry), entry);
  else expected.add(entry);
  await cp(path.join(root, entry), path.join(output, entry), {
    recursive: true,
    force: true,
    filter: allowed,
  });
}
async function prune(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name),
      relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) await prune(full, relative);
    else if (!expected.has(relative)) await unlink(full);
  }
}
await prune(output);
const sheets = ["tokens", "base", "layout", "sections", "motion"];
const css = (
  await Promise.all(
    sheets.map((name) =>
      readFile(path.join(root, "src/styles", name + ".css"), "utf8"),
    ),
  )
).join("\n");
await writeFile(path.join(output, "assets/site.css"), css);
const html = await readFile(path.join(output, "index.html"), "utf8");
let first = true;
await writeFile(
  path.join(output, "index.html"),
  html.replace(/<link\b(?=[^>]*rel="stylesheet")(?=[^>]*href="src\/styles\/[^"]+")[^>]*>/g, () => {
    if (!first) return "";
    first = false;
    return '<link rel="stylesheet" href="assets/site.css">';
  }),
);
console.log(
  "Production files are ready in dist/. No archive, docs or tooling included.",
);
