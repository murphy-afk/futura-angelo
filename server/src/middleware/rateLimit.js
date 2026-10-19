// Fixed window rate limiter kept in memory, no external store. The site runs
// as a single Node process, so a Map keyed by client IP is enough. If the app
// ever moves to several processes this has to become a shared store.

export function rateLimit({ windowMs, max, message = 'Too many requests, try again later.' }) {
  const hits = new Map();

  const sweeper = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (now - entry.start >= windowMs) hits.delete(key);
    }
  }, windowMs);
  sweeper.unref?.();

  return function limiter(req, res, next) {
    const key = req.ip || 'unknown';
    const now = Date.now();

    let entry = hits.get(key);
    if (!entry || now - entry.start >= windowMs) {
      entry = { start: now, count: 0 };
      hits.set(key, entry);
    }
    entry.count += 1;

    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ error: message });
    }

    return next();
  };
}
