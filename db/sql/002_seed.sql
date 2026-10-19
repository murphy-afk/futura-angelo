-- ============================================================================
-- Futura di Lacalamita Angelo
-- 002_seed.sql
--
-- Dati iniziali del sito. Eseguire dopo 001_schema.sql.
-- Questo script NON cancella leads, prodotti o retailers gia inseriti.
-- Usa INSERT IGNORE e UPDATE, quindi e sicuro da rieseguire.
--
-- NOTA: l'indirizzo e da confermare con il titolare prima della pubblicazione.
-- Google Maps riporta Via Novara 34, il vecchio sito Via Novara 139,
-- altri elenchi Via Novara 105. Qui e usato l'indirizzo di Google Maps,
-- che e quello collegato alle coordinate della mappa.
-- ============================================================================

USE `futura`;

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- Impostazioni del negozio
-- ---------------------------------------------------------------------------

INSERT INTO `settings` (`key`, `value`) VALUES
  ('shop_name',             'Futura'),
  ('shop_legal_name',       'Futura di Lacalamita Angelo'),
  ('owner_name',            'Angelo Lacalamita'),
  ('tagline',               'Bomboniere e articoli da regalo, made in Italy'),
  ('address_street',        'Via Novara 34'),
  ('address_zip',           '20147'),
  ('address_city',          'Milano'),
  ('address_region',        'Lombardia'),
  ('address_country',       'Italia'),
  ('geo_lat',               '45.4730713'),
  ('geo_lng',               '9.1184392'),
  ('phone_landline',        '+39 02 4820 2585'),
  ('phone_mobile',          '+39 349 237 6450'),
  ('fax',                   '+39 02 4820 2805'),
  ('email',                 'futura@futurabomboniere.it'),
  ('email_secondary',       'angelolacalamita.al@gmail.com'),
  ('facebook_url',          'https://www.facebook.com/p/Futura-Bomboniere-100063580117147'),
  ('google_rating_value',   '4.9'),
  ('google_rating_count',   '50'),
  ('founding_statement',    'Attiva da oltre trent anni nel settore delle bomboniere'),
  ('hours_json',            '{"lun":"09:30-19:30","mar":"09:30-19:30","mer":"09:30-19:30","gio":"09:30-19:30","ven":"09:30-19:30","sab":"09:30-19:30","dom":"10:30-19:00"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- ---------------------------------------------------------------------------
-- Le sei collezioni. 37 linee in totale.
-- ---------------------------------------------------------------------------

INSERT INTO `collections`
  (`slug`, `name`, `material`, `line_count`, `short_description`, `long_description`, `sort_order`, `published`)
VALUES
  ('silver', 'Silver', 'Argento', 4,
   'Quattro linee in argento, per un regalo che resta nel tempo.',
   'Quattro linee in argento. Materiali rigorosamente made in Italy, pensati per durare e per essere esposti.',
   1, 1),

  ('vetro', 'Vetro', 'Vetro', 10,
   'Dieci linee in vetro, la collezione piu ampia del campionario.',
   'Dieci linee in vetro. Forme e decori sempre all avanguardia, disponibili per piu stagioni.',
   2, 1),

  ('cristallo', 'Cristallo', 'Cristallo', 4,
   'Quattro linee in cristallo, la scelta piu classica per le grandi occasioni.',
   'Quattro linee in cristallo. La trasparenza del materiale valorizza ogni decoro e ogni colore.',
   3, 1),

  ('porcellana', 'Porcellana', 'Porcellana', 4,
   'Quattro linee in porcellana, decorate a mano.',
   'Quattro linee in porcellana. Decorazioni e forme che seguono le tendenze dell arredamento italiano.',
   4, 1),

  ('orologi-da-tavolo', 'Orologi da tavolo', 'Vetro dipinto', 7,
   'Sette linee di orologi da tavolo in vetro dipinto.',
   'Sette linee di orologi da tavolo in vetro dipinto. Un oggetto utile che diventa ricordo della cerimonia.',
   5, 1),

  ('stile-murano', 'Stile Murano', 'Vetro stile Murano', 8,
   'Otto linee in stile Murano, colori saturi e finiture preziose.',
   'Otto linee in stile Murano. Colori e tecniche che richiamano la tradizione del vetro veneziano.',
   6, 1)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `material` = VALUES(`material`),
  `line_count` = VALUES(`line_count`),
  `short_description` = VALUES(`short_description`),
  `long_description` = VALUES(`long_description`),
  `sort_order` = VALUES(`sort_order`);

-- ---------------------------------------------------------------------------
-- Occasioni
-- ---------------------------------------------------------------------------

INSERT INTO `occasions`
  (`slug`, `name`, `description`, `sort_order`, `published`)
VALUES
  ('matrimonio', 'Matrimonio', 'Bomboniere per sposi e per la cerimonia.', 1, 1),
  ('battesimo', 'Battesimo', 'Bomboniere per il battesimo.', 2, 1),
  ('comunione', 'Comunione', 'Bomboniere per la prima comunione.', 3, 1),
  ('cresima', 'Cresima', 'Bomboniere per la cresima.', 4, 1),
  ('laurea', 'Laurea', 'Bomboniere per la laurea.', 5, 1),
  ('nascita', 'Nascita', 'Bomboniere per la nascita.', 6, 1),
  ('anniversario', 'Anniversario', 'Bomboniere per gli anniversari.', 7, 1)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `sort_order` = VALUES(`sort_order`);

-- ---------------------------------------------------------------------------
-- Il negozio stesso come primo punto vendita.
-- Le bomboniere si acquistano solo nei punti vendita indicati.
-- ---------------------------------------------------------------------------

INSERT INTO `retailers`
  (`name`, `city`, `address`, `region`, `phone`, `website`, `latitude`, `longitude`, `is_showroom`, `sort_order`, `published`)
VALUES
  ('Futura di Lacalamita Angelo', 'Milano', 'Via Novara 34, 20147 Milano', 'Lombardia',
   '+39 02 4820 2585', 'https://www.futurabomboniere.it',
   45.4730713, 9.1184392, 1, 1, 1)
ON DUPLICATE KEY UPDATE
  `address` = VALUES(`address`),
  `phone` = VALUES(`phone`),
  `latitude` = VALUES(`latitude`),
  `longitude` = VALUES(`longitude`);

-- ---------------------------------------------------------------------------
-- Meta tag SEO per ogni route.
-- Titoli e descrizioni in italiano, una sola riga per route.
-- ---------------------------------------------------------------------------

INSERT INTO `pages_meta`
  (`route`, `title`, `description`, `canonical`)
VALUES
  ('/', 'Futura, bomboniere e articoli da regalo a Milano',
   'Futura produce e distribuisce bomboniere made in Italy: argento, vetro, cristallo, porcellana, orologi da tavolo e stile Murano. Showroom in Via Novara a Milano.',
   '/'),

  ('/chi-siamo', 'Chi siamo | Futura bomboniere Milano',
   'La storia di Futura di Lacalamita Angelo: campionario di bomboniere made in Italy, 37 linee e oltre trent anni di esperienza nel settore.',
   '/chi-siamo'),

  ('/collezioni', 'Le collezioni | Futura bomboniere',
   'Argento, vetro, cristallo, porcellana, orologi da tavolo in vetro dipinto e stile Murano. Le sei collezioni di bomboniere Futura.',
   '/collezioni'),

  ('/collezioni/silver', 'Collezione Silver | Bomboniere in argento',
   'Quattro linee di bomboniere in argento made in Italy, per matrimoni e cerimonie.',
   '/collezioni/silver'),

  ('/collezioni/vetro', 'Collezione Vetro | Bomboniere in vetro',
   'Dieci linee di bomboniere in vetro made in Italy, la collezione piu ampia del campionario Futura.',
   '/collezioni/vetro'),

  ('/collezioni/cristallo', 'Collezione Cristallo | Bomboniere in cristallo',
   'Quattro linee di bomboniere in cristallo made in Italy, per le occasioni piu importanti.',
   '/collezioni/cristallo'),

  ('/collezioni/porcellana', 'Collezione Porcellana | Bomboniere in porcellana',
   'Quattro linee di bomboniere in porcellana made in Italy, decorate secondo le tendenze dell arredamento.',
   '/collezioni/porcellana'),

  ('/collezioni/orologi-da-tavolo', 'Orologi da tavolo | Futura bomboniere',
   'Sette linee di orologi da tavolo in vetro dipinto, bomboniere utili che diventano ricordo.',
   '/collezioni/orologi-da-tavolo'),

  ('/collezioni/stile-murano', 'Collezione Stile Murano | Bomboniere in vetro',
   'Otto linee di bomboniere in stile Murano, colori saturi e finiture preziose made in Italy.',
   '/collezioni/stile-murano'),

  ('/occasioni', 'Bomboniere per ogni cerimonia | Futura Milano',
   'Bomboniere per matrimonio, battesimo, comunione, cresima, laurea, nascita e anniversario.',
   '/occasioni'),

  ('/dove-si-trova', 'Dove si trova | Futura bomboniere Milano',
   'Showroom Futura in Via Novara a Milano, aperto tutti i giorni. Trova il punto vendita piu vicino a te.',
   '/dove-si-trova'),

  ('/contatti', 'Contatti | Futura bomboniere Milano',
   'Contatta Futura per le bomboniere o per diventare punto vendita esclusivista. Telefono, email e modulo di contatto.',
   '/contatti')

ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `canonical` = VALUES(`canonical`);

-- Fine del seed. I prodotti si inseriscono quando arrivano le fotografie.
