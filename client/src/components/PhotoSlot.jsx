// Image slot shared by every visual block. Photos listed in the manifest the
// image pipeline writes are served as AVIF and WebP with a JPEG fallback and
// at several widths, so the browser downloads the smallest file that fits the
// slot. The alt text also comes from the manifest, written from the object
// actually shown in the photograph. A path the manifest does not know about
// falls back to a plain img, and a missing src draws a neutral framed area so
// the layout keeps its final proportions.

import photoManifest from '../lib/photo-manifest.json';
import { withBase, withBaseSrcSet } from '../lib/basePath.js';

export default function PhotoSlot({
  src,
  alt = '',
  className = '',
  ratio = 'landscape',
  sizes = '100vw',
  eager = false,
}) {
  const entry = src ? photoManifest[src] : null;

  if (!entry) {
    return <div className={`photo-slot photo-slot--${ratio} ${className}`.trim()} aria-hidden="true" />;
  }

  return (
    <picture className={`photo ${className}`.trim()}>
      <source type="image/avif" srcSet={withBaseSrcSet(entry.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={withBaseSrcSet(entry.webp)} sizes={sizes} />
      <img
        className="photo__image"
        src={withBase(entry.fallback)}
        srcSet={withBaseSrcSet(entry.jpg)}
        sizes={sizes}
        alt={entry.alt || alt}
        width={entry.width}
        height={entry.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async" />
    </picture>
  );
}
