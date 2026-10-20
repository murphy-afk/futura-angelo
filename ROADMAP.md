# Roadmap: Futura di Lacalamita Angelo

New marketing website for a Milan wedding favour and gift shop. Simple, clean, modern design.
Italian only. No online checkout, because the shop sells through authorised points of sale.

---

## 1. Project snapshot

| Item | Value |
| --- | --- |
| Client | Futura di Lacalamita Angelo (also traded as Futura Diffusion, Futura Bomboniere) |
| Owner | Angelo Lacalamita |
| Business type | Producer and wholesaler of bomboniere and gift articles, plus retail showroom |
| City | Milan, Via Novara |
| Languages | Italian only |
| Scope | Marketing site plus product catalogue |
| Stack | React, Express, MySQL, custom CSS |
| SEO | First class requirement, not an afterthought |

---

## 2. Business data collected

All facts below were pulled from the old website futurabomboniere.it, Google Maps, Facebook,
and Italian business directories. This section is the single source of truth for site copy.
Confirm the flagged items with the owner before launch.

### 2.1 Identity

| Field | Value | Confidence |
| --- | --- | --- |
| Display name | Futura | High |
| Legal name | Futura di Lacalamita Angelo | High |
| Address on Google Maps | Via Novara 34, 20147 Milano | Needs confirmation |
| Address on old site | Via Novara 139, 20153 Milano | Needs confirmation |
| Address on other directories | Via Novara 105, 20153 Milano | Needs confirmation |
| Map coordinates | 45.4730713, 9.1184392 | High |
| Landline | +39 02 4820 2585 r.a. | High |
| Fax | +39 02 4820 2805 | High |
| Mobile | +39 349 237 6450 | Medium |
| Email | futura@futurabomboniere.it | High |
| Secondary email | angelolacalamita.al@gmail.com | Medium |
| Old website | futurabomboniere.it | High |
| Facebook | Futura Bomboniere, about 184 followers | High |
| Google rating | 4.9 out of 5 from 50 reviews | High |

Three different street numbers appear across sources for the same shop. Only one is correct.
Ask the owner, then use it everywhere: site footer, contact page, schema markup, Google Business
Profile. Mismatched NAP data damages local SEO.

### 2.2 Opening hours

Sourced from the Google listing.

| Day | Hours |
| --- | --- |
| Monday | 09:30 to 19:30 |
| Tuesday | 09:30 to 19:30 |
| Wednesday | 09:30 to 19:30 |
| Thursday | 09:30 to 19:30 |
| Friday | 09:30 to 19:30 |
| Saturday | 09:30 to 19:30 |
| Sunday | 10:30 to 19:00 |

Open every day of the week. That is unusual and worth stating on the contact page.

### 2.3 Categories and keywords

- Google category: Articoli da regalo, dettaglio
- Directories: Bomboniere ed accessori, Ingrosso bomboniere regalo
- Old site meta keywords: futura, bomboniere, matrimonio, sposo, sposa, lista nozze, cerimonie,
  articoli regalo, wedding, article gift

### 2.4 Company story (translated from the old Italian site)

Futura produces and distributes bomboniere, gift objects and present articles across Italy and is
quickly winning the international market. It stands out for its campionario, the sample catalogue
described as designed to create the difference.

Strengths stated by the shop:

- Products are rigorously made in Italy.
- The range is always ahead on form, decoration and material.
- Collections stay available across several seasons, so a retailer invests once in the sample
  catalogue and can display and sell it without further spending.
- Futura is unusually able to bring the colours and shapes of current trends onto an object, in
  line with Italian home decor and fashion choices.

Signature moment for the brand story section:

In spring 1992 Futura designed the divorce bomboniera, described as transgressive and provocative.
The weekly L'Espresso and the TG2 news programme both covered it. The story grew when a known
Serie A footballer used it to celebrate his recovered bachelorhood.

This is a real press mention from a national broadcaster and a national weekly. It is the strongest
differentiator the shop owns and should be a highlighted block on the Chi siamo page.

### 2.5 Catalogue lines (from the old company page)

| Material | Lines |
| --- | --- |
| Silver | 4 |
| Vetro (glass) | 10 |
| Cristallo (crystal) | 4 |
| Porcellana (porcelain) | 4 |
| Table clocks in painted glass | 7 |
| Stile Murano (Murano style) | 8 |

Total: 37 lines. The old site also had a downloadable wallpapers section and an English section,
both of which are dropped.

### 2.6 Sales model

Bomboniere are sold only through the points of sale indicated by Futura. The old site told
bride and groom to buy from those shops for quality, courtesy and service. The B2B call to action
read: are you a trade operator, do you want to appear as an exclusive point of sale, contact us.

So the site has two audiences on every page:

1. Bride and groom planning a wedding, communion, christening or graduation.
2. Retail buyers and shop owners who want to stock the range.

No cart, no prices, no checkout.

### 2.7 Assets still needed from the owner

Nothing photo based could be read from the Google Maps listing by the agent, because Google Maps
serves photos behind JavaScript. The design direction below is inferred from the product
materials, not from the photos. Request these before session 3:

- 10 to 20 high resolution photos of the showroom interior
- Product shots per material: silver, glass, crystal, porcelain, Murano style, table clocks
- The official logo in vector or PNG with transparent background
- A favicon derived from the logo. Until it arrives the site ships an empty
  `data:,` icon link so browsers stop requesting a missing `favicon.ico`.
- Any old catalogue scans for typography cues
- Permission to use the Google listing photos, or a fresh photo shoot

---

## 3. Design direction

### 3.1 Vibe

An Italian wedding atelier that is also a workshop. Precious small objects, glass, crystal and
silver catching light, porcelain, gold and ivory. Elegant, calm, generous with white space,
confident rather than loud. The shop is 30 plus years old, so there is heritage, but the products
are described as always ahead on form and decoration, so the site should feel current.

### 3.2 Working palette

Refine after the photo review in session 3.

| Role | Token | Value |
| --- | --- | --- |
| Background | `--color-bg` | warm off white, ivory |
| Surface | `--color-surface` | pure white |
| Ink | `--color-ink` | near black warm grey |
| Muted | `--color-muted` | soft taupe grey |
| Accent | `--color-accent` | antique gold or champagne |
| Accent deep | `--color-accent-deep` | deeper bronze for hover states |
| Line | `--color-line` | light warm border |

Keep the accent restrained. Gold as a hairline, a small label or an underline, never as a large
filled block. Large gold areas read as cheap and fight the products.

### 3.3 Typography

- Headings: a high contrast serif, for example Cormorant Garamond or Playfair Display.
- Body and UI: a neutral sans, for example Inter or Jost.
- Two families maximum. Load only the weights actually used.
- Generous line height, comfortable measure of 60 to 70 characters.

### 3.4 Layout principles

- Big photography, small text blocks.
- Grid of collections with material names as the label.
- Sharp or barely rounded corners, thin 1px borders.
- No drop shadows, no gradients, no glass effects.
- Motion limited to fast opacity and transform transitions under 300 ms.
- Mobile first, since most bride and groom traffic arrives from a phone.

---

## 4. Architecture

### 4.1 Repository layout

```
futura-angelo/
  client/          React app, built with Vite
    public/
      photos/      Photographs from the owner, served from /photos
    src/
      components/
      pages/
      styles/
      lib/
  server/          Express app
    src/
      routes/
      controllers/
      db/
      middleware/
      seo/
  db/
    sql/           Numbered SQL scripts, run by hand in MySQL Workbench
  ROADMAP.md
  AGENTS.md
  package.json     Root scripts, runs client and server together
  .env.example     Template for the server environment
```

Two apps, one repository. Express serves the built React bundle in production so the site behaves
like one site to the browser and to search engines.

### 4.3 Database workflow

The client maintains the database by hand in MySQL Workbench. Nothing in this repository connects
to MySQL to create or alter tables.

SQL lives in `db/sql` as numbered scripts. Each script is idempotent where that is reasonable, so
it can be re run without corrupting data. The server only ever reads and writes rows through
`mysql2`, it never owns the schema.

Rules that follow from this:

- New schema work starts as a new numbered script, never as an edit to a script already run.
- Seed data that belongs to the shop lives in `db/sql`, not in a Node seeding task.
- The server must start cleanly against a database that has run every script in `db/sql` in
  numeric order.
- Anything the server writes at runtime, such as leads, lives only in the database and is not
  recreated by any script.

### 4.2 Why this shape

React is required, and a plain React single page app renders an empty shell to crawlers, which
would fail the SEO requirement. Adding Next.js would satisfy SSR but violates the required stack
of React, Express and MySQL.

The chosen compromise: Express builds the HTML document per route. For each known route it takes
the React build template, injects title, description, Open Graph tags, canonical URL and JSON-LD
read from MySQL, then hands the document to React, which hydrates into the same markup.

Result: real HTML content per URL for crawlers, and a normal React app for humans.

---

## 5. Database schema (MySQL 8)

| Table | Columns | Notes |
| --- | --- | --- |
| `settings` | key, value | Shop name, addresses, phones, emails, social links, opening hours JSON, founding year. Read on every render of header and footer. |
| `collections` | id, slug, name, material, line_count, short_description, long_description, hero_image, cover_image, sort_order, published | One row per material group: silver, vetro, cristallo, porcellana, orologi da tavolo, stile Murano. |
| `products` | id, collection_id, slug, name, description, image, material, is_featured, sort_order, published | Product gallery entries. |
| `occasions` | id, slug, name, description | Matrimonio, battesimo, comunione, cresima, laurea, nascita, anniversario. |
| `product_occasions` | product_id, occasion_id | Many to many join table. |
| `retailers` | id, name, city, address, region, phone, website, latitude, longitude, is_showroom | Powers the Dove si trova page. The shop itself is seeded as the first row. |
| `leads` | id, type, name, email, phone, occasion, message, created_at, status | `type` is `privato` or `rivenditore`. Every contact form submission lands here. |
| `pages_meta` | route, title, description, og_image, canonical | Per route SEO metadata, read by the HTML renderer in production. The route key `*` is the fallback document for unknown paths. |
| `admin_users` | id, email, password_hash, created_at | For a minimal admin area in session 6. |

The authoritative DDL is `db/sql/001_schema.sql`, run by hand in MySQL Workbench. The table above
is the summary, the SQL file is the truth. No ORM in version one, keep the query layer thin and
readable with `mysql2`.

Charsets and engine are fixed in the schema script: InnoDB, `utf8mb4` and `utf8mb4_unicode_ci`,
so Italian text with accents and the euro symbol always round trips correctly.

---

## 6. API surface

All JSON, all under `/api`.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /api/settings | Shop identity and hours |
| GET | /api/collections | List collections |
| GET | /api/collections/:slug | One collection with its products |
| GET | /api/products | List products, filter by collection and occasion |
| GET | /api/products/:slug | One product |
| GET | /api/occasions | List occasions |
| GET | /api/retailers | Points of sale |
| GET | /api/meta/:route | SEO metadata for a route |
| POST | /api/leads | Create a contact or trade lead |

Session 6 adds `/api/admin/*` with session auth for CRUD on collections, products, retailers and
leads.

Rate limit and validate the leads endpoint. It is the only public write path, so it is the only
spam target.

---

## 7. Pages

| Route | Content |
| --- | --- |
| `/` | Hero with showroom photo, brand promise, six collection tiles, the 1992 press story teaser, trade CTA |
| `/chi-siamo` | Full company story, made in Italy, the campionario argument, the divorce bomboniera press story, owner name |
| `/collezioni` | Grid of the six collections with line counts |
| `/collezioni/:slug` | Collection detail, product gallery, occasions it suits, request info CTA |
| `/occasioni` | Occasions index linking to products |
| `/dove-si-trova` | Map, address, opening hours, retailers list |
| `/contatti` | Two column form, one for private clients, one for trade operators |
| `*` | Custom 404 with links back into the catalogue |

---

## 8. SEO plan

### 8.1 On page

- One H1 per page, descriptive H2 structure below it.
- Unique title and meta description per route, stored in `pages_meta`.
- Canonical URLs, no duplicate query string versions.
- Alt text on every image, written from the actual product, never a filename.
- Internal links between collections and occasions, so the catalogue is crawlable.
- Breadcrumbs with BreadcrumbList JSON-LD.

### 8.2 Structured data

- `LocalBusiness` (subtype `Store`) on the home page with address, geo, telephone, opening hours
  and aggregate rating 4.9 from 50 reviews.
- `BreadcrumbList` on all inner pages.
- `Product` on product detail pages.
- `Organization` on Chi siamo.

### 8.3 Technical

- `sitemap.xml` generated from published collections, products and occasions. Only URLs that
  exist as pages are listed, so today that means the static routes plus the collection detail
  routes: there is no product or occasion detail page yet.
- `robots.txt` allowing all, pointing at the sitemap.
- Descriptive slugs in Italian: `/collezioni/bomboniere-in-cristallo`.
- Images in WebP with AVIF fallback, explicit width and height, lazy loading below the fold.
- Preconnect and subset fonts, no more than two families.
- Target: Lighthouse SEO 95 plus, performance 90 plus on mobile, LCP under 2.5 s.
- Google Search Console and Google Business Profile verified and linked to the new domain.

### 8.4 Italian keyword targets

- bomboniere Milano
- bomboniere matrimonio Milano
- bomboniere cristallo, bomboniere porcellana, bomboniere in argento
- bomboniere battesimo, comunione, cresima, laurea
- articoli da regalo Milano
- bomboniere ingrosso

---

## 9. Sessions

### Session 0. Content and assets
- Confirm the street number, hours, phone and email with the owner.
- Collect photos and logo, listed in section 2.7.
- Finalise Italian copy for Chi siamo from section 2.4.
- Deliverable: a content doc the whole team writes from.

### Session 1. Scaffold and database
Status: complete.

- Create the client and server apps, ESLint, custom CSS setup with design tokens.
- Write `db/sql/001_schema.sql`, the full schema, ready to paste into MySQL Workbench.
- Write `db/sql/002_seed.sql`, the six collections, the shop as first retailer, settings,
  occasions and page metadata.
- Add `server/.env.example` with the database credentials the server expects.
- Client runs both SQL scripts by hand in MySQL Workbench.
- Deliverable: site boots on the dev server, database created and seeded by hand, both apps
  install and run cleanly.

### Session 2. API
Status: complete. The `db/sql/003_pages_meta_404.sql` script has been run in MySQL Workbench and verified.

- Build all public read endpoints with validation and 404 handling.
- Build the leads endpoint with rate limiting, honeypot field and server side validation.
- Add the per route HTML renderer reading `pages_meta`.
- Deliverable: curl returns correct JSON and the HTML shell carries real meta tags.

### Session 3. UI build
Status: complete. Pending: revisit and lock the palette once the session 0 photos arrive.

- Design tokens, typography, base layout, header and footer.
- Home, Chi siamo, Collezioni, collection detail, Occasioni, Dove si trova, Contatti, 404.
- Custom CSS only, no component library, no CSS framework.
- Revisit the palette against the real photos, then lock the tokens.
- Deliverable: complete responsive site against seed data.

### Session 4. SEO and performance
Status: complete. Pending: the image pipeline to WebP and AVIF, the favicon, the product detail
pages with their `Product` structured data, and the Rich Results validation, which needs the
live domain. All of those wait on the session 0 assets or on session 5.

- `sitemap.xml` generated from the published collections plus the static routes, `robots.txt`
  allowing all and pointing at the sitemap. Only URLs that exist as pages are listed.
- Per route titles, descriptions, canonicals and Open Graph tags come from `pages_meta` as
  before, and a meta hook now keeps the head in step with client side navigation instead of
  leaving the first loaded title behind.
- Server side rendered body: Express renders the React tree with the data the page reads
  prefetched from MySQL, so the crawler receives the same HTML as the visitor, exactly one H1
  per page, and React hydrates that markup instead of rendering over it.
- JSON-LD in place: LocalBusiness on home, Organization on Chi siamo, BreadcrumbList on inner
  pages. Product structured data arrives with the product pages.
- Lighthouse, headless Chrome against the production Express server on `localhost`:

| Route | Mobile perf | Desktop perf | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- | --- |
| Home | 99 | 99 | 100 | 100 | 100 |
| Collezione Silver | 100 | 99 | 100 | 100 | 100 |
| Chi siamo | 99 | 99 | 100 | 100 | 100 |
| Dove si trova | 99 | 99 | 100 | 100 | 100 |
| Contatti | 100 | 99 | 100 | 100 | 100 |

- No failed audits on any route. Home on the mobile profile: LCP 1.6 s, CLS 0.03, total weight
  157 KiB, against the targets in 8.3 of SEO 95 plus, performance 90 plus, LCP under 2.5 s.
- Deliverable: scores recorded, structured data validated with the Rich Results test once the
  domain is live.

### Session 5. Deploy and handover
- Deploy Express serving the built client on a Node host.
- Set `PUBLIC_URL` to the live domain before launch, canonical URLs and the sitemap are built from it.
- MySQL managed instance, environment variables, backups.
- Domain, SSL, DNS, Google Search Console, Google Business Profile link.
- Deliverable: live site, access credentials handed over, training notes.

### Session 6. Optional admin
- Login protected area for collections, products, retailers and leads.
- Only build this if the client actually wants to update the catalogue themselves.

---

## 10. Risks

| Risk | Mitigation |
| --- | --- |
| Wrong address published, hurting local SEO | Confirm with owner in session 0 before any build |
| No photos available, design drifts from the shop vibe | Block session 3 until assets arrive |
| Single page app invisible to crawlers | Per route HTML renderer built in session 2, not left to the end |
| Contact form spam | Rate limit, honeypot, validation, optional Cloudflare Turnstile |
| Client expects online sales | Set expectations early, the site never takes payment |

---

## 11. Definition of done

- All routes render real HTML with correct title, description and canonical.
- LocalBusiness structured data validates.
- Lighthouse SEO 95 plus and performance 90 plus on mobile.
- Works on a phone, a tablet and a desktop with no horizontal scroll.
- Every fact matches what the owner confirmed in session 0.
- No emdashes, no emojis, no empty angle bracket only lines in any generated file.
