/* Static server for e2e and Lighthouse runs. Mirrors the Vercel rules this app relies on:
   /deadlines redirects to /deadlines/, /deadlines/ serves index.html, files are served as is
   with max-age=0, must-revalidate. GET /__mode/v1 swaps /deadlines/ to the original v1 files
   (to test the v1 to v2 takeover); /__mode/next serves v2 with a byte-different sw.js, like a
   new deploy; /__mode/v2 swaps back. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const V2 = resolve(here, "../../../../dist/deadlines");
const V1 = resolve(here, "../../legacy-v1");
const port = Number(process.env.PORT || 4174);
let mode = "v2";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".png": "image/png", ".woff2": "font/woff2", ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname.startsWith("/__mode/")) {
    mode = url.pathname.split("/").pop();
    res.writeHead(200, { "Content-Type": "text/plain" }).end(mode);
    return;
  }
  if (url.pathname === "/deadlines") {
    res.writeHead(308, { Location: "/deadlines/" + url.search }).end();
    return;
  }
  if (!url.pathname.startsWith("/deadlines/")) {
    res.writeHead(404).end("not found");
    return;
  }
  let rel = decodeURIComponent(url.pathname.slice("/deadlines/".length)) || "index.html";
  const base = mode === "v1" ? V1 : V2;
  const file = normalize(join(base, rel));
  if (!file.startsWith(base)) { res.writeHead(403).end(); return; }
  try {
    if (!(await stat(file)).isFile()) throw new Error("dir");
    let body = await readFile(file);
    if (mode === "next" && rel === "sw.js") body = Buffer.concat([body, Buffer.from("\n// next build\n")]);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "public, max-age=0, must-revalidate" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(port, () => console.log(`deadlines test server on http://localhost:${port}/deadlines/`));
