import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/collezioni', label: 'Collezioni' },
  { to: '/occasioni', label: 'Occasioni' },
  { to: '/dove-si-trova', label: 'Dove si trova' },
  { to: '/contatti', label: 'Contatti' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const navClass = open ? 'site-nav site-nav--open' : 'site-nav';

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="site-logo" to="/" onClick={() => setOpen(false)}>
          <span className="site-logo__name">Futura</span>
          <span className="site-logo__tag">Bomboniere, Milano</span>
        </Link>

        <button className="site-nav__toggle" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
          {open ? 'Chiudi il menu' : 'Apri il menu'}
        </button>

        <nav id="site-nav" className={navClass} aria-label="Navigazione principale">
          <ul className="site-nav__list">
            {NAV_ITEMS.map((item) => (
              <li className="site-nav__item" key={item.to}>
                <NavLink className={({ isActive }) => (isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link')} to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link className="site-nav__cta" to="/contatti" onClick={() => setOpen(false)}>
            Diventa punto vendita
          </Link>
        </nav>
      </div>
    </header>
  );
}
