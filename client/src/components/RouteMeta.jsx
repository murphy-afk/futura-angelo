import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { apiGet } from '../lib/api.js';

// Keeps the document head in step with client side navigation. On a direct
// load Express has already written the head for that URL, so the first render
// skips the request and only later navigations ask the meta API. The head the
// visitor sees therefore never drifts from the head the crawler was served.

function ensureHeadTag(selector, create) {
  const existing = document.head.querySelector(selector);
  if (existing) return existing;
  const tag = create();
  document.head.appendChild(tag);
  return tag;
}

function setMetaContent(selector, attribute, key, value) {
  const tag = ensureHeadTag(selector, () => {
    const element = document.createElement('meta');
    element.setAttribute(attribute, key);
    return element;
  });
  tag.setAttribute('content', value);
}

function applyMeta(meta) {
  if (meta.title) document.title = meta.title;
  if (meta.description) setMetaContent('meta[name="description"]', 'name', 'description', meta.description);

  const canonical = document.head.querySelector('link[rel="canonical"]');
  if (meta.canonical) {
    const link = canonical || ensureHeadTag('link[rel="canonical"]', () => {
      const element = document.createElement('link');
      element.setAttribute('rel', 'canonical');
      return element;
    });
    link.setAttribute('href', new URL(meta.canonical, window.location.origin).toString());
  } else if (canonical) {
    canonical.remove();
  }

  if (meta.title) setMetaContent('meta[property="og:title"]', 'property', 'og:title', meta.title);
  if (meta.description) setMetaContent('meta[property="og:description"]', 'property', 'og:description', meta.description);
}

export default function RouteMeta() {
  const location = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }

    let active = true;
    const requestPath = `/meta/${encodeURIComponent(location.pathname)}`;

    apiGet(requestPath)
      .catch(() => apiGet('/meta/%2A'))
      .then((response) => {
        if (active) applyMeta(response.meta);
      })
      .catch(() => {
        // A navigation with no meta at all keeps the current head.
      });

    return () => {
      active = false;
    };
  }, [location.pathname]);

  return null;
}
