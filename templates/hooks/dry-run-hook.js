#!/usr/bin/env node

const message = [
  "AICT dry-run hook:",
  "This sample hook only prints risk reminders.",
  "It does not block, upload, or modify files by default."
].join("
");

console.log(message);
