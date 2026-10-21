-- ============================================================================
-- Futura di Lacalamita Angelo
-- 005_occasions_image.sql
--
-- Run after 004_photos.sql. Gives the occasions table an image column so the
-- Occasioni page and its cards can show a photograph for each ceremony, then
-- points every seeded occasion at a matching photograph.
--
-- The paths are keys of client/src/lib/photo-manifest.json, written by the
-- image pipeline. A path the manifest no longer knows renders the neutral
-- placeholder rather than breaking the page. Rebuild with `npm run images`.
--
-- Safe to run again: the ALTER is guarded through information_schema and the
-- UPDATEs are idempotent.
-- ============================================================================

USE `futura`;

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- 1. Add the column, but only if it is not already there, so the script can be
--    re run in MySQL Workbench without failing.
-- ---------------------------------------------------------------------------

SET @has_image = (
  SELECT COUNT(*)
    FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME   = 'occasions'
     AND COLUMN_NAME  = 'image'
);

SET @add_image = IF(
  @has_image = 0,
  'ALTER TABLE `occasions` ADD COLUMN `image` VARCHAR(255) DEFAULT NULL AFTER `description`',
  'SELECT 1'
);

PREPARE add_image_stmt FROM @add_image;
EXECUTE add_image_stmt;
DEALLOCATE PREPARE add_image_stmt;

-- ---------------------------------------------------------------------------
-- 2. One photograph per ceremony, chosen from what the set actually shows.
-- ---------------------------------------------------------------------------

UPDATE `occasions`
   SET `image` = '/photos/jute-pouches-blue-bows-rings.jpg'
 WHERE `slug` = 'matrimonio';

UPDATE `occasions`
   SET `image` = '/photos/satin-bomboniere-pink-bows.jpg'
 WHERE `slug` = 'battesimo';

UPDATE `occasions`
   SET `image` = '/photos/blue-organza-confetti-pouches.jpg'
 WHERE `slug` = 'comunione';

UPDATE `occasions`
   SET `image` = '/photos/ceramic-favour-santa-cresima.jpg'
 WHERE `slug` = 'cresima';

UPDATE `occasions`
   SET `image` = '/photos/red-graduation-pouches-mortarboard.jpg'
 WHERE `slug` = 'laurea';

UPDATE `occasions`
   SET `image` = '/photos/blue-tiered-birth-display.jpg'
 WHERE `slug` = 'nascita';

UPDATE `occasions`
   SET `image` = '/photos/gold-auguri-favour-table.jpg'
 WHERE `slug` = 'anniversario';

-- End of 005.
