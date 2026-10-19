import { notFound } from '../lib/errors.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { findMetaByRoute } from '../db/pagesMeta.js';

// Accepts a route in any of the shapes a client or a crawler might send:
// /contatti, contatti or collezioni/vetro. Stored rows always carry the
// leading slash, so the value is normalized before the lookup.

function normalizeRoute(raw) {
  if (raw === '*') return '*';
  let route = raw.trim();
  if (!route.startsWith('/')) route = `/${route}`;
  if (route.length > 1 && route.endsWith('/')) route = route.slice(0, -1);
  return route;
}

export const getMeta = asyncHandler(async (req, res) => {
  const raw = req.validatedParams.route;
  const meta = await findMetaByRoute(normalizeRoute(raw));
  if (!meta) throw notFound('Meta not found');

  res.json({ meta });
});
