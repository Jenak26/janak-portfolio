import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import preact from "@preact/preset-vite";
import { defineConfig, type Plugin } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = resolve(root, "public");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/* The service worker is a second entry with a fixed name. After bundling, the list of every
   emitted and public file, and a version hashed from their contents, are written into it.
   So any change to any file gives a new worker, and the page can offer the update. */
function serviceWorker(): Plugin {
  return {
    name: "deadlines-sw",
    enforce: "post",
    apply: "build",
    generateBundle(_, bundle) {
      const sw = bundle["sw.js"];
      if (!sw || sw.type !== "chunk") this.error("sw.js missing from bundle");
      const hash = createHash("sha256");
      const files: string[] = [];
      for (const [name, out] of Object.entries(bundle).sort(([a], [b]) => a.localeCompare(b))) {
        if (name === "sw.js" || name.endsWith(".map")) continue;
        files.push(name);
        hash.update(name).update(out.type === "chunk" ? out.code : out.source);
      }
      for (const p of walk(publicDir).sort()) {
        const name = relative(publicDir, p).split("\\").join("/");
        files.push(name);
        hash.update(name).update(readFileSync(p));
      }
      const version = hash.digest("hex").slice(0, 12);
      if (!files.includes("index.html")) this.error("index.html missing from bundle");
      const list = files;
      sw.code = sw.code
        .replace('"__PRECACHE__"', JSON.stringify(list))
        .replace("__VERSION__", version);
    },
  };
}

/* Adds a Content-Security-Policy that allows the one inline boot script by hash and nothing
   from other origins, so the "no third-party requests" rule is enforced by the browser. */
function csp(): Plugin {
  return {
    name: "deadlines-csp",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const m = /<script id="boot">([\s\S]*?)<\/script>/.exec(html);
        if (!m) throw new Error("boot script missing");
        const sha = createHash("sha256").update(m[1]).digest("base64");
        const policy = [
          "default-src 'self'",
          `script-src 'self' 'sha256-${sha}'`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'self'",
          "manifest-src 'self'",
          "worker-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'none'",
        ].join("; ");
        return html.replace("<head>", `<head>\n<meta http-equiv="Content-Security-Policy" content="${policy}">`);
      },
    },
  };
}

export default defineConfig({
  root,
  base: "/deadlines/",
  plugins: [preact(), serviceWorker(), csp()],
  define: {
    __BUILD__: JSON.stringify(new Date().toISOString().slice(0, 16).replace("T", " ")),
  },
  build: {
    outDir: resolve(root, "../../dist/deadlines"),
    emptyOutDir: true,
    target: "es2021",
    modulePreload: { polyfill: false },
    cssCodeSplit: false,
    rollupOptions: {
      input: { index: resolve(root, "index.html"), sw: resolve(root, "src/sw/sw.ts") },
      output: {
        entryFileNames: chunk => (chunk.name === "sw" ? "sw.js" : "assets/[name]-[hash].js"),
      },
    },
  },
  // Inline config stops Vite from picking up the portfolio's PostCSS and Tailwind setup at the repo root.
  css: { postcss: { plugins: [] } },
  preview: { port: 4174, strictPort: true },
  test: {
    include: ["tests/unit/**/*.test.ts"],
  },
} as Parameters<typeof defineConfig>[0]);
