import { Link } from 'react-router-dom';

// items is an ordered list of the trailing trail entries, the current page
// last and without a link.

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Percorso di navigazione">
      <ol className="breadcrumbs__list">
        <li className="breadcrumbs__item"><Link to="/">Home</Link></li>
        {items.map((item) => (
          <li className="breadcrumbs__item" key={item.label}>
            {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
