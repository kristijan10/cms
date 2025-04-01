-- MySQL dump 10.13  Distrib 9.2.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: cms
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `korisnik`
--

DROP TABLE IF EXISTS `korisnik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `korisnik` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `korisnicko_ime` varchar(50) NOT NULL,
  `lozinka` varchar(255) NOT NULL,
  `datum_kreiranja` datetime DEFAULT CURRENT_TIMESTAMP,
  `uloga_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `username_UNIQUE` (`korisnicko_ime`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `korisnik`
--

LOCK TABLES `korisnik` WRITE;
/*!40000 ALTER TABLE `korisnik` DISABLE KEYS */;
INSERT INTO `korisnik` VALUES (1,'kristijan@gmail.com','kristijan','$2b$10$HEFV/T7NA5VxlKMtxRX7reBg3FuNFiJYhfiwcvJikdfeE8AFJLDKm','2025-03-30 17:05:27',1),(2,'filip@gmail.com','filip','$2b$10$CtQAKwi/NFCYSryPf5aKYue6ELpS6ik1WXy9cyLPL.GxQYSNk5oYu','2025-03-30 17:06:28',2),(3,'marko@gmail.com','marko','$2b$10$YLJYv9JUcpMoavdO8TD0S.CLIYGoG9W/DZFpXibsJEW5eCJh2tCjO','2025-03-30 17:06:36',3),(4,'nikola@gmail.com','nikola','$2b$10$5fW37B.RSQJ0ZI1oBlWaMOWW6PN31sp69uH3xGupvfIyr0nc8Yy8i','2025-03-30 17:07:55',4),(8,'veljko@gmail.com','veljko','$2b$10$gz1wYKaO8NcoyN88qbk9jeaKgSsezbDv7qo3SpNq5LTNP1a/fC4ym','2025-03-31 08:04:51',1),(9,'andjela@gmail.com','andjela','$2b$10$GiP5rwTdPHFy6nibqpBSV.G7rF3wbidrJQ0wlc18ZFATslPwdRLwW','2025-03-31 08:06:26',4),(10,'test1@gmail.com','test1','$2b$10$g5WOm6PMnXH8D/wG1NQRv.1DI.M071ATnfyH3XcK/RX6h26by69ta','2025-03-31 08:07:36',4),(11,'test2@gmail.com','test2','$2b$10$oBgEMrCY11esLbIqJJ5UsOyFJam11Jt/0z1bpvRofcxM0XGZqZX8m','2025-03-31 08:08:06',4),(12,'test3@gmail.com','test3','$2b$10$OzlZe5PlBoUhZqQcq8WC2.ZbgZMEDU5tlnNzH9WLs54QCoV0eSdH.','2025-03-31 08:09:58',4),(13,'test4@gmail.com','test4','$2b$10$EVyRx7HP5qWMKa2qTEYDUePwtE9lfz.jap7BB6fGqcWu2jW4wVuce','2025-03-31 08:12:20',4),(14,'test5@gmail.com','test5','$2b$10$4gJvOmsg9RBHrJLSEmT4y.J7WfiCqSPMnB7Ij0iv5dYZ/KTN2lYtu','2025-03-31 08:13:59',4),(15,'test6@gmail.com','test6','$2b$10$8AEQTXn65Bs0izOS1UeHIeGujMJ59OOVCbt00NN8/sWSAhCWJtnPK','2025-03-31 08:15:29',4),(16,'test7@gmail.com','test7','$2b$10$WApCT53Qg5x3EbYVOIjxeOpYs7ZaVuwp9FtF.71gmfdaRKEs9.01e','2025-03-31 08:16:59',4),(17,'test8@gmail.com','test8','$2b$10$qvCMMPiSsplUzqxa0L2vOesA5MvUc3wbBGHHLcgF7DV1yoHw8iOtq','2025-03-31 08:17:15',4),(18,'test9@gmail.com','test9','$2b$10$HosaCBJjccbr8f56F1gS1eV/pirdGCInF8W0SfvLXx0hH6rTakOCe','2025-03-31 08:17:38',4),(19,'test10@gmail.com','test10','$2b$10$IMgxVrqShvoFOsDxbcEQfOt3.6fRX9V28mHPezlpELqzhIOpyPRCi','2025-03-31 08:18:27',4);
/*!40000 ALTER TABLE `korisnik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objava`
--

DROP TABLE IF EXISTS `objava`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objava` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naslov` varchar(255) NOT NULL,
  `tekst` text NOT NULL,
  `datum_kreiranja` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `datum_izmene` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `autor_id` int NOT NULL,
  `objavljeno` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `objava_korisnik_fk_idx` (`autor_id`),
  CONSTRAINT `objava_korisnik_fk` FOREIGN KEY (`autor_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objava`
--

LOCK TABLES `objava` WRITE;
/*!40000 ALTER TABLE `objava` DISABLE KEYS */;
/*!40000 ALTER TABLE `objava` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objava_uloga`
--

DROP TABLE IF EXISTS `objava_uloga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objava_uloga` (
  `id_objava` int NOT NULL,
  `id_uloga` int NOT NULL,
  PRIMARY KEY (`id_objava`,`id_uloga`),
  KEY `objava_uloga_uloga_fk_idx` (`id_uloga`),
  CONSTRAINT `objava_uloga_objava_fk` FOREIGN KEY (`id_objava`) REFERENCES `objava` (`id`),
  CONSTRAINT `objava_uloga_uloga_fk` FOREIGN KEY (`id_uloga`) REFERENCES `uloga` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objava_uloga`
--

LOCK TABLES `objava_uloga` WRITE;
/*!40000 ALTER TABLE `objava_uloga` DISABLE KEYS */;
/*!40000 ALTER TABLE `objava_uloga` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uloga`
--

DROP TABLE IF EXISTS `uloga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uloga` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naziv` varchar(50) NOT NULL,
  `opis` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `naziv_UNIQUE` (`naziv`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uloga`
--

LOCK TABLES `uloga` WRITE;
/*!40000 ALTER TABLE `uloga` DISABLE KEYS */;
INSERT INTO `uloga` VALUES (1,'admin','Potpuna kontrola nad sistemom'),(2,'autor','Kreiranje i uredjivanje sopstvenog sadrzaja'),(3,'urednik','Upravljanje svim sadrzajem'),(4,'korisnik','Registrovani korisnik sa osnovnim pravima');
/*!40000 ALTER TABLE `uloga` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-01 15:48:24
