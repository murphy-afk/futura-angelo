import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import PhotoSlot from '../components/PhotoSlot.jsx';
import { useSettings } from '../lib/useApi.js';

export default function ChiSiamo() {
  const { settings } = useSettings();

  const ownerName = settings?.owner_name || '';
  const legalName = settings?.shop_legal_name || 'Futura di Lacalamita Angelo';
  const lede = 'Futura produce e distribuisce bomboniere, oggetti regalo e articoli presenti in tutta Italia, e conquista con la stessa velocità il mercato internazionale.';

  return (
    <main className="page" id="contenuto">
      <PageIntro eyebrow="Dal 1992 a Milano" title="Chi siamo" lede={lede}></PageIntro>

      <section className="section">
        <div className="container prose-layout">
          <div className="prose">
            <h2>Il campionario, pensato per creare la differenza</h2>
            <p>
              Ciò che distingue Futura è il campionario: una selezione di campioni costruita per
              distinguere il negozio che la espone. Chi investe nel campionario può mostrarlo e
              venderlo per più stagioni senza altre spese, perché le collezioni restano
              disponibili nel tempo.
            </p>
            <p>
              La produzione è rigorosamente made in Italy. Forma, decoro e materiale restano
              sempre un passo avanti, e le linee sanno portare i colori e le forme delle
              tendenze correnti sull'oggetto, in linea con le scelte dell'arredamento italiano e
              della moda.
            </p>

            <h2>I punti di forza</h2>
            <ul className="check-list">
              <li>Prodotti rigorosamente made in Italy.</li>
              <li>Una gamma sempre avanti su forma, decoro e materiale.</li>
              <li>Collezioni disponibili per più stagioni, senza ricompere del campionario.</li>
              <li>Colori e forme delle tendenze portati sull'oggetto.</li>
            </ul>

            <h2>La bomboniera del divorzio, 1992</h2>
            <p>
              Nella primavera del 1992 Futura disegnò la bomboniera del divorzio, un oggetto
              descritto come trasgressivo e provocatorio. La settimanale L'Espresso e il
              telegiornale TG2 ne parlarono, e la storia crebbe quando un noto calciatore di
              Serie A la usò per festeggiare il ritrovato stato di libero.
            </p>
            <p>
              È l'unica copertura stampa verificata che il negozio possiede, arrivata da un
              settimanale nazionale e da una rete televisiva nazionale, ed è il tratto che più
              di ogni altro ci distingue.
            </p>

            <h2>Chi c'è dietro Futura</h2>
            <p>
              Futura di Lacalamita Angelo lavora nel settore delle bomboniere da oltre
              trent'anni, con uno showroom in Via Novara a Milano aperto tutti i giorni
              della settimana.
            </p>
            {ownerName && <p className="signature">{ownerName}</p>}

            <p className="section__more">
              <Link className="text-link" to="/contatti">Contattaci per il campionario</Link>
            </p>
          </div>

          <aside className="prose-aside">
            <PhotoSlot className="prose-aside__media" src="/photos/glass-bowl-crystal-lotus-lid.jpg" alt="Il campionario Futura aperto sui modelli in vetro e cristallo" ratio="portrait" sizes="(max-width: 900px) 100vw, 320px"></PhotoSlot>
            <dl className="fact-list">
              <div className="fact-list__row">
                <dt>Ragione sociale</dt>
                <dd>{legalName}</dd>
              </div>
              <div className="fact-list__row">
                <dt>Attività</dt>
                <dd>Produzione e distribuzione di bomboniere</dd>
              </div>
              <div className="fact-list__row">
                <dt>Linee a catalogo</dt>
                <dd>37 in sei collezioni</dd>
              </div>
              <div className="fact-list__row">
                <dt>Showroom</dt>
                <dd>Milano, Via Novara</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}
