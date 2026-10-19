import { Router } from 'express';
import { getRetailers } from '../controllers/retailers.js';

const router = Router();

router.get('/retailers', getRetailers);

export default router;
