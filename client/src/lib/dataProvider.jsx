import { DataContext } from './dataContext.js';

// Hands the prefetched responses to the tree. Mounted once in main.jsx for the
// client and once in entry-server.jsx for the server render.

export function DataProvider({ initial, children }) {
  return <DataContext.Provider value={initial}>{children}</DataContext.Provider>;
}
