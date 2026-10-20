# Photos

Drop the photographs for the site in this folder, as delivered by the
photographer. Nothing else belongs here.

The database points at files served from this folder:

- `collections.hero_image` and `collections.cover_image` for a collection page
- `products.image` for a product gallery photo
- `pages_meta.og_image` for the social preview of a page

Paths are stored as URLs from the site root, so `showroom-01.jpg` placed here
is stored as `/photos/showroom-01.jpg`, and a subfolder such as
`/photos/prodotti/silver-01.jpg` works the same way.

Vite copies this folder into the built site, and Express serves the build as
static files, so no extra server code is needed for any file dropped here.

Until the WebP and AVIF pipeline runs, upload the original files as they were
delivered. Keep the file names simple: lower case, no spaces, no accents.
