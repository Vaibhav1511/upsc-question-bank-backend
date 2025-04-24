-- MySQL dump 10.13  Distrib 9.3.0, for macos15 (x86_64)
--
-- Host: localhost    Database: upsc_question_bank
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_text` longtext,
  `option_a` text,
  `option_b` text,
  `option_c` text,
  `option_d` text,
  `correct_option` enum('A','B','C','D') DEFAULT NULL,
  `explanation` longtext,
  `tags` text,
  `difficulty` enum('Easy','Medium','Hard') DEFAULT NULL,
  `selected` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image_url` text,
  `subject` varchar(255) DEFAULT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `subtopic` varchar(255) DEFAULT NULL,
  `question_type` enum('Factual','Conceptual','Analytical') DEFAULT NULL,
  `format` enum('Single Liner','Two Statement','Three Statement','More than Three Statements','Pairing','Assertion/Reason') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (2,'<p>Consider the following statements with reference to silk production in India:</p><p>1. India is the largest producer of silk in the world.</p><p>2. More than 90 percent of India’s total raw silk production comes from mulberry.</p><p>3. Non-mulberry silk comes from wild silkworms that feed on leaves from trees like oak, castor and arjun.</p><p>How many of the above statements are correct?</p>','Only one','Only two','All three','None','B','<p>●&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Statement 1 is not correct:&nbsp;</strong>India is the second largest producer of silk and also the largest consumer of silk in the world. In India, mulberry silk is produced mainly in the states of Karnataka, Andhra Pradesh, Tamil Nadu, Jammu &amp; Kashmir and West Bengal, while the non-mulberry silks are produced in Jharkhand, Chattisgarh, Orissa and north-eastern states.</p><p>●&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Statement 2 is correct:&nbsp;</strong>Mulberry silk comes from silkworms that eat only mulberry leaves. It is soft, smooth, and shiny with a bright glow, making it perfect for luxury sarees and high-end fabrics. 92% of the country\'s total raw silk production comes from mulberry.</p><p>●&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Statement 3 is correct:&nbsp;</strong>Non-mulberry silk (also known as Vanya silk) comes from wild silkworms that feed on leaves from trees like oak, castor and arjun. This silk has a natural, earthy feel with less shine but is strong, durable, and eco-friendly.</p>','Silk','Medium',0,'2025-04-23 12:25:21','','Economy','','','Factual','Three Statement');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-24 10:45:32
