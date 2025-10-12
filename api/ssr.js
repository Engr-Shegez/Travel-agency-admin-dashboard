// Vercel serverless adapter for react-router SSR
// Dynamically import the build/server entry (produced by `react-router build`) and
// adapt incoming Node req/res into a Web Request for the SSR handler.
// This file is intentionally CommonJS so Vercel's Node runtime can execute it without extra setup.

const { Readable } = require("stream");

module.exports = async function (req, res) {
  try {
    // Try to synchronously require the built server so Vercel's bundler
    // includes it in the function bundle. Fall back to dynamic import
    // (ESM) if require fails.
    let entry;
    try {
      // Use require to ensure the file is bundled with the lambda
      // when possible (CommonJS runtime).
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      entry = require("../build/server/index.js");
    } catch (reqErr) {
      // Fall back to dynamic import for ESM-built bundles.
      entry = await import("../build/server/index.js");
    }

    // The build's default export should be the SSR handler.
    const handler = entry && (entry.default || entry);
    if (!handler) {
      res.statusCode = 500;
      res.end(
        "SSR handler not found. Ensure `react-router build` ran and produced build/server/index.js"
      );
      return;
    }

    // Construct a Web Fetch Request from the incoming Node request
    const url = new URL(req.url, `https://${req.headers.host}`);
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers || {})) {
      // Node headers may be arrays; Headers expects string or repeated append
      if (Array.isArray(v)) {
        for (const vv of v) headers.append(k, String(vv));
      } else if (v !== undefined) {
        headers.set(k, String(v));
      }
    }

    // For non-GET/HEAD, pass the node request stream as the body
    const body =
      req.method === "GET" || req.method === "HEAD" ? undefined : req;

    const fetchRequest = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
    });

    // Call the SSR handler. Many react-router server entries return a Response
    // when invoked with a Request; the handler may accept additional args, but
    // providing just the Request is compatible with common handlers.
    const response = await handler(fetchRequest).catch(async (err) => {
      // If the handler expected a different signature (older react-router-serve style),
      // try calling with fallback signature used by some generated bundles.
      try {
        return await handler(fetchRequest, 200, new Headers(), {}, {}).catch(
          (e) => {
            throw e;
          }
        );
      } catch (e) {
        throw err;
      }
    });

    if (
      !response ||
      typeof response !== "object" ||
      typeof response.body === "undefined"
    ) {
      res.statusCode = 500;
      res.end("Invalid response from SSR handler");
      return;
    }

    // Copy status and headers
    res.statusCode = response.status || 200;
    try {
      response.headers.forEach((value, key) => res.setHeader(key, value));
    } catch (e) {
      // Some older Response polyfills don't have forEach; iterate keys if necessary
      try {
        for (const [k, v] of Object.entries(response.headers || {}))
          res.setHeader(k, v);
      } catch {}
    }

    // Pipe the response body (which might be a Node stream, a Web ReadableStream, or a string)
    const bodyStream = response.body;
    if (!bodyStream) {
      res.end();
      return;
    }

    // If it's a Web ReadableStream (has getReader), convert to Node stream
    if (typeof bodyStream.getReader === "function") {
      const reader = bodyStream.getReader();
      const nodeStream = Readable.from(
        (async function* () {
          while (true) {
            const { done, value } = await reader.read();
            if (done) return;
            yield value;
          }
        })()
      );
      nodeStream.pipe(res);
      return;
    }

    // If it's already a Node stream
    if (typeof bodyStream.pipe === "function") {
      bodyStream.pipe(res);
      return;
    }

    // Otherwise, try to serialize
    const text = await response.text().catch(() => null);
    if (text !== null) {
      res.end(text);
      return;
    }

    res.end();
  } catch (err) {
    console.error("SSR error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
};
