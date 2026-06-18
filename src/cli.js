import { readDoctorInput, formatDoctorReport } from "./doctor.js";
import { runInit } from "./init.js";
import { runDemo } from "./demo.js";

export async function runCli(argv, io = { stdout: process.stdout, stderr: process.stderr }) {
  const parsed = parseArgs(argv);
  if (parsed.flags.noNetwork) {
    process.env.AICT_NO_NETWORK = "1";
  }

  const [command, subcommand] = parsed.positionals;
  if (!command && parsed.flags.uninstall) {
    io.stdout.write(runInit(parsed.flags));
    return;
  }
  if (!command || command === "help" || parsed.flags.help) {
    io.stdout.write(helpText());
    return;
  }

  if (command === "doctor" && subcommand === "basic") {
    const input = readDoctorInput(parsed.options);
    io.stdout.write(formatDoctorReport({ ...input, flags: parsed.flags }));
    return;
  }

  if (command === "init") {
    io.stdout.write(runInit(parsed.flags));
    return;
  }

  if (command === "demo") {
    io.stdout.write(runDemo(parsed.flags));
    return;
  }

  throw new Error("Unknown command: " + parsed.positionals.join(" "));
}

export function parseArgs(argv) {
  const flags = { dryRun: false, noNetwork: false, explain: false, uninstall: false, help: false };
  const options = { input: null, inputFile: null };
  const positionals = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") flags.dryRun = true;
    else if (arg === "--no-network") flags.noNetwork = true;
    else if (arg === "--explain") flags.explain = true;
    else if (arg === "--uninstall") flags.uninstall = true;
    else if (arg === "--help" || arg === "-h") flags.help = true;
    else if (arg === "--input") options.input = argv[++index] ?? "";
    else if (arg === "--input-file") options.inputFile = argv[++index] ?? "";
    else positionals.push(arg);
  }
  return { flags, options, positionals };
}

function helpText() {
  return [
    "AI Collaboration Toolkit Community",
    "Usage:",
    "  aict init [--dry-run] [--uninstall] [--explain] [--no-network]",
    "  aict doctor basic [--input text | --input-file file] [--explain] [--no-network]",
    "  aict demo [--explain] [--no-network]",
    "",
  ].join("\n");
}
