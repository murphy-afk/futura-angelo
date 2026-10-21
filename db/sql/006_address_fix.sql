-- ============================================================================
-- Futura di Lacalamita Angelo
-- 006_address_fix.sql
--
-- Corrects the shop address after the owner confirmed it: Via Novara 105,
-- 20153 Milano. Earlier data carried Via Novara 34, 20147, taken from the
-- Google Maps listing. The street number and CAP were wrong, the coordinates
-- were already correct: Via Novara 105 geocodes to 45.4731145, 9.1182994,
-- which is the point already stored in geo_lat and geo_lng. No coordinate
-- change is needed.
--
-- This supersedes the address block in 002_seed.sql. That script is left
-- untouched because it has already been run.
--
-- The address is read from `settings` by the header, footer, contact page,
-- the Dove si trova page and the LocalBusiness JSON-LD, so this single
-- correction reaches every place the address appears.
--
-- Safe to run again: the UPDATEs are idempotent.
-- ============================================================================

USE `futura`;

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- 1. Street number and CAP in the settings table.
-- ---------------------------------------------------------------------------

UPDATE `settings`
   SET `value` = 'Via Novara 105'
 WHERE `key` = 'address_street';

UPDATE `settings`
   SET `value` = '20153'
 WHERE `key` = 'address_zip';

-- ---------------------------------------------------------------------------
-- 2. The showroom row in the retailers table. It is the row flagged
--    is_showroom = 1, seeded as the first point of sale.
-- ---------------------------------------------------------------------------

UPDATE `retailers`
   SET `address` = 'Via Novara 105, 20153 Milano'
 WHERE `is_showroom` = 1;

-- End of 006.
