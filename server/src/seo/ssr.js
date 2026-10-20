import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { config } from '../config.js';
import { getSettings } from '../db/settings.js';
import { findCollectionBySlug, listCollections, listProductsByCollection } from '../db/collections.js';
import { listOccasions } from '../db/occasions.js';
import { listRetailers } from '../db/retailers.js';

// Server side rendering of the React client. The client build produces an ssr
// bundle beside the dist folder; Express gives it the route plus the data that
// page reads, and it returns the markup the visitor would otherwise fetch
// after hydration. When the bundle is missing or a render throws, renderRoute
// returns null and the document renderer ships the head only template.

const COLLECTION_PREFIX = '/collezioni/';

let cachedRenderer = null;
let cachedMtimeMs = 0;

async function loadRenderer() {
  if (!fs.existsSync(config.ssrEntry)) return null;
  const stat = fs.statSync(config.ssrEntry);
  if (!cachedRenderer || cachedMtimeMs !== stat.mtimeMs) {
    cachedRenderer = await import(`${pathToFileURL(config.ssrEntry).href}?v=${stat.mtimeMs}`);
    cachedMtimeMs = stat.mtimeMs;
  }
  return cachedRenderer;
}

async function loadCollectionDetail(slug) {
  const collection = await findCollectionBySlug(slug);
  if (!collection) return null;
  const products = await listProductsByCollection(collection.id);
  return { collection: { ...collection, products } };
}

// Which API keys each route reads, mirroring the hooks the pages call. An
// unknown path lands on the 404 page, and that page lists collections.

function dataPlan(route) {
  if (route.startsWith(COLLECTION_PREFIX)) {
    return { key: `/collections/${route.slice(COLLECTION_PREFIX.length)}`, load: () => loadCollectionDetail(route.slice(COLLECTION_PREFIX.length)) };
  }
  if (route === '/' || route === '/collezioni') {
    return { key: '/collections', load: async () => ({ collections: await listCollections() }) };
  }
  if (route === '/occasioni' || route === '/contatti') {
    return { key: '/occasions', load: async () => ({ occasions: await listOccasions() }) };
  }
  if (route === '/dove-si-trova') {
    return { key: '/retailers', load: async () => ({ retailers: await listRetailers() }) };
  }
  if (route === '/chi-siamo') return null;
  return { key: '/collections', load: async () => ({ collections: await listCollections() }) };
}

// A prefetch failure must not take the document down: the page then renders
// its loading state and fetches the data on the client, as it did before.

async function collect(route) {
  const data = {};
  const jobs = [
    getSettings()
      .then((settings) => {
        data['/settings'] = { settings };
      })
      .catch((error) => {
        console.error(`Ssr prefetch failed for /settings: ${error.message}`);
      }),
  ];

  const plan = dataPlan(route);
  if (plan) {
    jobs.push(
      plan
        .load()
        .then((payload) => {
          if (payload) data[plan.key] = payload;
        })
        .catch((error) => {
          console.error(`Ssr prefetch failed for ${plan.key}: ${error.message}`);
        })
    );
  }

  await Promise.all(jobs);
  return data;
}

export async function renderRoute(route) {
  const renderer = await loadRenderer();
  if (!renderer || typeof renderer.render !== 'function') return null;

  try {
    const initialData = await collect(route);
    return { markup: renderer.render(route, initialData), initialData };
  } catch (error) {
    console.error(`Ssr render failed for ${route}: ${error.message}`);
    return null;
  }
}
