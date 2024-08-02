-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: tttn
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `Account`
--

DROP TABLE IF EXISTS `Account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `accountType` varchar(255) DEFAULT NULL,
  `authGoogleId` varchar(255) DEFAULT NULL,
  `authType` varchar(255) DEFAULT 'local',
  `refreshToken` varchar(255) DEFAULT NULL,
  `roleId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `Account_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Account`
--

LOCK TABLES `Account` WRITE;
/*!40000 ALTER TABLE `Account` DISABLE KEYS */;
INSERT INTO `Account` VALUES (1,'patient1@gmail.com','$2a$10$uG38qLIg0Z/ulrUeqCzpqeaGorT.yiY6vxaEa/tfgykYNh8txMzLG','Patient',NULL,'local','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwYXRpZW50MUBnbWFpbC5jb20iLCJyb2xlIjoiQuG7h25oIG5ow6JuIiwiaWF0IjoxNzIyNDU3NzEwLCJleHAiOjE3MjI1NDQxMTB9.1y9ZQKKUe5-LTJYM914BRfWbpjlJvKZgDRAX3fVUduk',4,'2024-07-31 08:07:17','2024-07-31 20:28:30'),(2,'admin@gmail.com','$2a$10$qxy4Y4flUCBInhJr8ieslerRim3JWKV6Dnxol74sifPJcoCA632pW','MedicalStaff',NULL,'local','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiUXXhuqNuIHRy4buLIHZpw6puIiwiaWF0IjoxNzIyNDE0NTY4LCJleHAiOjE3MjI1MDA5Njh9.K1xRPn4iTM7SVhgm4xzOvDHHeoiN1hIDiCptYguB2xo',1,'2024-07-31 08:25:57','2024-07-31 08:29:28'),(3,'doanhvu@gmail.com','$2a$10$qxy4Y4flUCBInhJr8ieslerRim3JWKV6Dnxol74sifPJcoCA632pW','MedicalStaff',NULL,'local','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJkb2FuaHZ1QGdtYWlsLmNvbSIsInJvbGUiOiJCw6FjIHPEqSIsImlhdCI6MTcyMjQ1NzEwMSwiZXhwIjoxNzIyNTQzNTAxfQ.BXircZc4hDOAAGgbx4BaXGkiyNvxGOSpSyFLE82LHE4',2,'2024-07-31 08:34:24','2024-07-31 20:18:21'),(4,'lequoctu@gmail.com','$2a$10$qxy4Y4flUCBInhJr8ieslerRim3JWKV6Dnxol74sifPJcoCA632pW','MedicalStaff',NULL,'local',NULL,2,'2024-07-31 08:35:31','2024-07-31 08:35:31'),(5,'nguyenvanly@gmail.com','$2a$10$qxy4Y4flUCBInhJr8ieslerRim3JWKV6Dnxol74sifPJcoCA632pW','MedicalStaff',NULL,'local',NULL,2,'2024-07-31 08:36:05','2024-07-31 08:36:05'),(6,'lenhatvinh@gmail.com','$2a$10$qxy4Y4flUCBInhJr8ieslerRim3JWKV6Dnxol74sifPJcoCA632pW','MedicalStaff',NULL,'local',NULL,2,'2024-07-31 08:36:45','2024-07-31 08:36:45'),(7,'phamthiquynh@gmail.com','$2a$10$qxy4Y4flUCBInhJr8ieslerRim3JWKV6Dnxol74sifPJcoCA632pW','MedicalStaff',NULL,'local',NULL,2,'2024-07-31 08:37:20','2024-07-31 08:37:20'),(8,'staff@gmail.com','$2a$10$qxy4Y4flUCBInhJr8ieslerRim3JWKV6Dnxol74sifPJcoCA632pW','MedicalStaff',NULL,'local','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJzdGFmZkBnbWFpbC5jb20iLCJyb2xlIjoiTmjDom4gdmnDqm4iLCJpYXQiOjE3MjI0NTU1MzQsImV4cCI6MTcyMjU0MTkzNH0.OG9CrC7B2wbpoY6Iwm_23vTyge_uhXGUOd2VK7Iipbg',3,'2024-07-31 08:37:54','2024-07-31 19:52:14'),(9,'nguyenxuancuong@gmail.com','$2a$10$ZQAlwHxits/CqYLjlKZcNeNHY4ILtdkD/qLGp7W3N2uThWs27485u','MedicalStaff',NULL,'local','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJwYXRpZW50MUBnbWFpbC5jb20iLCJyb2xlIjoiQuG7h25oIG5ow6JuIiwiaWF0IjoxNzIyNDE4MTU4LCJleHAiOjE3MjI1MDQ1NTh9.xM5vL-nTDaPM0IDf_p7LJE3H0-2tUndMF_mGI81WL8E',2,'2024-07-31 08:47:33','2024-07-31 09:29:18'),(10,'nguyenlehoang@gmail.com','$2a$10$ZQAlwHxits/CqYLjlKZcNeNHY4ILtdkD/qLGp7W3N2uThWs27485u','MedicalStaff',NULL,'local',NULL,2,'2024-07-31 08:48:16','2024-07-31 08:48:16'),(11,'nguyenquangtoan@gmail.com','$2a$10$ZQAlwHxits/CqYLjlKZcNeNHY4ILtdkD/qLGp7W3N2uThWs27485u','MedicalStaff',NULL,'local',NULL,2,'2024-07-31 08:48:55','2024-07-31 08:48:55'),(12,'bi12345b12345@gmail.com',NULL,'Patient','117338808821543221357','google','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoiYmkxMjM0NWIxMjM0NUBnbWFpbC5jb20iLCJyb2xlIjoiQuG7h25oIG5ow6JuIiwiaWF0IjoxNzIyNDM3NTM5LCJleHAiOjE3MjI1MjM5Mzl9.QOpusZwsuy-3KZYBenXr3EryZXtXjGpRDTMrWElnIeY',4,'2024-07-31 09:02:57','2024-07-31 14:52:19');
/*!40000 ALTER TABLE `Account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AllStatus`
--

DROP TABLE IF EXISTS `AllStatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AllStatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `statusName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AllStatus`
--

LOCK TABLES `AllStatus` WRITE;
/*!40000 ALTER TABLE `AllStatus` DISABLE KEYS */;
INSERT INTO `AllStatus` VALUES (1,'Chờ xác nhận','2024-07-31 07:53:43','2024-07-31 07:53:43'),(2,'Đã xác nhận','2024-07-31 07:53:43','2024-07-31 07:53:43'),(3,'Hoàn thành','2024-07-31 07:53:43','2024-07-31 07:53:43'),(4,'Hủy bỏ','2024-07-31 07:53:43','2024-07-31 07:53:43'),(5,'Không đến','2024-07-31 07:53:43','2024-07-31 07:53:43'),(6,'Tạo mới','2024-07-31 07:53:43','2024-07-31 07:53:43'),(7,'Đã khám','2024-07-31 07:53:43','2024-07-31 07:53:43'),(8,'Tái khám','2024-07-31 07:53:43','2024-07-31 07:53:43');
/*!40000 ALTER TABLE `AllStatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Appointment`
--

DROP TABLE IF EXISTS `Appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Appointment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointmentNumber` int DEFAULT NULL,
  `statusId` int NOT NULL,
  `scheduleId` int NOT NULL,
  `patientId` int NOT NULL,
  `staffId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `statusId` (`statusId`),
  KEY `scheduleId` (`scheduleId`),
  KEY `patientId` (`patientId`),
  KEY `staffId` (`staffId`),
  CONSTRAINT `Appointment_ibfk_1` FOREIGN KEY (`statusId`) REFERENCES `AllStatus` (`id`),
  CONSTRAINT `Appointment_ibfk_2` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule` (`id`),
  CONSTRAINT `Appointment_ibfk_3` FOREIGN KEY (`patientId`) REFERENCES `Patient` (`id`),
  CONSTRAINT `Appointment_ibfk_4` FOREIGN KEY (`staffId`) REFERENCES `MedicalStaff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Appointment`
--

LOCK TABLES `Appointment` WRITE;
/*!40000 ALTER TABLE `Appointment` DISABLE KEYS */;
INSERT INTO `Appointment` VALUES (1,1,1,5,1,NULL,'2024-07-31 14:44:44','2024-07-31 14:44:44');
/*!40000 ALTER TABLE `Appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DoctorSpecialty`
--

DROP TABLE IF EXISTS `DoctorSpecialty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DoctorSpecialty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctorId` int NOT NULL,
  `specialtyId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctorId` (`doctorId`),
  KEY `specialtyId` (`specialtyId`),
  CONSTRAINT `DoctorSpecialty_ibfk_1` FOREIGN KEY (`doctorId`) REFERENCES `MedicalStaff` (`id`),
  CONSTRAINT `DoctorSpecialty_ibfk_2` FOREIGN KEY (`specialtyId`) REFERENCES `Specialty` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DoctorSpecialty`
--

LOCK TABLES `DoctorSpecialty` WRITE;
/*!40000 ALTER TABLE `DoctorSpecialty` DISABLE KEYS */;
INSERT INTO `DoctorSpecialty` VALUES (1,2,1,'2024-07-31 08:58:17','2024-07-31 08:58:17'),(2,2,2,'2024-07-31 08:58:17','2024-07-31 08:58:17');
/*!40000 ALTER TABLE `DoctorSpecialty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Invoice`
--

DROP TABLE IF EXISTS `Invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Invoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file` longblob,
  `doctorId` int NOT NULL,
  `recordId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctorId` (`doctorId`),
  KEY `recordId` (`recordId`),
  CONSTRAINT `Invoice_ibfk_1` FOREIGN KEY (`doctorId`) REFERENCES `MedicalStaff` (`id`),
  CONSTRAINT `Invoice_ibfk_2` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Invoice`
--

LOCK TABLES `Invoice` WRITE;
/*!40000 ALTER TABLE `Invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `Invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MedicalRecord`
--

DROP TABLE IF EXISTS `MedicalRecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MedicalRecord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `medicalHistory` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `diagnosis` varchar(255) DEFAULT NULL,
  `dateCreated` datetime DEFAULT NULL,
  `patientId` int NOT NULL,
  `relativeId` int DEFAULT NULL,
  `doctorId` int NOT NULL,
  `statusId` int NOT NULL,
  `appointmentId` int NOT NULL,
  `specialtyId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patientId` (`patientId`),
  KEY `relativeId` (`relativeId`),
  KEY `doctorId` (`doctorId`),
  KEY `statusId` (`statusId`),
  KEY `appointmentId` (`appointmentId`),
  KEY `specialtyId` (`specialtyId`),
  CONSTRAINT `MedicalRecord_ibfk_1` FOREIGN KEY (`patientId`) REFERENCES `Patient` (`id`),
  CONSTRAINT `MedicalRecord_ibfk_2` FOREIGN KEY (`relativeId`) REFERENCES `Relative` (`id`),
  CONSTRAINT `MedicalRecord_ibfk_3` FOREIGN KEY (`doctorId`) REFERENCES `MedicalStaff` (`id`),
  CONSTRAINT `MedicalRecord_ibfk_4` FOREIGN KEY (`statusId`) REFERENCES `AllStatus` (`id`),
  CONSTRAINT `MedicalRecord_ibfk_5` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment` (`id`) ON DELETE CASCADE,
  CONSTRAINT `MedicalRecord_ibfk_6` FOREIGN KEY (`specialtyId`) REFERENCES `Specialty` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MedicalRecord`
--

LOCK TABLES `MedicalRecord` WRITE;
/*!40000 ALTER TABLE `MedicalRecord` DISABLE KEYS */;
INSERT INTO `MedicalRecord` VALUES (1,'','đau đầu',NULL,'2024-07-31 14:44:44',1,NULL,2,6,1,1,'2024-07-31 14:44:44','2024-07-31 14:44:44');
/*!40000 ALTER TABLE `MedicalRecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MedicalStaff`
--

DROP TABLE IF EXISTS `MedicalStaff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MedicalStaff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) DEFAULT NULL,
  `image` blob,
  `gender` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `accountId` int NOT NULL,
  `positionId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `accountId` (`accountId`),
  KEY `positionId` (`positionId`),
  CONSTRAINT `MedicalStaff_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `Account` (`id`),
  CONSTRAINT `MedicalStaff_ibfk_2` FOREIGN KEY (`positionId`) REFERENCES `Position` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MedicalStaff`
--

LOCK TABLES `MedicalStaff` WRITE;
/*!40000 ALTER TABLE `MedicalStaff` DISABLE KEYS */;
INSERT INTO `MedicalStaff` VALUES (1,'Trần Admin',NULL,'Nam','0586958970','Quản lý chuyên khoa, thuốc, tài khoản của bác sĩ và nhân viên.',NULL,2,NULL,'2024-07-31 08:25:57','2024-07-31 08:50:03'),(2,'Đỗ Anh Vũ',NULL,'Nam','0263636363','Có nhiều năm kinh nghiệm về chuyên khoa Chẩn đoán hình ảnh. Hiện đang công tác tại Bệnh viện 198 - Bộ Công An.','500.000',3,4,'2024-07-31 08:34:24','2024-07-31 08:58:38'),(3,'Lê Quốc Tú',NULL,NULL,'0467474747',NULL,NULL,4,NULL,'2024-07-31 08:35:31','2024-07-31 08:35:31'),(4,'Nguyễn Văn Lý',NULL,NULL,'0363745747',NULL,NULL,5,NULL,'2024-07-31 08:36:05','2024-07-31 08:36:05'),(5,'Lê Nhật Vinh',NULL,NULL,'0357478475',NULL,NULL,6,NULL,'2024-07-31 08:36:45','2024-07-31 08:36:45'),(6,'Phạm Thị Quỳnh',NULL,NULL,'0362625252',NULL,NULL,7,NULL,'2024-07-31 08:37:20','2024-07-31 08:37:20'),(7,'Trần Nhân viên',NULL,'Nữ','0758858585','Phê duyệt lịch khám bệnh cho bệnh nhân.',NULL,8,NULL,'2024-07-31 08:37:54','2024-07-31 08:50:59'),(8,'Nguyễn Xuân Cường',NULL,NULL,'0574847474',NULL,NULL,9,NULL,'2024-07-31 08:47:33','2024-07-31 08:47:33'),(9,'Nguyễn Lê Hoàng',NULL,NULL,'0476484574',NULL,NULL,10,NULL,'2024-07-31 08:48:16','2024-07-31 08:48:16'),(10,'Nguyễn Quang Toàn',NULL,NULL,'045747474',NULL,NULL,11,NULL,'2024-07-31 08:48:55','2024-07-31 08:48:55');
/*!40000 ALTER TABLE `MedicalStaff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Medication`
--

DROP TABLE IF EXISTS `Medication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Medication` (
  `id` int NOT NULL AUTO_INCREMENT,
  `medicationName` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Medication`
--

LOCK TABLES `Medication` WRITE;
/*!40000 ALTER TABLE `Medication` DISABLE KEYS */;
INSERT INTO `Medication` VALUES (1,'Thuốc giảm đau và hạ sốt(Paracetamol)','Giảm đau và hạ sốt, thường được sử dụng cho các cơn đau nhẹ và trung bình.','50.000','2024-07-31 07:53:43','2024-07-31 07:53:43'),(2,'Thuốc kháng sinh(Amoxicillin)','Kháng sinh thuộc nhóm penicillin, thường được sử dụng để điều trị nhiễm trùng do vi khuẩn như viêm phổi, viêm tai giữa, và viêm họng.','40.000','2024-07-31 07:53:43','2024-07-31 07:53:43'),(3,'Thuốc chống viêm(Prednisone)','Thuốc corticosteroid được sử dụng để giảm viêm và ức chế hệ miễn dịch, thường được sử dụng trong các bệnh như viêm khớp, lupus, và bệnh phổi.','60.000','2024-07-31 07:53:43','2024-07-31 07:53:43'),(4,'Thuốc hạ huyết áp(Amlodipine)','Thuốc chẹn kênh canxi được sử dụng để điều trị cao huyết áp và đau thắt ngực.','70.000','2024-07-31 07:53:43','2024-07-31 07:53:43'),(5,'Thuốc điều trị tiểu đường(Metformin)','Thuốc uống được sử dụng để kiểm soát lượng đường trong máu ở những người bị bệnh tiểu đường tuýp 2.','80.000','2024-07-31 07:53:43','2024-07-31 07:53:43');
/*!40000 ALTER TABLE `Medication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Patient`
--

DROP TABLE IF EXISTS `Patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Patient` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) DEFAULT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `accountId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `Patient_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `Account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Patient`
--

LOCK TABLES `Patient` WRITE;
/*!40000 ALTER TABLE `Patient` DISABLE KEYS */;
INSERT INTO `Patient` VALUES (1,'Tran Duc Bê','2000-01-01 00:00:00','Nam','09583733','Thử đức ',1,'2024-07-31 08:07:17','2024-07-31 14:45:35'),(2,'Bi Bi',NULL,NULL,NULL,NULL,12,'2024-07-31 09:02:57','2024-07-31 09:02:57');
/*!40000 ALTER TABLE `Patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PeriodOfTime`
--

DROP TABLE IF EXISTS `PeriodOfTime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PeriodOfTime` (
  `id` int NOT NULL AUTO_INCREMENT,
  `time` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PeriodOfTime`
--

LOCK TABLES `PeriodOfTime` WRITE;
/*!40000 ALTER TABLE `PeriodOfTime` DISABLE KEYS */;
INSERT INTO `PeriodOfTime` VALUES (1,'08:00 - 08:30','2024-07-31 07:53:43','2024-07-31 07:53:43'),(2,'08:30 - 09:00','2024-07-31 07:53:43','2024-07-31 07:53:43'),(3,'09:00 - 09:30','2024-07-31 07:53:43','2024-07-31 07:53:43'),(4,'09:30 - 10:00','2024-07-31 07:53:43','2024-07-31 07:53:43'),(5,'10:00 - 10:30','2024-07-31 07:53:43','2024-07-31 07:53:43'),(6,'10:30 - 11:00','2024-07-31 07:53:43','2024-07-31 07:53:43'),(7,'13:00 - 13:30','2024-07-31 07:53:43','2024-07-31 07:53:43'),(8,'13:30 - 14:00','2024-07-31 07:53:43','2024-07-31 07:53:43'),(9,'14:00 - 14:30','2024-07-31 07:53:43','2024-07-31 07:53:43'),(10,'14:30 - 15:00','2024-07-31 07:53:43','2024-07-31 07:53:43'),(11,'15:00 - 15:30','2024-07-31 07:53:43','2024-07-31 07:53:43'),(12,'15:30 - 16:00','2024-07-31 07:53:43','2024-07-31 07:53:43'),(13,'16:00 - 16:30','2024-07-31 07:53:43','2024-07-31 07:53:43'),(14,'20:00 - 20:30','2024-07-31 07:53:43','2024-07-31 07:53:43'),(15,'20:30 - 21:00','2024-07-31 07:53:43','2024-07-31 07:53:43'),(16,'21:00 - 21:30','2024-07-31 07:53:43','2024-07-31 07:53:43'),(17,'21:30 - 22:00','2024-07-31 07:53:43','2024-07-31 07:53:43'),(18,'22:00 - 22:30','2024-07-31 07:53:43','2024-07-31 07:53:43'),(19,'23:00 - 23:30','2024-07-31 07:53:43','2024-07-31 07:53:43');
/*!40000 ALTER TABLE `PeriodOfTime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Position`
--

DROP TABLE IF EXISTS `Position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Position` (
  `id` int NOT NULL AUTO_INCREMENT,
  `positionName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Position`
--

LOCK TABLES `Position` WRITE;
/*!40000 ALTER TABLE `Position` DISABLE KEYS */;
INSERT INTO `Position` VALUES (1,'Thạc sĩ','2024-07-31 07:53:43','2024-07-31 07:53:43'),(2,'Tiến sĩ','2024-07-31 07:53:43','2024-07-31 07:53:43'),(3,'Phó giáo sư','2024-07-31 07:53:43','2024-07-31 07:53:43'),(4,'Giáo sư','2024-07-31 07:53:43','2024-07-31 07:53:43');
/*!40000 ALTER TABLE `Position` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Prescription`
--

DROP TABLE IF EXISTS `Prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Prescription` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctorId` int NOT NULL,
  `recordId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctorId` (`doctorId`),
  KEY `recordId` (`recordId`),
  CONSTRAINT `Prescription_ibfk_1` FOREIGN KEY (`doctorId`) REFERENCES `MedicalStaff` (`id`),
  CONSTRAINT `Prescription_ibfk_2` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Prescription`
--

LOCK TABLES `Prescription` WRITE;
/*!40000 ALTER TABLE `Prescription` DISABLE KEYS */;
/*!40000 ALTER TABLE `Prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PrescriptionDetail`
--

DROP TABLE IF EXISTS `PrescriptionDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PrescriptionDetail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `instruction` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `medicationId` int NOT NULL,
  `prescriptionId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `medicationId` (`medicationId`),
  KEY `prescriptionId` (`prescriptionId`),
  CONSTRAINT `PrescriptionDetail_ibfk_1` FOREIGN KEY (`medicationId`) REFERENCES `Medication` (`id`),
  CONSTRAINT `PrescriptionDetail_ibfk_2` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PrescriptionDetail`
--

LOCK TABLES `PrescriptionDetail` WRITE;
/*!40000 ALTER TABLE `PrescriptionDetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `PrescriptionDetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Relative`
--

DROP TABLE IF EXISTS `Relative`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Relative` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) DEFAULT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `patientId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patientId` (`patientId`),
  CONSTRAINT `Relative_ibfk_1` FOREIGN KEY (`patientId`) REFERENCES `Patient` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Relative`
--

LOCK TABLES `Relative` WRITE;
/*!40000 ALTER TABLE `Relative` DISABLE KEYS */;
/*!40000 ALTER TABLE `Relative` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'Quản trị viên','2024-07-31 07:53:43','2024-07-31 07:53:43'),(2,'Bác sĩ','2024-07-31 07:53:43','2024-07-31 07:53:43'),(3,'Nhân viên','2024-07-31 07:53:43','2024-07-31 07:53:43'),(4,'Bệnh nhân','2024-07-31 07:53:43','2024-07-31 07:53:43');
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Schedule`
--

DROP TABLE IF EXISTS `Schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `doctorId` int NOT NULL,
  `timeId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctorId` (`doctorId`),
  KEY `timeId` (`timeId`),
  CONSTRAINT `Schedule_ibfk_1` FOREIGN KEY (`doctorId`) REFERENCES `MedicalStaff` (`id`),
  CONSTRAINT `Schedule_ibfk_2` FOREIGN KEY (`timeId`) REFERENCES `PeriodOfTime` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Schedule`
--

LOCK TABLES `Schedule` WRITE;
/*!40000 ALTER TABLE `Schedule` DISABLE KEYS */;
INSERT INTO `Schedule` VALUES (1,'2024-07-31 00:00:00',2,13,'2024-07-31 08:54:17','2024-07-31 08:54:17'),(2,'2024-07-31 00:00:00',2,14,'2024-07-31 08:54:17','2024-07-31 08:54:17'),(5,'2024-08-01 00:00:00',2,3,'2024-07-31 08:54:29','2024-07-31 08:54:29'),(6,'2024-08-01 00:00:00',2,4,'2024-07-31 08:54:29','2024-07-31 08:54:29'),(7,'2024-08-01 00:00:00',2,5,'2024-07-31 08:54:29','2024-07-31 08:54:29'),(8,'2024-08-01 00:00:00',2,6,'2024-07-31 08:54:29','2024-07-31 08:54:29'),(9,'2024-08-01 00:00:00',2,7,'2024-07-31 08:54:29','2024-07-31 08:54:29'),(10,'2024-08-01 00:00:00',2,8,'2024-07-31 08:54:29','2024-07-31 08:54:29'),(11,'2024-08-02 00:00:00',2,3,'2024-07-31 20:18:32','2024-07-31 20:18:32'),(12,'2024-08-02 00:00:00',2,4,'2024-07-31 20:18:32','2024-07-31 20:18:32'),(13,'2024-08-02 00:00:00',2,5,'2024-07-31 20:18:32','2024-07-31 20:18:32'),(14,'2024-08-02 00:00:00',2,6,'2024-07-31 20:18:32','2024-07-31 20:18:32'),(15,'2024-08-02 00:00:00',2,7,'2024-07-31 20:18:32','2024-07-31 20:18:32'),(16,'2024-08-02 00:00:00',2,8,'2024-07-31 20:18:32','2024-07-31 20:18:32');
/*!40000 ALTER TABLE `Schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20240715162708-migration-skeleton.js'),('migration-create-01-role.js'),('migration-create-02-specialty.js'),('migration-create-03-all-status.js'),('migration-create-04-position.js'),('migration-create-05-period-of-time.js'),('migration-create-06-account.js'),('migration-create-07-medical-staff.js'),('migration-create-08-doctor-specialty.js'),('migration-create-09-schedule.js'),('migration-create-10-patient.js'),('migration-create-11-relative.js'),('migration-create-12-appointment.js'),('migration-create-13-medical-record.js'),('migration-create-14-prescription.js'),('migration-create-15-medication.js'),('migration-create-16-prescription-detail.js'),('migration-create-17-invoice.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Specialty`
--

DROP TABLE IF EXISTS `Specialty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Specialty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `specialtyName` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` blob,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Specialty`
--

LOCK TABLES `Specialty` WRITE;
/*!40000 ALTER TABLE `Specialty` DISABLE KEYS */;
INSERT INTO `Specialty` VALUES (1,'Thần kinh','Bại Não, Đau đầu, chóng mặt, buồn nôn, Bệnh Pakison, bệnh tiền đình, Bị co cơ, căng dây thần kinh, Động kinh, có những cơn vãng ý thức, Bị tê bì nửa mặt, chèn dây thần kinh. Bồn chồn, lo lắng, hồi hộp, chân tay run. ',NULL,'2024-07-31 07:53:43','2024-07-31 08:40:29'),(2,'Cơ xương khớp','Gout. Thoái hóa khớp: khớp gối, cột sống thắt lưng, cột sống cổ. Viêm khớp dạng thấp, Viêm đa khớp, Viêm gân\nTràn dịch khớp gối, Tràn dịch khớp háng, Tràn dịch khớp. khủy, Tràn dịch khớp vai. Loãng xương, đau nhức xương.',NULL,'2024-07-31 07:53:43','2024-07-31 08:41:28'),(3,'Tiêu hóa','Ăn uống kém, không ngon. Rối loạn tiêu hóa, táo bón, trĩ\nNhiễm vi khuẩn HP (Helicobacter pylori). Nội soi dạ dày, đại tràng, tiêu hóa. Buồn nôn, chướng bụng, đầy bụng ợ chua, đầy hơi. Co thắt thực quản, Hội chứng ruột kích thích.',NULL,'2024-07-31 07:53:43','2024-07-31 08:42:06'),(4,'Tim mạch','Khó thở, Đau ngực, đau tim. Tăng huyết áp, hạ huyết áp\nRối loạn mỡ máu, cao huyết áp, chóng mặt. Bệnh van tim (Hẹp hở van tim), Hẹp động mạch chủ. Cảm giác hồi hộp, tim đập nhanh.',NULL,'2024-07-31 07:53:43','2024-07-31 08:42:44'),(5,'Cột sống','Đau cột sống, đau thắt lưng. Chấn thương cột sống. Cột sống bị đau, sưng, cong, vẹo. Đau mỏi cổ vai gáy, bả vai. Đau tê mông xuống chân. Phồng đĩa đệm.',NULL,'2024-07-31 08:43:53','2024-07-31 08:43:53'),(6,'Tai mũi họng','Ù tai, đau tai, chảy máu tai. Thủng màng nhĩ, điếc đột ngột. Viêm tai giữa. Amidan, V.A. Viêm xoang. Nghẹt mũi.',NULL,'2024-07-31 08:44:47','2024-07-31 08:44:47'),(7,'Nha khoa','Nhổ răng. Hàn răng. Điều trị tủy. Điều trị Viêm nha chu. Bọc răng sứ. Làm răng giả. Dán sứ Veneer.',NULL,'2024-07-31 08:45:47','2024-07-31 08:45:47'),(8,'Siêu âm','Khám thai sản. Khám thai lần đầu. Siêu âm thai định kỳ. Siêu âm thai tuần thứ 12. Siêu âm thai tuần thứ 16. Siêu âm thai tuần thứ 18.',NULL,'2024-07-31 08:46:40','2024-07-31 08:46:40');
/*!40000 ALTER TABLE `Specialty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'tttn'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-01 17:00:01
