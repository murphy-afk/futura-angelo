import { Router } from 'express';
import { createLead } from '../controllers/leads.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

// The only public write endpoint on the site. Everything about it is
// defensive: a rate limit per IP, a honeypot field and server side schema
// validation. `sito_web` is the honeypot, it stays hidden in the form.

const leadSchema = {
  type: { kind: 'enum', values: ['privato', 'rivenditore'], default: 'privato' },
  name: { kind: 'string', required: true, min: 2, max: 160 },
  email: { kind: 'email', required: true, max: 190 },
  phone: { kind: 'string', max: 40 },
  occasion: { kind: 'string', max: 80 },
  message: { kind: 'string', required: true, min: 5, max: 5000 },
  sito_web: { kind: 'string', max: 255 },
};

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Too many submissions, please try again later.',
});

router.post('/', limiter, validateBody(leadSchema), createLead);

export default router;
