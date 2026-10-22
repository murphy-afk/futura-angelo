// Renders the whole site to static HTML so it can be published to a host with
// no Node and no MySQL, such as GitHub Pages. It reads the committed snapshot
// written by export-static-data.mjs and the client build (dist for the shell,
// dist-ssr for the render function), then writes one index.html per route into
// client/dist plus a 404.html, sitemap.xml and robots.txt.
//
// Every page is given the same complete data map, not just the keys its own
// route reads. A visitor who lands on the home page and then clicks through to
// a collection must not find a spinner: the navigation resolves from data
// already in the document instead of calling an API that does not exist on a
// static host. The map also carries the /meta/... keys the client asks for when
// it changes the document head during navigation.
//
// Run by hand after the client build, from the repository root:
//
//     npm run build:static
//
// PUBLIC_URL must be the deployed origin including any sub path, for example
// https://murphy-afk.github.io/futura-angelo. It drives canonical, Open Graph
// and the sitemap. VITE_BASE must match the sub path the host serves under.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { assembleDocument, normalizePath } from '../src/seo/documentTemplate.js';
import { renderRobotsTxt, renderSitemapXml } from '../src/seo/sitemap.js';

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = path.resolve(serverDir, '..', 'client');
const distDir = path.join(clientDir, 'dist');
const ssrEntry = path.join(clientDir, 'dist-ssr', 'entry-server.js');
const snapshotPath = path.join(clientDir, 'static-data.json');

// The routes the site actually documents. A collection detail page is added
// for every published collection below, so no URL is invented here.
const STATIC_ROUTES = ['/', '/chi-siamo', '/collezioni', '/occasioni', '/dove-si-trova', '/contatti'];

function readPublicUrl() {
  const value = (process.env.PUBLIC_URL || '').trim().replace(/\/$/, '');
  if (!/^https?:\/\//i.test(value)) {
    throw new Error(
      'PUBLIC_URL must be the deployed origin including any sub path, for example https://murphy-afk.github.io/futura-angelo'
    );
  }
  return value;
}

// The base path the host serves under, taken from VITE_BASE so the file layout
// and the client agree. It is only used to check that PUBLIC_URL agrees with
// it, which is the mistake that silently breaks every asset on a sub path.

function readBasePath() {
  const raw = process.env.VITE_BASE || '/';
  return raw.endsWith('/') ? raw : `${raw}/`;
}

function assertBaseMatchesPublicUrl(baseUrl, publicUrl) {
  const origin = new URL(publicUrl);
  const expected = `${origin.pathname.endsWith('/') ? origin.pathname : `${origin.pathname}/`}`;
  if (expected !== baseUrl) {
    throw new Error(
      `VITE_BASE (${baseUrl}) does not match the path part of PUBLIC_URL (${expected}). ` +
        'Set both from the same sub path, for example VITE_BASE=/futura-angelo/ and PUBLIC_URL=https://murphy-afk.github.io/futura-angelo'
    );
  }
}

// The data map every page receives, keyed by the API path the client requests.
// It mirrors the endpoints the Express server exposes, so the React tree reads
// the same shapes with or without a server.

function buildDataMap(snapshot) {
  const data = {
    '/settings': { settings: snapshot.settings },
    '/collections': { collections: snapshot.collections },
    '/occasions': { occasions: snapshot.occasions },
    '/retailers': { retailers: snapshot.retailers },
  };

  for (const collection of snapshot.collections) {
    data[`/collections/${collection.slug}`] = { collection };
  }

  // RouteMeta asks for the head of the route it is navigating to, encoded as a
  // single segment, and falls back to the '*' row when a path has none.
  for (const [route, meta] of Object.entries(snapshot.meta)) {
    data[`/meta/${encodeURIComponent(route)}`] = { meta };
  }
  data['/meta/%2A'] = { meta: snapshot.meta['*'] };

  return data;
}

// Breadcrumb labels come from the data, never guessed from the slug.

function makeCollectionResolver(snapshot) {
  const bySlug = new Map(snapshot.collections.map((collection) => [collection.slug, collection.name]));
  return (slug) => bySlug.get(slug) || null;
}

// Where a route's document lands inside dist. The root route is index.html at
// the top, everything else is a folder so the host serves it at a clean path.

function outputFilesForRoute(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  return path.join(distDir, ...route.slice(1).split('/'), 'index.html');
}

async function renderRouteDocument({ route, snapshot, dataMap, template, publicUrl, renderer, resolveCollectionName }) {
  const meta = snapshot.meta[route] || snapshot.meta['*'];
  const rendered = renderer.render(route, dataMap);

  return assembleDocument({
    route,
    meta,
    settings: snapshot.settings,
    publicUrl,
    template,
    markup: rendered,
    initialData: dataMap,
    resolveCollectionName,
  });
}

async function main() {
  const publicUrl = readPublicUrl();
  const baseUrl = readBasePath();
  assertBaseMatchesPublicUrl(baseUrl, publicUrl);

  if (!fs.existsSync(ssrEntry)) {
    throw new Error(`Missing ${ssrEntry}. Run the client build before build:static.`);
  }
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    throw new Error(`Missing ${path.join(distDir, 'index.html')}. Run the client build before build:static.`);
  }

  const [snapshot, template, rendererModule] = await Promise.all([
    readFile(snapshotPath, 'utf8').then(JSON.parse),
    readFile(path.join(distDir, 'index.html'), 'utf8'),
    import(pathToFileURL(ssrEntry).href),
  ]);

  const renderer = rendererModule.default || rendererModule;
  if (typeof renderer.render !== 'function') {
    throw new Error('The SSR bundle does not export a render function.');
  }

  const dataMap = buildDataMap(snapshot);
  const resolveCollectionName = makeCollectionResolver(snapshot);

  const routes = new Set(STATIC_ROUTES);
  for (const collection of snapshot.collections) {
    routes.add(`/collezioni/${collection.slug}`);
  }

  const written = [];
  for (const route of routes) {
    const document = await renderRouteDocument({
      route,
      snapshot,
      dataMap,
      template,
      publicUrl,
      renderer,
      resolveCollectionName,
    });

    const outputFile = outputFilesForRoute(route);
    await mkdir(path.dirname(outputFile), { recursive: true });
    await writeFile(outputFile, document.html, 'utf8');
    written.push(path.relative(distDir, outputFile));
  }

  // The 404 document. GitHub Pages serves 404.html for any path that has no
  // file, so this is what a visitor sees on an unknown address. Its canonical
  // stays empty because the '*' row carries none, and the status the crawler
  // sees is the host's own 404.
  const notFoundDocument = await renderRouteDocument({
    route: '*',
    snapshot,
    dataMap,
    template,
    publicUrl,
    renderer,
    resolveCollectionName,
  });
  await writeFile(path.join(distDir, '404.html'), notFoundDocument.html, 'utf8');
  written.push('404.html');

  const origin = publicUrl;
  const collectionRoutes = snapshot.collections.map((collection) => collection.slug);
  await writeFile(path.join(distDir, 'sitemap.xml'), renderSitemapXml(origin, collectionRoutes), 'utf8');
  await writeFile(path.join(distDir, 'robots.txt'), renderRobotsTxt(origin), 'utf8');
  written.push('sitemap.xml', 'robots.txt');

  console.log(`Static site written to ${distDir}`);
  console.log(`  routes: ${routes.size}, plus 404.html, sitemap.xml, robots.txt`);
  console.log(`  public url: ${publicUrl}`);
  console.log(`  files: ${written.length}`);
}

try {
  await main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
