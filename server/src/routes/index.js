import { Router } from 'express';
import health from './health.js';
import settings from './settings.js';
import collections from './collections.js';
import products from './products.js';
import occasions from './occasions.js';
import retailers from './retailers.js';
import meta from './meta.js';
import leads from './leads.js';

const api = Router();

api.use('/', health);
api.use('/', settings);
api.use('/', collections);
api.use('/', products);
api.use('/', occasions);
api.use('/', retailers);
api.use('/', meta);
api.use('/leads', leads);

api.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

export default api;
