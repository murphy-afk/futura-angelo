import { query } from './index.js';

const COLLECTION_COLUMNS = `
  id, slug, name, material, line_count, short_description, long_description,
  hero_image, cover_image, sort_order`;

const PRODUCT_COLUMNS = `
  p.id, p.collection_id, p.slug, p.name, p.description, p.image, p.material,
  p.is_featured, p.sort_order`;

export async function listCollections() {
  return query(
    `SELECT${COLLECTION_COLUMNS}
       FROM collections
      WHERE published = 1
      ORDER BY sort_order, name`
  );
}

export async function findCollectionBySlug(slug) {
  const rows = await query(
    `SELECT${COLLECTION_COLUMNS}
       FROM collections
      WHERE slug = ? AND published = 1
      LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
}

export async function listProductsByCollection(collectionId) {
  return query(
    `SELECT${PRODUCT_COLUMNS}
       FROM products p
      WHERE p.collection_id = ? AND p.published = 1
      ORDER BY p.sort_order, p.name`,
    [collectionId]
  );
}
