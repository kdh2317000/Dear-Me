# 📊 'Dear Me' 프로젝트 전체 발표 파워포인트(PPT) 기획서 및 상세 초안 (총 16장)

본 문서는 **'Dear Me (명언 추천 & 감성 익명 소통 플랫폼)' 프로젝트 전체**의 기획 목적, 데이터베이스(DB) 테이블 구조, 개발 환경 및 소스코드 구성, 주요 서비스 기능을 총망라하는 **16장 규모 발표용 PPT 기획서 및 상세 대본 초안**입니다.

---

## 🎯 1. PPT 기획 및 개발 개요

### 1.1 프로젝트 명 및 목적
- **프로젝트 명**: `Dear Me` (`dear-me`)
- **기획 목적**: 현대인의 외로움과 스트레스를 해소하고, 감정 상태별 맞춤 명언 추천, 익명 편지 주고받기(위로 우체통), 익명 커뮤니티 게시판, 게이미피케이션(짱구 펫 육성/수집)을 통해 **마음의 위로와 힐링을 전달하는 통합 감성 소통 웹 플랫폼**.

### 1.2 기술 스택 및 개발 환경 (Stack & Tools)
- **Backend**: Node.js (v18+), Express.js (`express`)
- **Database**: MySQL (학교 실습 서버 `infodb.ansan.ac.kr`, `mysql2` Connection Pool 연결)
- **Frontend**: HTML5, Vanilla CSS3 (CSS Variables, Flex/Grid, Keyframe Animations), Pure JavaScript (ES6+ Fetch API)
- **Design & Assets**: FontAwesome v6.0.0, Google Fonts (`Gowun Dodum`, `Noto Sans KR`), custom CSS time-themes
- **Development Tools**: Visual Studio Code, Gemini Antigravity IDE, Git, Node Package Manager (npm)

---

## 📄 2. 슬라이드 16장 전체 구성표 (Index)

| 슬라이드 번호 | 구분 | 주제 / 제목 |
|---|---|---|
| **Slide 01** | 표지 | Dear Me: 마음을 어루만지는 감성 익명 소통 & 명언 추천 플랫폼 |
| **Slide 02** | 목차 | 목차 (Table of Contents) |
| **Slide 03** | 프로젝트 개요 | 'Dear Me' 기획 배경, 서비스 목적 및 핵심 가치 |
| **Slide 04** | 개발 환경 | 개발 테크 스택 & 오픈소스 라이브러리 구성 |
| **Slide 05** | 시스템 구조 | 아키텍처 디자인 (Client - Node.js/Express - MySQL DB Connection Pool) |
| **Slide 06** | DB 설계 (1) | 데이터베이스 스키마 1: 회원(`users`), 명언(`system_quotes`, `custom_quotes`, `saved_quotes`), 포춘쿠키 |
| **Slide 07** | DB 설계 (2) | 데이터베이스 스키마 2: 위로 우체통(`letters`, `replies`) & 짱구 펫 다마고치(`pets`) |
| **Slide 08** | DB 설계 (3) | 데이터베이스 스키마 3: 익명 게시판(`board_posts`), 중복방지 장부(`post_likes`, `post_views`) & 피드백 |
| **Slide 09** | 핵심 기능 (1) | 감정별 맞춤 명언 추천 & 나만의 명언 보관함 (`recommend.html`, `library.html`) |
| **Slide 10** | 핵심 기능 (2) | 익명 위로 우체통 (`postbox.html`: 편지 쓰기/꺼내기/나의 우체통) |
| **Slide 11** | 핵심 기능 (3) | 활동 보상형 짱구 펫 다마고치 수집 도감 (`pet-collection.html`) |
| **Slide 12** | 핵심 기능 (4) | 익명 소통 게시판 커뮤니티 (`board.html`, `view.html`, `write.html`) |
| **Slide 13** | 핵심 기능 (5) | 유저 세션 관리, 중복 로그인 방지 & 마이페이지 (`mypage.html`, `login.html`) |
| **Slide 14** | 디자인 시스템 | 시간대별 반응형 테마(Morning/Evening/Night) 및 마이크로 애니메이션 |
| **Slide 15** | 관리자 시스템 | 서비스 관리자 페이지 & 유저 피드백 답변 관리 (`admin.html`, `feedback.html`) |
| **Slide 16** | 결론 및 성과 | 프로젝트 종합 성과, 기대 효과 및 Q&A |

---

## ✍️ 3. 슬라이드별 상세 초안 & 발표 스크립트 (Slide-by-Slide Draft)

---

### 📌 Slide 01. [표지] Title Slide
- **슬라이드 제목**: **Dear Me : 감성 익명 소통 & 명언 추천 웹 플랫폼**
- **부제목**: *Node.js & MySQL 기반의 힐링 명언 추천, 위로 우체통 및 짱구 펫 수집 서비스*
- **시각 요소**: 은은한 분홍/보라 그라데이션 배경, 하트 및 편지 봉투 아이콘 (`💌`), 깔끔한 메인 로고
- **발표 대본**:
  > "안녕하세요. 감성 익명 소통 및 맞춤 명언 추천 웹 플랫폼 'Dear Me'의 전체 프로젝트 발표를 맡은 [발표자 이름]입니다. 본 프로젝트는 현대인들에게 마음의 휴식과 위로를 전달하기 위해 개발된 웹 애플리케이션입니다."

---

### 📌 Slide 02. [목차] Table of Contents
- **슬라이드 제목**: **AGENDA**
- **콘텐츠 구성**:
  1. 프로젝트 개요 & 기획 목적
  2. 개발 환경 및 전체 시스템 아키텍처
  3. 데이터베이스(DB) 테이블 모델링 및 스키마 설계
  4. 핵심 기능 구현 (명언 추천, 위로 우체통, 펫 도감, 익명 게시판)
  5. 디자인 시스템 & 관리자 기능
  6. 프로젝트 성과 및 Q&A
- **발표 대본**:
  > "오늘 발표는 프로젝트 개요와 개발 스택, DB 설계부터 시작하여 저희가 직접 구현한 5대 핵심 서비스 기능과 기술적 성과순으로 말씀드리겠습니다."

---

### 📌 Slide 03. [개요] 프로젝트 기획 배경 및 서비스 목적
- **슬라이드 제목**: **Project Background & Objective**
- **기획 목적**:
  - **감정 케어**: 기쁨, 슬픔, 고민, 화남, 외로움, 무기력, 불안, 설렘 등 8가지 감정 상태에 맞는 따뜻한 명언 제공
  - **익명 위로 소통**: 타인의 고민에 따뜻한 답장을 주고받는 '위로 우체통'
  - **동기부여 게이미피케이션**: 소통 및 활동에 따른 '짱구 펫' 레벨업 및 도감 수집 시스템
- **시각 요소**: 3대 서비스 축 카드 (1. 맞춤 명언 추천 / 2. 익명 위로 우체통 / 3. 짱구 펫 도감)
- **발표 대본**:
  > "'Dear Me'는 사용자의 현재 감정을 분석하여 최적의 명언을 추천하고, 누군지도 모르는 낯선 이와 익명으로 따뜻한 위로 편지를 주고받을 수 있는 종합 힐링 플랫폼입니다."

---

### 📌 Slide 04. [개발 환경] 개발 테크 스택 & 라이브러리
- **슬라이드 제목**: **Development Tech Stack**
- **기술 구성**:
  - **Server / Environment**: Node.js (v18.x), Express.js (`express` v5.2.1)
  - **Database**: MySQL Server (`infodb.ansan.ac.kr`), Connection Pool (`mysql2` v3.20.0)
  - **Client-Side**: HTML5, Vanilla CSS3 (CSS Custom Variables, Flexbox/Grid), Pure JavaScript (ES6+)
  - **UI Assets & Icons**: FontAwesome 6.0, Google Fonts (`Gowun Dodum`, `Noto Sans KR`)
- **시각 요소**: Node.js, Express, MySQL, HTML5/CSS3/JS 로고 아이콘 그리드
- **발표 대본**:
  > "저희 시스템은 백엔드에 Node.js와 Express 프레임워크를 사용하였으며, 데이터베이스로는 커넥션 풀 기법을 적용한 MySQL을 구축하여 빠른 데이터 처리를 실현했습니다."

---

### 📌 Slide 05. [시스템 아키텍처] 전체 데이터 흐름 및 아키텍처
- **슬라이드 제목**: **System Architecture & Data Flow**
- **구조 설명**:
  - **Client Layer**: 브라우저 기반 동적 Web UI (`public/*.html`, `script.js`)
  - **API Server Layer**: Express.js RESTful API (`app.js`), 대용량 파일 전송 패키지 처리 (`50mb` limit)
  - **Database Layer**: MySQL Connection Pool (`createPool`)을 활용한 가용성 확보 및 무중단 데이터베이스 연결
- **시각 요소**: 클라이언트(Browser) - REST API(Express) - 데이터베이스(MySQL Pool) 플로우차트 다이어그램
- **발표 대본**:
  > "전체 아키텍처는 클라이언트 웹 페이지와 Express REST API, 그리고 MySQL 커넥션 풀을 기반으로 동작하며, 동시 접속 시에도 끊김 없이 안정적으로 데이터를 주고받도록 구성했습니다."

---

### 📌 Slide 06. [DB 설계 1] 회원 및 명언 관련 DB 스키마
- **슬라이드 제목**: **Database Schema (1): Users & Quotes Tables**
- **주요 테이블**:
  - `users`: 유저 계정 정보 (`id`, `username`, `password`, `top_emotion`, `created_at`)
  - `system_quotes`: 80여 개의 엄선된 기본 카테고리 명언 (`id`, `emotion`, `text`, `author`)
  - `custom_quotes`: 유저가 직접 등록한 나만의 명언 (`id`, `username`, `emotion`, `text`, `author`)
  - `saved_quotes`: 공감(하트)하여 보관함에 저장한 명언 (`id`, `username`, `text`, `author`)
  - `fortune_cookies`: 오늘의 행운 포춘쿠키 메시지 데이터 (`id`, `text`)
- **시각 요소**: ERD 다이어그램 블록 (users ↔ saved_quotes ↔ custom_quotes)
- **발표 대본**:
  > "데이터베이스 구조 중 명언 관련 스키마입니다. 시스템 기본 제공 80여 개의 명언 외에도 유저가 직접 작성한 명언과 하트를 눌러 저장한 명언 보관함 테이블을 독립적으로 모델링했습니다."

---

### 📌 Slide 07. [DB 설계 2] 위로 우체통 & 짱구 펫 다마고치 DB 스키마
- **슬라이드 제목**: **Database Schema (2): Letters, Replies & Pets Tables**
- **주요 테이블**:
  - `letters`: 우체통 편지 원본 데이터 (`id`, `author`, `content`, `is_replied`, `created_at`)
  - `replies`: 편지에 달린 익명 답장 데이터 (`id`, `letter_id`, `author`, `content`, `is_read`, `star`)
  - `pets`: 유저별 짱구 펫 다마고치 레벨/경험치 (`id`, `username`, `pet_type`, `exp`, `level`, `total_completions`, `completed_types`)
- **시각 요소**: letters 1:N replies 관계도 및 pets 스키마 표
- **발표 대본**:
  > "위로 우체통 서비스는 편지 원본(`letters`)과 답장(`replies`)을 1:N 관계 구조로 연동시켰으며, 사용자 활동에 따라 펫 경험치와 레벨이 오르는 `pets` 테이블을 연동했습니다."

---

### 📌 Slide 08. [DB 설계 3] 익명 게시판 & 피드백 DB 스키마
- **슬라이드 제목**: **Database Schema (3): Board, Likes & Feedbacks Tables**
- **주요 테이블**:
  - `board_posts`: 자유게시판 글/댓글 저장 (`id`, `username`, `title`, `content` (LONGTEXT), `likes`, `dislikes`, `views`, `is_notice`, `parent_id`)
  - `post_likes` / `post_dislikes` / `post_views`: 게시글 공감/비공감/조회수 중복 방지용 유니크 장부
  - `feedbacks`: 유저 피드백 및 관리자 답글 저장 (`id`, `username`, `content`, `reply`)
- **시각 요소**: board_posts 스키마 및 UNIQUE KEY 제약조건 구조표
- **발표 대본**:
  > "게시판의 경우 본문 용량을 LONGTEXT로 확장하여 긴 글도 손실 없이 저장하며, `post_likes`와 같은 전용 테이블에 UNIQUE 제약조건을 두어 중복 추천을 완벽히 방지했습니다."

---

### 📌 Slide 09. [핵심 기능 1] 감정별 맞춤 명언 추천 & 나만의 명언 보관함
- **슬라이드 제목**: **Feature 1: Emotion-Based Quotes & Library**
- **구현 페이지**: `recommend.html`, `library.html`
- **주요 기능**:
  - **감정 선택 알고리즘**: 기쁨, 슬픔, 무기력 등 8가지 감정 탭 선택 시 맞춤 명언 무작위 추첨
  - **나만의 명언 등록**: 사용자가 감동적인 문구를 직접 작성하여 등록 및 공유
  - **하트 보관함**: 마음에 드는 명언을 '하트(❤️)' 버튼으로 나만의 보관함에 영구 저장
- **시각 요소**: 명언 추천 화면(`recommend.html`) 및 나만의 명언 보관함(`library.html`) 캡처
- **발표 대본**:
  > "첫 번째 핵심 기능은 맞춤 명언 추천입니다. 유저가 자신의 현재 감정 상태를 선택하면 그에 맞는 따뜻한 명언을 띄워주며, 마음에 드는 명언은 하트를 눌러 개인 보관함에 담아둘 수 있습니다."

---

### 📌 Slide 10. [핵심 기능 2] 익명 위로 우체통 (Comfort Mailbox)
- **슬라이드 제목**: **Feature 2: Comfort Mailbox (위로 우체통)**
- **구현 페이지**: `postbox.html`
- **주요 기능**:
  - **편지 띄워 보내기**: 익명으로 고민 편지를 작성하여 우체통에 투고
  - **편지 꺼내보기 & 답장**: 다른 사람의 고민 편지를 뽑아 따뜻한 위로 답장 전송
  - **나의 우체통 (UX 개선 완료)**: 도착한 답장 편지를 **엽서 카드 뷰 ↔ 컴팩트 리스트 뷰**로 확인, 2줄 요약 및 상세보기 팝업 모달 제공
- **시각 요소**: 편지 봉투 애니메이션 및 나의 우체통 듀얼 뷰/모달 팝업 캡처
- **발표 대본**:
  > "두 번째는 위로 우체통입니다. 고민을 편지로 띄워 보내면 낯선 타인이 위로 답장을 남겨주며, 최근 듀얼 뷰 모드와 상세보기 모달을 구축하여 편지 탐색 가독성을 획기적으로 향상시켰습니다."

---

### 📌 Slide 11. [핵심 기능 3] 짱구 펫 다마고치 수집 도감
- **슬라이드 제목**: **Feature 3: Shin-chan Pet Collection (짱구 펫 도감)**
- **구현 페이지**: `pet-collection.html`
- **주요 기능**:
  - **활동 보상 경험치**: 편지 쓰기(+5 EXP), 답장 남기기(+5 EXP) 등 활동 시 펫 경험치 자동 획득
  - **진화 & 도감 수집**: 병아리 펫부터 시작해 짱구의 주요 캐릭터(짱구, 짱아, 흰둥이, 철수 등)로 진화 및 수집
  - **EXP 토스트 알림**: 획득 경험치를 실시간 토스트 애니메이션으로 피드백 제공
- **시각 요소**: 짱구 펫 도감 수집 화면(`pet-collection.html`) 및 EXP 획득 토스트 팝업 캡처
- **발표 대본**:
  > "세 번째는 짱구 펫 수집 도감입니다. 사용자가 위로를 주고받을 때마다 펫이 경험치를 얻고 성장하며, 짱구의 다양한 캐릭터 도감을 수집하는 게이미피케이션 요소를 결합했습니다."

---

### 📌 Slide 12. [핵심 기능 4] 익명 소통 게시판 커뮤니티
- **슬라이드 제목**: **Feature 4: Anonymous Community Board**
- **구현 페이지**: `board.html`, `view.html`, `write.html`, `edit.html`
- **주요 기능**:
  - **자유로운 익명 글 작성**: 타인의 눈치를 보지 않고 솔직한 이야기를 공유하는 커뮤니티
  - **공감 / 비공감 / 댓글**: 게시글 추천 및 댓글(답글) 작성 기능
  - **공지사항 및 검색**: 관리자 공지 상단 고정, 제목/본문 키워드 검색 지원
- **시각 요소**: 익명 게시판 목록(`board.html`) 및 상세 읽기(`view.html`) 캡처
- **발표 대본**:
  > "네 번째는 익명 커뮤니티 게시판입니다. 자유롭게 익명으로 소통할 수 있으며 추천, 댓글, 조회수 기능과 함께 관리자 공지사항 고정 기능을 제공합니다."

---

### 📌 Slide 13. [핵심 기능 5] 유저 세션 관리 & 마이페이지
- **슬라이드 제목**: **Feature 5: Session Management & My Page**
- **구현 페이지**: `mypage.html`, `login.html`, `register.html`
- **주요 기능**:
  - **중복 로그인 방지**: `activeSessions` 인메모리 관리로 동일 계정 중복 접속 차단
  - **대표 감정 설정**: 유저별 메인 감정 프로필 설정
  - **활동 통계**: 작성한 글 수, 별 보유 수, 펫 레벨 등 마이페이지에서 한눈에 확인
- **시각 요소**: 마이페이지(`mypage.html`) 프로필 카드 및 중복 로그인 방지 안내 화면
- **발표 대본**:
  > "다섯 번째는 회원 관리 및 마이페이지입니다. 서버 단에서 중복 로그인을 방지하여 보안을 강화했으며, 마이페이지에서 자신의 활동 기록과 펫 성장 상태를 통합 관리합니다."

---

### 📌 Slide 14. [디자인 시스템] 시간대별 반응형 테마 & 마이크로 애니메이션
- **슬라이드 제목**: **UI/UX Design System: Responsive Time-Themes**
- **디자인 특징**:
  - **시간대별 자동 반응형 테마**:
    - Morning Theme (06시~17시): 파스텔 블루/라벤더 배경 (`#e0c3fc`~`#8ec5fc`)
    - Evening Theme (17시~20시): 따뜻한 핑크 노을 배경 (`#ff9a9e`~`#fecfef`)
    - Night Theme (20시~06시): 은은한 밤하늘 다크모드 (`#0f2027`~`#2c5364`)
  - **감성 마이크로 애니메이션**: 편지 봉투가 날아가는 3D CSS 애니메이션 (`@keyframes flyAway`)
- **시각 요소**: 시간대별 3가지 배경 테마 캡처 및 편지 봉투 애니메이션 프레임
- **발표 대본**:
  > "저희 서비스는 접속한 시간대에 따라 아침, 노을, 밤 3가지 배경 테마로 자동 전환되어 사용자에게 편안하고 몰입감 있는 시각적 경험을 선물합니다."

---

### 📌 Slide 15. [관리자 시스템] 서비스 관리자 & 피드백 관리
- **슬라이드 제목**: **Admin System & User Feedback**
- **구현 페이지**: `admin.html`, `feedback.html`
- **주요 기능**:
  - **유저 피드백 수집**: 서비스 이용 관련 건의사항 및 문의 수신
  - **관리자 전용 대시보드**: 피드백 답변 작성, 유저 관리 및 게시글 숨김/공지 등록 기능
- **시각 요소**: 관리자 전용 페이지(`admin.html`) 및 피드백 문의함 화면 캡처
- **발표 대본**:
  > "마지막으로 서비스 관리자 시스템입니다. 유저의 목소리를 듣는 피드백 문의함과 게시판 모니터링 관리자 전용 대시보드를 구축하여 서비스의 지속 가능성을 높였습니다."

---

### 📌 Slide 16. [결론 및 성과] 종합 평가 & 향후 로드맵 (Q&A)
- **슬라이드 제목**: **Conclusion & Future Roadmap**
- **프로젝트 핵심 성과**:
  - ✅ **통합 힐링 플랫폼 구축**: 명언 추천 + 익명 소통 + 게이미피케이션의 성공적 결합
  - ✅ **안정적인 DB 모델링**: MySQL Pool 및 11개 테이블 데이터 구조 최적화
  - ✅ **사용자 중심 UX/UI**: 시간대별 테마 및 우체통 듀얼 뷰/모달 시스템 완성
- **향후 확장 계획**:
  - 📱 모바일 앱(React Native / PWA) 전환
  - 🤖 AI 기반 유저 감정 분석 알고리즘 고도화
- **Q&A 마무리**: *"경청해 주셔서 감사합니다. 질의응답을 진행하겠습니다."*
- **발표 대본**:
  > "이상으로 'Dear Me' 프로젝트 전체 발표를 마치겠습니다. 앞으로도 사용자의 지친 마음을 따뜻하게 안아주는 서비스가 되도록 계속 발전시켜 나가겠습니다. 감사합니다."
