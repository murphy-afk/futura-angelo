import { config } from '../config.js';
import { listCollections } from '../db/collections.js';

// Sitemap and robots file, generated from published data. Only routes that
// actually exist as documents are listed, so no product or occasion URL is
// invented while those pages are still unbuilt.

const STATIC_ROUTES = ['/', '/chi-siamo', '/collezioni', '/occasioni', '/dove-si-trova', '/contatti'];

function publicOrigin() {
  return (config.publicUrl || '').replace(/\/$/, '');
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function buildSitemapXml() {
  const origin = publicOrigin();
  const collections = await listCollections();

  const locations = [
    ...STATIC_ROUTES.map((route) => `${origin}${route === '/' ? '/' : route}`),
    ...collections.map((collection) => `${origin}/collezioni/${collection.slug}`),
  ];

  const entries = locations.map((loc) => `  <url><loc>${escapeXml(loc)}</loc></url>`);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}

export function buildRobotsTxt() {
  const origin = publicOrigin();
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n');
}
