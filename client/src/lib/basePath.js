// The sub path the site is served under, taken from Vite's base. The dev
// server and a root deployment both use "/", so every helper below is a no-op
// there. A host that serves the site from a folder, such as a GitHub Pages
// project page, gets that folder prefixed onto photo, canonical and route URLs
// so nothing resolves one level too high.

const rawBase = import.meta.env.BASE_URL || '/';

// No trailing slash, so appending a leading-slash path never doubles up.
export const basePath = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

// Prefix a root-relative path with the base. Absolute URLs and protocol
// relative URLs are left alone, they already point where they need to go.
export function withBase(pathname) {
  if (!pathname) return pathname;
  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(pathname)) return pathname;
  if (!pathname.startsWith('/')) return pathname;
  return `${basePath}${pathname}`;
}

// The manifest stores a srcset as "url width, url width". Only the url of each
// pair takes the base, the width descriptor stays as it is.
export function withBaseSrcSet(srcSet) {
  if (!srcSet) return srcSet;
  return srcSet
    .split(',')
    .map((candidate) => {
      const parts = candidate.trim().split(/\s+/);
      if (parts.length === 0) return '';
      const [url, ...descriptor] = parts;
      const prefixed = withBase(url);
      return descriptor.length > 0 ? `${prefixed} ${descriptor.join(' ')}` : prefixed;
    })
    .filter(Boolean)
    .join(', ');
}

// React Router wants the basename without a trailing slash. An empty string
// means the site sits at the root and the router needs no basename at all.
export const routerBasename = basePath;
