# Photos, originals

Drop the photographs for the site in this folder, exactly as delivered by the
photographer or pulled from the shop social page. Nothing else belongs here.

List every photo in `index.json` with three fields:

- `slug`, the lower case name the generated files use, for example
  `showroom-banco-01`
- `source`, the file name in this folder
- `alt`, one sentence in Italian describing the object actually shown, never
  a file name and never a generic label

Then run, from the repository root:

    npm run images

The pipeline refuses to run if a photo has no alt text, so the site can never
publish an image without one. Generated files land in `client/public/photos`,
and the database stores paths such as `/photos/showroom-banco-01.jpg`.

Originals are kept out of `client/public` on purpose, so the deployed site
does not ship a copy of every source file alongside the optimized ones.
