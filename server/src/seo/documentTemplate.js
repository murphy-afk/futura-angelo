// Pure document assembly. No database, no Express, no config import, so the
// same head, Open Graph and JSON-LD markup can be produced by the running
// server and by the static build that publishes to a host with no Node or
// MySQL. document.js reads the data and calls into here; the static build
// reads a committed snapshot and calls the same functions.

import { breadcrumbList, localBusiness, organization } from './jsonLd.js';

const FIXED_LABELS = {
  '/': 'Home',
  '/chi-siamo': 'Chi siamo',
  '/collezioni': 'Collezioni',
  '/occasioni': 'Occasioni',
  '/dove-si-trova': 'Dove si trova',
  '/contatti': 'Contatti',
};

export function normalizePath(pathname) {
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

export function absoluteUrl(value, publicUrl) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${publicUrl}${value.startsWith('/') ? '' : '/'}${value}`;
}

export function buildHead({ title, description, canonical, ogImage, siteName, jsonLd }) {
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

export function applyHead(template, head) {
  const titleTag = /<title>[\s\S]*?<\/title>/;
  if (titleTag.test(template)) {
    return template.replace(titleTag, () => head);
  }
  return template.replace('</head>', () => `${head}\n  </head>`);
}

// The rendered body goes inside the root element and the data the page was
// rendered from goes into a global, so the first client render reads the same
// values instead of refetching. A callback replacer keeps dollar sequences in
// the markup and in the JSON out of the replacement string.

export function applyBody(template, markup, initialData) {
  const dataJson = JSON.stringify(initialData)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const withData = template.replace(
    '</body>',
    () => `    <script>window.__INITIAL_DATA__ = ${dataJson};</script>\n  </body>`
  );

  if (!markup) return withData;
  return withData.replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`);
}

// A collection detail page shows the material name, read from the data rather
// than guessed from the slug. The resolver is injected so the server can back
// it with a query and the static build with a snapshot.

async function buildBreadcrumbs(route, resolveCollectionName) {
  if (route === '/') return null;

  const segments = route.split('/').filter(Boolean);
  const items = [{ label: 'Home', path: '/' }];
  let accumulated = '';

  for (let index = 0; index < segments.length; index += 1) {
    accumulated += `/${segments[index]}`;
    let label = FIXED_LABELS[accumulated];

    if (!label && segments[index - 1] === 'collezioni') {
      label = (await resolveCollectionName(segments[index])) || segments[index];
    }

    if (!label) label = segments[index];
    items.push({ label, path: accumulated });
  }

  return items;
}

async function buildJsonLd(route, settings, publicUrl, resolveCollectionName) {
  const nodes = [];

  if (route === '/') nodes.push(localBusiness(settings, publicUrl));
  if (route === '/chi-siamo') nodes.push(organization(settings, publicUrl));

  const items = await buildBreadcrumbs(route, resolveCollectionName);
  if (items) nodes.push(breadcrumbList(items, publicUrl));

  if (nodes.length === 0) return null;
  // Escape the angle bracket so a value can never close the script element.
  return JSON.stringify(nodes).replace(/</g, '\\u003c');
}

// Assemble one document from already loaded data. Returns the html plus the
// status the caller should answer with, 404 for the '*' fallback row and for
// a path that has no metadata at all.

export async function assembleDocument({
  route,
  meta,
  settings,
  publicUrl,
  template,
  markup,
  initialData,
  resolveCollectionName,
}) {
  // No row at all means the seed scripts have not been run yet. The template
  // still renders, without invented metadata.
  if (!meta) {
    return { html: template, status: 404 };
  }

  // The '*' row is the 404 document: real copy, but the response status
  // stays 404 so crawlers never index it.
  const status = meta.route === '*' ? 404 : 200;
  const origin = (publicUrl || '').replace(/\/$/, '');

  const canonical = status === 200 && meta.canonical ? absoluteUrl(meta.canonical, origin) : null;
  const ogImage = meta.og_image ? absoluteUrl(meta.og_image, origin) : null;
  const jsonLd = status === 200 ? await buildJsonLd(route, settings, origin, resolveCollectionName) : null;

  const head = buildHead({
    title: meta.title,
    description: meta.description,
    canonical,
    ogImage,
    siteName: settings.shop_name || 'Futura',
    jsonLd,
  });

  const html = applyBody(applyHead(template, head), markup, initialData);
  return { html, status };
}
