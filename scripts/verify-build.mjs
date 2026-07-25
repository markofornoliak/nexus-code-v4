import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const projectRoot = process.cwd();
const distRoot = resolve(projectRoot, "dist");

function fail(message) {
  throw new Error(`Build verification failed: ${message}`);
}

function normalizeBasePath(value) {
  if (!value || value === "/") return "/";
  return `/${value.replace(/^\/+|\/+$/g, "")}/`;
}

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(absolute) : [absolute];
  });
}

function localReferencePath(reference, basePath) {
  if (
    !reference ||
    reference.startsWith("#") ||
    reference.startsWith("data:") ||
    /^[a-z][a-z\d+.-]*:/i.test(reference)
  ) {
    return null;
  }

  const clean = reference.split(/[?#]/, 1)[0];
  if (!clean) return null;
  if (clean.startsWith("/")) {
    if (basePath !== "/" && !clean.startsWith(basePath)) {
      fail(`root reference "${reference}" does not use configured base "${basePath}"`);
    }
    return clean.slice(basePath === "/" ? 1 : basePath.length);
  }
  return clean.replace(/^\.\//, "");
}

if (!existsSync(distRoot)) fail("dist directory is missing");

const requiredFiles = ["index.html", "manifest.webmanifest", ".nojekyll"];
for (const file of requiredFiles) {
  if (!existsSync(join(distRoot, file))) fail(`${file} is missing`);
}

const basePath = normalizeBasePath(process.env.VITE_BASE_PATH);
const indexHtml = readFileSync(join(distRoot, "index.html"), "utf8");
if (/["']\/src\//.test(indexHtml)) fail("index.html still references development source");

const references = Array.from(
  indexHtml.matchAll(/\b(?:href|src)=["']([^"']+)["']/g),
  (match) => match[1],
);
for (const reference of references) {
  const localPath = localReferencePath(reference, basePath);
  if (localPath && !existsSync(join(distRoot, localPath))) {
    fail(`index.html references missing file "${localPath}"`);
  }
}

const files = collectFiles(distRoot);
const relativeFiles = files.map((file) => relative(distRoot, file).split(sep).join("/"));
for (const expected of [
  "codemirror-",
  "three-",
  "pyodide.worker-",
  "javascript.worker-",
]) {
  if (!relativeFiles.some((file) => file.includes(expected))) {
    fail(`expected generated asset containing "${expected}" was not emitted`);
  }
}

const totalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0);
console.log(
  `Verified dist: ${files.length} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MiB, base ${basePath}`,
);
