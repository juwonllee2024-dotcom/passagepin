import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const root = resolve("dist");
const contentTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" };

const server = createServer(async (request, response) => {
  const requestPath = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
  const relative = requestPath === "/" ? "demo/index.html" : requestPath.replace(/^\/+/, "");
  const target = resolve(root, relative);
  if (!target.startsWith(`${root}\\`) && target !== root) {
    response.writeHead(403).end("forbidden");
    return;
  }
  try {
    const body = await readFile(target);
    response.writeHead(200, { "content-type": contentTypes[extname(target)] ?? "text/plain; charset=utf-8" }).end(body);
  } catch {
    response.writeHead(404).end("not found");
  }
});

server.listen(4177, "127.0.0.1");
