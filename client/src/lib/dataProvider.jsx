import { DataContext } from './dataContext.js';

// Hands the prefetched responses to the tree. Mounted once in main.jsx for the
// client and once in entry-server.jsx for the server render. The same object
// is also stashed on the window so the data layer can answer navigations from
// what the document already carries, which is what lets the site run on a host
// with no API at all.

export function DataProvider({ initial, children }) {
  if (typeof window !== 'undefined') {
    window.__INITIAL_DATA__ = initial;
  }
  return <DataContext.Provider value={initial}>{children}</DataContext.Provider>;
}
