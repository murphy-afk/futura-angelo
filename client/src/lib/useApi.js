import { useContext, useEffect, useState } from 'react';
import { apiGet } from './api.js';
import { DataContext } from './dataContext.js';

// Thin data hooks over the public API. Every page reads the seed data through
// these, so the client never writes its own fetch code. A response the server
// prefetched for this request short circuits the fetch on both the server
// render and the first client render.

export function useApi(path) {
  const initial = useContext(DataContext);
  const preloaded = initial ? initial[path] : undefined;

  const [state, setState] = useState(() =>
    preloaded ? { data: preloaded, loading: false, error: null } : { data: null, loading: true, error: null }
  );

  useEffect(() => {
    if (preloaded) {
      setState({ data: preloaded, loading: false, error: null });
      return undefined;
    }

    let active = true;
    setState({ data: null, loading: true, error: null });

    apiGet(path)
      .then((response) => {
        if (active) setState({ data: response, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error });
      });

    return () => {
      active = false;
    };
  }, [path, preloaded]);

  return state;
}

// Settings are read by the header and the footer, so once the response is not
// already prefetched the request is cached at module level and both
// components share a single round trip.

let settingsPromise = null;

function loadSettings() {
  if (!settingsPromise) {
    settingsPromise = apiGet('/settings')
      .then((response) => response.settings)
      .catch((error) => {
        settingsPromise = null;
        throw error;
      });
  }

  return settingsPromise;
}

export function useSettings() {
  const initial = useContext(DataContext);
  const preloaded = initial ? initial['/settings'] : undefined;

  const [state, setState] = useState(() =>
    preloaded
      ? { settings: preloaded.settings, loading: false, error: null }
      : { settings: null, loading: true, error: null }
  );

  useEffect(() => {
    if (preloaded) {
      setState({ settings: preloaded.settings, loading: false, error: null });
      return undefined;
    }

    let active = true;

    loadSettings()
      .then((settings) => {
        if (active) setState({ settings, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ settings: null, loading: false, error });
      });

    return () => {
      active = false;
    };
  }, [preloaded]);

  return state;
}
