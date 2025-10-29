-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 16 sep. 2025 à 12:32
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `maillot`
--

-- --------------------------------------------------------

--
-- Structure de la table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `first_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FR',
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `addresses_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `carts`
--

DROP TABLE IF EXISTS `carts`;
CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carts_user_id_unique` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 8, '2025-07-13 20:09:40', '2025-07-13 20:09:40'),
(2, 13, '2025-07-13 21:17:26', '2025-07-13 21:17:26'),
(3, 1, '2025-07-13 21:58:38', '2025-07-13 21:58:38'),
(4, 14, '2025-07-13 23:21:05', '2025-07-13 23:21:05'),
(5, 10, '2025-07-14 01:51:11', '2025-07-14 01:51:11'),
(6, 3, '2025-07-15 09:01:42', '2025-07-15 09:01:42'),
(7, 5, '2025-07-15 11:51:40', '2025-07-15 11:51:40'),
(8, 6, '2025-07-16 07:16:52', '2025-07-16 07:16:52'),
(9, 11, '2025-07-16 10:17:16', '2025-07-16 10:17:16'),
(10, 15, '2025-07-16 17:11:59', '2025-07-16 17:11:59'),
(11, 7, '2025-07-17 05:56:53', '2025-07-17 05:56:53'),
(12, 4, '2025-07-17 07:46:47', '2025-07-17 07:46:47'),
(13, 2, '2025-07-18 06:21:45', '2025-07-18 06:21:45'),
(14, 12, '2025-07-20 00:48:09', '2025-07-20 00:48:09'),
(15, 9, '2025-07-21 11:07:13', '2025-07-21 11:07:13'),
(16, 17, '2025-07-21 19:05:41', '2025-07-21 19:05:41'),
(17, 18, '2025-07-22 11:32:47', '2025-07-22 11:32:47'),
(18, 16, '2025-07-29 16:52:48', '2025-07-29 16:52:48');

-- --------------------------------------------------------

--
-- Structure de la table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cart_id` bigint UNSIGNED NOT NULL,
  `maillot_id` bigint UNSIGNED NOT NULL,
  `size` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `numero` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_items_cart_id_foreign` (`cart_id`),
  KEY `cart_items_maillot_id_foreign` (`maillot_id`)
) ENGINE=MyISAM AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `maillot_id`, `size`, `quantity`, `created_at`, `updated_at`, `numero`, `nom`) VALUES
(138, 1, 188, 'XL', 3, '2025-07-22 09:59:49', '2025-07-25 09:17:50', '33', 'ZORRO'),
(114, 2, 185, 'S', 2, '2025-07-20 00:22:00', '2025-07-23 07:08:21', NULL, NULL),
(7, 4, 177, 'XL', 2, '2025-07-15 05:59:45', '2025-07-25 07:19:18', NULL, 'LULOL'),
(8, 4, 188, 'XL', 3, '2025-07-15 06:35:53', '2025-07-25 07:19:29', NULL, 'LUBLEU'),
(140, 17, 2, 'XL', 3, '2025-07-22 11:33:39', '2025-07-22 11:55:37', '31', 'ULYSSE'),
(153, 3, 389, 'XL', 3, '2025-07-25 22:32:44', '2025-07-25 23:19:55', '88', 'AL BUNDY'),
(154, 3, 1, 'XL', 1, '2025-07-25 22:42:28', '2025-07-25 22:42:28', '97', 'BUNDY FRANCE'),
(19, 3, 188, 'XL', 3, '2025-07-15 07:40:00', '2025-07-25 23:20:06', '0', 'AL FRANCE'),
(20, 3, 36, 'XL', 1, '2025-07-15 07:41:37', '2025-07-25 23:20:47', '99', 'AL OL'),
(21, 3, 2, 'XL', 1, '2025-07-15 07:46:44', '2025-07-25 23:20:35', '57', 'BUNDY FRA EXT'),
(129, 7, 36, 'S', 3, '2025-07-21 10:05:35', '2025-07-21 11:26:54', '11', 'Marion OL'),
(146, 1, 371, 'XL', 2, '2025-07-25 08:09:09', '2025-07-25 08:09:09', '00', 'Zorro le renard'),
(27, 4, 176, 'L', 3, '2025-07-15 09:52:56', '2025-07-25 09:50:25', '10', 'LACAZETTE'),
(130, 5, 177, 'XL', 3, '2025-07-21 10:06:36', '2025-07-22 11:02:54', '69', 'Azerty OL'),
(29, 1, 178, 'XL', 2, '2025-07-15 10:05:02', '2025-07-15 10:05:02', '10', 'GIRESSE'),
(147, 1, 363, 'XL', 4, '2025-07-25 09:18:34', '2025-07-25 09:19:26', '2', 'Z le renard'),
(131, 7, 182, 'S', 2, '2025-07-21 10:07:00', '2025-07-21 11:27:33', '33', 'Marion Bordeaux'),
(124, 1, 36, 'XL', 3, '2025-07-20 01:58:58', '2025-07-20 01:58:58', '22', 'zorro'),
(132, 7, 1, 'S', 4, '2025-07-21 10:08:04', '2025-07-21 10:14:06', '52', 'Marion L'),
(39, 4, 36, 'L', 1, '2025-07-15 11:49:17', '2025-07-25 07:21:14', '87', 'Lulu'),
(157, 6, 182, 'XL', 1, '2025-07-26 01:04:07', '2025-08-29 21:27:27', '21', 'LOLO RIG'),
(126, 7, 177, 'S', 3, '2025-07-20 03:10:50', '2025-07-21 11:27:00', '69', 'MARION OL25'),
(159, 18, 385, 'L', 3, '2025-07-29 16:52:48', '2025-07-29 16:53:32', '47', 'Lucien'),
(160, 6, 185, 'XL', 3, '2025-08-29 21:25:54', '2025-08-29 21:27:16', NULL, NULL),
(156, 6, 384, 'XL', 2, '2025-07-26 01:03:32', '2025-08-29 21:29:12', NULL, NULL),
(151, 10, 188, 'S', 2, '2025-07-25 09:27:03', '2025-07-25 09:27:03', '21', 'MICHELLE'),
(137, 16, 176, 'S', 2, '2025-07-21 19:05:41', '2025-07-21 19:05:41', '89', 'ALF'),
(155, 6, 385, 'XL', 2, '2025-07-26 01:02:43', '2025-07-26 01:02:43', '21', 'LOLO'),
(115, 2, 63, 'S', 1, '2025-07-20 00:25:59', '2025-07-20 00:25:59', '23', 'minnie'),
(52, 4, 180, 'XL', 2, '2025-07-16 06:47:52', '2025-07-25 07:22:41', '99', 'Lulu'),
(53, 8, 177, 'XL', 2, '2025-07-16 07:18:44', '2025-07-16 07:18:44', '47', 'Magnum'),
(54, 5, 188, 'L', 3, '2025-07-16 07:39:30', '2025-07-22 11:08:46', '18', 'azerty2018'),
(55, 5, 176, 'XL', 2, '2025-07-16 07:56:57', '2025-07-22 11:00:39', '75', 'AzerTY'),
(56, 9, 188, 'XL', 2, '2025-07-16 10:17:54', '2025-07-16 10:17:54', '22', 'Mc Nulty'),
(152, 2, 369, 'S', 1, '2025-07-25 20:36:03', '2025-07-25 20:36:03', '88', 'MINA PORTABLE'),
(150, 10, 177, 'S', 1, '2025-07-25 09:25:08', '2025-07-25 09:25:08', '21', 'MIMI'),
(60, 11, 176, 'L', 1, '2025-07-17 07:15:52', '2025-07-17 07:15:52', '88', 'Raïs'),
(136, 15, 177, 'S', 3, '2025-07-21 11:09:15', '2025-07-21 12:43:51', '11', 'ALICIA C'),
(86, 12, 177, 'S', 2, '2025-07-17 10:51:54', '2025-07-21 10:52:52', '69', 'SO SO'),
(87, 12, 35, 'S', 1, '2025-07-17 10:53:33', '2025-07-21 19:08:21', '69', 'SO OL'),
(96, 5, 180, 'XL', 3, '2025-07-17 19:44:30', '2025-07-21 09:36:15', '23', 'AZerTY'),
(98, 5, 1, 'L', 2, '2025-07-17 20:13:39', '2025-07-22 11:03:14', '55', 'Azerty'),
(99, 9, 176, 'L', 2, '2025-07-17 20:15:59', '2025-07-17 20:15:59', '75', 'Mc Nulty'),
(100, 9, 177, 'L', 1, '2025-07-17 20:17:49', '2025-07-17 20:17:49', '7', 'MC NultY'),
(102, 13, 177, 'S', 1, '2025-07-18 06:23:44', '2025-07-18 06:23:44', '4', 'ADHRIT'),
(103, 13, 1, 'S', 1, '2025-07-18 06:24:17', '2025-07-18 06:24:17', '4', 'AdhriT'),
(104, 13, 182, 'S', 1, '2025-07-18 06:28:36', '2025-07-18 06:28:36', '14', 'Anagha'),
(113, 2, 176, 'S', 1, '2025-07-19 01:49:14', '2025-07-19 01:49:14', '28', 'MinA'),
(112, 2, 1, 'S', 1, '2025-07-18 23:44:45', '2025-07-18 23:44:45', '28', 'Mina Bell@'),
(110, 2, 177, 'S', 1, '2025-07-18 20:20:12', '2025-07-18 20:20:12', '69', 'MINA B'),
(111, 2, 182, 'S', 2, '2025-07-18 22:00:54', '2025-07-18 22:00:54', '33', 'MINA BELLA'),
(134, 12, 1, 'S', 3, '2025-07-21 10:15:44', '2025-07-21 10:21:59', '33', 'Sophie bleue'),
(135, 12, 176, 'S', 3, '2025-07-21 10:56:36', '2025-07-21 10:57:38', '69', 'SO LYON'),
(120, 14, 29, 'XL', 2, '2025-07-20 01:05:02', '2025-07-20 01:05:02', '11', 'EIKICHI'),
(121, 14, 184, 'XL', 3, '2025-07-20 01:20:28', '2025-07-20 01:20:28', '99', 'ONIZUKA'),
(122, 14, 176, 'XL', 3, '2025-07-20 01:30:09', '2025-07-20 01:30:09', '69', 'ONIZUKA'),
(123, 14, 178, 'XL', 3, '2025-07-20 01:31:56', '2025-07-20 01:31:56', '22', 'EIKICHI'),
(133, 7, 188, 'S', 1, '2025-07-21 10:08:20', '2025-07-21 11:27:03', '18', 'marion'),
(139, 16, 1, 'S', 2, '2025-07-22 10:10:52', '2025-07-22 11:30:51', '23', 'ALF Gordon'),
(141, 17, 176, 'L', 2, '2025-07-22 11:55:26', '2025-07-22 11:55:26', '31', 'ULYSSE');

-- --------------------------------------------------------

--
-- Structure de la table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
CREATE TABLE IF NOT EXISTS `clubs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clubs_slug_unique` (`slug`)
) ENGINE=MyISAM AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `clubs`
--

INSERT INTO `clubs` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'France', 'france', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(2, 'Brésil', 'bresil', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(3, 'Espagne', 'espagne', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(4, 'Pays-Bas', 'pays-bas', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(5, 'Belgique', 'belgique', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(6, 'Sénégal', 'senegal', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(7, 'Côte d\'Ivoire', 'cote-divoire', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(8, 'Maroc', 'maroc', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(9, 'Suisse', 'suisse', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(10, 'Pologne', 'pologne', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(11, 'Croatie', 'croatie', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(12, 'Suède', 'suede', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(13, 'Danemark', 'danemark', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(14, 'Ukraine', 'ukraine', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(15, 'Japon', 'japon', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(16, 'Corée du Sud', 'coree-du-sud', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(17, 'Mexique', 'mexique', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(18, 'Olympique Lyonnais', 'olympique-lyonnais', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(19, 'Girondins de Bordeaux', 'girondins-de-bordeaux', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(20, 'Lille', 'lille', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(21, 'Monaco', 'monaco', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(22, 'Nice', 'nice', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(23, 'Rennes', 'rennes', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(24, 'Strasbourg', 'strasbourg', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(25, 'Toulouse', 'toulouse', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(26, 'Nantes', 'nantes', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(27, 'Montpellier', 'montpellier', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(28, 'Lens', 'lens', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(29, 'Reims', 'reims', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(30, 'Angers', 'angers', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(31, 'Auxerre', 'auxerre', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(32, 'Liverpool', 'liverpool', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(33, 'Manchester City', 'manchester-city', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(34, 'Arsenal', 'arsenal', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(35, 'Chelsea', 'chelsea', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(36, 'Tottenham Hotspur', 'tottenham-hotspur', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(37, 'Leicester City', 'leicester-city', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(38, 'Aston Villa', 'aston-villa', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(39, 'Newcastle United', 'newcastle-united', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(40, 'Everton', 'everton', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(41, 'Wolverhampton Wanderers', 'wolves', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(42, 'Brighton & Hove Albion', 'brighton', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(43, 'Crystal Palace', 'crystal-palace', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(44, 'Brentford', 'brentford', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(45, 'Fulham', 'fulham', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(46, 'Bayern Munich', 'bayern-munich', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(47, 'Borussia Dortmund', 'borussia-dortmund', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(48, 'RB Leipzig', 'rb-leipzig', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(49, 'Bayer Leverkusen', 'bayer-leverkusen', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(50, 'Borussia Mönchengladbach', 'borussia-monchengladbach', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(51, 'VfL Wolfsburg', 'wolfsburg', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(52, 'Eintracht Francfort', 'eintracht-francfort', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(53, 'Hoffenheim', 'hoffenheim', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(54, 'Hertha Berlin', 'hertha-berlin', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(55, 'VfB Stuttgart', 'stuttgart', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(56, 'FC Cologne', 'cologne', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(57, 'Schalke 04', 'schalke-04', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(58, 'Atletico Madrid', 'atletico-madrid', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(59, 'Athletic Bilbao', 'athletic-bilbao', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(60, 'Real Madrid', 'real-madrid', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(61, 'FC Barcelone', 'fc-barcelone', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(62, 'Real Sociedad', 'real-sociedad', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(63, 'Valence CF', 'valence-cf', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(64, 'Villarreal', 'villarreal', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(65, 'Sevilla FC', 'sevilla-fc', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(66, 'Real Betis', 'real-betis', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(67, 'Celta Vigo', 'celta-vigo', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(68, 'Espanyol', 'espanyol', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(69, 'Inter Milan', 'inter-milan', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(70, 'Naples', 'naples', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(71, 'Juventus', 'juventus', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(72, 'AC Milan', 'ac-milan', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(73, 'AS Roma', 'as-roma', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(74, 'Lazio Rome', 'lazio-rome', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(75, 'Atalanta', 'atalanta', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(76, 'Fiorentina', 'fiorentina', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(77, 'Torino', 'torino', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(78, 'Bologne', 'bologne', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(79, 'Porto', 'porto', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(80, 'Benfica', 'benfica', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(81, 'Sporting CP', 'sporting-cp', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(82, 'Galatasaray', 'galatasaray', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(83, 'Fenerbahçe', 'fenerbahce', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(84, 'Celtic FC', 'celtic-fc', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(85, 'Rangers FC', 'rangers-fc', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(86, 'Ajax Amsterdam', 'ajax-amsterdam', '2025-07-10 22:43:34', '2025-07-10 22:43:34'),
(87, 'PSV Eindhoven', 'psv-eindhoven', '2025-07-10 22:43:34', '2025-07-10 22:43:34');

-- --------------------------------------------------------

--
-- Structure de la table `maillots`
--

DROP TABLE IF EXISTS `maillots`;
CREATE TABLE IF NOT EXISTS `maillots` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `club_id` bigint UNSIGNED NOT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `price` decimal(8,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `maillots_club_id_foreign` (`club_id`)
) ENGINE=MyISAM AUTO_INCREMENT=397 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `maillots`
--

INSERT INTO `maillots` (`id`, `club_id`, `nom`, `image`, `created_at`, `updated_at`, `price`) VALUES
(1, 1, 'Domicile 2024', 'images/maillot/images_maillot/france.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(2, 1, 'Extérieur 2024', 'images/maillot/images_maillot/france_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(3, 2, 'Domicile 2024', 'images/maillot/images_maillot/bresil.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(4, 2, 'Extérieur 2025', 'images/maillot/images_maillot/bresil26_exterieur.webp', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(5, 3, 'Domicile 2024', 'images/maillot/images_maillot/espagne_24_domicile.webp', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(6, 3, 'Extérieur 2024', 'images/maillot/images_maillot/espagne_24_exterieur_jaune.webp', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(7, 4, 'Domicile 2024', 'images/maillot/images_maillot/pays_bas_24_domicile.webp', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(8, 4, 'Extérieur 2024', 'images/maillot/images_maillot/pays_bas_24_exterieur.webp', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(9, 5, 'Domicile 2024', 'belgique_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(10, 5, 'Extérieur 2024', 'belgique_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(11, 6, 'Domicile 2024', 'senegal_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(12, 6, 'Extérieur 2024', 'senegal_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(13, 7, 'Domicile 2024', 'cote-d-ivoire_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(14, 7, 'Extérieur 2024', 'cote-d-ivoire_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(15, 8, 'Domicile 2024', 'images/maillot/images_maillot/maroc.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(16, 8, 'Extérieur 2024', 'images/maillot/images_maillot/maroc_24_25_exterieur_blanc.webp', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(17, 9, 'Domicile 2024', 'suisse_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(18, 9, 'Extérieur 2024', 'suisse_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(19, 10, 'Domicile 2024', 'images/maillot/images_maillot/pologne.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(20, 10, 'Extérieur 2024', 'images/maillot/images_maillot/pologne_exterieur.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(21, 11, 'Domicile 2024', 'croatie_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(22, 11, 'Extérieur 2024', 'croatie_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(23, 12, 'Domicile 2024', 'suede_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(24, 12, 'Extérieur 2024', 'suede_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(25, 13, 'Domicile 2024', 'danemark_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(26, 13, 'Extérieur 2024', 'danemark_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(27, 14, 'Domicile 2024', 'ukraine_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(28, 14, 'Extérieur 2024', 'ukraine_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(29, 15, 'Domicile 2024', 'images/maillot/images_maillot/japon.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(30, 15, 'Extérieur 2024', 'images/maillot/images_maillot/japon_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(31, 16, 'Domicile 2024', 'coree-du-sud_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(32, 16, 'Extérieur 2024', 'coree-du-sud_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(33, 17, 'Domicile 2024', 'mexique_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(34, 17, 'Extérieur 2024', 'mexique_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(35, 18, 'Domicile 2024\r\n', 'images/maillot/images_maillot/OL_Domicile_2024_2025.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(36, 18, 'Extérieur 2024', 'images/maillot/images_maillot/ol_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(37, 19, 'Domicile 2024', 'images/maillot/images_maillot/bordeaux.jfif\r\n', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(38, 19, 'Extérieur 2024', 'images/maillot/images_maillot/bordeaux_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(39, 20, 'Domicile 2024', 'images/maillot/images_maillot/losc26.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(40, 20, 'Extérieur 2024', 'images/maillot/images_maillot/losc26_exterieur.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(41, 21, 'Domicile 2024', 'monaco_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(42, 21, 'Extérieur 2024', 'monaco_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(43, 22, 'Domicile 2024', 'nice_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(44, 22, 'Extérieur 2024', 'nice_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(45, 23, 'Domicile 2024', 'rennes_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(46, 23, 'Extérieur 2024', 'rennes_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(47, 24, 'Domicile 2024', 'strasbourg_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(48, 24, 'Extérieur 2024', 'strasbourg_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(49, 25, 'Domicile 2024', 'toulouse_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(50, 25, 'Extérieur 2024', 'toulouse_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(51, 26, 'Domicile 2024', 'nantes_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(52, 26, 'Extérieur 2024', 'nantes_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(53, 27, 'Domicile 2024', 'montpellier_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(54, 27, 'Extérieur 2024', 'montpellier_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(55, 28, 'Domicile 2024', 'lens_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(56, 28, 'Extérieur 2024', 'lens_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(57, 29, 'Domicile 2024', 'reims_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(58, 29, 'Extérieur 2024', 'reims_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(59, 30, 'Domicile 2024', 'angers_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(60, 30, 'Extérieur 2024', 'angers_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(61, 31, 'Domicile 2024', 'auxerre_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(62, 31, 'Extérieur 2024', 'auxerre_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(63, 32, 'Domicile 2024', 'images/maillot/images_maillot/liverpool.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(64, 32, 'Extérieur 2024', 'images/maillot/images_maillot/liverpool_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(65, 33, 'Domicile 2024', 'images/maillot/images_maillot/mancity.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(66, 33, 'Extérieur 2024', 'images/maillot/images_maillot/mancity_third.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(67, 34, 'Domicile 2024', 'images/maillot/images_maillot/arsenal26.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(68, 34, 'Extérieur 2024', 'images/maillot/images_maillot/arsenal26_exterieur.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(69, 35, 'Domicile 2024', 'images/maillot/images_maillot/chelsea26.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(70, 35, 'Extérieur 2024', 'images/maillot/images_maillot/chelsea26_exterieur.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(71, 36, 'Domicile 2024', 'tottenham-hotspur_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(72, 36, 'Extérieur 2024', 'tottenham-hotspur_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(73, 37, 'Domicile 2024', 'leicester-city_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(74, 37, 'Extérieur 2024', 'leicester-city_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(75, 38, 'Domicile 2024', 'aston-villa_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(76, 38, 'Extérieur 2024', 'aston-villa_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(77, 39, 'Domicile 2024', 'newcastle-united_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(78, 39, 'Extérieur 2024', 'newcastle-united_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(79, 40, 'Domicile 2024', 'everton_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(80, 40, 'Extérieur 2024', 'everton_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(81, 41, 'Domicile 2024', 'wolverhampton-wanderers_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(82, 41, 'Extérieur 2024', 'wolverhampton-wanderers_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(83, 42, 'Domicile 2024', 'brighton-hove-albion_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(84, 42, 'Extérieur 2024', 'brighton-hove-albion_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(85, 43, 'Domicile 2024', 'crystal-palace_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(86, 43, 'Extérieur 2024', 'crystal-palace_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(87, 44, 'Domicile 2024', 'brentford_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(88, 44, 'Extérieur 2024', 'brentford_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(89, 45, 'Domicile 2024', 'fulham_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(90, 45, 'Extérieur 2024', 'fulham_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(91, 46, 'Domicile 2024', 'images/maillot/images_maillot/bayern.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(92, 46, 'Extérieur 2024', 'images/maillot/images_maillot/bayern_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(93, 47, 'Domicile 2024', 'images/maillot/images_maillot/borussia.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(94, 47, 'Extérieur 2024', 'images/maillot/images_maillot/borussia_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(95, 48, 'Domicile 2024', 'rb-leipzig_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(96, 48, 'Extérieur 2024', 'rb-leipzig_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(97, 49, 'Domicile 2024', 'images/maillot/images_maillot/leverkusen26.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(98, 49, 'Extérieur 2024', 'images/maillot/images_maillot/leverkusen26_exterieur.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(99, 50, 'Domicile 2024', 'borussia-monchengladbach_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(100, 50, 'Extérieur 2024', 'borussia-monchengladbach_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(101, 51, 'Domicile 2024', 'vfl-wolfsburg_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(102, 51, 'Extérieur 2024', 'vfl-wolfsburg_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(103, 52, 'Domicile 2024', 'eintracht-francfort_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(104, 52, 'Extérieur 2024', 'eintracht-francfort_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(105, 53, 'Domicile 2024', 'hoffenheim_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(106, 53, 'Extérieur 2024', 'hoffenheim_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(107, 54, 'Domicile 2024', 'hertha-berlin_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(108, 54, 'Extérieur 2024', 'hertha-berlin_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(109, 55, 'Domicile 2024', 'vfb-stuttgart_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(110, 55, 'Extérieur 2024', 'vfb-stuttgart_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(111, 56, 'Domicile 2024', 'fc-cologne_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(112, 56, 'Extérieur 2024', 'fc-cologne_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(113, 57, 'Domicile 2024', 'schalke-04_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(114, 57, 'Extérieur 2024', 'schalke-04_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(115, 58, 'Domicile 2024', 'images/maillot/images_maillot/atletico.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(116, 58, 'Extérieur 2024', 'images/maillot/images_maillot/atletico_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(117, 59, 'Domicile 2024', 'images/maillot/images_maillot/bilbao_dom.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(118, 59, 'Extérieur 2024', 'images/maillot/images_maillot/bilbao_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(119, 60, 'Domicile 2024', 'images/maillot/images_maillot/real26.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(120, 60, 'Extérieur 2024', 'images/maillot/images_maillot/real26_exterieur.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(121, 61, 'Domicile 2024', 'images/maillot/images_maillot/barcelone26.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(122, 61, 'Extérieur 2024', 'images/maillot/images_maillot/barcelone26_exterieur.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(123, 62, 'Domicile 2024', 'real-sociedad_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(124, 62, 'Extérieur 2024', 'real-sociedad_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(125, 63, 'Domicile 2024', 'valence-cf_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(126, 63, 'Extérieur 2024', 'valence-cf_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(127, 64, 'Domicile 2024', 'villarreal_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(128, 64, 'Extérieur 2024', 'villarreal_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(129, 65, 'Domicile 2024', 'sevilla-fc_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(130, 65, 'Extérieur 2024', 'sevilla-fc_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(131, 66, 'Domicile 2024', 'real-betis_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(132, 66, 'Extérieur 2024', 'real-betis_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(133, 67, 'Domicile 2024', 'celta-vigo_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(134, 67, 'Extérieur 2024', 'celta-vigo_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(135, 68, 'Domicile 2024', 'espanyol_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(136, 68, 'Extérieur 2024', 'espanyol_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(137, 69, 'Domicile 2024', 'images/maillot/images_maillot/inter.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(138, 69, 'Extérieur 2024', 'images/maillot/images_maillot/inter_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(139, 70, 'Domicile 2024', 'images/maillot/images_maillot/naples.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(140, 70, 'Extérieur 2024', 'images/maillot/images_maillot/naples_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(141, 71, 'Domicile 2024', 'images/maillot/images_maillot/juventus_25_26_domicile.webp', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(142, 71, 'Extérieur 2024', 'images/maillot/images_maillot/juventus_24_25_exterieur_jaune.webp', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(143, 72, 'Domicile 2024', 'images/maillot/images_maillot/milan_ac.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(144, 72, 'Extérieur 2024', 'images/maillot/images_maillot/milan_ac_ext.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(145, 73, 'Domicile 2025-2026', 'images/maillot/images_maillot/rome26.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(146, 73, 'Extérieur 2025-2026', 'images/maillot/images_maillot/rome26_exterieur.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(147, 74, 'Domicile 2024', 'lazio-rome_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(148, 74, 'Extérieur 2024', 'lazio-rome_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(149, 75, 'Domicile 2024', 'atalanta_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(150, 75, 'Extérieur 2024', 'atalanta_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(151, 76, 'Domicile 2024', 'fiorentina_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(152, 76, 'Extérieur 2024', 'fiorentina_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(153, 77, 'Domicile 2024', 'torino_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(154, 77, 'Extérieur 2024', 'torino_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(155, 78, 'Domicile 2024', 'bologne_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(156, 78, 'Extérieur 2024', 'bologne_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(157, 79, 'Domicile 2024', 'porto_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(158, 79, 'Extérieur 2024', 'porto_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(159, 80, 'Domicile 2024', 'benfica_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(160, 80, 'Extérieur 2024', 'benfica_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(161, 81, 'Domicile 2024', 'sporting-cp_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(162, 81, 'Extérieur 2024', 'sporting-cp_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(163, 82, 'Domicile 2024', 'galatasaray_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(164, 82, 'Extérieur 2024', 'galatasaray_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(165, 83, 'Domicile 2024', 'fenerbahce_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(166, 83, 'Extérieur 2024', 'fenerbahce_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(167, 84, 'Domicile 2024', 'celtic-fc_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(168, 84, 'Extérieur 2024', 'celtic-fc_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(169, 85, 'Domicile 2024', 'rangers-fc_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(170, 85, 'Extérieur 2024', 'rangers-fc_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(171, 86, 'Domicile 2024', 'images/maillot/images_maillot/ajax26.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(172, 86, 'Extérieur 2024', 'images/maillot/images_maillot/ajax26_exterieur.jfif', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(173, 87, 'Domicile 2024', 'psv-eindhoven_domicile_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(174, 87, 'Extérieur 2024', 'psv-eindhoven_exterieur_2024.jpg', '2025-07-10 22:51:44', '2025-07-10 22:51:44', 20.00),
(175, 18, 'maillot third', 'images/maillot/images_maillot/ol_third.jfif', NULL, NULL, 20.00),
(176, 18, 'Maillot 75 ans ', 'images/maillot/images_maillot/lyon_75ans.jfif', NULL, NULL, 20.00),
(177, 18, 'extérieur 2025/26', 'images/maillot/images_maillot/ol_exterieur_25_26.jfif', NULL, NULL, 20.00),
(178, 19, 'VINTAGE 1985 DOMICILE', 'images/maillot/images_maillot/bordeaux85.jpg', NULL, NULL, 20.00),
(186, 15, 'MAILLOT JAPON COUCHER DE SOLEIL ROUGE ', 'images/maillot/images_maillot/japon_soleil_rouge.webp', NULL, NULL, 20.00),
(180, 19, 'VINTAGE 1985-1987', 'images/maillot/images_maillot/bordeaux85_opel.jpg', NULL, NULL, 20.00),
(184, 15, 'dragon ', 'images/maillot/images_maillot/japon_dragon_noir_rose.webp', NULL, NULL, 20.00),
(182, 19, 'VINTAGE 1984 EXTERIEUR', 'images/maillot/images_maillot/bordeaux84_ext.jpg', NULL, NULL, 20.00),
(185, 15, 'Geisha ', 'images/maillot/images_maillot/geisha.webp', NULL, NULL, 20.00),
(187, 15, 'Japon Graffiti ', 'images/maillot/images_maillot/japon_graffiti.jpg', NULL, NULL, 20.00),
(188, 1, 'FRANCE 2018', 'images/maillot/images_maillot/france2018.jfif', NULL, NULL, 20.00),
(363, 15, 'japon fox', 'images/maillot/images_maillot/japon_fox.webp', NULL, NULL, 20.00),
(367, 15, 'Temple Blanc', 'images/maillot/images_maillot/japon_temple_blanc.webp', NULL, NULL, 20.00),
(368, 15, 'Dragon Ball vert', 'images/maillot/images_maillot/japon_dragon_ball_vert.webp', NULL, NULL, 20.00),
(369, 18, 'OL 2025-2026 domicile', 'images/maillot/images_maillot/ol_25_26_domicile.webp', NULL, NULL, 20.00),
(370, 18, 'OL 2025-2026 third', 'images/maillot/images_maillot/ol_25_26_third.webp', NULL, NULL, 20.00),
(371, 18, 'OL 75ans version player', 'images/maillot/images_maillot/ol_75ans_version_player.webp', NULL, NULL, 20.00),
(374, 3, 'Espagne Domicile 2024 Plaza Cibeles.webp', 'images/maillot/images_maillot/espagne_24_plaza_cibeles.webp', NULL, NULL, 20.00),
(375, 4, 'Pays Bas Lion bleu', 'images/maillot/images_maillot/pays_bas_lion_bleu.webp', NULL, NULL, 20.00),
(376, 3, 'Espagne 2024 rouge Edition spéciale ', 'images/maillot/images_maillot/espagne_24_rouge_edition_speciale.webp', NULL, NULL, 20.00),
(377, 3, 'Espagne 2024 jaune Edition spéciale ', 'images/maillot/images_maillot/espagne_24_jaune_edition_speciale.webp', NULL, NULL, 20.00),
(378, 1, 'FRANCE 2024 entrainement', 'images/maillot/images_maillot/france_24_entrainement.webp', NULL, NULL, 20.00),
(379, 1, 'FRANCE 20224 BALENCIAGA', 'images/maillot/images_maillot/france_balenciaga_24_bleu_marine.webp', NULL, NULL, 20.00),
(380, 1, 'VINTAGE FRANCE 98', 'images/maillot/images_maillot/france_98_domicile.webp', NULL, NULL, 20.00),
(381, 1, 'VINTAGE FRANCE 1982', 'images/maillot/images_maillot/france_1982_domicile.webp', NULL, NULL, 20.00),
(382, 15, 'Japon special samourai', 'images/maillot/images_maillot/japon_special_samourai.webp', NULL, NULL, 20.00),
(383, 1, '', 'images/maillot/images_maillot/France_25_concept_blanc.webp', NULL, NULL, 20.00),
(384, 19, 'VINTAGE  1983-84 ', 'images/maillot/images_maillot/bordeaux84.jfif', NULL, NULL, 20.00),
(385, 19, 'VINTAGE 1981-82', 'images/maillot/images_maillot/bordeaux81_82.jfif', NULL, NULL, 20.00),
(386, 19, 'Bordeaux Third 2025', 'images/maillot/images_maillot/bordeaux_third.jfif', NULL, NULL, 20.00),
(387, 19, 'BORDEAUX 1996', 'images/maillot/images_maillot/bordeaux96.jfif', NULL, NULL, 20.00),
(388, 19, 'VINTAGE 1995-96', 'images/maillot/images_maillot/bordeaux_95_96_exterieur.jfif', NULL, NULL, 20.00),
(389, 19, 'VINTAGE 1987-88', 'images/maillot/images_maillot/bordeaux_vintage_1987_1988_domicile.webp', NULL, NULL, 20.00),
(390, 2, 'Maillot concept 2025', 'images/maillot/images_maillot/bresil2.jfif', NULL, NULL, 20.00),
(391, 2, 'Brésil 2026 concept version', 'images/maillot/images_maillot/bresil26_concept_version.jfif', NULL, NULL, 20.00),
(392, 2, 'Brésil 2026 Edition speciale bleu K', 'images/maillot/images_maillot/bresil_26_edition_speciale_bleu_K.jpg', NULL, NULL, 20.00),
(393, 2, 'Brésil 2025 Extérieur', 'images/maillot/images_maillot/bresil_25_exterieurwebp.webp', NULL, NULL, 20.00),
(394, 2, 'Domicile 2025-26', 'images/maillot/images_maillot/bresil26.jfif', NULL, NULL, 20.00),
(395, 2, 'Brésil 2026 concept couleur', 'images/maillot/images_maillot/bresil26_concept_couleur.jpg', NULL, NULL, 20.00),
(396, 2, 'Brésil 2020-25 Edition speciale vert', 'images/maillot/images_maillot/bresil25_edition_speciale_vert.webp', NULL, NULL, 20.00);

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2025_05_14_122644_create_sessions_table', 1),
(2, '2025_06_07_001044_add_type_to_addresses_table', 1),
(3, '2025_06_17_144031_create_users_table', 1),
(4, '2025_06_17_144035_create_user_sessions_table', 1),
(5, '2025_06_17_144036_create_user_addresses_table', 1),
(6, '2025_06_26_123828_create_addresses_table', 1),
(7, '2025_07_10_112612_create_clubs_table', 1),
(8, '2025_07_10_112614_create_maillots_table', 1),
(9, '2025_07_13_034211_create_carts_table', 2),
(10, '2025_07_13_225109_update_cart_item_maillot_foreign', 3),
(11, '2025_07_14_025414_add_numero_nom_to_cart_items_table', 4),
(12, '2025_07_16_124954_add_price_to_maillots_table', 5);

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('hlktVQOYS5fcqxwUFUEid6xohuiMXP7mMScg7hxw', 8, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiNVZmQUdIcjFqTlhRUG9vOXhOdDRuZGprMzB3VDFjZkh2T3h6Nlo4RyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9yZW5uZXNfZXh0ZXJpZXVyXzIwMjQuanBnIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czoyODoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL3BhbmllciI7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjg7fQ==', 1757343013),
('wTL77Hkep0x1b1wW4JsynQdJn5LWNTERGeQIUdQW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmJReTBudDBBcEFvZFdHQ2JYbWs3UkhVWE1JV2VzdUVyQkNqNzYwcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1757426675),
('bw2LawqK1B8mJ7AvJACaxmoy1Dbi7gAJOPANGFNY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoibXdpa3NkV1NjYzU2RFJDVVZ1U3c4UVBKdVd6cFRESU9TbThLQ3ZXTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MzoidXJsIjthOjE6e3M6ODoiaW50ZW5kZWQiO3M6Mjg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9wYW5pZXIiO319', 1757428797),
('uNXeolhcXTReb5r0azScuYyztNZqRpHgO05Poja2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNlRIVDFaWFdWT0hlTElpdHRsNG42blNlc3NJelVoUGJzdGg5bFJXZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1757681760),
('4qIZGeeavC96WzH15R5xzf8pJAPsQsIFP7SWlDpH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTmhGY21uRmVYSjhDUHVHMDhoZ3d3ZjFXZnJFdDBha0FRWGI5UkhJMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1757685679),
('eSO91GiiYVFRpujm517gP26UCzeEdheIZplXyioL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRzZHUVVOQjBLSGlGcTZzVUJyMUhFSXdPWG5palFVTll0bndsUFV6cSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1757685865);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_email_index` (`email`),
  KEY `users_username_index` (`username`),
  KEY `users_is_active_index` (`is_active`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `first_name`, `last_name`, `phone`, `birth_date`, `gender`, `email_verified_at`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Albundy', 'albundy@gmail.com', '$2y$12$UvN5QMkeIWZ9jKthn5codO.qKMrFCFvNc8KwPsMJnRZIMOp1cMsGC', 'AL', 'BUNDY', '04 84 89 21 88', NULL, 'male', NULL, 1, NULL, '2025-07-10 10:18:44', '2025-09-08 10:08:05'),
(2, 'prasanna', 'prasann@yahoo.in', '$2y$12$O2AMY26P67ahq57agiSkXeWHCfqnoEdhRbse3QsN.wAXWWJa1.FtG', 'Prasanna Lakshmi', 'Darbha', '07 84 55 43 88', '1985-04-22', 'female', NULL, 1, NULL, '2025-07-10 10:22:18', '2025-07-10 10:30:44'),
(3, 'Lolo', 'lolo@gmail.com', '$2y$12$BKwgXMX9dDzQOKZH1nxw.uq24jq8BfQggGMKFnivcxrfIwiQNXfNa', 'Lolo', 'Rig', '04 78 46 05 93', '1987-02-21', 'male', NULL, 1, NULL, '2025-07-10 10:54:01', '2025-07-11 20:17:12'),
(4, 'Sophie69', 'sophie@gmail.com', '$2y$12$U6nJ4RHO9y.TiXoE3rdkgeD6e6.M4O0Mm5GDogmpkQwbvgdiBO1.2', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-07-10 11:04:45', '2025-07-10 11:04:45'),
(5, 'marion', 'marion@hotmail.com', '$2y$12$des/YkbbsYL9Ml/1r0YB6eu97Yzd7.LdCmhX.j69F4WFRhty/udYy', 'Marion', 'LABICHE', '06 18 45 23 82', NULL, 'female', NULL, 1, NULL, '2025-07-10 12:28:09', '2025-07-10 12:29:50'),
(6, 'magnum', 'magnum@yahoo.us', '$2y$12$JGfAGqsS.cugICQviXDLfOraM.waSjCidCnMP6.xsyXyyfprFkpZi', 'thomas', 'Magnum', '1234567890', NULL, 'male', NULL, 1, NULL, '2025-07-10 19:40:59', '2025-07-10 19:45:15'),
(7, 'raïs', 'rais@yahoo.fr', '$2y$12$S5cQ9VfHc7dG.A0maBwL..WaUcnDCIou/qFTm0qcnZ5TufsltAHU2', 'Raïs', 'Paqueta', '34 54 64 74 94', NULL, 'male', NULL, 1, NULL, '2025-07-11 06:57:03', '2025-07-11 07:31:51'),
(8, 'zorro', 'zorro@secret.cal', '$2y$12$YrOglQI3o/ZtqUv0uJ1DtOLH1OWlPfxn.0ThfJn48eHlwLHcohhru', 'Diego', 'De  la Vega', '88 14 29 52 44', NULL, 'male', NULL, 1, NULL, '2025-07-11 07:38:00', '2025-07-11 10:25:24'),
(9, 'alicia', 'alici@gmail.com', '$2y$12$0f6VNHGCijK2y1pfach9B.HjZGt2uhNnzZ42khGmDTpCBzaexSzju', 'alicia', 'chabane', '07 25 50 75 11', NULL, 'female', NULL, 1, NULL, '2025-07-11 10:34:28', '2025-07-11 11:02:35'),
(10, 'azerty', 'azerty@gmail.com', '$2y$12$DmIlfncQffAzCloovzWdT.2XulKwIJk3chqhd/R2Ku.9xb782tK.G', 'AVERELL', 'AZERTY', '7684892199', NULL, 'male', NULL, 1, NULL, '2025-07-11 11:34:58', '2025-07-12 02:19:24'),
(11, 'mcnulty', 'mcnulty@cop.us', '$2y$12$eYqefq7gIDP5GB09JQd6VeUjUPSRd0HmAnUP6zXPR8v7UYHM5WMv2', 'Jimmy', 'Mc Nulty', '34 36 72 85 44', NULL, 'male', NULL, 1, NULL, '2025-07-11 11:49:35', '2025-07-11 12:16:35'),
(12, 'eikichi', 'eikichi@gto.com', '$2y$12$jfOm24RQ3McHIMmk9Sek4eCDgiPRrU204RvKxrO/iDcFJmX9C42bq', 'Eikichi', 'Onizuka', '73 74 75 76 77', NULL, 'male', NULL, 1, NULL, '2025-07-11 11:55:26', '2025-07-11 11:56:19'),
(13, 'mina', 'mina@carp.roum', '$2y$12$a6LRFi21pvT33Xc2HRsco.PB.MxfZ6PjnB5Vu94WXGRw1bWhGg89i', 'MINA', 'BELLA', '77 33 11 88 66', NULL, 'female', NULL, 1, NULL, '2025-07-11 12:18:11', '2025-07-11 12:33:53'),
(14, 'lulu87', 'lulu87@gmail.com', '$2y$12$NNQaD9QhaAoSze7alV8qyeIc5MAHny9Be2f0g5ZZ9Eyk8RUdCCsVi', 'Lulu87', 'LululeK', '07 57  48 93 22', '1987-04-09', 'male', NULL, 1, NULL, '2025-07-11 20:18:05', '2025-07-11 20:30:48'),
(15, 'mimi', 'mimi@gmail.com', '$2y$12$M3ASWOLE8e1ENjkoLZjD/.fExoJhRCHZU3sBt9w.13mJNEkXdH3zG', 'Michelle', 'RIGOUX', '06 18 30 63 12', '1952-07-21', 'female', NULL, 1, NULL, '2025-07-16 17:11:48', '2025-07-25 09:39:35'),
(16, 'Lucien', 'lucien@gmail.com', '$2y$12$8Ty4pEEiNgM6NpoEvDBMFOIdPRPgfWgapd61UIhtHGGny.7kHa0Ie', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-07-16 17:18:21', '2025-07-16 17:18:21'),
(17, 'alf', 'alf@hotmail.com', '$2y$12$7BGJbT4vB/xZzBtSIT2IhOssi9MU8EwTmd0/QiRfO8Vp4iiv6WR5y', 'gordon', 'alf', '87 58 45 56 97', NULL, 'other', NULL, 1, NULL, '2025-07-21 19:00:45', '2025-07-21 19:04:26'),
(18, 'ulysse', 'ulysse@yahoo.fr', '$2y$12$DSAVuuEGXPO6pNIn6EBs7ek0eVHkKBLcEEs8bwJL4mIB6qy4crCw2', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-07-22 11:32:26', '2025-07-22 11:32:26');

-- --------------------------------------------------------

--
-- Structure de la table `user_addresses`
--

DROP TABLE IF EXISTS `user_addresses`;
CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `type` enum('billing','shipping') COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FR',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_addresses_user_id_index` (`user_id`),
  KEY `user_addresses_type_index` (`type`),
  KEY `user_addresses_is_default_index` (`is_default`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `user_id`, `type`, `first_name`, `last_name`, `street`, `city`, `postal_code`, `country`, `phone`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 1, 'billing', 'AL', 'BUNDY', 'macadam av 77', 'CHICAGO', '543T5', 'FR', '04 84 89 21 88', 1, '2025-07-10 10:20:00', '2025-09-08 10:07:50'),
(2, 2, 'billing', 'Prasanna Lakshmi', 'Darbha', 'Champs Elysées', 'Paris', '75000', 'FR', '07 84 55 43 88', 1, '2025-07-10 10:29:12', '2025-07-10 10:30:44'),
(3, 3, 'billing', 'Lolo', 'Rig', 'chemin le soleil levant', 'Vernaison', '69390', 'FR', '04 78 46 05 93', 1, '2025-07-10 10:58:22', '2025-08-29 21:24:11'),
(4, 6, 'billing', 'thomas', 'Magnum', 'Robin master street 53', 'Hawaï', '8234', 'FR', '1234567890', 1, '2025-07-10 19:45:06', '2025-07-10 19:45:06'),
(5, 7, 'billing', 'Raïs', 'Paqueta', '781 BD de la croisette', 'Vence', '06400', 'FR', '34 54 64 74 94', 1, '2025-07-11 07:00:58', '2025-07-17 05:56:31'),
(6, 8, 'billing', 'Diego', 'De  la Vega', '65 ROUTE DE la soie', 'MONTEREY california', '56734', 'FR', '88 14 29 52 44', 1, '2025-07-11 07:50:56', '2025-07-11 10:25:24'),
(8, 9, 'billing', 'alicia', 'chabane', '33 BD de la mourrachone', 'Grasse', '06355', 'FR', '07 25 50 75 11', 1, '2025-07-11 10:56:23', '2025-07-11 11:02:35'),
(12, 10, 'billing', 'AVERELL', 'AZERTY', '10 BD de la morue', 'cannes', '06400', 'FR', '7684892199', 1, '2025-07-11 11:47:31', '2025-07-12 02:19:16'),
(14, 12, 'billing', 'Eikichi', 'Onizuka', '', '', '', '', '73 74 75 76 77', 1, '2025-07-11 11:57:56', '2025-07-11 11:57:56'),
(15, 11, 'billing', 'Jimmy', 'Mc Nulty', 'amsterdam av', 'Baltimore', '523R4', 'FR', '34 36 72 85 77', 1, '2025-07-11 12:07:36', '2025-07-11 12:16:50'),
(17, 14, 'billing', 'Lulu87', 'LululeK', '26 RTE de l\'espoir', 'STADE FORREST', '02525', 'FR', '07 57  48 93 22', 1, '2025-07-11 20:23:49', '2025-07-11 20:30:40'),
(18, 1, 'shipping', 'Al', 'bundy', 'loser av', 'chicago', '66934', 'FR', '1784892647', 1, '2025-07-13 02:16:24', '2025-07-13 02:16:24'),
(19, 8, 'shipping', 'diego', 'de la vega', 'ranch de la vega', 'monterrey', '23456', 'FR', '45 56 67 78 89', 1, '2025-07-13 20:13:17', '2025-07-13 20:13:17'),
(20, 13, 'shipping', 'MINA', 'BELLA', '91 rue gandipige', 'nice', '28239', 'FR', '3784894638', 1, '2025-07-13 20:34:35', '2025-07-13 20:34:35'),
(21, 10, 'shipping', 'AVERELL', 'AZERTY', '10 BD de la morue', 'cannes', '06400', 'FR', '73 43 86 04 45', 1, '2025-07-14 01:54:16', '2025-07-14 01:54:16'),
(22, 14, 'shipping', 'Lulu87', 'LululeK', '26 RTE de l\'espoir', 'STADE FORREST', '02525', 'FR', '07 57 48 93 22', 1, '2025-07-15 09:59:27', '2025-07-15 09:59:27'),
(23, 15, 'billing', 'Michelle', 'RIGOUX', 'bd du périer', 'cannes', '06400', 'FR', '06 18 30 63 12', 1, '2025-07-16 17:13:32', '2025-07-25 09:39:35'),
(24, 13, 'billing', 'MINA', 'BELLA', 'rue gandolphe', 'Mandelieu', '06210', 'FR', '77 33 11 88 66', 1, '2025-07-18 19:42:58', '2025-07-18 19:43:18'),
(25, 17, 'billing', 'gordon', 'alf', 'abbey road 58', 'burbank', '47G34', 'FR', '87 58 45 56 97', 1, '2025-07-21 19:03:09', '2025-07-21 19:03:09'),
(26, 17, 'shipping', 'gordon', 'alf', 'abbey road 58', 'burbank', '47G34', 'FR', '87 58 45 56 97', 1, '2025-07-21 19:04:08', '2025-07-21 19:04:08'),
(27, 15, 'shipping', 'Michelle', 'RIGOUX', '79 bd du périer', 'cannes', '06400', 'FR', '06 18 30 63 12', 1, '2025-07-25 09:38:48', '2025-07-25 09:38:48');

-- --------------------------------------------------------

--
-- Structure de la table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `expires_at` timestamp NOT NULL,
  `last_activity` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_sessions_user_id_index` (`user_id`),
  KEY `user_sessions_expires_at_index` (`expires_at`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
