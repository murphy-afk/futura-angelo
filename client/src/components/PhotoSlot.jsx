// Image slot shared by every visual block. When the session 0 photographs
// arrive they are pointed at from the database (hero_image, cover_image,
// products.image) and this component renders a real img. Until then it draws a
// neutral framed area so the layout keeps its final proportions.

export default function PhotoSlot({ src, alt = '', className = '', ratio = 'landscape', eager = false }) {
  if (src) {
    return <img className={`photo ${className}`.trim()} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} />;
  }

  return <div className={`photo-slot photo-slot--${ratio} ${className}`.trim()} aria-hidden="true" />;
}
