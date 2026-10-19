import { Router } from 'express';
import { getProduct, getProducts } from '../controllers/products.js';
import { validateParams, validateQuery } from '../middleware/validate.js';

const router = Router();
const slugParams = { slug: { kind: 'slug', required: true, max: 120 } };
const listQuery = {
  collection: { kind: 'slug', max: 120 },
  occasion: { kind: 'slug', max: 120 },
};

router.get('/products', validateQuery(listQuery), getProducts);
router.get('/products/:slug', validateParams(slugParams), getProduct);

export default router;
