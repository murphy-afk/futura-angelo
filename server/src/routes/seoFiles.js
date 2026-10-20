import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { buildRobotsTxt, buildSitemapXml } from '../seo/sitemap.js';

// robots.txt and sitemap.xml live at the site root, outside /api, so they are
// mounted before the document catch all, which would otherwise answer any
// path with an extension as a JSON 404.

const router = Router();

router.get('/robots.txt', (req, res) => {
  res.type('text/plain; charset=utf-8').send(buildRobotsTxt());
});

router.get(
  '/sitemap.xml',
  asyncHandler(async (req, res) => {
    const xml = await buildSitemapXml();
    res.type('application/xml; charset=utf-8').send(xml);
  })
);

export default router;
