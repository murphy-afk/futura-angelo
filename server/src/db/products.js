import { query } from './index.js';

const PRODUCT_COLUMNS = `
  p.id, p.collection_id, p.slug, p.name, p.description, p.image, p.material,
  p.is_featured, p.sort_order`;

const PRODUCT_LIST_SQL = `
  SELECT${PRODUCT_COLUMNS},
         c.slug AS collection_slug,
         c.name AS collection_name
    FROM products p
    JOIN collections c ON c.id = p.collection_id
    WHERE p.published = 1 AND c.published = 1`;

const ORDER_BY = ' ORDER BY p.sort_order, p.name';

// Both filters are optional. A collection filter restricts to one material
// group, an occasion filter keeps only products linked to that ceremony.

export async function listProducts({ collectionSlug, occasionSlug } = {}) {
  const sql = [PRODUCT_LIST_SQL];
  const params = [];

  if (collectionSlug) {
    sql.push(' AND c.slug = ?');
    params.push(collectionSlug);
  }

  if (occasionSlug) {
    sql.push(
      ` AND EXISTS (
            SELECT 1
              FROM product_occasions po
              JOIN occasions o ON o.id = po.occasion_id
             WHERE po.product_id = p.id AND o.slug = ? AND o.published = 1
          )`
    );
    params.push(occasionSlug);
  }

  sql.push(ORDER_BY);
  return query(sql.join(''), params);
}

export async function findProductBySlug(slug) {
  const rows = await query(
    `SELECT${PRODUCT_COLUMNS},
            c.slug AS collection_slug,
            c.name AS collection_name
       FROM products p
       JOIN collections c ON c.id = p.collection_id
      WHERE p.slug = ? AND p.published = 1 AND c.published = 1
      LIMIT 1`,
    [slug]
  );

  return rows[0] || null;
}

export async function listOccasionsForProduct(productId) {
  return query(
    `SELECT o.id, o.slug, o.name
       FROM product_occasions po
       JOIN occasions o ON o.id = po.occasion_id
      WHERE po.product_id = ? AND o.published = 1
      ORDER BY o.sort_order, o.name`,
    [productId]
  );
}
