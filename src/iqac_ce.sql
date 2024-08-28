-- Adminer 4.8.1 MySQL 8.3.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `iqac_ce`;
CREATE DATABASE `iqac_ce` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `iqac_ce`;

DROP TABLE IF EXISTS `academic_year`;
CREATE TABLE `academic_year` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `year` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `academic_year`;
INSERT INTO `academic_year` (`id`, `year`, `status`) VALUES
(1,	'2022-2023',	'1');

DROP TABLE IF EXISTS `branch_regulation_mapping`;
CREATE TABLE `branch_regulation_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch` bigint NOT NULL,
  `regulation` bigint NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `branch` (`branch`),
  KEY `regulation` (`regulation`),
  CONSTRAINT `branch_regulation_mapping_ibfk_1` FOREIGN KEY (`branch`) REFERENCES `master_branch` (`id`),
  CONSTRAINT `branch_regulation_mapping_ibfk_2` FOREIGN KEY (`regulation`) REFERENCES `master_regulation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `branch_regulation_mapping`;

DROP TABLE IF EXISTS `ce`;
CREATE TABLE `ce` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `ce`;
INSERT INTO `ce` (`id`, `name`, `image_path`, `status`) VALUES
(1,	'Online Course',	'uploads\\static\\course_excemption\\online.png',	'1');

DROP TABLE IF EXISTS `ce_oc_courselist`;
CREATE TABLE `ce_oc_courselist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `branch` bigint NOT NULL,
  `platform` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `duration` int NOT NULL,
  `credit` int NOT NULL,
  `excemption` enum('0','1') NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `platform` (`platform`),
  KEY `branch` (`branch`),
  CONSTRAINT `ce_oc_courselist_ibfk_2` FOREIGN KEY (`platform`) REFERENCES `ce_oc_platform` (`id`),
  CONSTRAINT `ce_oc_courselist_ibfk_3` FOREIGN KEY (`branch`) REFERENCES `master_branch` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `ce_oc_courselist`;
INSERT INTO `ce_oc_courselist` (`id`, `branch`, `platform`, `name`, `duration`, `credit`, `excemption`, `status`) VALUES
(1,	1,	1,	'3D MODEL AND ANIMATIONS',	12,	3,	'1',	'1');

DROP TABLE IF EXISTS `ce_oc_platform`;
CREATE TABLE `ce_oc_platform` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `excemption` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `ce_oc_platform`;
INSERT INTO `ce_oc_platform` (`id`, `name`, `excemption`, `status`) VALUES
(1,	'NPTEL',	'1',	'1');

DROP TABLE IF EXISTS `ce_oc_registered`;
CREATE TABLE `ce_oc_registered` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course` bigint NOT NULL,
  `student` int NOT NULL,
  `type` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `exam_date` date NOT NULL,
  `mark` int NOT NULL,
  `certificate_url` varchar(255) NOT NULL,
  `certificate_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `approval_status` enum('-1','0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `status` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `course` (`course`),
  KEY `student` (`student`),
  CONSTRAINT `ce_oc_registered_ibfk_1` FOREIGN KEY (`course`) REFERENCES `ce_oc_courselist` (`id`),
  CONSTRAINT `ce_oc_registered_ibfk_2` FOREIGN KEY (`student`) REFERENCES `master_students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `ce_oc_registered`;
INSERT INTO `ce_oc_registered` (`id`, `course`, `student`, `type`, `start_date`, `end_date`, `exam_date`, `mark`, `certificate_url`, `certificate_path`, `approval_status`, `status`) VALUES
(1,	1,	1,	'1',	'2024-05-06',	'2024-08-07',	'2024-08-14',	45,	'nptel.com/view-my-certificate?id=1234',	'uploads/course_excemption/oc_certificates/math.pdf',	'0',	'1');

DROP TABLE IF EXISTS `course_category`;
CREATE TABLE `course_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `course_category`;
INSERT INTO `course_category` (`id`, `name`, `status`) VALUES
(1,	'BS',	'1'),
(2,	'PC',	'1'),
(3,	'OE',	'1');

DROP TABLE IF EXISTS `course_objective`;
CREATE TABLE `course_objective` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course` bigint NOT NULL,
  `co_obj_id` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course` (`course`),
  CONSTRAINT `course_objective_ibfk_1` FOREIGN KEY (`course`) REFERENCES `master_courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `course_objective`;
INSERT INTO `course_objective` (`id`, `course`, `co_obj_id`, `description`, `status`) VALUES
(1,	3,	'1',	'Acquire knowledge in different phases of a Compiler and its applications.',	'1'),
(2,	3,	'2',	'Understand the categorization of tokens using lexical analyzer and pattern recognition\r\nusing parsers.',	'1'),
(3,	3,	'3',	'Familiar with the code generation schemes and optimization methods.',	'1');

DROP TABLE IF EXISTS `course_outcome`;
CREATE TABLE `course_outcome` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course` bigint NOT NULL,
  `co_id` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course` (`course`),
  KEY `co_id` (`co_id`),
  CONSTRAINT `course_outcome_ibfk_1` FOREIGN KEY (`course`) REFERENCES `master_courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `course_outcome`;
INSERT INTO `course_outcome` (`id`, `course`, `co_id`, `description`, `status`) VALUES
(1,	3,	'CO1',	'Analyze the output generated in each phase of the compiler',	'1'),
(2,	3,	'CO2',	'Construct finite automata for regular expression and apply state minimization techniques',	'1'),
(3,	3,	'CO3',	'Construct Top down and Bottom up parser for context free grammars',	'1'),
(4,	3,	'CO4',	'Generate intermediate code for programming constructs',	'1'),
(5,	3,	'CO5',	'Apply optimization techniques in code generation and analyze the issues in code generation.',	'1');

DROP TABLE IF EXISTS `course_student_mapping`;
CREATE TABLE `course_student_mapping` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student` int NOT NULL,
  `course` bigint NOT NULL,
  `year` bigint NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `student` (`student`),
  KEY `course` (`course`),
  KEY `year` (`year`),
  CONSTRAINT `course_student_mapping_ibfk_1` FOREIGN KEY (`student`) REFERENCES `master_students` (`id`),
  CONSTRAINT `course_student_mapping_ibfk_2` FOREIGN KEY (`course`) REFERENCES `master_courses` (`id`),
  CONSTRAINT `course_student_mapping_ibfk_5` FOREIGN KEY (`year`) REFERENCES `academic_year` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `course_student_mapping`;
INSERT INTO `course_student_mapping` (`id`, `student`, `course`, `year`, `status`) VALUES
(1,	1,	1,	1,	'1'),
(2,	3,	3,	1,	'1'),
(3,	4,	3,	1,	'1'),
(4,	3,	4,	1,	'1');

DROP TABLE IF EXISTS `faculty_course_mapping`;
CREATE TABLE `faculty_course_mapping` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `year` bigint NOT NULL,
  `faculty` int NOT NULL,
  `course` bigint NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `year` (`year`),
  KEY `faculty` (`faculty`),
  KEY `course` (`course`),
  CONSTRAINT `faculty_course_mapping_ibfk_1` FOREIGN KEY (`year`) REFERENCES `academic_year` (`id`),
  CONSTRAINT `faculty_course_mapping_ibfk_3` FOREIGN KEY (`course`) REFERENCES `master_courses` (`id`),
  CONSTRAINT `faculty_course_mapping_ibfk_4` FOREIGN KEY (`faculty`) REFERENCES `master_faculty` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `faculty_course_mapping`;
INSERT INTO `faculty_course_mapping` (`id`, `year`, `faculty`, `course`, `status`) VALUES
(1,	1,	1,	2,	'1'),
(2,	1,	1,	1,	'1'),
(3,	1,	2,	3,	'1'),
(4,	1,	1,	4,	'1');

DROP TABLE IF EXISTS `faculty_departments`;
CREATE TABLE `faculty_departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dep_name` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `faculty_departments`;
INSERT INTO `faculty_departments` (`id`, `dep_name`, `status`) VALUES
(1,	'CSE',	'1'),
(2,	'IOT',	'1'),
(3,	'MECH',	'1');

DROP TABLE IF EXISTS `mapping_co_po`;
CREATE TABLE `mapping_co_po` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_outcome` bigint NOT NULL,
  `program_outcome` bigint NOT NULL,
  `mapping_level` bigint NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_outcome` (`course_outcome`),
  KEY `program_outcome` (`program_outcome`),
  CONSTRAINT `mapping_co_po_ibfk_1` FOREIGN KEY (`course_outcome`) REFERENCES `course_outcome` (`id`),
  CONSTRAINT `mapping_co_po_ibfk_2` FOREIGN KEY (`program_outcome`) REFERENCES `outcome` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `mapping_co_po`;
INSERT INTO `mapping_co_po` (`id`, `course_outcome`, `program_outcome`, `mapping_level`, `status`) VALUES
(1,	1,	1,	2,	'1'),
(2,	1,	2,	3,	'1'),
(3,	1,	3,	2,	'1'),
(4,	1,	4,	2,	'1'),
(5,	1,	13,	2,	'1'),
(6,	2,	1,	2,	'1'),
(7,	2,	2,	3,	'1'),
(8,	2,	3,	3,	'1'),
(9,	2,	4,	3,	'1'),
(10,	2,	13,	2,	'1'),
(11,	3,	1,	2,	'1'),
(12,	3,	2,	2,	'1'),
(13,	3,	3,	3,	'1'),
(14,	3,	4,	3,	'1'),
(15,	3,	13,	2,	'1'),
(16,	4,	1,	3,	'1'),
(17,	4,	2,	3,	'1'),
(18,	4,	3,	3,	'1'),
(19,	4,	4,	3,	'1'),
(20,	4,	13,	2,	'1'),
(21,	5,	1,	3,	'1'),
(22,	5,	2,	3,	'1'),
(23,	5,	3,	3,	'1'),
(24,	5,	4,	3,	'1'),
(25,	5,	13,	2,	'1');

DROP TABLE IF EXISTS `mark_entry`;
CREATE TABLE `mark_entry` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student` int NOT NULL,
  `type` bigint NOT NULL,
  `co_id` bigint NOT NULL,
  `mark` int NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `co_id` (`co_id`),
  KEY `student` (`student`),
  KEY `type` (`type`),
  CONSTRAINT `mark_entry_ibfk_1` FOREIGN KEY (`student`) REFERENCES `master_students` (`id`),
  CONSTRAINT `mark_entry_ibfk_2` FOREIGN KEY (`co_id`) REFERENCES `course_outcome` (`id`),
  CONSTRAINT `mark_entry_ibfk_3` FOREIGN KEY (`type`) REFERENCES `test_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `mark_entry`;
INSERT INTO `mark_entry` (`id`, `student`, `type`, `co_id`, `mark`, `status`) VALUES
(4,	3,	1,	1,	20,	'1'),
(5,	3,	1,	2,	10,	'1'),
(6,	3,	1,	3,	5,	'1');

DROP TABLE IF EXISTS `master_branch`;
CREATE TABLE `master_branch` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `degree` bigint NOT NULL,
  `branch` varchar(255) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `degree` (`degree`),
  CONSTRAINT `master_branch_ibfk_1` FOREIGN KEY (`degree`) REFERENCES `master_degree` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `master_branch`;
INSERT INTO `master_branch` (`id`, `degree`, `branch`, `status`) VALUES
(1,	1,	'CSE',	'1'),
(2,	2,	'IT',	'1'),
(3,	3,	'CSE',	'1'),
(4,	3,	'MECH',	'1');

DROP TABLE IF EXISTS `master_courses`;
CREATE TABLE `master_courses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `branch` bigint NOT NULL,
  `semester` bigint NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lecture_hours` int NOT NULL,
  `tutorial_hours` int NOT NULL,
  `practical_hours` int NOT NULL,
  `credit` int NOT NULL,
  `hours_per_week` int NOT NULL,
  `ca` int NOT NULL,
  `es` int NOT NULL,
  `total` int NOT NULL,
  `category` bigint NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `regulation` (`branch`),
  KEY `semester` (`semester`),
  KEY `category` (`category`),
  CONSTRAINT `master_courses_ibfk_2` FOREIGN KEY (`semester`) REFERENCES `master_semester` (`id`),
  CONSTRAINT `master_courses_ibfk_3` FOREIGN KEY (`category`) REFERENCES `course_category` (`id`),
  CONSTRAINT `master_courses_ibfk_5` FOREIGN KEY (`branch`) REFERENCES `master_branch` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `master_courses`;
INSERT INTO `master_courses` (`id`, `branch`, `semester`, `code`, `name`, `lecture_hours`, `tutorial_hours`, `practical_hours`, `credit`, `hours_per_week`, `ca`, `es`, `total`, `category`, `status`) VALUES
(1,	1,	1,	'22CS101',	'ENGINEERING MATHEMATICS I',	3,	1,	0,	4,	4,	40,	60,	100,	1,	'1'),
(2,	1,	1,	'22CS102',	'ENGINEERING PHYSICS I',	2,	0,	2,	3,	4,	50,	50,	100,	1,	'1'),
(3,	3,	6,	'21CS601',	'COMPILER DESIGN',	3,	1,	0,	4,	4,	40,	60,	100,	2,	'1'),
(4,	4,	6,	'210ME03',	'MAINTAINENCE ENGINEERING',	3,	0,	0,	3,	6,	40,	60,	100,	3,	'1');

DROP TABLE IF EXISTS `master_degree`;
CREATE TABLE `master_degree` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `regulation` bigint NOT NULL,
  `degree` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `regulation` (`regulation`),
  CONSTRAINT `master_degree_ibfk_1` FOREIGN KEY (`regulation`) REFERENCES `master_regulation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `master_degree`;
INSERT INTO `master_degree` (`id`, `regulation`, `degree`, `status`) VALUES
(1,	1,	'BE',	'1'),
(2,	1,	'BTech',	'1'),
(3,	2,	'BE',	'1');

DROP TABLE IF EXISTS `master_faculty`;
CREATE TABLE `master_faculty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `register_number` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `department` int NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `department` (`department`),
  CONSTRAINT `master_faculty_ibfk_1` FOREIGN KEY (`department`) REFERENCES `faculty_departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `master_faculty`;
INSERT INTO `master_faculty` (`id`, `register_number`, `name`, `email`, `phone_number`, `department`, `status`) VALUES
(1,	'CS10268',	'GANAGAVALLI',	'ganagavalli@bitsathy.ac.in',	'1234567890',	2,	'1'),
(2,	'753dfghj74',	'DHIVYA P',	'dhivya@bitsathy',	'8520852',	1,	'1'),
(4,	'CS10268',	'GANAGAVALLI',	'ganagavalli@bitsathy.ac.in',	'1234567890',	3,	'1');

DROP TABLE IF EXISTS `master_regulation`;
CREATE TABLE `master_regulation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `regulation` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `master_regulation`;
INSERT INTO `master_regulation` (`id`, `regulation`, `status`) VALUES
(1,	'2022',	'1'),
(2,	'2021',	'1'),
(4,	'2017',	'1');

DROP TABLE IF EXISTS `master_resources`;
CREATE TABLE `master_resources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `resource_name` varchar(50) NOT NULL,
  `group` varchar(50) NOT NULL,
  `icon` enum('0','1') NOT NULL,
  `path` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  `order_by` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `master_resources`;

DROP TABLE IF EXISTS `master_roles`;
CREATE TABLE `master_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `master_roles`;

DROP TABLE IF EXISTS `master_semester`;
CREATE TABLE `master_semester` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `semester` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `master_semester`;
INSERT INTO `master_semester` (`id`, `semester`, `status`) VALUES
(1,	'I',	'1'),
(2,	'II',	'1'),
(3,	'III',	'1'),
(4,	'IV',	'1'),
(5,	'V',	'1'),
(6,	'VI',	'1'),
(7,	'VII',	'1'),
(8,	'VIII',	'1');

DROP TABLE IF EXISTS `master_students`;
CREATE TABLE `master_students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `register_number` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `department` bigint NOT NULL,
  `ssig` varchar(255) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `register_number` (`register_number`),
  KEY `year` (`year`),
  KEY `department` (`department`),
  CONSTRAINT `master_students_ibfk_5` FOREIGN KEY (`year`) REFERENCES `master_year` (`id`),
  CONSTRAINT `master_students_ibfk_6` FOREIGN KEY (`department`) REFERENCES `master_branch` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `master_students`;
INSERT INTO `master_students` (`id`, `register_number`, `name`, `email`, `phone_number`, `year`, `department`, `ssig`, `status`) VALUES
(1,	'7376221CS269',	'PRIYADARSHAN B',	'priyadarshan.cs22@gmail.com',	'9876543210',	1,	1,	'',	'1'),
(3,	'7376211CS261',	'RISHVANTH RAJA NL',	'rishvanthraja.cs21@bitsathy.ac.in',	'753963741',	3,	3,	'',	'1'),
(4,	'7376211CS108',	'ABISHEK T',	'abishek.cs21@gmail.com',	'1234567890',	3,	3,	'',	'1');

DROP TABLE IF EXISTS `master_year`;
CREATE TABLE `master_year` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` varchar(7) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `master_year`;
INSERT INTO `master_year` (`id`, `year`, `status`) VALUES
(1,	'I',	'1'),
(2,	'II',	'1'),
(3,	'III',	'1');

DROP TABLE IF EXISTS `outcome`;
CREATE TABLE `outcome` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` bigint NOT NULL,
  `code_name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  CONSTRAINT `outcome_ibfk_1` FOREIGN KEY (`type`) REFERENCES `program_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='PO and PSO''s description';

TRUNCATE `outcome`;
INSERT INTO `outcome` (`id`, `type`, `code_name`, `description`, `status`) VALUES
(1,	1,	'PO1',	'Engineering Knowledge: Apply the knowledge of mathematics, science, engineering\r\nfundamentals, and an engineering specialization to the solution of complex engineering\r\nproblems.',	'1'),
(2,	1,	'PO2',	'Problem Analysis: Identify, formulate, review research literature, and analyse complex\r\nengineering problems reaching substantiated conclusions using first principles of\r\nmathematics, natural sciences, and engineering sciences.',	'1'),
(3,	1,	'PO3',	'Design/ Development of Solutions: Design solutions for complex engineering problems\r\nand design system components or processes that meet the specified needs with appropriate\r\nconsideration for the public health and safety, and the cultural, societal, andenvironmental\r\nconsiderations.',	'1'),
(4,	1,	'PO4',	'ConductInvestigations of Complex Problems: Use research-based knowledge and research\r\nmethods including design of experiments, analysis and interpretation of data, and synthesis\r\nof the information to provide valid conclusions.',	'1'),
(5,	1,	'P05',	'Modern Tool Usage: Create,select, and apply appropriate techniques, resources, and modern\r\nengineering and IT tools including prediction and modelling to complex engineeringactivities\r\nwith an understanding of the limitations.',	'1'),
(6,	1,	'PO6',	'The Engineer and Society: Apply reasoning informed by the contextual knowledge to assess\r\nsocietal, health, safety, legal and cultural issues and the consequent responsibilities\r\nrelevant to the professional engineering practice.',	'1'),
(7,	1,	'PO7',	'Environment and Sustainability: Understand the impact of the professional engineering\r\nsolutions in societal and environmental contexts, and demonstrate the knowledge of, and\r\nneed for sustainable development.',	'1'),
(8,	1,	'PO8',	'Ethics: Apply ethical principles and commit to professional ethics and responsibilities and\r\nnorms of the engineering practice.',	'1'),
(9,	1,	'PO9',	'Individual and Team Work: Function effectively as an individual, and as a member or\r\nleader in diverse teams, and in multidisciplinary settings.',	'1'),
(10,	1,	'P010',	'Communication: Communicate effectively on complex engineering activities with the\r\nengineering community and with society at large, such as, being able to comprehend and\r\nwrite effective reports and design documentation, make effective presentations, and give and\r\nreceive clear instructions.',	'1'),
(11,	1,	'PO11',	'Project Management and Finance: Demonstrate knowledge and understanding of the\r\nengineering and management principles and apply these to oneâ€™s own work, as a memberand\r\nleader in a team, to manage projects and in multidisciplinary environments.',	'1'),
(12,	1,	'PO12',	'Life-long Learning: Recognize the need for, and have the preparation and ability to engage\r\nin independent and life-long learning in the broadest context of technological change.',	'1'),
(13,	2,	'PSO1',	'Apply suitable algorithmic thinking and data management practices to design develop,\r\nand evaluate effective solutions for real-life and research problems.',	'1'),
(14,	2,	'PSO2',	'Design and develop cost-effective solutions based on cutting-edge hardware and\r\nsoftware tools and techniques to meet global requirements.',	'1');

DROP TABLE IF EXISTS `program_type`;
CREATE TABLE `program_type` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Type of Program ie PO or PSO';

TRUNCATE `program_type`;
INSERT INTO `program_type` (`id`, `type`, `status`) VALUES
(1,	'PO',	'1'),
(2,	'PSO',	'1');

DROP TABLE IF EXISTS `roles_resources_mapping`;
CREATE TABLE `roles_resources_mapping` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `resource_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `resource_id` (`resource_id`),
  CONSTRAINT `roles_resources_mapping_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `master_roles` (`id`),
  CONSTRAINT `roles_resources_mapping_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `master_resources` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `roles_resources_mapping`;

DROP TABLE IF EXISTS `special_labs`;
CREATE TABLE `special_labs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `special_labs`;

DROP TABLE IF EXISTS `test_type`;
CREATE TABLE `test_type` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='PT1, PT2, PTI OPTIONAL , PT2 OPTIONAL  AND SEMESTER';

TRUNCATE `test_type`;
INSERT INTO `test_type` (`id`, `type`, `status`) VALUES
(1,	'PERIODICAL TEST-I',	'1'),
(2,	'PERIODICAL TEST-II',	'1'),
(3,	'OPTIONAL TEST PT-I',	'1'),
(4,	'OPTIONAL TEST PT-II',	'1'),
(5,	'SEMESTER',	'1');

DROP TABLE IF EXISTS `user_roles_mapping`;
CREATE TABLE `user_roles_mapping` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_mapping_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `master_roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `user_roles_mapping`;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `googleId` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `accessToken` varchar(255) DEFAULT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `googleId` (`googleId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE `users`;

-- 2024-03-16 03:26:29
