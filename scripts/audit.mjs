import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { GUIDES, LOCALES, SERVICES, SITE } from "../site-data.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const errors = [];
const htmlFiles = [];
const knownFiles = new Set();

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else {
      knownFiles.add(path);
      if (entry.name.endsWith(".html")) htmlFiles.push(path);
    }
  }
}

try { await walk(dist); } catch { errors.push("dist is missing; run npm run build first"); }

const expectedPerLocale = 1 + SERVICES.length + 1 + GUIDES.length + 6;
const expectedHtml = expectedPerLocale * Object.keys(LOCALES).length + 2;
if (htmlFiles.length !== expectedHtml) errors.push(`Expected ${expectedHtml} HTML files, found ${htmlFiles.length}`);

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  if (html.includes(["kontakt", "bb-legal.dev"].join("@"))) errors.push(`${file}: old email remains`);
  if (!file.endsWith("/dist/index.html") && !file.endsWith("/dist/404.html")) {
    for (const token of ["<title>", "meta name=\"description\"", "rel=\"canonical\"", "hreflang=\"x-default\"", "application/ld+json", "/assets/favicon.svg"]) {
      if (!html.includes(token)) errors.push(`${file}: missing ${token}`);
    }
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${file}: duplicate id`);
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (!file.endsWith("/dist/index.html") && !file.endsWith("/dist/404.html") && h1Count !== 1) errors.push(`${file}: expected one h1, found ${h1Count}`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
    const target = match[1].split(/[?#]/)[0];
    if (!target || target === "/") continue;
    const direct = join(dist, target);
    const index = join(dist, target, "index.html");
    if (!knownFiles.has(direct) && !knownFiles.has(index)) errors.push(`${file}: broken internal reference ${target}`);
  }
}

for (const required of ["sitemap.xml", "robots.txt", "manifest.webmanifest", "assets/favicon.svg", "assets/logo.svg"]) {
  try { await readFile(join(dist, required)); } catch { errors.push(`Missing ${required}`); }
}

const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8").catch(() => "");
for (const locale of Object.keys(LOCALES)) {
  for (const service of SERVICES) if (!sitemap.includes(`${SITE.origin}/${locale}/${service.slug}`)) errors.push(`Sitemap missing ${locale}/${service.slug}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Audit passed: ${htmlFiles.length} HTML files, ${Object.keys(LOCALES).length} locales, ${SERVICES.length} service routes.`);
}
