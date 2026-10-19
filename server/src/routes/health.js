import { Router } from 'express';
import { ping } from '../db/index.js';

const router = Router();

router.get('/health', async (req, res) => {
  let database = false;

  try {
    database = await ping();
  } catch {
    database = false;
  }

  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    database,
    timestamp: new Date().toISOString(),
  });
});

export default router;
