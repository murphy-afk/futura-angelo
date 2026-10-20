import { createContext } from 'react';

// Responses the server has already fetched for the request being rendered.
// The client reads them on its first render, so the markup React hydrates is
// identical to the markup the crawler received, and it skips the fetch it
// would otherwise repeat.

export const DataContext = createContext({});
