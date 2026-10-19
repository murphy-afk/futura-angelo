import { query } from './index.js';

export async function listOccasions() {
  return query(
    `SELECT id, slug, name, description, sort_order
       FROM occasions
      WHERE published = 1
      ORDER BY sort_order, name`
  );
}

export async function findOccasionBySlug(slug) {
  const rows = await query(
    `SELECT id, slug, name, description, sort_order
       FROM occasions
      WHERE slug = ? AND published = 1
      LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
}
