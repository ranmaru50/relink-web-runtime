// server/server.ts
import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const directory = dirname(fileURLToPath(import.meta.url));
createServer((request, response) => {
  if (request.method === "GET" && request.url === "/sample.arxml") {
    response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8" }); createReadStream(join(directory, "sample.arxml")).pipe(response); return;
  }
  if (request.method === "POST" && request.url === "/api/register") {
    response.writeHead(200, { "Content-Type": "application/json" }); response.end(JSON.stringify({ success: true })); return;
  }
  response.writeHead(404); response.end();
}).listen(3000, () => console.log("Demo backend: http://localhost:3000"));
