import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';
import { findMetaForPath } from '../db/pagesMeta.js';
import { getSettings } from '../db/settings.js';
import { findCollectionBySlug } from '../db/collections.js';
import { renderRoute } from './ssr.js';
import { assembleDocument, normalizePath } from './documentTemplate.js';

// Per route HTML renderer. Express hands it a path, it reads title,
// description, canonical and og image from pages_meta, adds JSON-LD built
// from settings, and injects everything plus the rendered React body into the
// build template. The crawler therefore receives the same document the visitor
// sees, and React hydrates that markup instead of replacing it.
//
// The head and JSON-LD markup itself lives in documentTemplate.js, which has
// no database import, so the static build can reuse it. This module only reads
// the data and hands it to the shared assembler.

const templatePath = path.resolve(config.clientDist, 'index.html');

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

// Backs the breadcrumb label for a collection detail page with a query, so the
// trail shows the material name instead of the raw slug.

async function resolveCollectionName(slug) {
  const collection = await findCollectionBySlug(slug);
  return collection ? collection.name : null;
}

export async function renderDocument(pathname) {
  const route = normalizePath(pathname);

  const [meta, settings] = await Promise.all([findMetaForPath(route), getSettings()]);
  const rendered = await renderRoute(route);

  return assembleDocument({
    route,
    meta,
    settings,
    publicUrl: config.publicUrl,
    template: loadTemplate(),
    markup: rendered ? rendered.markup : '',
    initialData: rendered ? rendered.initialData : {},
    resolveCollectionName,
  });
}
