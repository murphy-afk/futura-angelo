import { useState } from 'react';
import { apiPost } from '../lib/api.js';

const EMPTY_FIELDS = {
  name: '',
  email: '',
  phone: '',
  occasion: '',
  message: '',
  sito_web: '',
};

// One of the two columns on the Contatti page. `leadType` tells the API which
// audience the lead belongs to, `sito_web` is the honeypot the server ignores.

export default function LeadForm({ leadType, title, intro, occasions = [], successMessage }) {
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      await apiPost('/leads', { type: leadType, ...fields });
      setFields(EMPTY_FIELDS);
      setStatus('sent');
    } catch (submitError) {
      const rateLimited = submitError.message.includes('429');
      setError(
        rateLimited
          ? 'Hai inviato troppe richieste in poco tempo. Riprova più tardi.'
          : 'Non è stato possibile inviare il modulo. Riprova tra qualche istante oppure contattaci per telefono o email.'
      );
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <section className="lead-form" aria-live="polite">
        <h2>{title}</h2>
        <p className="form-note form-note--ok">{successMessage}</p>
        <button className="button button--ghost" type="button" onClick={() => setStatus('idle')}>
          Invia un'altra richiesta
        </button>
      </section>
    );
  }

  return (
    <section className="lead-form">
      <h2>{title}</h2>
      <p className="lead-form__intro">{intro}</p>

      <form onSubmit={handleSubmit}>
        {/* Honeypot, hidden from people and read by the server side check. */}
        <div className="lead-form__hp"><input type="text" name="sito_web" tabIndex={-1} autoComplete="off" value={fields.sito_web} onChange={handleChange} /></div>

        <label className="form-field">
          <span className="form-field__label">Nome e cognome</span> <input className="form-field__input" type="text" name="name" autoComplete="name" minLength="2" maxLength="160" required value={fields.name} onChange={handleChange} />
        </label>

        <label className="form-field">
          <span className="form-field__label">Email</span> <input className="form-field__input" type="email" name="email" autoComplete="email" maxLength="190" required value={fields.email} onChange={handleChange} />
        </label>

        <label className="form-field">
          <span className="form-field__label">Telefono</span> <input className="form-field__input" type="tel" name="phone" autoComplete="tel" maxLength="40" value={fields.phone} onChange={handleChange} />
        </label>

        {leadType === 'privato' && (
          <label className="form-field">
            <span className="form-field__label">Occasione</span>
            <select className="form-field__input" name="occasion" value={fields.occasion} onChange={handleChange}>
              <option value="">Da scegliere in fase di preventivo</option>
              {occasions.map((occasion) => (
                <option key={occasion.slug} value={occasion.name}>{occasion.name}</option>
              ))}
            </select>
          </label>
        )}

        <label className="form-field form-field--wide">
          <span className="form-field__label">Messaggio</span>
          <textarea className="form-field__input" name="message" rows="5" minLength="5" maxLength="5000" required value={fields.message} onChange={handleChange}></textarea>
        </label>

        {error && <p className="form-note form-note--error" role="alert">{error}</p>}

        <p className="lead-form__actions">
          <button className="button button--primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Invio in corso' : 'Invia richiesta'}
          </button>
        </p>
      </form>
    </section>
  );
}
