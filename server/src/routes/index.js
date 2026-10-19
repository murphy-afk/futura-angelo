import { Router } from 'express';
import health from './health.js';

const api = Router();

api.use('/', health);

api.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

export default api;
