/**
 * Extract text from a PDF file/URL and format it into cutoff data.
 *
 * Usage:
 *   node scripts/extract-pdf.mjs <pdf-file-path>
 *   node scripts/extract-pdf.mjs <pdf-url>
 */

import { createRequire } from "module";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: node scripts/extract-pdf.mjs <path-to-pdf>");
  console.error("       node scripts/extract-pdf.mjs <pdf-url>");
  process.exit(1);
}

async function main() {
  let buffer;

  if (arg.startsWith("http")) {
    console.error("Downloading PDF...");
    const res = await fetch(arg);
    buffer = Buffer.from(await res.arrayBuffer());
  } else {
    buffer = readFileSync(resolve(arg));
  }

  console.error("Extracting text...");
  const data = await pdfParse(buffer);
  const text = data.text;

  console.log("\n// ── Raw PDF text ──\n");
  console.log(text);

  console.error(`\nExtracted ${text.length} chars`);
  console.error("\nCopy the raw output above and format into /src/lib/cutoff.ts");
  console.error("Or paste it here and I'll structure it for you.");
}

main().catch(console.error);
