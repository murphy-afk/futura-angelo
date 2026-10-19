import { query } from './index.js';

const META_COLUMNS = 'route, title, description, og_image, canonical';

// Row used by the HTML renderer for every path that has no exact match.
// Seeded by db/sql/003_pages_meta_404.sql with the route key '*'.

export async function findMetaByRoute(route) {
  const rows = await query(
    `SELECT ${META_COLUMNS}
       FROM pages_meta
      WHERE route = ?
      LIMIT 1`,
    [route]
  );
  return rows[0] || null;
}

export async function findMetaForPath(pathname) {
  const exact = await findMetaByRoute(pathname);
  if (exact) return exact;
  return findMetaByRoute('*');
}

export async function listMetaRoutes() {
  return query(`SELECT ${META_COLUMNS} FROM pages_meta ORDER BY route`);
}
