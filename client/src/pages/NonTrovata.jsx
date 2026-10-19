import { Link } from 'react-router-dom';

export default function NonTrovata() {
  return (
    <main className="page">
      <div className="container">
        <p className="eyebrow">Errore 404</p>
        <h1>Pagina non trovata</h1>
        <p className="lede">
          La pagina che cerchi non esiste. Torna al <Link to="/">sito</Link> o alle{" "}
          <Link to="/collezioni">collezioni</Link>.
        </p>
      </div>
    </main>
  );
}
