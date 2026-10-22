import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { DataProvider } from './lib/dataProvider.jsx';
import { routerBasename } from './lib/basePath.js';
import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';

// A document Express has already rendered arrives with a body and the prefetched
// data that produced it, so React hydrates it. A dev server request arrives
// empty and React renders it from scratch.

const initial = window.__INITIAL_DATA__ || {};
const rootElement = document.getElementById('root');

const app = (
  <DataProvider initial={initial}>
    <BrowserRouter basename={routerBasename}>
      <App></App>
    </BrowserRouter>
  </DataProvider>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <StrictMode>{app}</StrictMode>);
} else {
  createRoot(rootElement).render(<StrictMode>{app}</StrictMode>);
}
