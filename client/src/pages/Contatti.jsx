import { useApi, useSettings } from '../lib/useApi.js';
import { DAY_LABELS, formatHours } from '../lib/hours.js';
import PageIntro from '../components/PageIntro.jsx';
import LeadForm from '../components/LeadForm.jsx';

export default function Contatti() {
  const { settings } = useSettings();
  const { data } = useApi('/occasions');
  const occasions = data?.occasions || [];
  const lede = 'Due moduli a fianco: uno per sposi e famiglie, uno per operatori del settore. Rispondiamo tutti i giorni.';

  const street = settings?.address_street || '';
  const zip = settings?.address_zip || '';
  const city = settings?.address_city || '';
  const phone = settings?.phone_landline || '';
  const mobile = settings?.phone_mobile || '';
  const email = settings?.email || '';
  const hours = settings?.hours || {};
  const hoursSummary = DAY_LABELS.map(([key, label]) => `${label} ${formatHours(hours[key])}`).join(', ');

  const privateIntro = 'Raccontaci la cerimonia, la data e quanti ospiti saremo: ti rispondiamo con le linee più adatte e con il punto vendita più vicino.';
  const privateSuccess = 'Grazie, abbiamo ricevuto la tua richiesta. Ti risponderemo al più presto.';
  const tradeIntro = 'Sei un rivenditore o un titolare di negozio e vuoi proporti come punto vendita esclusivista? Presentati e ti contatteremo con il campionario.';
  const tradeSuccess = 'Grazie, abbiamo ricevuto la tua richiesta. Ti contatteremo con il campionario.';

  return (
    <main className="page" id="contenuto">
      <PageIntro eyebrow="Parliamone" title="Contatti" lede={lede}></PageIntro>

      <section className="section">
        <div className="container contact-layout">
          <aside className="contact-details">
            <h2>Futura di Lacalamita Angelo</h2>
            <address className="contact-details__address">
              <span>{street}</span>
              <span>{zip} {city}</span>
            </address>

            <ul className="contact-details__list">
              {phone && (
                <li className="contact-details__item">
                  <span className="contact-details__label">Telefono</span>
                  <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                </li>
              )}
              {mobile && (
                <li className="contact-details__item">
                  <span className="contact-details__label">Cellulare</span>
                  <a href={`tel:${mobile.replace(/\s/g, '')}`}>{mobile}</a>
                </li>
              )}
              {email && (
                <li className="contact-details__item">
                  <span className="contact-details__label">Email</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
            </ul>

            <h3 className="contact-details__subtitle">Orari</h3>
            <p className="contact-details__text">Aperti tutti i giorni della settimana.</p>
            <p className="contact-details__hours">{hoursSummary}</p>
          </aside>

          <div className="contact-forms">
            <LeadForm leadType="privato" title="Sposi e famiglie" occasions={occasions} intro={privateIntro} successMessage={privateSuccess}></LeadForm>
            <LeadForm leadType="rivenditore" title="Operatori del settore" intro={tradeIntro} successMessage={tradeSuccess}></LeadForm>
          </div>
        </div>
      </section>
    </main>
  );
}
