import { Router } from 'express';
import { getSettingsHandler } from '../controllers/settings.js';

const router = Router();

router.get('/settings', getSettingsHandler);

export default router;
