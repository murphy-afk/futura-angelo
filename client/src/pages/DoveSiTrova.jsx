import { Link } from 'react-router-dom';
import { useApi, useSettings } from '../lib/useApi.js';
import { DAY_LABELS, formatHours } from '../lib/hours.js';
import PageIntro from '../components/PageIntro.jsx';

function buildMapUrl(lat, lng) {
  const south = (Number(lat) - 0.004).toFixed(6);
  const north = (Number(lat) + 0.004).toFixed(6);
  const west = (Number(lng) - 0.005).toFixed(6);
  const east = (Number(lng) + 0.005).toFixed(6);
  const bbox = `${west}%2C${south}%2C${east}%2C${north}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function buildMapLink(lat, lng) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
}

export default function DoveSiTrova() {
  const { settings } = useSettings();
  const { data, loading, error } = useApi('/retailers');
  const retailers = data?.retailers || [];
  const lede = 'Lo showroom di Milano è aperto tutti i giorni della settimana. Le bomboniere si acquistano presso i punti vendita indicati da Futura.';

  const street = settings?.address_street || '';
  const zip = settings?.address_zip || '';
  const city = settings?.address_city || '';
  const lat = settings?.geo_lat;
  const lng = settings?.geo_lng;
  const hours = settings?.hours || {};
  const hasMap = Boolean(lat && lng);

  return (
    <main className="page" id="contenuto">
      <PageIntro eyebrow="Showroom e punti vendita" title="Dove si trova" lede={lede}></PageIntro>

      <section className="section">
        <div className="container location-grid">
          <div className="location-info">
            <h2>Lo showroom</h2>
            <address className="location-info__address">
              <span>Futura di Lacalamita Angelo</span>
              <span>{street}</span>
              <span>{zip} {city}</span>
            </address>

            <h3 className="location-info__subtitle">Orari di apertura</h3>
            <table className="hours-table">
              <caption className="visually-hidden">Orari di apertura settimanali</caption>
              <tbody>
                {DAY_LABELS.map(([key, label]) => (
                  <tr className="hours-table__row" key={key}>
                    <th className="hours-table__day" scope="row">{label}</th>
                    <td className="hours-table__value">{formatHours(hours[key])}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="location-info__note">Aperti tutti i giorni, domenica compresa.</p>
            <p className="location-info__note">
              <Link className="text-link" to="/contatti">Scrivi o chiama per una visita</Link>
            </p>
          </div>

          <div className="location-map">
            {hasMap && (
              <iframe className="map-frame" src={buildMapUrl(lat, lng)} title="Mappa dello showroom Futura in Via Novara a Milano" loading="lazy"></iframe>
            )}
            {hasMap && (
              <p className="location-map__link">
                <a href={buildMapLink(lat, lng)} rel="noreferrer noopener" target="_blank">Apri la mappa in grandezza</a>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section section--band">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Punti vendita</p>
            <h2>Dove acquistare le bomboniere</h2>
            <p className="section__text">
              Futura distribuisce tramite i punti vendita indicati, per garantire qualità,
              cortesia e servizio. Ecco dove trovarci e dove acquistare.
            </p>
          </div>

          {loading && <p className="state-note">Caricamento dei punti vendita in corso.</p>}
          {error && <p className="state-note">Non è stato possibile caricare i punti vendita.</p>}

          <ul className="retailer-list">
            {retailers.map((retailer) => (
              <li className="retailer" key={retailer.id}>
                <div className="retailer__body">
                  <h3 className="retailer__name">{retailer.name}</h3>
                  {retailer.is_showroom === 1 && <p className="retailer__badge">Showroom Futura</p>}
                  <p className="retailer__address">{retailer.address}</p>
                  {retailer.phone && (
                    <p className="retailer__line">
                      <a href={`tel:${String(retailer.phone).replace(/\s/g, '')}`}>{retailer.phone}</a>
                    </p>
                  )}
                  {retailer.website && (
                    <p className="retailer__line">
                      <a href={retailer.website} rel="noreferrer noopener" target="_blank">Sito del negozio</a>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
