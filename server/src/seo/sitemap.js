import { config } from '../config.js';
import { listCollections } from '../db/collections.js';

// Sitemap and robots file, generated from published data. Only routes that
// actually exist as documents are listed, so no product or occasion URL is
// invented while those pages are still unbuilt.
//
// The pure builders take their data as arguments, so the static export can
// reuse them from a committed snapshot with no database. The exported
// buildSitemapXml and buildRobotsTxt wrap them with a database read for the
// running server.

const STATIC_ROUTES = ['/', '/chi-siamo', '/collezioni', '/occasioni', '/dove-si-trova', '/contatti'];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderSitemapXml(origin, collectionRoutes) {
  const locations = [
    ...STATIC_ROUTES.map((route) => `${origin}${route === '/' ? '/' : route}`),
    ...collectionRoutes.map((slug) => `${origin}/collezioni/${slug}`),
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

export function renderRobotsTxt(origin) {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n');
}

function publicOrigin() {
  return (config.publicUrl || '').replace(/\/$/, '');
}

export async function buildSitemapXml() {
  const collections = await listCollections();
  return renderSitemapXml(publicOrigin(), collections.map((collection) => collection.slug));
}

export function buildRobotsTxt() {
  return renderRobotsTxt(publicOrigin());
}
