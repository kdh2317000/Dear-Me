-- Synced MariaDB/MySQL Dump from Aiven DB to db2451002_DearMe
-- Date: 2026-10-15T11:34:11.080Z

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `board_posts`;
CREATE TABLE `board_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL,
  `likes` int(11) DEFAULT 0,
  `dislikes` int(11) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `is_hidden` tinyint(1) DEFAULT 0,
  `is_notice` tinyint(1) DEFAULT 0,
  `parent_id` int(11) DEFAULT NULL,
  `reply_target_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `board_posts` (`id`, `username`, `title`, `content`, `likes`, `dislikes`, `views`, `created_at`, `is_hidden`, `is_notice`, `parent_id`, `reply_target_id`) VALUES
(17, 'ㅇㄹ', '저 고민 있는데 들어주실 분..?', '<a href="https://www.naver.com/">https://www.naver.com/</a><br>', 0, 0, 16, '2026-04-03 00:36:10', 0, 0, NULL, NULL),
(24, 'ㅇㄹ', '트럼프 사실 남자가...', '맞다', 0, 0, 251, '2026-04-03 01:44:04', 0, 0, NULL, NULL),
(99, '관리자', '익명게시판 이용규칙 안내', '안녕하세요! 익명게시판은 서로를 존중하며 따뜻하게 소통하는 공간입니다.<br>비방이나 욕설은 자제 부탁드리고, 명언과 관련된 따뜻한 글을 작성해주시길 부탁드립니다!<div>저희 게시판에서는 비속어나 그 외에 나쁜 단어로 글을 작성할 시 계정 정지나 신고 조치가 됨을 알려드립니다.&nbsp;</div><div>공지사항 보시고 이해하셨다면 댓글로 "이해했습니다." 라고 댓글 작성 부탁드립니다.<br><div><br></div></div>', 0, 0, 294, '2026-04-07 00:05:04', 0, 1, NULL, NULL),
(124, 'ㄹㅇ', '댓글', 'ㄹㅇ', 1, 0, 0, '2026-04-07 01:37:28', 0, 0, 24, NULL),
(125, 'ㄹㅇ', '댓글', 'ㅇㅇ', 1, 0, 0, '2026-04-07 01:43:20', 0, 0, 24, NULL),
(142, 'ㅇㅇ', '글 수정하기', '수정 하기 연습', 0, 0, 36, '2026-04-07 02:57:48', 0, 0, NULL, NULL),
(143, 'ㅇㅇ', '댓글', '이렇게', 0, 0, 0, '2026-04-07 03:00:08', 0, 0, 24, NULL),
(148, 'admin', '댓글', 'ddddd', 0, 1, 0, '2026-04-14 02:14:21', 0, 0, 142, NULL),
(149, 'ㄹㅇ', '나 고민있는데 ', '제곧내<div>이번 기말고사가 너무 어려울 것 같아 교수님들도 예고했기도 했고</div><div>그래서 너무 걱정돼</div>', 0, 0, 9, '2026-04-27 23:57:31', 0, 0, NULL, NULL),
(152, 'admin', '댓글', '아아', 0, 0, 0, '2026-05-18 23:35:41', 0, 0, 142, NULL),
(154, 'admin', '대댓글', '글 내용에 맞는 댓글 작성 부탁드립니다.', 2, 0, 0, '2026-05-25 22:05:40', 0, 0, 24, 143),
(160, 'ㅇㄹ', '아아', '테스트', 0, 0, 14, '2026-10-11 14:17:10', 0, 0, NULL, NULL),
(161, 'admin', '댓글', '댓글', 0, 0, 0, '2026-10-11 15:43:34', 0, 0, 160, NULL),
(162, 'ㅇㄹ', '글쓰기', '글쓰기', 0, 0, 6, '2026-10-11 23:20:34', 0, 0, NULL, NULL);

DROP TABLE IF EXISTS `custom_quotes`;
CREATE TABLE `custom_quotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `emotion` varchar(50) DEFAULT NULL,
  `text` text NOT NULL,
  `author` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `custom_quotes` (`id`, `username`, `emotion`, `text`, `author`, `created_at`) VALUES
(1, 'admin', 'sadness', '종강이 끝났다', 'ㅎㅈ', '2026-09-10 20:40:42'),
(2, 'admin', 'joy', '달레는 귀여워', 'ㅇㄹ', '2026-10-11 15:22:27');

DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `reply` text DEFAULT NULL,
  `is_private` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `feedbacks` (`id`, `username`, `content`, `created_at`, `reply`, `is_private`) VALUES
(20, 'ㅇㄹ', '문의 남기기', '2026-04-07 00:27:27', '문의 답변용', 0),
(22, 'ㅇㄹ', '1. 명언추천 항목마다 주제별 어울리는 배경이미지나 멜로디가 랜덤으로 나타나게 하면 더 좋을것 같아요.

2. 메인에 나타나는 화나는 단어를 입력했을때 단어이미지가 훨씬 크게 나오면서 창문 깨지는 소리도 함께 나타난다면 속이 후련하겠어요.', '2026-06-10 03:56:10', '네 알겠습니다. 적극 반영하여 바로 고치겠습니다.', 0),
(23, 'ㅇㄹ', '테스트', '2026-10-11 07:37:57', '테스트', 0),
(24, 'ㄹㅇ', '앱을 좀 더 귀엽고 단순한데 알찬 느낌으로 꾸며주세요 지금은 너무 좀 ..ㅎ', '2026-10-12 18:19:14', '아직은 개발 초기단계라서 좀 더 css를 꾸미고 배치도 다르게 해서 사용자들이 편하고 즐겁게 다가갈 수 있도록 대폭 개선할 것입니다. ', 0);

DROP TABLE IF EXISTS `fortune_cookies`;
CREATE TABLE `fortune_cookies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `text` (`text`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fortune_cookies` (`id`, `text`, `created_at`) VALUES
(1, '오늘은 예상치 못한 행운이 찾아올 거예요.', '2026-10-10 20:40:01'),
(2, '당신의 미소가 누군가의 하루를 밝게 해줄 것입니다.', '2026-10-10 20:40:01'),
(3, '새로운 도전이 당신을 기다리고 있습니다. 주저하지 마세요!', '2026-10-10 20:40:01'),
(4, '잠시 쉬어가는 것도 좋은 선택입니다. 당신을 돌보세요.', '2026-10-10 20:40:01'),
(5, '곧 좋은 소식이 들려올 것입니다. 기대하셔도 좋습니다.', '2026-10-10 20:40:01'),
(53, '생각지도 못한 곳에서 기분 좋은 소식이 찾아옵니다.', '2026-10-10 22:25:02'),
(54, '지금 충분히 잘하고 있으니 조급해하지 않아도 괜찮습니다.', '2026-10-10 22:25:02'),
(55, '새로운 도전이 당신에게 예상치 못한 큰 기쁨을 선물합니다.', '2026-10-10 22:25:02'),
(56, '뭘 해도 되는 날이니 복권 한 장 사보는 건 어떨까요?', '2026-10-10 22:25:02'),
(57, '오늘 당신이 걷는 모든 길에는 행운이 마중 나와 있습니다.', '2026-10-10 22:25:02'),
(58, '지갑을 잘 단속하세요, 생각지도 못한 지출이 기다립니다.', '2026-10-10 22:25:02'),
(59, '오늘따라 유난히 일이 꼬인다면 그냥 일찍 잠자리에 드세요.', '2026-10-10 22:25:02'),
(60, '가는 날이 장날입니다, 오늘은 중요한 계획을 미루는 게 좋습니다.', '2026-10-10 22:25:02'),
(61, '당신의 오랜 노력이 드디어 눈부신 결실을 맺기 시작합니다.', '2026-10-10 22:25:02'),
(62, '행복은 멀리 있지 않습니다, 오늘 먹을 맛있는 메뉴에 있습니다.', '2026-10-10 22:25:02'),
(63, '오늘 어제의 꿈이 현실이 될 확률이 높으니 기대해도 좋습니다.', '2026-10-10 22:25:02'),
(64, '당신을 힘들게 하던 일이 생각보다 아주 싱겁게 해결됩니다.', '2026-10-10 22:25:02'),
(65, '말 한마디로 천 냥 빚을 질 수 있으니 입을 무겁게 하세요.', '2026-10-10 22:25:02'),
(66, '가까운 사람의 달콤한 유혹에 넘어가면 후회할 수 있습니다.', '2026-10-10 22:25:02'),
(67, '노력 없는 행운을 바라다간 본전도 못 건질 수 있습니다.', '2026-10-10 22:25:02'),
(68, '오늘의 힘든 노력이 쌓이고 쌓여 결국은 긍적적인 성과가 올 것입니다.', '2026-10-10 22:25:02'),
(69, '지나간 일을 후회해 봤자 현재만 힘들어질 뿐이다.', '2026-10-10 22:25:02'),
(70, '웃으면 복이 옵니다', '2026-10-10 22:25:02'),
(72, '꾸준히 노력해보세요', '2026-10-12 18:23:48');

DROP TABLE IF EXISTS `letters`;
CREATE TABLE `letters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author` varchar(50) DEFAULT '익명',
  `content` text NOT NULL,
  `is_replied` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `letters` (`id`, `author`, `content`, `is_replied`, `created_at`) VALUES
(47, 'admin', '아무거나', 1, '2026-05-29 04:04:47'),
(48, 'admin', '111', 0, '2026-05-29 04:06:43'),
(49, 'admin', '졸업까지도 얼마 남지 않았는데 학교 다니는 기간동안 어떻게 무엇을 해야 할지 잘 모르겠다.', 1, '2026-06-09 18:00:16'),
(50, 'onlyme00', '갱년기가 두려워요. 어쩌지요?  주식 50배가 목표인데 계속 떨어져요. 불안해요.', 1, '2026-06-10 03:48:01'),
(51, 'admin', '매일매일 위로우체통을 쓰려고요. 오늘은 9/6일 일요일이네요. 어느덧 개강 첫주가 빠르게 지나갔네요 물론 학교는 이틀밖에 가지는 않았지만요. 이번주 주말에는 가족들끼리 캠핑장을 가서 재밌게 놀고 왔네요. 재밌게 놀고 다시 원래 일상으로 돌아오니 뭔가 허무하고 공허한 기분이 드는게 썩 좋지는 않네요 뭐 그래도 맛있는 밥 해먹고 간식 먹으면 기분이 돌아오겠죠? ㅎㅎ 다음주도 열심히 살아봐요 우리. 화이팅', 1, '2026-09-06 00:26:30'),
(52, 'admin', 'ㅇㅇㅇ', 1, '2026-09-10 20:41:34'),
(53, 'ㅇㄹ', '편지쓰기', 1, '2026-10-11 23:20:47'),
(54, 'admin', '오늘은 10/14일 입니다. 공부하느라 지치네요
힘든 하루입니다..', 0, '2026-10-13 20:35:03');

DROP TABLE IF EXISTS `pet_collection`;
CREATE TABLE `pet_collection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `pet_type` varchar(50) DEFAULT 'egg',
  `level` int(11) DEFAULT 1,
  `exp` int(11) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pet_collection` (`id`, `username`, `pet_type`, `level`, `exp`, `completed_at`) VALUES
(1, 'ㄹㅇ', 'chicken', 3, 100, '2026-05-14 02:15:53');

DROP TABLE IF EXISTS `pets`;
CREATE TABLE `pets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `pet_type` varchar(20) DEFAULT 'chick',
  `exp` int(11) DEFAULT 0,
  `level` int(11) DEFAULT 1,
  `last_checkin` date DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total_completions` int(11) DEFAULT 0,
  `completed_types` text DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4500 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pets` (`id`, `username`, `pet_type`, `exp`, `level`, `last_checkin`, `updated_at`, `total_completions`, `completed_types`) VALUES
(1, 'ㅇㄹ', 'maenggu', 48, 2, '2026-10-12 15:00:00', '2026-10-12 18:06:10', 26, 'chicken,chick,rabbit,cat,fox,panda,hamster,dog,snake,lion,penguin,alpaca,mole,axolotl'),
(2, 'tester', 'chick', 590, 4, '2026-05-13 15:00:00', '2026-05-14 01:37:44', 0, ''),
(185, 'user1', 'chick', 155, 4, '2026-05-13 15:00:00', '2026-05-14 02:05:35', 0, ''),
(343, 'user2', 'hamster', 80, 3, '2026-05-13 15:00:00', '2026-05-14 02:21:41', 11, 'chick,cat,dog,fox,rabbit,hamster'),
(400, 'ㄹㅇ', 'tiger', 85, 3, '2026-10-12 15:00:00', '2026-10-12 18:17:39', 33, 'chicken,hamster,fox,rabbit,dog,panda,cat,chick,alpaca,mole,lion,penguin,axolotl,armadillo,snake,hedgehog,tiger,koala,anteater'),
(2570, 'admin', 'hamster', 15, 1, '2026-10-14 15:00:00', '2026-10-15 02:02:40', 38, 'chick,rabbit,alpaca,snake,cat,dog,gaydriver,buriburi,rose,miso2,namiri,miso,maenggu2,suji,hamster,maenggu,cheolsu2,miseon,cheolsu,miseon2,chaesonghwa,dumok,couple,heukgom'),
(2699, 'hello1234', 'chick', 0, 1, NULL, '2026-05-18 21:51:56', 0, ''),
(2953, 'testuser_3236', 'chick', 0, 1, NULL, '2026-05-18 23:32:51', 0, ''),
(3053, 'tester_celebration', 'chick', 0, 1, NULL, '2026-05-18 23:56:14', 0, ''),
(3324, 'shinchan1', 'chick', 150, 4, NULL, '2026-05-26 01:23:54', 0, 'chick,rabbit,hamster,cat,dog,cheolsu,maenggu,suji,miso,miseon'),
(4407, 'onlyme00', 'chick', 18, 1, '2026-06-09 15:00:00', '2026-06-10 03:48:01', 0, ''),
(4427, 'testuser_1781176747', 'chick', 0, 1, NULL, '2026-06-11 02:19:35', 0, ''),
(4490, 'ff', 'chick', 0, 1, NULL, '2026-09-30 18:07:13', 0, ''),
(4491, 'ㄹㅎ', 'chick', 0, 1, NULL, '2026-10-15 11:08:16', 0, ''),
(4492, 'ㅋㅎ', 'chick', 10, 1, '2026-09-30 15:00:00', '2026-10-15 11:08:16', 0, ''),
(4493, 'testmobile', 'chick', 0, 1, NULL, '2026-10-15 11:08:16', 0, '');

DROP TABLE IF EXISTS `post_dislikes`;
CREATE TABLE `post_dislikes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_dislike` (`post_id`,`username`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `post_dislikes` (`id`, `post_id`, `username`) VALUES
(22, 111, 'ㅇㄹ'),
(24, 112, 'ㅇㄹ'),
(23, 114, 'ㅇㄹ'),
(25, 135, 'ㅇㅇ'),
(26, 148, 'ㅇㄹ');

DROP TABLE IF EXISTS `post_likes`;
CREATE TABLE `post_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_like` (`post_id`,`username`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `post_likes` (`id`, `post_id`, `username`) VALUES
(18, 5, 'ㅇㄹ'),
(45, 102, 'ㅇㄹ'),
(52, 113, 'ㅇㄹ'),
(59, 124, 'ㅇㄹ'),
(60, 125, 'ㅇㄹ'),
(53, 129, 'ㅇㅇ'),
(62, 154, 'ㄹㅇ'),
(61, 154, 'ㅇㄹ');

DROP TABLE IF EXISTS `post_views`;
CREATE TABLE `post_views` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_view` (`post_id`,`username`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `post_views` (`id`, `post_id`, `username`) VALUES
(4, 0, 'ㅇㄹ'),
(12, 22, 'ㅇㄹ'),
(45, 23, 'admin'),
(13, 23, 'ㅇㄹ'),
(47, 24, 'admin'),
(10, 24, 'ㅇㄹ'),
(43, 25, 'admin'),
(2, 25, 'ㅇㄹ'),
(1, 26, 'ㅇㄹ'),
(24, 27, 'ㅇㄹ'),
(31, 28, 'ㅇㄹ'),
(42, 29, 'admin'),
(39, 29, 'ㅇㄹ'),
(53, 30, 'ㅇㄹ');

DROP TABLE IF EXISTS `quotes`;
CREATE TABLE `quotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `emotion` varchar(50) DEFAULT NULL,
  `text` text NOT NULL,
  `author` varchar(50) DEFAULT NULL,
  `is_system` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `quotes` (`id`, `username`, `emotion`, `text`, `author`, `is_system`, `created_at`) VALUES
(1, 'ㄹㅇ', 'joy', 'ㅇㅇㅇㅇㅇㅇㅇㅇ', 'ㅇㅇㅇ', 0, '2026-04-28 08:23:27'),
(2, 'testuser123', 'joy', 'Persistence is key.', 'Test User', 0, '2026-04-28 08:24:05'),
(3, 'ㄹㅇ', 'joy', '마음이 기뻐요', '강다현', 0, '2026-04-28 08:28:57'),
(4, 'ㅇㄹ', 'joy', 'dddd', 'dddd', 0, '2026-04-28 08:29:16'),
(5, 'ㄹㅇ', 'joy', '아무거나 입력', '강다현', 0, '2026-04-28 08:35:09'),
(6, 'ㄹㅇ', 'joy', '마음을 울ㄹ리는 문장', 'ㄹㄹ', 0, '2026-04-28 08:39:12'),
(7, 'ㅇㄹ', 'joy', '기쁜 명언', 'ㅇㄹ', 0, '2026-05-14 10:52:04'),
(8, 'ㅇㄹ', 'sadness', '눈물을 흘린다고 부끄러운게 아니다', '슬픔이', 0, '2026-05-19 09:38:41'),
(9, 'ㅇㄹ', 'sadness', '눈물은 슬픔의 말 없는 말이다', '볼테르', 0, '2026-05-19 09:38:59'),
(10, 'ㅇㄹ', 'joy', 'ㅇㅇㅇ', 'ㅁㅁㅁ', 0, '2026-05-26 06:44:15'),
(11, 'admin', 'joy', '이제 거의 끝나간다', '하준', 0, '2026-05-29 12:14:59'),
(16, NULL, 'joy', '행복은 습관이다. 그것을 몸에 익혀라.', '허버트', 1, '2026-06-02 07:09:23'),
(17, NULL, 'joy', '웃음이 없는 날은 낭비한 날이다.', '찰리 채플린', 1, '2026-06-02 07:09:23'),
(18, NULL, 'joy', '기쁨은 나눌수록 커지는 마법이다.', 'Dear Me', 1, '2026-06-02 07:09:23'),
(19, NULL, 'sadness', '눈물은 마음의 신성한 언어다.', '워싱턴 어빙', 1, '2026-06-02 07:09:23'),
(20, NULL, 'sadness', '흔들리지 않고 피는 꽃이 어디 있으랴.', '도종환', 1, '2026-06-02 07:09:23'),
(21, NULL, 'sadness', '슬픔 뒤에는 반드시 찬란한 해가 뜬다.', '고다', 1, '2026-06-02 07:09:23'),
(22, NULL, 'worry', '걱정은 내일의 슬픔을 없애는 것이 아니라 오늘의 힘을 없애는 것이다.', '코리 텐 붐', 1, '2026-06-02 07:09:23'),
(23, NULL, 'worry', '어제보다 나은 오늘이 되기를.', '고다', 1, '2026-06-02 07:09:23'),
(24, NULL, 'anger', '화가 날 때는 10까지 세어라.', '토마스 제퍼슨', 1, '2026-06-02 07:09:23'),
(25, NULL, 'anger', '분노는 남에게 던지려고 뜨거운 숯을 집어 드는 것과 같다.', '붓다', 1, '2026-06-02 07:09:23'),
(26, NULL, 'lonely', '고독은 이 세상에서 가장 아름다운 것이다.', '괴테', 1, '2026-06-02 07:09:23'),
(27, NULL, 'lonely', '혼자 있는 시간은 자신을 만나는 소중한 시간이다.', 'Dear Me', 1, '2026-06-02 07:09:23'),
(28, NULL, 'lethargy', '너무 잘하려고 애쓰지 마라.', '정희재', 1, '2026-06-02 07:09:23'),
(29, NULL, 'lethargy', '아무것도 하지 않는 것도 휴식의 한 방법이다.', '고다', 1, '2026-06-02 07:09:23'),
(30, NULL, 'anxiety', '우리가 두려워해야 할 것은 두려움 그 자체뿐이다.', '루스벨트', 1, '2026-06-02 07:09:23'),
(31, NULL, 'anxiety', '폭풍우가 지나가면 반드시 맑은 하늘이 온다.', '서양 격언', 1, '2026-06-02 07:09:23'),
(32, NULL, 'flutter', '사랑은 가장 위대한 모험이다.', 'Dear Me', 1, '2026-06-02 07:09:23'),
(33, NULL, 'flutter', '당신의 심장 소리가 들리는 곳으로 가라.', '스티브 잡스', 1, '2026-06-02 07:09:23'),
(34, NULL, 'flutter', '설렘은 새로운 세상이 열리고 있다는 신호다.', '고다', 1, '2026-06-02 07:09:23');

DROP TABLE IF EXISTS `replies`;
CREATE TABLE `replies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `letter_id` int(11) NOT NULL,
  `author` varchar(50) DEFAULT '익명',
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `star` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `replies` (`id`, `letter_id`, `author`, `content`, `is_read`, `star`, `created_at`) VALUES
(50, 47, 'ㄹㅇ', '뭐가?', 1, 0, '2026-05-29 04:05:11'),
(52, 49, 'ㅇㄹ', '나도 마찬가지야.. 일단 뭐든 열심히 준비해보는 게 좋을것같아. 미래에 어떤 일들이 펼쳐질지 모르잖아!', 1, 0, '2026-06-09 19:21:16'),
(53, 50, 'admin', '갱년기가 두렵겠죠.. 나이가 들면 다 생기는 하나의 병이니까요 ㅠ 그래도 갱년기 약 잘 챙겨먹고 건강관리 잘하시면 문제 없을 거에요. 그리고.. 주식 50배는 현실적으로 쉽지는 않겠지만 그래도 소원으로 적고 홍등으로 날려 보냈으니 꼭 반드시 이루어질것이라고 믿어요. 반드시 이루어질거에요!', 0, 0, '2026-09-06 00:23:35'),
(54, 51, 'ㅇㄹ', '화이팅이에요. 현재의 자신을 열심히 살게 하고 노력하게 하면 미래의 자신이 더 행복해질거에요. 그러니까 현재를 열심히 살아봅시다!', 1, 0, '2026-10-11 15:06:11'),
(55, 52, 'ㅇㄹ', 'ㅇㅇㅇ', 1, 0, '2026-10-11 23:21:11'),
(56, 53, 'admin', '편지보내기', 0, 0, '2026-10-12 18:24:15');

DROP TABLE IF EXISTS `saved_quotes`;
CREATE TABLE `saved_quotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `author` varchar(50) NOT NULL,
  `saved_at` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_saved_quote` (`username`,`text`(200))
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `saved_quotes` (`id`, `username`, `text`, `author`, `saved_at`, `created_at`) VALUES
(31, 'ㄹㅇ', '폭풍우가 지나가면 반드시 맑은 하늘이 온다.', '서양 격언', '2026-04-07 02:00:23', '2026-10-11 14:06:43'),
(46, 'ㅎㅎ', '웃어라', 'ㅇㄹ', '2026-04-26 21:06:13', '2026-10-11 14:06:43'),
(47, 'ㄹㅇ', '눈물은 마음의 신성한 언어다.', '워싱턴 어빙', '2026-04-27 21:58:18', '2026-10-11 14:06:43'),
(115, 'ㅇㄹ', '너무 잘하려고 애쓰지 마라.', '정희재', '2026-06-09 19:24:15', '2026-10-11 14:06:43'),
(116, 'ㅇㄹ', '폭풍우가 지나가면 반드시 맑은 하늘이 온다.', '서양 격언', '2026-06-09 19:24:24', '2026-10-11 14:06:43'),
(117, 'onlyme00', '흔들리지 않고 피는 꽃이 어디 있으랴.', '도종환', '2026-06-10 03:45:26', '2026-10-11 14:06:43'),
(120, 'admin', '작은 일에 감사하는 마음이 기쁨의 원천이다.', '제레미', '2026-09-06 00:06:23', '2026-10-11 14:06:43'),
(122, 'admin', '기쁨은 나눌수록 커지는 마법이다.', 'Dear Me', '2026-09-30 15:59:25', '2026-10-11 14:06:43'),
(123, 'ㅇㄹ', '가장 맑은 별은 가장 어두운 밤하늘에서 홀로 빛난다.', 'Dear Me', '2026-10-11 14:06:42', '2026-10-11 07:36:54'),
(124, 'admin', '지친 마음에 억지로 힘을 불어넣지 마세요. 쉴 때입니다.', 'Dear Me', '2026-10-11 14:12:34', '2026-10-11 14:12:34'),
(125, 'admin', '달레는 귀여워', 'ㅇㄹ', '2026-10-11 23:25:04', '2026-10-11 23:25:04');

DROP TABLE IF EXISTS `system_quotes`;
CREATE TABLE `system_quotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emotion` varchar(50) DEFAULT NULL,
  `text` text NOT NULL,
  `author` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `system_quotes` (`id`, `emotion`, `text`, `author`) VALUES
(1, 'joy', '행복은 습관이다. 그것을 몸에 익혀라.', '허버트'),
(2, 'joy', '웃음이 없는 날은 낭비한 날이다.', '찰리 채플린'),
(3, 'joy', '기쁨은 나눌수록 커지는 마법이다.', 'Dear Me'),
(4, 'joy', '가장 큰 행복은 사랑받고 있다는 확신이다.', '빅토르 위고'),
(5, 'joy', '지금 이 순간에 충실한 것, 그것이 행복의 비밀이다.', '스피노자'),
(6, 'joy', '행복은 주어지는 것이 아니라 우리의 선택이다.', '닐스'),
(7, 'joy', '마음에 기쁨을 품으면 세상이 온통 빛나 보이기 마련이다.', 'Dear Me'),
(8, 'joy', '작은 일에 감사하는 마음이 기쁨의 원천이다.', '제레미'),
(9, 'joy', '오늘 하루 가장 많이 웃는 사람이 가장 행복한 사람이다.', 'Dear Me'),
(10, 'joy', '기쁨은 마음을 가볍게 하고 영혼을 춤추게 한다.', '존 러스킨'),
(11, 'sadness', '눈물은 마음의 신성한 언어다.', '워싱턴 어빙'),
(12, 'sadness', '흔들리지 않고 피는 꽃이 어디 있으랴.', '도종환'),
(13, 'sadness', '슬픔 뒤에는 반드시 찬란한 해가 뜬다.', '고다'),
(14, 'sadness', '비가 내린 뒤에야 땅이 굳고 무지개가 피어난다.', 'Dear Me'),
(15, 'sadness', '가장 깊은 슬픔 속에서도 희망의 씨앗은 자란다.', '칼 힐티'),
(16, 'sadness', '슬픔을 외면하지 마세요. 그것은 치유의 시작입니다.', 'Dear Me'),
(17, 'sadness', '마음껏 울고 나면 영혼에 맑은 바람이 분다.', '셰익스피어'),
(18, 'sadness', '상처받은 조개만이 진주를 품을 수 있다.', '서양 격언'),
(19, 'sadness', '오늘의 아픔은 내일의 단단한 거름이 될 것이다.', 'Dear Me'),
(20, 'sadness', '눈물이 흘러내리는 것은 마음이 씻겨 내려가는 과정이다.', 'Dear Me'),
(21, 'worry', '걱정은 내일의 슬픔을 없애는 것이 아니라 오늘의 힘을 없애는 것이다.', '코리 텐 붐'),
(22, 'worry', '어제보다 나은 오늘이 되기를.', '고다'),
(23, 'worry', '고민의 90%는 실제로 일어나지 않는 일들에 대한 것이다.', '어니 젤린스키'),
(24, 'worry', '아무리 깊은 고민도 결국 지나가는 바람일 뿐이다.', 'Dear Me'),
(25, 'worry', '길을 잃는다는 것은 곧 새로운 길을 발견한다는 뜻이다.', '동양 격언'),
(26, 'worry', '모든 문제에는 반드시 어울리는 열쇠가 존재한다.', 'Dear Me'),
(27, 'worry', '한 걸음 물러서서 바라보면 고민은 작아지기 마련이다.', 'Dear Me'),
(28, 'worry', '인생의 큰 결정 앞의 고민은 당신이 성장하고 있다는 신호다.', 'Dear Me'),
(29, 'worry', '오늘 해결할 수 없는 일은 오늘 고민하지 마라.', '토마스 제퍼슨'),
(30, 'worry', '바람이 불지 않으면 노를 저어라. 생각보다 답은 가까이 있다.', '라틴 격언'),
(31, 'anger', '화가 날 때는 10까지 세어라.', '토마스 제퍼슨'),
(32, 'anger', '분노는 남에게 던지려고 뜨거운 숯을 집어 드는 것과 같다.', '붓다'),
(33, 'anger', '성남 마음은 거친 파도와 같아 맑은 거울이 될 수 없다.', '동양 격언'),
(34, 'anger', '분노를 억누르기보다 차분하게 숨을 내쉬며 흘려보내세요.', 'Dear Me'),
(35, 'anger', '잠시 그 자리를 벗어나는 것만으로도 마음의 열기는 식는다.', 'Dear Me'),
(36, 'anger', '화는 어리석은 자의 품에 머무는 법이다.', '솔로몬'),
(37, 'anger', '너너러움은 분노의 불꽃을 잠재우는 가장 찬물이다.', 'Dear Me'),
(38, 'anger', '남에게 상처 주는 말은 결국 내 마음에 상처를 남긴다.', '붓다'),
(39, 'anger', '용서는 분노로부터 나 자신을 해방시키는 가장 큰 선물이다.', '넬슨 만델라'),
(40, 'anger', '화가 치밀어 오를 때 침묵은 가장 강력한 방패이다.', '세네카'),
(41, 'lonely', '고독은 이 세상에서 가장 아름다운 것이다.', '괴테'),
(42, 'lonely', '혼자 있는 시간은 자신을 만나는 소중한 시간이다.', 'Dear Me'),
(43, 'lonely', '외로움은 다른 사람과의 단절이 아니라 자기 자신과의 단절이다.', '폴 틸리히'),
(44, 'lonely', '가장 맑은 별은 가장 어두운 밤하늘에서 홀로 빛난다.', 'Dear Me'),
(45, 'lonely', '혼자 걷는 길은 당신의 내면을 단단하게 만드는 시간이다.', 'Dear Me'),
(46, 'lonely', '새들도 홀로 날아오를 때 가장 아름다운 날갯짓을 한다.', 'Dear Me'),
(47, 'lonely', '외롭다고 느껴질 때 마음의 문을 열고 세상을 바라보세요.', 'Dear Me'),
(48, 'lonely', '고독 속에서 비로소 진정한 자아를 발견하게 된다.', '니체'),
(49, 'lonely', '당신은 결코 혼자가 아닙니다. 세상은 당신을 향해 열려 있습니다.', 'Dear Me'),
(50, 'lonely', '외로움을 느낀다는 것은 사랑을 나눌 준비가 되었다는 뜻이다.', 'Dear Me'),
(51, 'lethargy', '너무 잘하려고 애쓰지 마라.', '정희재'),
(52, 'lethargy', '아무것도 하지 않는 것도 휴식의 한 방법이다.', '고다'),
(53, 'lethargy', '에너지가 고갈되었을 땐 그저 누워 쉬는 것이 정답이다.', 'Dear Me'),
(54, 'lethargy', '천천히 걸어도 괜찮다. 멈추지만 않으면 된다.', '공자'),
(55, 'lethargy', '지친 마음에 억지로 힘을 불어넣지 마세요. 쉴 때입니다.', 'Dear Me'),
(56, 'lethargy', '작은 한 걸음부터 시작하라. 거창할 필요는 전혀 없다.', 'Dear Me'),
(57, 'lethargy', '쉼표가 있어야 다음 문장이 힘차게 이어질 수 있다.', 'Dear Me'),
(58, 'lethargy', '오늘 하루는 온전히 나를 위한 휴식의 날로 삼아보세요.', 'Dear Me'),
(59, 'lethargy', '자연도 겨울에는 성장을 멈추고 깊은 휴식을 취한다.', '서양 격언'),
(60, 'lethargy', '무기력은 영혼이 보내는 휴식의 신호입니다.', 'Dear Me'),
(61, 'anxiety', '우리가 두려워해야 할 것은 두려움 그 자체뿐이다.', '루스벨트'),
(62, 'anxiety', '폭풍우가 지나가면 반드시 맑은 하늘이 온다.', '서양 격언'),
(63, 'anxiety', '내일은 내일의 태양이 뜬다. 미리 걱정하지 말자.', '마가렛 미첼'),
(64, 'anxiety', '지금 이 순간 숨을 깊이 들이마시고 내쉬어 보세요.', 'Dear Me'),
(65, 'anxiety', '일어나지 않은 일로 현재의 평화를 깨뜨리지 마라.', '라 로슈푸코'),
(66, 'anxiety', '안개 낀 길도 한 걸음씩 걷다 보면 목적지에 닿기 마련이다.', 'Dear Me'),
(67, 'anxiety', '당신의 내면은 당신이 생각하는 것보다 훨씬 더 강합니다.', 'Dear Me'),
(68, 'anxiety', '불안은 앞으로 나아가고자 하는 마음의 또 다른 얼굴이다.', '키에르케고르'),
(69, 'anxiety', '가장 어두운 밤이 지나면 반드시 눈부신 아침이 온다.', 'Dear Me'),
(70, 'anxiety', '마음의 평화는 외부가 아닌 내면의 조절에서 비롯된다.', '에픽테토스'),
(71, 'flutter', '사랑은 가장 위대한 모험이다.', 'Dear Me'),
(72, 'flutter', '당신의 심장 소리가 들리는 곳으로 가라.', '스티브 잡스'),
(73, 'flutter', '설렘은 새로운 세상이 열리고 있다는 신호다.', '고다'),
(74, 'flutter', '기대감은 매일 아침 우리를 깨우는 마법의 열쇠다.', 'Dear Me'),
(75, 'flutter', '새로운 만남은 언제나 마음에 봄바람을 불어넣는다.', 'Dear Me'),
(76, 'flutter', '가슴이 뛰는 일을 찾는 것, 그것이 살아있음의 증거다.', 'Dear Me'),
(77, 'flutter', '두근거림을 느낀다면 망설이지 말고 도전하세요.', 'Dear Me'),
(78, 'flutter', '삶의 모든 첫 순간들은 설렘이라는 꽃을 피운다.', 'Dear Me'),
(79, 'flutter', '사랑하고 설레는 마음을 아낌없이 표현해 보세요.', 'Dear Me'),
(80, 'flutter', '내일 무슨 일이 일어날지 모른다는 것이 인생의 묘미다.', 'Dear Me'),
(81, 'anxiety', '폭풍우가 지나가면 반드시 맑은 하늘이 온다.', '서양 격언'),
(82, 'anxiety', '내일은 내일의 태양이 뜬다. 미리 걱정하지 말자.', '마가렛 미첼'),
(83, 'anxiety', '지금 이 순간 숨을 깊이 들이마시고 내쉬어 보세요.', 'Dear Me'),
(84, 'anxiety', '일어나지 않은 일로 현재의 평화를 깨뜨리지 마라.', '라 로슈푸코'),
(85, 'anxiety', '안개 낀 길도 한 걸음씩 걷다 보면 목적지에 닿기 마련이다.', 'Dear Me'),
(86, 'anxiety', '당신의 내면은 당신이 생각하는 것보다 훨씬 더 강합니다.', 'Dear Me'),
(87, 'anxiety', '불안은 앞으로 나아가고자 하는 마음의 또 다른 얼굴이다.', '키에르케고르'),
(88, 'anxiety', '가장 어두운 밤이 지나면 반드시 눈부신 아침이 온다.', 'Dear Me'),
(89, 'anxiety', '마음의 평화는 외부가 아닌 내면의 조절에서 비롯된다.', '에픽테토스'),
(90, 'flutter', '사랑은 가장 위대한 모험이다.', 'Dear Me'),
(91, 'flutter', '당신의 심장 소리가 들리는 곳으로 가라.', '스티브 잡스'),
(92, 'flutter', '설렘은 새로운 세상이 열리고 있다는 신호다.', '고다'),
(93, 'flutter', '기대감은 매일 아침 우리를 깨우는 마법의 열쇠다.', 'Dear Me'),
(94, 'flutter', '새로운 만남은 언제나 마음에 봄바람을 불어넣는다.', 'Dear Me'),
(95, 'flutter', '가슴이 뛰는 일을 찾는 것, 그것이 살아있음의 증거다.', 'Dear Me'),
(96, 'flutter', '두근거림을 느낀다면 망설이지 말고 도전하세요.', 'Dear Me'),
(97, 'flutter', '삶의 모든 첫 순간들은 설렘이라는 꽃을 피운다.', 'Dear Me'),
(98, 'flutter', '사랑하고 설레는 마음을 아낌없이 표현해 보세요.', 'Dear Me'),
(99, 'flutter', '내일 무슨 일이 일어날지 모른다는 것이 인생의 묘미다.', 'Dear Me');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `top_emotion` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `username`, `password`, `created_at`, `top_emotion`) VALUES
(1, 'gg', 'gggg', '2026-10-10 22:14:33', '기쁨 😊'),
(8, 'ㅇㄹ', 'dfdf', '2026-03-21 20:07:47', '😊
기쁨'),
(9, 'admin', 'rhksflwk', '2026-03-21 21:34:12', '😟
고민'),
(10, 'ㄹㅇ', 'fdfd', '2026-03-21 22:57:42', '😊
기쁨'),
(35, 'shinchan1', 'password', '2026-05-26 00:54:10', NULL),
(40, 'onlyme00', 'kdh770', '2026-06-10 03:42:32', '🧘
고독'),
(42, 'ff', 'ffff', '2026-09-30 18:07:13', NULL),
(43, 'ㄹㅎ', 'fgfg', '2026-10-01 01:34:22', '기쁨 😊'),
(44, 'ㅋㅎ', 'zgzg', '2026-10-01 01:36:10', '기쁨 😊'),
(45, 'testmobile', 'test1234', '2026-10-01 01:37:58', '기쁨 😊');

SET FOREIGN_KEY_CHECKS=1;
