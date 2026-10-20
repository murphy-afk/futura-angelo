import { useEffect, useState } from 'react';
import { apiGet } from './api.js';

// Thin data hooks over the public API. Every page reads the seed data through
// these, so the client never writes its own fetch code.

export function useApi(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
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
  }, [path]);

  return state;
}

// Settings are read by the header and the footer, so the request is cached at
// module level and the two components share a single round trip.

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
  const [state, setState] = useState({ settings: null, loading: true, error: null });

  useEffect(() => {
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
  }, []);

  return state;
}
