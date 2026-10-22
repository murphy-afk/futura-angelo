const API_BASE = import.meta.env.VITE_API_BASE || '';

// The document DataProvider mounts carries every response the site was
// rendered from. A static host has no /api, so a navigation is answered from
// this map when it holds the key. On a server deployment the map holds only
// what the current route prefetched, so anything else still goes to the API.
function preloaded(path) {
  if (typeof window === 'undefined') return undefined;
  const data = window.__INITIAL_DATA__;
  return data && Object.prototype.hasOwnProperty.call(data, path) ? data[path] : undefined;
}

export async function apiGet(path) {
  const cached = preloaded(path);
  if (cached) return cached;

  const response = await fetch(`${API_BASE}/api${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function apiPost(path, body) {
  const response = await fetch(`${API_BASE}/api${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Submit failed with status ${response.status}`);
  }

  return response.json();
}
