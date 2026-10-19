import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';
import { findMetaForPath } from '../db/pagesMeta.js';
import { getSettings } from '../db/settings.js';
import { findCollectionBySlug } from '../db/collections.js';
import { breadcrumbList, localBusiness, organization } from './jsonLd.js';

// Per route HTML renderer. Express hands it a path, it reads title,
// description, canonical and og image from pages_meta, adds JSON-LD built
// from settings, and injects everything into the React build template.
// The crawler therefore receives a real document, React hydrates the same
// markup for the visitor.

const templatePath = path.resolve(config.clientDist, 'index.html');

const FIXED_LABELS = {
  '/': 'Home',
  '/chi-siamo': 'Chi siamo',
  '/collezioni': 'Collezioni',
  '/occasioni': 'Occasioni',
  '/dove-si-trova': 'Dove si trova',
  '/contatti': 'Contatti',
};

let cachedTemplate = null;

// The template changes only when the client is rebuilt, so the mtime check
// keeps a running server from serving asset links from an old build.

function loadTemplate() {
  const stat = fs.statSync(templatePath);
  if (!cachedTemplate || cachedTemplate.mtimeMs !== stat.mtimeMs) {
    cachedTemplate = {
      mtimeMs: stat.mtimeMs,
      html: fs.readFileSync(templatePath, 'utf8'),
    };
  }
  return cachedTemplate.html;
}

function normalizePath(pathname) {
  let route = typeof pathname === 'string' && pathname ? pathname : '/';
  if (!route.startsWith('/')) route = `/${route}`;
  if (route.length > 1 && route.endsWith('/')) route = route.slice(0, -1);
  return route;
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttribute(value) {
  return escapeText(value).replace(/"/g, '&quot;');
}

function absoluteUrl(value, publicUrl) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${publicUrl}${value.startsWith('/') ? '' : '/'}${value}`;
}

function buildHead({ title, description, canonical, ogImage, siteName, jsonLd }) {
  const lines = [];
  lines.push(`<title>${escapeText(title)}</title>`);
  if (description) {
    lines.push(`<meta name="description" content="${escapeAttribute(description)}" />`);
  }
  if (canonical) {
    lines.push(`<link rel="canonical" href="${escapeAttribute(canonical)}" />`);
  }
  lines.push('<meta property="og:type" content="website" />');
  lines.push(`<meta property="og:site_name" content="${escapeAttribute(siteName)}" />`);
  lines.push('<meta property="og:locale" content="it_IT" />');
  lines.push(`<meta property="og:title" content="${escapeAttribute(title)}" />`);
  if (description) {
    lines.push(`<meta property="og:description" content="${escapeAttribute(description)}" />`);
  }
  if (canonical) {
    lines.push(`<meta property="og:url" content="${escapeAttribute(canonical)}" />`);
  }
  if (ogImage) {
    lines.push(`<meta property="og:image" content="${escapeAttribute(ogImage)}" />`);
  }
  if (jsonLd) {
    lines.push(`<script type="application/ld+json">${jsonLd}</script>`);
  }
  return lines.join('\n    ');
}

function applyHead(template, head) {
  const titleTag = /<title>[\s\S]*?<\/title>/;
  if (titleTag.test(template)) {
    return template.replace(titleTag, () => head);
  }
  return template.replace('</head>', () => `${head}\n  </head>`);
}

async function buildBreadcrumbs(route) {
  if (route === '/') return null;

  const segments = route.split('/').filter(Boolean);
  const items = [{ label: 'Home', path: '/' }];
  let accumulated = '';

  for (let index = 0; index < segments.length; index += 1) {
    accumulated += `/${segments[index]}`;
    let label = FIXED_LABELS[accumulated];

    // A collection detail page shows the material name, read from the
    // database rather than guessed from the slug.
    if (!label && segments[index - 1] === 'collezioni') {
      const collection = await findCollectionBySlug(segments[index]);
      label = collection ? collection.name : segments[index];
    }

    if (!label) label = segments[index];
    items.push({ label, path: accumulated });
  }

  return items;
}

async function buildJsonLd(route, settings, publicUrl) {
  const nodes = [];

  if (route === '/') nodes.push(localBusiness(settings, publicUrl));
  if (route === '/chi-siamo') nodes.push(organization(settings, publicUrl));

  const items = await buildBreadcrumbs(route);
  if (items) nodes.push(breadcrumbList(items, publicUrl));

  if (nodes.length === 0) return null;
  // Escape the angle bracket so a value can never close the script element.
  return JSON.stringify(nodes).replace(/</g, '\\u003c');
}

export async function renderDocument(pathname) {
  const route = normalizePath(pathname);

  const [meta, settings] = await Promise.all([findMetaForPath(route), getSettings()]);

  // No row at all means the seed scripts have not been run yet. The template
  // still renders, without invented metadata.
  if (!meta) {
    return { html: loadTemplate(), status: 404 };
  }

  // The '*' row is the 404 document: real copy, but the response status
  // stays 404 so crawlers never index it.
  const status = meta.route === '*' ? 404 : 200;
  const publicUrl = (config.publicUrl || '').replace(/\/$/, '');

  const canonical =
    status === 200 && meta.canonical ? absoluteUrl(meta.canonical, publicUrl) : null;
  const ogImage = meta.og_image ? absoluteUrl(meta.og_image, publicUrl) : null;
  const jsonLd = status === 200 ? await buildJsonLd(route, settings, publicUrl) : null;

  const head = buildHead({
    title: meta.title,
    description: meta.description,
    canonical,
    ogImage,
    siteName: settings.shop_name || 'Futura',
    jsonLd,
  });

  return { html: applyHead(loadTemplate(), head), status };
}
