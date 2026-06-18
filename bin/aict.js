#!/usr/bin/env node

import { runCli } from "../src/cli.js";

runCli(process.argv.slice(2)).catch((error) => {
  console.error("aict error: " + error.message);
  process.exitCode = 1;
});
