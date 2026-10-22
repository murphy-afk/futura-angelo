import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataProvider } from './lib/dataProvider.jsx';
import { basePath, routerBasename } from './lib/basePath.js';
import App from './App.jsx';

// Server entry. Express and the static build load the built copy of this file
// and ask it for the body of each document request, so the crawler and the
// visitor start from the same markup and React hydrates it instead of
// rendering over it. Callers pass a root relative route; the basename is
// prepended here so StaticRouter sees the full path it matches against, the
// same way the browser's address bar carries it.

export function render(url, initial) {
  // The 404 page is rendered for the literal '*'. Any other route already
  // begins with a slash, so only that one needs one added to stay a valid path
  // under the basename.
  const route = url === '*' ? '/*' : url;
  const location = routerBasename ? `${basePath}${route}` : route;

  return renderToString(
    <DataProvider initial={initial}>
      <StaticRouter basename={routerBasename} location={location}>
        <App></App>
      </StaticRouter>
    </DataProvider>
  );
}
