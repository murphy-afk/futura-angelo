-- ============================================================================
-- Futura di Lacalamita Angelo
-- 001_schema.sql
--
-- Eseguire questo script a mano in MySQL Workbench, in ordine numerico.
-- Il server non crea mai tabelle: questo file e l'unica fonte dello schema.
--
-- Requisiti: MySQL 8.0 o superiore.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `futura`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `futura`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- Impostazioni del negozio, coppie chiave valore.
-- Nome, recapiti, indirizzo, orari e dati per le richiami strutturate.
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `key`        VARCHAR(64)  NOT NULL,
  `value`      TEXT         NOT NULL,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Collezioni. Una riga per gruppo di materiale.
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `collections`;
CREATE TABLE `collections` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`             VARCHAR(120) NOT NULL,
  `name`             VARCHAR(160) NOT NULL,
  `material`         VARCHAR(80)  NOT NULL,
  `line_count`       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `short_description` VARCHAR(255) DEFAULT NULL,
  `long_description`  TEXT         DEFAULT NULL,
  `hero_image`       VARCHAR(255) DEFAULT NULL,
  `cover_image`      VARCHAR(255) DEFAULT NULL,
  `sort_order`       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `published`        TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_collections_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Prodotti singoli dentro una collezione.
-- Le immagini arrivano nella sessione 3, per questo i campi sono nullable.
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `collection_id` INT UNSIGNED NOT NULL,
  `slug`          VARCHAR(120) NOT NULL,
  `name`          VARCHAR(160) NOT NULL,
  `description`   TEXT         DEFAULT NULL,
  `image`         VARCHAR(255) DEFAULT NULL,
  `material`      VARCHAR(80)  DEFAULT NULL,
  `is_featured`   TINYINT(1)   NOT NULL DEFAULT 0,
  `sort_order`    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `published`     TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  KEY `idx_products_collection` (`collection_id`),
  CONSTRAINT `fk_products_collection`
    FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Occasioni: matrimonio, battesimo, comunione e cosi via.
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `occasions`;
CREATE TABLE `occasions` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`        VARCHAR(120) NOT NULL,
  `name`        VARCHAR(120) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `sort_order`  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `published`   TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_occasions_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Collegamento molti a molti tra prodotti e occasioni.
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `product_occasions`;
CREATE TABLE `product_occasions` (
  `product_id`   INT UNSIGNED NOT NULL,
  `occasion_id`  INT UNSIGNED NOT NULL,
  PRIMARY KEY (`product_id`, `occasion_id`),
  KEY `idx_po_occasion` (`occasion_id`),
  CONSTRAINT `fk_po_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_po_occasion`
    FOREIGN KEY (`occasion_id`) REFERENCES `occasions` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Punti vendita. Le bomboniere si vendono solo attraverso questi punti.
-- Il negozio stesso e la prima riga.
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `retailers`;
CREATE TABLE `retailers` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(160) NOT NULL,
  `city`        VARCHAR(120) NOT NULL,
  `address`     VARCHAR(255) NOT NULL,
  `region`      VARCHAR(120) DEFAULT NULL,
  `phone`       VARCHAR(40)  DEFAULT NULL,
  `website`     VARCHAR(255) DEFAULT NULL,
  `latitude`    DECIMAL(10,7) DEFAULT NULL,
  `longitude`   DECIMAL(10,7) DEFAULT NULL,
  `is_showroom` TINYINT(1)   NOT NULL DEFAULT 0,
  `sort_order`  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `published`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_retailers_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Richieste di contatto dal modulo. Unica scrittura pubblica del sito.
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `leads`;
CREATE TABLE `leads` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type`       ENUM('privato','rivenditore') NOT NULL DEFAULT 'privato',
  `name`       VARCHAR(160) NOT NULL,
  `email`      VARCHAR(190) NOT NULL,
  `phone`      VARCHAR(40)  DEFAULT NULL,
  `occasion`   VARCHAR(80)  DEFAULT NULL,
  `message`    TEXT         NOT NULL,
  `status`     ENUM('nuovo','in_corso','chiuso') NOT NULL DEFAULT 'nuovo',
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leads_status` (`status`),
  KEY `idx_leads_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Meta tag SEO per ogni route, lette dal renderer HTML in produzione.
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `pages_meta`;
CREATE TABLE `pages_meta` (
  `route`       VARCHAR(190) NOT NULL,
  `title`       VARCHAR(160) NOT NULL,
  `description` VARCHAR(300) NOT NULL,
  `og_image`    VARCHAR(255) DEFAULT NULL,
  `canonical`   VARCHAR(255) DEFAULT NULL,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`route`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Utenti amministrativi per l'area admin della sessione 6.
-- La password e memorizzata come hash bcrypt, mai in chiaro.
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`         VARCHAR(190) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` TIMESTAMP    NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Fine dello schema. Prosegui con 002_seed.sql.
