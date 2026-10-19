import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { config } from './config.js';
import { renderDocument } from './seo/document.js';
import api from './routes/index.js';

// Anything with a file extension is an asset request. Those miss the static
// handler and must fall through to the JSON 404 instead of an HTML document.
function isAssetRequest(pathname) {
  return /\/[^/]*\.[a-z0-9]{2,5}$/i.test(pathname);
}

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  if (config.trustProxy !== false) {
    app.set('trust proxy', config.trustProxy);
  }
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', api);

  // In production Express serves the built React bundle. Every document route
  // is rendered from pages_meta, so the crawler receives a real title,
  // description, canonical URL, Open Graph tags and JSON-LD per URL.
  const distIndex = path.join(config.clientDist, 'index.html');
  if (fs.existsSync(distIndex)) {
    app.use(
      express.static(config.clientDist, {
        index: false,
        maxAge: '1y',
        setHeaders(res, filePath) {
          if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      })
    );

    // Document routes. Real API routes are handled above and never reach here.
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api') || isAssetRequest(req.path)) {
        return next();
      }

      try {
        const document = await renderDocument(req.path);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        return res.status(document.status).send(document.html);
      } catch (error) {
        return next(error);
      }
    });
  }

  app.use((req, res) => {
    res.status(404).json({ error: 'Resource not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Request body too large' });
    }

    const status = error.status || 500;
    if (status >= 500) {
      console.error(error);
    }

    const message =
      status < 500 && error.expose ? error.message : status >= 500 ? 'Internal server error' : 'Invalid request';
    return res.status(status).json({ error: message });
  });

  return app;
}
