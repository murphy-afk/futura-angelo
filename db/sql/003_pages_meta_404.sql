-- ============================================================================
-- Futura di Lacalamita Angelo
-- 003_pages_meta_404.sql
--
-- Run after 002_seed.sql. Does two things:
--   1. Adds the catch-all row the HTML renderer uses for unknown paths, so a
--      404 answer carries a real Italian title and description instead of the
--      home page copy.
--   2. Corrects seeded copy that was written without apostrophes and accents
--      (piu, all avanguardia, dell arredamento, esclusivista).
-- Safe to run again: every statement is idempotent.
-- ============================================================================

USE `futura`;

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- 1. The 404 document. Route '*' is the fallback key. Canonical stays NULL,
--    a missing page must never be announced to crawlers as canonical.
-- ---------------------------------------------------------------------------

INSERT INTO `pages_meta` (`route`, `title`, `description`, `canonical`)
VALUES
  ('*',
   'Pagina non trovata | Futura bomboniere Milano',
   'La pagina che cerchi non esiste. Torna alle collezioni di bomboniere Futura o contattaci per informazioni.',
   NULL)
ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `description` = VALUES(`description`),
  `canonical`   = NULL;

-- ---------------------------------------------------------------------------
-- 2. Italian typography fixes in the collections table.
-- ---------------------------------------------------------------------------

UPDATE `collections`
   SET `short_description` = 'Dieci linee in vetro, la collezione più ampia del campionario.',
       `long_description`  = 'Dieci linee in vetro. Forme e decori sempre all''avanguardia, disponibili per più stagioni.'
 WHERE `slug` = 'vetro';

UPDATE `collections`
   SET `short_description` = 'Quattro linee in cristallo, la scelta più classica per le grandi occasioni.'
 WHERE `slug` = 'cristallo';

UPDATE `collections`
   SET `long_description` = 'Quattro linee in porcellana. Decorazioni e forme che seguono le tendenze dell''arredamento italiano.'
 WHERE `slug` = 'porcellana';

-- ---------------------------------------------------------------------------
-- 3. Italian typography fixes in the page metadata.
-- ---------------------------------------------------------------------------

UPDATE `pages_meta`
   SET `description` = 'Dieci linee di bomboniere in vetro made in Italy, la collezione più ampia del campionario Futura.'
 WHERE `route` = '/collezioni/vetro';

UPDATE `pages_meta`
   SET `description` = 'Quattro linee di bomboniere in cristallo made in Italy, per le occasioni più importanti.'
 WHERE `route` = '/collezioni/cristallo';

UPDATE `pages_meta`
   SET `description` = 'Quattro linee di bomboniere in porcellana made in Italy, decorate secondo le tendenze dell''arredamento.'
 WHERE `route` = '/collezioni/porcellana';

UPDATE `pages_meta`
   SET `description` = 'Showroom Futura in Via Novara a Milano, aperto tutti i giorni. Trova il punto vendita più vicino a te.'
 WHERE `route` = '/dove-si-trova';

UPDATE `pages_meta`
   SET `description` = 'Contatta Futura per le bomboniere o per diventare punto vendita esclusivo. Telefono, email e modulo di contatto.'
 WHERE `route` = '/contatti';

-- End of 003. Any later data change goes in a new numbered script.
