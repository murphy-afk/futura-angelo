import { query } from './index.js';

// Points of sale. Bomboniere are sold only through these shops, so the list
// is public. The showroom itself is always the first row.

export async function listRetailers() {
  return query(
    `SELECT id, name, city, address, region, phone, website,
            latitude, longitude, is_showroom, sort_order
       FROM retailers
      WHERE published = 1
      ORDER BY is_showroom DESC, sort_order, city`
  );
}
