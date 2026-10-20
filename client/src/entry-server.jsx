import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataProvider } from './lib/dataProvider.jsx';
import App from './App.jsx';

// Server entry. Express loads the built copy of this file and asks it for the
// body of each document request, so the crawler and the visitor start from the
// same markup and React hydrates it instead of rendering over it.

export function render(url, initial) {
  return renderToString(
    <DataProvider initial={initial}>
      <StaticRouter location={url}>
        <App></App>
      </StaticRouter>
    </DataProvider>
  );
}
