import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/useApi.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import PhotoSlot from '../components/PhotoSlot.jsx';

export default function CollezioneDettaglio() {
  const { slug } = useParams();
  const { data, loading, error } = useApi(`/collections/${slug}`);
  const collection = data?.collection || null;
  const products = collection?.products || [];

  if (loading) {
    return (
      <main className="page" id="contenuto">
        <div className="container">
          <p className="state-note">Caricamento della collezione in corso.</p>
        </div>
      </main>
    );
  }

  if (error || !collection) {
    return (
      <main className="page" id="contenuto">
        <div className="container">
          <h1>Collezione non trovata</h1>
          <p className="lede">La collezione che cerchi non è disponibile.</p>
          <p className="section__more">
            <Link className="text-link" to="/collezioni">Torna a tutte le collezioni</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page" id="contenuto">
      <section className="section section--first">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Collezioni', to: '/collezioni' }, { label: collection.name }]}></Breadcrumbs>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container split">
          <div className="split__copy">
            <p className="eyebrow">{collection.material}</p>
            <h1>Collezione {collection.name}</h1>
            <p className="lede">{collection.short_description}</p>
            <p>{collection.long_description}</p>
            <ul className="fact-list fact-list--inline">
              <li className="fact-list__item"><span>{collection.line_count}</span> linee</li>
              <li className="fact-list__item"><span>{collection.material}</span> materiale</li>
              <li className="fact-list__item"><span>Made in Italy</span> produzione</li>
            </ul>
            <p className="hero__actions">
              <Link className="button button--primary" to="/contatti">Richiedi informazioni</Link>
              <Link className="button button--ghost" to="/occasioni">Le occasioni</Link>
            </p>
          </div>
          <PhotoSlot className="split__media" src={collection.hero_image} alt={`Bomboniere della collezione ${collection.name} in ${collection.material}`} eager></PhotoSlot>
        </div>
      </section>

      {products.length > 0 && (
        <section className="section section--band">
          <div className="container">
            <div className="section__head">
              <p className="eyebrow">Galleria</p>
              <h2>I prodotti della collezione</h2>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.slug}>
                  <PhotoSlot className="product-card__media" src={product.image} alt={product.name} ratio="square"></PhotoSlot>
                  <h3 className="product-card__title">{product.name}</h3>
                  <p className="product-card__text">{product.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container note-block">
          <h2>Per quali occasioni</h2>
          <p>
            Le linee di questa collezione accompagnano matrimoni, battesimi, comunioni,
            cresime, lauree, nascita e anniversari. La stessa gamma si adatta a più cerimonie,
            così il rivenditore espone un solo campionario per tutto l'anno.
          </p>
          <p className="section__more">
            <Link className="text-link" to="/occasioni">Vedi tutte le occasioni</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
