// server/server.ts
import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** デモ画面を配信する開発用 Origin の許可一覧です。 */
const ALLOWED_DEMO_ORIGINS = new Set(["http://localhost:5173", "http://127.0.0.1:5173"]);
const directory = dirname(fileURLToPath(import.meta.url));
/** 環境変数で上書き可能なローカルデモ用の待受ポートです。 */
const port = Number(process.env.PORT ?? 3000);
createServer((request, response) => {
  // ブラウザの通常の CORS チェックを尊重しつつ、開発用デモ Origin だけを許可します。
  const origin = request.headers.origin;
  if (origin && ALLOWED_DEMO_ORIGINS.has(origin)) response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Vary", "Origin");
  // 将来 JSON POST サンプルを追加しても安全に検証できるよう preflight に応答します。
  if (request.method === "OPTIONS") {
    response.writeHead(204, { "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Accept" });
    response.end();
    return;
  }
  if (request.method === "GET" && request.url === "/sample.arxml") {
    response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8" }); createReadStream(join(directory, "sample.arxml")).pipe(response); return;
  }
  if (request.method === "GET" && request.url === "/api/temperature") {
    response.writeHead(200, { "Content-Type": "application/json" }); response.end(JSON.stringify(20.1)); return;
  }
  response.writeHead(404); response.end();
}).listen(port, () => console.log(`Demo backend: http://localhost:${port}`));
