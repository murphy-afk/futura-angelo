import { Router } from 'express';
import { getOccasions } from '../controllers/occasions.js';

const router = Router();

router.get('/occasions', getOccasions);

export default router;
