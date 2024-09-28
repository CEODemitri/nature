import { fileURLToPath } from "url";
import { dirname, join, parse } from "path";
import { existsSync, readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = join(__dirname, pathname);
    const { ext } = parse(filePath);

    const mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      // add more MIME types according to your needs
    };

    if (existsSync(filePath)) {
      return new Response(readFileSync(filePath), {
        headers: {
          "Content-Type": mimeTypes[ext] || "text/plain",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`http://localhost:${server.port}`);
