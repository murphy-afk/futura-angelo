import { Link } from 'react-router-dom';
import { useApi } from '../lib/useApi.js';
import PageIntro from '../components/PageIntro.jsx';

export default function Occasioni() {
  const { data, loading, error } = useApi('/occasions');
  const occasions = data?.occasions || [];
  const lede = 'Matrimonio, battesimo, comunione, cresima, laurea, nascita, anniversario: ogni cerimonia ha il suo ricordo, e ogni ricordo trova la sua bomboniera.';

  return (
    <main className="page" id="contenuto">
      <PageIntro eyebrow="Le cerimonie" title="Occasioni" lede={lede}></PageIntro>

      <section className="section">
        <div className="container">
          {loading && <p className="state-note">Caricamento delle occasioni in corso.</p>}
          {error && <p className="state-note">Non è stato possibile caricare le occasioni.</p>}

          <div className="occasion-grid">
            {occasions.map((occasion) => (
              <article className="occasion-card" key={occasion.slug}>
                <h2 className="occasion-card__title">{occasion.name}</h2>
                <p className="occasion-card__text">{occasion.description}</p>
                <p className="occasion-card__more">
                  <Link className="text-link" to="/collezioni">Guarda le collezioni</Link>
                </p>
              </article>
            ))}
          </div>

          <div className="note-block">
            <h2>Serve un consiglio?</h2>
            <p>
              Raccontaci la cerimonia e il numero degli ospiti, ti indichiamo le linee più adatte
              e il punto vendita che ti può servire.
            </p>
            <p className="section__more">
              <Link className="text-link" to="/contatti">Scrivici</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
