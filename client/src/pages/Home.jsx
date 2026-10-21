import { Link } from 'react-router-dom';
import { useApi, useSettings } from '../lib/useApi.js';
import CollectionCard from '../components/CollectionCard.jsx';
import PhotoSlot from '../components/PhotoSlot.jsx';

export default function Home() {
  const { settings } = useSettings();
  const { data, loading, error } = useApi('/collections');
  const collections = data?.collections || [];

  const rating = settings?.google_rating_value;
  const ratingCount = settings?.google_rating_count;

  return (
    <main className="page" id="contenuto">
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Futura, Milano</p>
            <h1>Bomboniere e articoli da regalo, made in Italy</h1>
            <p className="lede">
              Futura produce e distribuisce bomboniere, oggetti regalo e articoli presenti in
              tutta Italia, con il campionario pensato per creare la differenza.
            </p>
            <p className="hero__actions">
              <Link className="button button--primary" to="/collezioni">Scopri le collezioni</Link>
              <Link className="button button--ghost" to="/contatti">Sei un operatore del settore?</Link>
            </p>
          </div>
          <PhotoSlot className="hero__media" src={settings?.hero_image} alt="Interno dello showroom Futura con bomboniere esposte" sizes="(max-width: 900px) 100vw, 620px" eager></PhotoSlot>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Il campionario</p>
            <h2>Sei collezioni, 37 linee</h2>
            <p className="section__text">
              Argento, vetro, cristallo, porcellana, orologi da tavolo in vetro dipinto e stile
              Murano. Ogni linea resta disponibile per più stagioni, così il campionario si
              investe una sola volta.
            </p>
          </div>

          {loading && <p className="state-note">Caricamento delle collezioni in corso.</p>}
          {error && <p className="state-note">Non è stato possibile caricare le collezioni.</p>}

          <div className="collection-grid">
            {collections.map((collection) => <CollectionCard key={collection.slug} collection={collection} />)}
          </div>

          <p className="section__more">
            <Link className="text-link" to="/collezioni">Vedi tutte le collezioni</Link>
          </p>
        </div>
      </section>

      <section className="section section--band">
        <div className="container split">
          <div className="split__copy">
            <p className="eyebrow">Dal 1992</p>
            <h2>La bomboniera del divorzio</h2>
            <p>
              Nella primavera del 1992 Futura disegnò la bomboniera del divorzio, definita
              trasgressiva e provocatoria. La settimanale L'Espresso e il telegiornale TG2 ne
              parlarono, e la storia crebbe quando un noto calciatore di Serie A la usò per
              festeggiare il ritrovato stato di libero.
            </p>
            <p className="section__more">
              <Link className="text-link" to="/chi-siamo">Leggi la storia di Futura</Link>
            </p>
          </div>
          {/* Photo slot: a related bomboniera shot stands in until the 1992
              archive photograph of the divorce bomboniera is supplied. */}
          <PhotoSlot className="split__media" src="/photos/red-pyramid-favour-boxes.jpg" alt="Bomboniera Futura in vetro colorato" ratio="square" sizes="(max-width: 900px) 100vw, 620px"></PhotoSlot>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ul className="facts">
            <li className="fact">
              <span className="fact__value">37</span>
              <span className="fact__label">linee a catalogo</span>
            </li>
            <li className="fact">
              <span className="fact__value">6</span>
              <span className="fact__label">collezioni per materiale</span>
            </li>
            <li className="fact">
              <span className="fact__value">30+</span>
              <span className="fact__label">anni di attività</span>
            </li>
            {rating && ratingCount && (
              <li className="fact">
                <span className="fact__value">{rating}</span>
                <span className="fact__label">su 5, {ratingCount} recensioni Google</span>
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="section section--band">
        <div className="container band-cta">
          <div>
            <p className="eyebrow">Operatori del settore</p>
            <h2>Vuoi diventare un punto vendita esclusivista?</h2>
            <p className="section__text">
              Le bomboniere Futura si acquistano solo presso i punti vendita indicati da noi.
              Sei un rivenditore o un titolare di negozio, contattaci per presentare il
              campionario nella tua città.
            </p>
          </div>
          <p className="band-cta__actions">
            <Link className="button button--primary" to="/contatti">Richiedi informazioni</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
