# Photos, generated

Every file in this folder is produced by the image pipeline. Do not edit or
drop files here by hand.

The photographs as delivered live in `client/photos`, and
`client/photos/index.json` maps each of them to a slug and to the Italian alt
text used on the site. To rebuild this folder, run from the repository root:

    npm run images

The pipeline writes, for each photo:

- `<slug>.jpg`, the largest JPEG, which is the canonical file the database
  points at through `collections.hero_image`, `collections.cover_image`,
  `products.image` and `pages_meta.og_image`
- `<slug>-<width>.avif` and `<slug>-<width>.webp`, the formats browsers pick
  through the picture element
- `<slug>-<width>.jpg`, small JPEG fallbacks for browsers without WebP. The
  canonical width is never written this way, that size is `<slug>.jpg` itself,
  so no photo ends up with two copies of the same picture.

It also writes `client/src/lib/photo-manifest.json`, which the PhotoSlot
component reads to build the picture element, its srcset and its alt text.
Storing a path in the database that no longer matches a slug simply renders
the neutral placeholder, so a stale path never breaks a page.
