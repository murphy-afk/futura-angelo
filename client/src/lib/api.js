const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function apiGet(path) {
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
