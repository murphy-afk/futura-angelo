-- ============================================================================
-- Futura di Lacalamita Angelo
-- 004_photos.sql
--
-- Run after 003_pages_meta_404.sql. Points the database at the photographs
-- the owner delivered, now that the image pipeline has turned them into web
-- ready files under client/public/photos.
--
-- The paths below are the keys of client/src/lib/photo-manifest.json, which
-- the pipeline writes. A path that no longer matches a manifest key renders
-- the neutral placeholder instead of breaking the page, so a stale path is
-- visible but never fatal. Rebuild the images with `npm run images`.
--
-- Every statement is idempotent. This script only writes to existing columns,
-- it creates and drops nothing.
-- ============================================================================

USE `futura`;

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- 1. Home page hero. The settings table is key value, and the home page reads
--    the key hero_image through /api/settings.
-- ---------------------------------------------------------------------------

INSERT INTO `settings` (`key`, `value`) VALUES
  ('hero_image', '/photos/showroom-tiered-stand-ivory.jpg')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- ---------------------------------------------------------------------------
-- 2. Collections. Each material group gets a hero for its detail page and a
--    cover for its card. Where the set holds two honest photographs of the
--    same material they are used, otherwise the same photo serves both slots.
-- ---------------------------------------------------------------------------

UPDATE `collections`
   SET `hero_image`  = '/photos/silver-white-favour-display.jpg',
       `cover_image` = '/photos/silver-white-favour-display.jpg'
 WHERE `slug` = 'silver';

UPDATE `collections`
   SET `hero_image`  = '/photos/miledi-home-fragrance-diffusers.jpg',
       `cover_image` = '/photos/glass-bowl-crystal-lotus-lid.jpg'
 WHERE `slug` = 'vetro';

UPDATE `collections`
   SET `hero_image`  = '/photos/crystal-flower-centrepiece.jpg',
       `cover_image` = '/photos/crystal-flower-centrepiece.jpg'
 WHERE `slug` = 'cristallo';

UPDATE `collections`
   SET `hero_image`  = '/photos/ceramic-favour-santa-cresima.jpg',
       `cover_image` = '/photos/ceramic-favour-santa-cresima.jpg'
 WHERE `slug` = 'porcellana';

UPDATE `collections`
   SET `hero_image`  = '/photos/showroom-painted-table-clocks.jpg',
       `cover_image` = '/photos/showroom-painted-table-clocks.jpg'
 WHERE `slug` = 'orologi-da-tavolo';

UPDATE `collections`
   SET `hero_image`  = '/photos/crystal-butterfly-favours.jpg',
       `cover_image` = '/photos/crystal-butterfly-favours.jpg'
 WHERE `slug` = 'stile-murano';

-- ---------------------------------------------------------------------------
-- 3. Social sharing image per route. The HTML renderer turns these into an
--    absolute og:image tag. Landscape photographs are preferred where the set
--    holds one, because that is the shape social cards crop to.
-- ---------------------------------------------------------------------------

UPDATE `pages_meta` SET `og_image` = '/photos/showroom-tiered-stand-ivory.jpg' WHERE `route` = '/';
UPDATE `pages_meta` SET `og_image` = '/photos/showroom-painted-table-clocks.jpg' WHERE `route` = '/chi-siamo';
UPDATE `pages_meta` SET `og_image` = '/photos/silver-white-favour-display.jpg' WHERE `route` = '/collezioni';
UPDATE `pages_meta` SET `og_image` = '/photos/silver-white-favour-display.jpg' WHERE `route` = '/collezioni/silver';
UPDATE `pages_meta` SET `og_image` = '/photos/glass-bowl-crystal-lotus-lid.jpg' WHERE `route` = '/collezioni/vetro';
UPDATE `pages_meta` SET `og_image` = '/photos/crystal-flower-centrepiece.jpg' WHERE `route` = '/collezioni/cristallo';
UPDATE `pages_meta` SET `og_image` = '/photos/ceramic-favour-santa-cresima.jpg' WHERE `route` = '/collezioni/porcellana';
UPDATE `pages_meta` SET `og_image` = '/photos/showroom-painted-table-clocks.jpg' WHERE `route` = '/collezioni/orologi-da-tavolo';
UPDATE `pages_meta` SET `og_image` = '/photos/crystal-butterfly-favours.jpg' WHERE `route` = '/collezioni/stile-murano';
UPDATE `pages_meta` SET `og_image` = '/photos/gold-auguri-favour-table.jpg' WHERE `route` = '/occasioni';
UPDATE `pages_meta` SET `og_image` = '/photos/showroom-tiered-stand-ivory.jpg' WHERE `route` = '/dove-si-trova';
UPDATE `pages_meta` SET `og_image` = '/photos/white-gold-wedding-favours.jpg' WHERE `route` = '/contatti';

-- End of 004. Product images are not written here: the products table is still
-- empty, and product names must come from the owner, never from the agent.
