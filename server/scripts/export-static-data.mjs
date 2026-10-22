// Exports the seed data the static build needs into a committed JSON snapshot,
// so GitHub Pages (or any host with no Node or MySQL) can pre-render the site
// without a database. Read from the same server/src/db layer the API uses, so
// the snapshot can never drift in shape from what the client already consumes.
//
// Run by hand when the data changes, from the repository root:
//
//     npm run data:export
//
// It reads server/.env for the connection, exactly like the running server.
// The output, client/static-data.json, is committed so CI can build the static
// site with no database. Nothing here writes to MySQL.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.resolve(serverDir, '..', 'client', 'static-data.json');

// Imported after the path constants so a bad environment fails with the
// connection error, not a resolution error.
const { getSettings } = await import('../src/db/settings.js');
const { listCollections, listProductsByCollection } = await import('../src/db/collections.js');
const { listOccasions } = await import('../src/db/occasions.js');
const { listRetailers } = await import('../src/db/retailers.js');
const { listMetaRoutes } = await import('../src/db/pagesMeta.js');
const { pool } = await import('../src/db/index.js');

async function buildCollections() {
  const collections = await listCollections();
  // Attach each collection's published products, mirroring the shape the
  // /collections/:slug endpoint returns so the detail page needs no change.
  const withProducts = await Promise.all(
    collections.map(async (collection) => ({
      ...collection,
      products: await listProductsByCollection(collection.id),
    }))
  );
  return withProducts;
}

async function main() {
  const [settings, collections, occasions, retailers, metaRows] = await Promise.all([
    getSettings(),
    buildCollections(),
    listOccasions(),
    listRetailers(),
    listMetaRoutes(),
  ]);

  // Meta rows are keyed by their route, with '*' as the 404 fallback.
  const meta = {};
  for (const row of metaRows) {
    meta[row.route] = {
      route: row.route,
      title: row.title,
      description: row.description,
      og_image: row.og_image,
      canonical: row.canonical,
    };
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    settings,
    collections,
    occasions,
    retailers,
    meta,
  };

  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(
    `Wrote ${outputPath}\n` +
      `  collections: ${collections.length}, products: ${collections.reduce((n, c) => n + c.products.length, 0)}\n` +
      `  occasions: ${occasions.length}, retailers: ${retailers.length}, meta routes: ${metaRows.length}`
  );
}

try {
  await main();
} finally {
  await pool.end();
}
