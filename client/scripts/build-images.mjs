// Image pipeline. Reads the photographs as delivered by the owner from
// client/photos, listed in client/photos/index.json, and writes web ready
// files into client/public/photos: AVIF and WebP at several widths plus a
// JPEG fallback, with the largest JPEG of each photo kept as the canonical
// file the database points at.
//
// The script also writes client/src/lib/photo-manifest.json, which the
// PhotoSlot component reads to build the picture element with srcset, sizes
// and the intrinsic width and height of every photo.
//
// Run it by hand with `npm run images` from the repository root. It is not
// part of the Vite build, so the generated files stay stable between builds.

import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const clientDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(clientDir, 'photos');
const outputDir = path.join(clientDir, 'public', 'photos');
const manifestPath = path.join(clientDir, 'src', 'lib', 'photo-manifest.json');

// Widths offered through srcset. A width is skipped when the source photo is
// narrower than it, so a small photo is never enlarged.
const widths = [480, 820, 1280, 1920];
// Width of the canonical JPEG, the file the database stores as the image path.
const canonicalWidth = 1280;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function loadIndex() {
  const raw = await readFile(path.join(sourceDir, 'index.json'), 'utf8');
  const entries = JSON.parse(raw);

  if (!Array.isArray(entries)) {
    throw new Error('client/photos/index.json must be a list of photo entries');
  }

  for (const entry of entries) {
    if (!entry.slug || !slugPattern.test(entry.slug)) {
      throw new Error(`Bad slug "${entry.slug}", use lower case words joined by hyphens`);
    }
    if (!entry.source) {
      throw new Error(`Photo "${entry.slug}" has no source file`);
    }
    if (!entry.alt || entry.alt.trim().length < 10) {
      throw new Error(`Photo "${entry.slug}" needs an Italian alt text describing the object`);
    }
  }

  const slugs = entries.map((entry) => entry.slug);
  const duplicated = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  if (duplicated.length > 0) {
    throw new Error(`Duplicated slug: ${duplicated[0]}`);
  }

  return entries;
}

async function buildPhoto(entry) {
  const input = path.join(sourceDir, entry.source);
  const base = sharp(input).rotate();
  const metadata = await sharp(input).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Cannot read the size of ${entry.source}`);
  }

  const targetWidths = widths.filter((width) => width < metadata.width);
  targetWidths.push(Math.min(canonicalWidth, metadata.width));

  const canonicalFile = `${entry.slug}.jpg`;
  const canonicalPipeline = await base
    .clone()
    .resize({ width: canonicalWidth, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  await writeFile(path.join(outputDir, canonicalFile), canonicalPipeline.data);

  const avifSet = [];
  const webpSet = [];
  const jpgSet = [];

  for (const width of targetWidths) {
    const resized = () => base.clone().resize({ width, withoutEnlargement: true });
    // The canonical JPEG is already written at this width and the srcset names
    // it, so encoding a width suffixed copy would only leave an unreferenced
    // duplicate of the same picture on disk.
    const usesCanonical = width === canonicalPipeline.info.width;

    const [avif, webp, jpg] = await Promise.all([
      resized().avif({ quality: 60, effort: 4 }).toBuffer(),
      resized().webp({ quality: 78 }).toBuffer(),
      usesCanonical ? null : resized().jpeg({ quality: 80, mozjpeg: true }).toBuffer(),
    ]);

    const writes = [
      writeFile(path.join(outputDir, `${entry.slug}-${width}.avif`), avif),
      writeFile(path.join(outputDir, `${entry.slug}-${width}.webp`), webp),
    ];
    if (jpg) {
      writes.push(writeFile(path.join(outputDir, `${entry.slug}-${width}.jpg`), jpg));
    }
    await Promise.all(writes);

    avifSet.push(`/photos/${entry.slug}-${width}.avif ${width}w`);
    webpSet.push(`/photos/${entry.slug}-${width}.webp ${width}w`);
    if (usesCanonical) {
      jpgSet.push(`/photos/${canonicalFile} ${width}w`);
    } else {
      jpgSet.push(`/photos/${entry.slug}-${width}.jpg ${width}w`);
    }
  }

  return {
    [`/photos/${canonicalFile}`]: {
      alt: entry.alt.trim(),
      width: canonicalPipeline.info.width,
      height: canonicalPipeline.info.height,
      fallback: `/photos/${canonicalFile}`,
      avif: avifSet.join(', '),
      webp: webpSet.join(', '),
      jpg: jpgSet.join(', '),
    },
  };
}

async function main() {
  const entries = await loadIndex();

  await mkdir(outputDir, { recursive: true });
  // The output folder holds generated files only, so it can be emptied
  // safely. The README that documents the folder is written back after.
  const keep = new Set(['README.md']);
  for (const file of await readdir(outputDir)) {
    if (!keep.has(file)) {
      await rm(path.join(outputDir, file));
    }
  }

  const manifest = {};
  // One photo at a time, so a failure names the photo that broke.
  for (const entry of entries) {
    Object.assign(manifest, await buildPhoto(entry));
  }

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const files = (await readdir(outputDir)).length;
  console.log(`Built ${entries.length} photos into ${files} files, manifest updated.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
