import { createRequestHandler } from "@react-router/express";
import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const app = express();

app.use(express.static("build/client"));

const build = require("../build/server/index.js");

app.all(
  "*",
  createRequestHandler({
    build,
  }),
);

export default app;
