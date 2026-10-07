import { build } from "esbuild";
import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/demo", { recursive: true });

await build({ entryPoints: ["src/content.ts"], bundle: true, format: "iife", outfile: "dist/content.js", minify: true });
await build({ entryPoints: ["src/service-worker.ts"], bundle: true, format: "iife", outfile: "dist/service-worker.js", minify: true });
await build({ entryPoints: ["src/demo.ts"], bundle: true, format: "iife", outfile: "dist/demo.js", minify: true });
await build({ entryPoints: ["src/cli.ts"], bundle: true, platform: "node", format: "esm", outfile: "dist/passagepin.mjs", target: "node20" });
await cp("extension/manifest.json", "dist/manifest.json");
await cp("demo/index.html", "dist/demo/index.html");
