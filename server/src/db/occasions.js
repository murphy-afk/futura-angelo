import { query } from './index.js';

const OCCASION_COLUMNS = 'id, slug, name, description, image, sort_order';

export async function listOccasions() {
  return query(
    `SELECT ${OCCASION_COLUMNS}
       FROM occasions
      WHERE published = 1
      ORDER BY sort_order, name`
  );
}

export async function findOccasionBySlug(slug) {
  const rows = await query(
    `SELECT ${OCCASION_COLUMNS}
       FROM occasions
      WHERE slug = ? AND published = 1
      LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
}
