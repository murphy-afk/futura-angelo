import { Link } from 'react-router-dom';
import PhotoSlot from './PhotoSlot.jsx';

export default function CollectionCard({ collection }) {
  return (
    <article className="collection-card">
      <PhotoSlot className="collection-card__media" src={collection.cover_image} alt={`Bomboniere della collezione ${collection.name}`}></PhotoSlot>
      <div className="collection-card__body">
        <p className="collection-card__material">{collection.material}</p>
        <h3 className="collection-card__title">
          <Link to={`/collezioni/${collection.slug}`}>{collection.name}</Link>
        </h3>
        <p className="collection-card__lines">{collection.line_count} linee</p>
        <p className="collection-card__text">{collection.short_description}</p>
      </div>
    </article>
  );
}
