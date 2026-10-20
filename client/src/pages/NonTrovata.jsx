import { Link } from 'react-router-dom';
import { useApi } from '../lib/useApi.js';

export default function NonTrovata() {
  const { data } = useApi('/collections');
  const collections = data?.collections || [];

  return (
    <main className="page" id="contenuto">
      <div className="container not-found">
        <p className="eyebrow">Errore 404</p>
        <h1>Pagina non trovata</h1>
        <p className="lede">
          La pagina che cerchi non esiste più oppure ha cambiato indirizzo. Da qui puoi
          ripartire verso il catalogo.
        </p>

        <div className="not-found__links">
          <Link className="button button--primary" to="/">Torna alla home</Link>
          <Link className="button button--ghost" to="/collezioni">Vedi le collezioni</Link>
        </div>

        {collections.length > 0 && (
          <div className="not-found__collections">
            <h2>Le collezioni</h2>
            <ul className="not-found__list">
              {collections.map((collection) => (
                <li className="not-found__item" key={collection.slug}>
                  <Link to={`/collezioni/${collection.slug}`}>{collection.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
