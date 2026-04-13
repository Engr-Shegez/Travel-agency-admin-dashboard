import { createRequestListener } from "@react-router/node";
import { existsSync } from "node:fs";
import type { RequestListener } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

let listenerPromise: Promise<RequestListener> | null = null;

const createListener = async () => {
  const serverBuildPath = path.resolve(process.cwd(), "build/server/index.js");

  if (!existsSync(serverBuildPath)) {
    throw new Error(
      "Missing build/server/index.js. Make sure Vercel runs `npm run build` before invoking the serverless function."
    );
  }

  const build = await import(pathToFileURL(serverBuildPath).href);

  return createRequestListener({
    build,
  });
};

export default async function handler(req: any, res: any) {
  try {
    listenerPromise ??= createListener();
    const listener = await listenerPromise;
    return listener(req, res);
  } catch (error) {
    listenerPromise = null;
    console.error("Failed to initialize Vercel server handler:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
