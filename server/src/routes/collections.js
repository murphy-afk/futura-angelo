import { Router } from 'express';
import { getCollection, getCollections } from '../controllers/collections.js';
import { validateParams } from '../middleware/validate.js';

const router = Router();
const slugParams = { slug: { kind: 'slug', required: true, max: 120 } };

router.get('/collections', getCollections);
router.get('/collections/:slug', validateParams(slugParams), getCollection);

export default router;
