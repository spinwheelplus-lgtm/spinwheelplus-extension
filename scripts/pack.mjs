import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { crc32 as zlibCrc32, deflateRawSync, inflateRawSync } from "node:zlib";

const TARGETS = ["chrome", "edge", "firefox", "source"];
const SKIP_SOURCE_DIRS = new Set(["node_modules", "dist", "release"]);
const STORE_HINT = {
  chrome: "Upload this zip in the Chrome Web Store developer dashboard.",
  edge: "Upload this zip in the Microsoft Edge Add-ons partner center.",
  firefox: "Upload this zip on addons.mozilla.org (AMO).",
  source: "Upload this zip as Firefox AMO source code (not the store file).",
};

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const target = process.argv[2];
const applyOnly = process.argv.includes("--apply-only");

if (!TARGETS.includes(target)) {
  console.error(`Usage: node scripts/pack.mjs <${TARGETS.join("|")}> [--apply-only]`);
  process.exit(1);
}

if (target === "source") {
  if (applyOnly) {
    console.error("source does not support --apply-only");
    process.exit(1);
  }
  packSource();
  process.exit(0);
}

const dist = path.join(root, "dist");
const sourceManifest = path.join(root, "manifests", `${target}.json`);
const destManifest = path.join(dist, "manifest.json");

copyFileSync(sourceManifest, destManifest);
console.log(`Applied manifests/${target}.json -> dist/manifest.json`);

if (applyOnly) {
  process.exit(0);
}

const releaseDir = path.join(root, "release");
const zipName = `spinwheelplus-${target}.zip`;
const zipPath = path.join(releaseDir, zipName);
const storeHint =
  target === "edge"
    ? STORE_HINT.edge
    : target === "firefox"
      ? STORE_HINT.firefox
      : STORE_HINT.chrome;

mkdirSync(releaseDir, { recursive: true });
rmSync(zipPath, { force: true });

const files = listFiles(dist).map((file) => stampStorePack(file, target));
writeZip(files, zipPath);
assertPosixZipNames(zipPath);
assertStorePack(zipPath, target);

console.log(`Packed ${zipPath}`);
console.log(`store-pack.json in zip: ${target}`);
console.log(storeHint);

function packSource() {
  const releaseDir = path.join(root, "release");
  const zipPath = path.join(releaseDir, "spinwheelplus-firefox-source.zip");
  mkdirSync(releaseDir, { recursive: true });
  rmSync(zipPath, { force: true });
  const files = listFiles(root, "", SKIP_SOURCE_DIRS);
  if (files.length === 0) {
    throw new Error("Source zip would be empty");
  }
  writeZip(files, zipPath);
  assertPosixZipNames(zipPath);
  console.log(`Packed ${zipPath}`);
  console.log(STORE_HINT.source);
}

function stampStorePack(file, packTarget) {
  if (file.rel !== "store-pack.json" || packTarget === "chrome") return file;
  return {
    ...file,
    data: Buffer.from(`${JSON.stringify({ pack: packTarget })}\n`, "utf8"),
  };
}

function listFiles(dir, prefix = "", skipDirs = new Set()) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    if (skipDirs.has(name)) {
      continue;
    }
    const abs = path.join(dir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    if (statSync(abs).isDirectory()) {
      out.push(...listFiles(abs, rel, skipDirs));
    } else {
      out.push({ abs, rel });
    }
  }
  return out;
}

function fileCrc32(buf) {
  return typeof zlibCrc32 === "function" ? zlibCrc32(buf) >>> 0 : crc32Fallback(buf);
}

function crc32Fallback(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUInt16LE(target, offset, value) {
  target.writeUInt16LE(value, offset);
}

function writeUInt32LE(target, offset, value) {
  target.writeUInt32LE(value, offset);
}

/** ZIP spec requires `/` in entry names. PowerShell Compress-Archive writes `\` and AMO rejects it. */
function writeZip(files, destPath) {
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const file of files) {
    const { abs, rel } = file;
    if (rel.includes("\\")) {
      throw new Error(`Refusing Windows path in zip entry: ${rel}`);
    }

    const data = file.data ?? readFileSync(abs);
    const deflated = deflateRawSync(data);
    const store = deflated.length >= data.length;
    const payload = store ? data : deflated;
    const method = store ? 0 : 8;
    const crc = fileCrc32(data);
    const nameBuf = Buffer.from(rel, "utf8");

    const local = Buffer.alloc(30);
    writeUInt32LE(local, 0, 0x04034b50);
    writeUInt16LE(local, 4, 20);
    writeUInt16LE(local, 6, 0);
    writeUInt16LE(local, 8, method);
    writeUInt16LE(local, 10, 0);
    writeUInt16LE(local, 12, 0);
    writeUInt32LE(local, 14, crc);
    writeUInt32LE(local, 18, payload.length);
    writeUInt32LE(local, 22, data.length);
    writeUInt16LE(local, 26, nameBuf.length);
    writeUInt16LE(local, 28, 0);

    const localHeader = Buffer.concat([local, nameBuf, payload]);
    locals.push(localHeader);

    const central = Buffer.alloc(46);
    writeUInt32LE(central, 0, 0x02014b50);
    writeUInt16LE(central, 4, 20);
    writeUInt16LE(central, 6, 20);
    writeUInt16LE(central, 8, 0);
    writeUInt16LE(central, 10, method);
    writeUInt16LE(central, 12, 0);
    writeUInt16LE(central, 14, 0);
    writeUInt32LE(central, 16, crc);
    writeUInt32LE(central, 20, payload.length);
    writeUInt32LE(central, 24, data.length);
    writeUInt16LE(central, 28, nameBuf.length);
    writeUInt16LE(central, 30, 0);
    writeUInt16LE(central, 32, 0);
    writeUInt16LE(central, 34, 0);
    writeUInt16LE(central, 36, 0);
    writeUInt32LE(central, 38, 0);
    writeUInt32LE(central, 42, offset);
    centrals.push(Buffer.concat([central, nameBuf]));

    offset += localHeader.length;
  }

  const centralDir = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  writeUInt32LE(eocd, 0, 0x06054b50);
  writeUInt16LE(eocd, 4, 0);
  writeUInt16LE(eocd, 6, 0);
  writeUInt16LE(eocd, 8, files.length);
  writeUInt16LE(eocd, 10, files.length);
  writeUInt32LE(eocd, 12, centralDir.length);
  writeUInt32LE(eocd, 16, offset);
  writeUInt16LE(eocd, 20, 0);

  writeFileSync(destPath, Buffer.concat([...locals, centralDir, eocd]));
}

function assertStorePack(destPath, packTarget) {
  const packed = JSON.parse(readZipEntry(readFileSync(destPath), "store-pack.json")).pack;
  if (packed !== packTarget) {
    throw new Error(`store-pack.json in zip is ${packed}, expected ${packTarget}`);
  }
  const distPack = JSON.parse(readFileSync(path.join(dist, "store-pack.json"), "utf8")).pack;
  if (distPack !== "chrome") {
    throw new Error("dist/store-pack.json must stay chrome");
  }
}

function readZipEntry(data, entryName) {
  let idx = 0;
  while (idx + 30 <= data.length && data.readUInt32LE(idx) === 0x04034b50) {
    const method = data.readUInt16LE(idx + 8);
    const compSize = data.readUInt32LE(idx + 18);
    const nameLen = data.readUInt16LE(idx + 26);
    const extraLen = data.readUInt16LE(idx + 28);
    const name = data.subarray(idx + 30, idx + 30 + nameLen).toString("utf8");
    const start = idx + 30 + nameLen + extraLen;
    const payload = data.subarray(start, start + compSize);
    if (name === entryName) {
      if (method === 0) return payload.toString("utf8");
      if (method === 8) return inflateRawSync(payload).toString("utf8");
      throw new Error(`Unsupported zip method ${method} for ${entryName}`);
    }
    idx = start + compSize;
  }
  throw new Error(`Missing ${entryName} in zip`);
}

function assertPosixZipNames(destPath) {
  const data = readFileSync(destPath);
  let idx = 0;
  let found = 0;
  while (true) {
    const i = data.indexOf(Buffer.from("PK\x01\x02"), idx);
    if (i < 0) {
      break;
    }
    const nameLen = data.readUInt16LE(i + 28);
    const name = data.subarray(i + 46, i + 46 + nameLen).toString("utf8");
    if (name.includes("\\") || name.startsWith("/") || name.includes("..")) {
      throw new Error(`Invalid zip entry name: ${JSON.stringify(name)}`);
    }
    found += 1;
    idx = i + 1;
  }
  if (found === 0) {
    throw new Error(`Zip has no central-directory entries: ${destPath}`);
  }
}
