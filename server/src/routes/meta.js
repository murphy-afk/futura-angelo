import { Router } from 'express';
import { getMeta } from '../controllers/meta.js';
import { validateParams } from '../middleware/validate.js';

// Two shapes are accepted: /api/meta/%2Fcontatti, where the route arrives as a
// single encoded segment, and /api/meta/collezioni/vetro, where the slashes
// arrive raw and are captured by the wildcard.

const router = Router();
const routeParams = {
  route: { kind: 'string', required: true, max: 190, pattern: /^\/?[a-z0-9\-/]*$/i },
};

function fromWildcard(req, res, next) {
  if (req.params.route === undefined && typeof req.params[0] === 'string') {
    req.params.route = req.params[0];
  }
  return next();
}

router.get('/meta/:route', validateParams(routeParams), getMeta);
router.get('/meta/*', fromWildcard, validateParams(routeParams), getMeta);

export default router;
