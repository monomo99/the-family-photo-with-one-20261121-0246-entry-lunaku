// The Family Photo With One Machine Member.
// Writes the entry photograph to /output/entry.png.
//
// The photograph: a candid family kitchen scene at golden hour — a mother
// peeling a carrot and her daughter stirring a pot at a wooden counter,
// while the household's one machine member, a small cream home robot,
// stands at the counter reaching toward the pot mid-task, like something
// that already lives there. Observed details: a carrot on the counter,
// a dog bowl, mismatched wooden chairs. No text or lettering in frame.
//
// The image is baked into this repository as family-photo.png (a PNG
// generated for this entry). This program copies it to /output/entry.png
// after validating it against the competition gate: a whole PNG, at most
// 1,048,576 bytes, at most 1024 by 1024 pixels. No network is used.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576;
const MAX_DIMENSION = 1024;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fail(message: string): never {
  throw new Error(`family-photo entry: ${message}`);
}

function readPngDimensions(data: Buffer): { width: number; height: number } {
  if (data.length < 24 || !data.subarray(0, 8).equals(PNG_MAGIC)) {
    fail("source is not a PNG (bad magic bytes)");
  }
  // A whole PNG ends with the 12-byte IEND chunk: length 0, "IEND", CRC.
  const tail = data.subarray(data.length - 12);
  if (tail.readUInt32BE(0) !== 0 || tail.subarray(4, 8).toString("ascii") !== "IEND") {
    fail("source PNG is truncated (no IEND trailer)");
  }
  // IHDR chunk: 8-byte magic, then length (4) + "IHDR" (4) at bytes 12-15,
  // then width (4 BE) + height (4 BE).
  if (data.subarray(12, 16).toString("ascii") !== "IHDR") {
    fail("source PNG has no IHDR chunk where expected");
  }
  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  return { width, height };
}

function validatePng(data: Buffer, label: string): { width: number; height: number } {
  if (data.length > MAX_BYTES) {
    fail(`${label} is ${data.length} bytes, over the 1,048,576 byte cap`);
  }
  const { width, height } = readPngDimensions(data);
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    fail(`${label} is ${width}x${height}, over the 1024x1024 cap`);
  }
  if (width === 0 || height === 0) {
    fail(`${label} has a zero dimension`);
  }
  return { width, height };
}

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(here, "family-photo.png");
  if (!existsSync(sourcePath)) {
    fail(`source image missing: ${sourcePath}`);
  }

  const image = readFileSync(sourcePath);
  const { width, height } = validatePng(image, "family-photo.png");

  const outDir = "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.png");
  writeFileSync(outPath, image);

  // Read it back and re-validate: the file the judge sees must be the
  // same whole PNG we checked.
  const written = readFileSync(outPath);
  if (!written.equals(image)) {
    fail("written entry.png differs from the validated source");
  }
  const checked = validatePng(written, "entry.png");

  console.log(
    `wrote ${outPath}: ${checked.width}x${checked.height}, ${written.length} bytes`
  );
}

main();
