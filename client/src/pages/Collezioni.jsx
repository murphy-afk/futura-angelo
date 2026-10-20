import { Link } from 'react-router-dom';
import { useApi } from '../lib/useApi.js';
import CollectionCard from '../components/CollectionCard.jsx';
import PageIntro from '../components/PageIntro.jsx';

export default function Collezioni() {
  const { data, loading, error } = useApi('/collections');
  const collections = data?.collections || [];

  const totalLines = collections.reduce((total, collection) => total + (collection.line_count || 0), 0);
  const lede = totalLines
    ? `Sei collezioni per materiale, ${totalLines} linee in tutto: dalla selezione che si mostra in negozio al pezzo singolo che chiude la cerimonia.`
    : 'Sei collezioni per materiale, dalla selezione che si mostra in negozio al pezzo singolo che chiude la cerimonia.';

  return (
    <main className="page" id="contenuto">
      <PageIntro eyebrow="Il catalogo" title="Le collezioni" lede={lede}></PageIntro>

      <section className="section">
        <div className="container">
          {loading && <p className="state-note">Caricamento delle collezioni in corso.</p>}
          {error && <p className="state-note">Non è stato possibile caricare le collezioni.</p>}

          <div className="collection-grid">
            {collections.map((collection) => <CollectionCard key={collection.slug} collection={collection} />)}
          </div>

          <div className="note-block">
            <h2>Come si acquistano</h2>
            <p>
              Le bomboniere Futura si acquistano esclusivamente presso i punti vendita indicati
              da noi, per garantire qualità, cortesia e servizio. Per vedere il campionario dal
              vivo, vi indichiamo il rivenditore più vicino.
            </p>
            <p className="section__more">
              <Link className="text-link" to="/dove-si-trova">Trova il punto vendita</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
