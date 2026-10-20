import { Link } from 'react-router-dom';
import { useSettings } from '../lib/useApi.js';

export default function SiteFooter() {
  const { settings } = useSettings();

  const shopName = settings?.shop_legal_name || 'Futura di Lacalamita Angelo';
  const street = settings?.address_street || '';
  const zip = settings?.address_zip || '';
  const city = settings?.address_city || '';
  const phone = settings?.phone_landline || '';
  const email = settings?.email || '';
  const facebook = settings?.facebook_url || '';
  const rating = settings?.google_rating_value || '';
  const ratingCount = settings?.google_rating_count || '';

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__col">
            <p className="site-footer__name">{shopName}</p>
            <address className="site-footer__address">
              {street && <span>{street}</span>}
              {zip && city && <span>{zip} {city}</span>}
            </address>
            {phone && (
              <p className="site-footer__line">
                <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
              </p>
            )}
            {email && (
              <p className="site-footer__line">
                <a href={`mailto:${email}`}>{email}</a>
              </p>
            )}
          </div>

          <div className="site-footer__col">
            <p className="site-footer__heading">Il sito</p>
            <ul className="site-footer__list">
              <li><Link to="/chi-siamo">Chi siamo</Link></li>
              <li><Link to="/collezioni">Collezioni</Link></li>
              <li><Link to="/occasioni">Occasioni</Link></li>
              <li><Link to="/dove-si-trova">Dove si trova</Link></li>
              <li><Link to="/contatti">Contatti</Link></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__heading">Punti vendita</p>
            <p className="site-footer__text">
              Le bomboniere Futura si acquistano solo presso i punti vendita indicati dalla
              maison, per qualità, cortesia e servizio.
            </p>
            <p className="site-footer__line">
              <Link to="/dove-si-trova">Trova il punto vendita più vicino</Link>
            </p>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__heading">Futura online</p>
            {facebook && (
              <p className="site-footer__line">
                <a href={facebook} rel="noreferrer noopener" target="_blank">Pagina Facebook</a>
              </p>
            )}
            {rating && ratingCount && (
              <p className="site-footer__line">
                Voto {rating} su 5, basato su {ratingCount} recensioni Google.
              </p>
            )}
            <p className="site-footer__line">Aperti tutti i giorni della settimana.</p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>{shopName}</span>
          <span>Bomboniere e articoli da regalo, made in Italy.</span>
        </div>
      </div>
    </footer>
  );
}
