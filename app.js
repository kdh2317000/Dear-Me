require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// глобальный 세션 관리 객체 (중복 로그인 방지용)
const activeSessions = {};

// [나노 바나나 2의 핵심 처방 1] 대용량 사진 전송 및 검색 처리를 위한 용량 제한 해제 (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// [DB 설정] Aiven 클라우드 MySQL 연결 설정
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // 👈 이 부분 추가!
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: '+09:00',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { // 👈 Aiven 보안 연결을 위해 이 부분도 꼭 추가!
        rejectUnauthorized: false
    }
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL 연결 실패:', err);
        return;
    }
    console.log('✅ MySQL 서버 가동! 모든 시스템이 정상 연결되었습니다.');
    connection.release(); // 연결 테스트 후 즉시 해제

    // [1] 피드백 테이블
    db.query(`
        CREATE TABLE IF NOT EXISTS feedbacks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50),
            content TEXT NOT NULL,
            reply TEXT, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // [2] 익명 게시판 테이블 (기존 TEXT를 LONGTEXT로 자동 확장하도록 수정)
    db.query(`
        CREATE TABLE IF NOT EXISTS board_posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50),
            title VARCHAR(255),
            content LONGTEXT NOT NULL,
            likes INT DEFAULT 0,
            views INT DEFAULT 0,
            is_hidden TINYINT(1) DEFAULT 0,
            parent_id INT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // [3] 게시판 좋아요 기록 장부
    db.query(`
        CREATE TABLE IF NOT EXISTS post_likes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT,
            username VARCHAR(50),
            UNIQUE KEY unique_like (post_id, username)
        )
    `);

    // [3-2] 게시판 싫어요 기록 장부
    db.query(`
        CREATE TABLE IF NOT EXISTS post_dislikes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT,
            username VARCHAR(50),
            UNIQUE KEY unique_dislike (post_id, username)
        )
    `);

    // [핵심 추가] 조회수 중복 방지용 기록 장부 (구조는 유지하되 제한 로직은 해제함)
    db.query(`
        CREATE TABLE IF NOT EXISTS post_views (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT,
            username VARCHAR(50),
            UNIQUE KEY unique_view (post_id, username)
        )
    `);

    // [4] 사용자 정보 테이블
    db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE,
            password VARCHAR(255) NOT NULL,
            top_emotion VARCHAR(50) DEFAULT '기쁨 😊',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);


    // [5-2] 나만의 명언 등록하기 전용 테이블 (독립된 저장소)
    db.query(`
        CREATE TABLE IF NOT EXISTS custom_quotes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50),
            emotion VARCHAR(50),
            text TEXT NOT NULL,
            author VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // [5-3] 시스템 기본 명언 테이블 (고정 데이터 DB화)
    db.query(`
        CREATE TABLE IF NOT EXISTS system_quotes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            emotion VARCHAR(50),
            text TEXT NOT NULL,
            author VARCHAR(50)
        )
    `, () => {
        // 테이블 생성 후 데이터가 없거나 이전 19개 규격이면 초기 데이터(80개) 삽입
        db.query('SELECT COUNT(*) as count FROM system_quotes', (err, results) => {
            if (!err && (results[0].count < 70)) {
                // 기존 데이터가 적은 상태라면 밀어버리고 엄선 80개로 재적재
                db.query('DELETE FROM system_quotes', () => {
                    const initialQuotes = [
                        // joy (기쁨 😊)
                        ['joy', '행복은 습관이다. 그것을 몸에 익혀라.', '허버트'],
                        ['joy', '웃음이 없는 날은 낭비한 날이다.', '찰리 채플린'],
                        ['joy', '기쁨은 나눌수록 커지는 마법이다.', 'Dear Me'],
                        ['joy', '가장 큰 행복은 사랑받고 있다는 확신이다.', '빅토르 위고'],
                        ['joy', '지금 이 순간에 충실한 것, 그것이 행복의 비밀이다.', '스피노자'],
                        ['joy', '행복은 주어지는 것이 아니라 우리의 선택이다.', '닐스'],
                        ['joy', '마음에 기쁨을 품으면 세상이 온통 빛나 보이기 마련이다.', 'Dear Me'],
                        ['joy', '작은 일에 감사하는 마음이 기쁨의 원천이다.', '제레미'],
                        ['joy', '오늘 하루 가장 많이 웃는 사람이 가장 행복한 사람이다.', 'Dear Me'],
                        ['joy', '기쁨은 마음을 가볍게 하고 영혼을 춤추게 한다.', '존 러스킨'],

                        // sadness (슬픔 😭)
                        ['sadness', '눈물은 마음의 신성한 언어다.', '워싱턴 어빙'],
                        ['sadness', '흔들리지 않고 피는 꽃이 어디 있으랴.', '도종환'],
                        ['sadness', '슬픔 뒤에는 반드시 찬란한 해가 뜬다.', '고다'],
                        ['sadness', '비가 내린 뒤에야 땅이 굳고 무지개가 피어난다.', 'Dear Me'],
                        ['sadness', '가장 깊은 슬픔 속에서도 희망의 씨앗은 자란다.', '칼 힐티'],
                        ['sadness', '슬픔을 외면하지 마세요. 그것은 치유의 시작입니다.', 'Dear Me'],
                        ['sadness', '마음껏 울고 나면 영혼에 맑은 바람이 분다.', '셰익스피어'],
                        ['sadness', '상처받은 조개만이 진주를 품을 수 있다.', '서양 격언'],
                        ['sadness', '오늘의 아픔은 내일의 단단한 거름이 될 것이다.', 'Dear Me'],
                        ['sadness', '눈물이 흘러내리는 것은 마음이 씻겨 내려가는 과정이다.', 'Dear Me'],

                        // worry (고민 😟)
                        ['worry', '걱정은 내일의 슬픔을 없애는 것이 아니라 오늘의 힘을 없애는 것이다.', '코리 텐 붐'],
                        ['worry', '어제보다 나은 오늘이 되기를.', '고다'],
                        ['worry', '고민의 90%는 실제로 일어나지 않는 일들에 대한 것이다.', '어니 젤린스키'],
                        ['worry', '아무리 깊은 고민도 결국 지나가는 바람일 뿐이다.', 'Dear Me'],
                        ['worry', '길을 잃는다는 것은 곧 새로운 길을 발견한다는 뜻이다.', '동양 격언'],
                        ['worry', '모든 문제에는 반드시 어울리는 열쇠가 존재한다.', 'Dear Me'],
                        ['worry', '한 걸음 물러서서 바라보면 고민은 작아지기 마련이다.', 'Dear Me'],
                        ['worry', '인생의 큰 결정 앞의 고민은 당신이 성장하고 있다는 신호다.', 'Dear Me'],
                        ['worry', '오늘 해결할 수 없는 일은 오늘 고민하지 마라.', '토마스 제퍼슨'],
                        ['worry', '바람이 불지 않으면 노를 저어라. 생각보다 답은 가까이 있다.', '라틴 격언'],

                        // anger (화남 😡)
                        ['anger', '화가 날 때는 10까지 세어라.', '토마스 제퍼슨'],
                        ['anger', '분노는 남에게 던지려고 뜨거운 숯을 집어 드는 것과 같다.', '붓다'],
                        ['anger', '성남 마음은 거친 파도와 같아 맑은 거울이 될 수 없다.', '동양 격언'],
                        ['anger', '분노를 억누르기보다 차분하게 숨을 내쉬며 흘려보내세요.', 'Dear Me'],
                        ['anger', '잠시 그 자리를 벗어나는 것만으로도 마음의 열기는 식는다.', 'Dear Me'],
                        ['anger', '화는 어리석은 자의 품에 머무는 법이다.', '솔로몬'],
                        ['anger', '너너러움은 분노의 불꽃을 잠재우는 가장 찬물이다.', 'Dear Me'],
                        ['anger', '남에게 상처 주는 말은 결국 내 마음에 상처를 남긴다.', '붓다'],
                        ['anger', '용서는 분노로부터 나 자신을 해방시키는 가장 큰 선물이다.', '넬슨 만델라'],
                        ['anger', '화가 치밀어 오를 때 침묵은 가장 강력한 방패이다.', '세네카'],

                        // lonely (외로움 👤)
                        ['lonely', '고독은 이 세상에서 가장 아름다운 것이다.', '괴테'],
                        ['lonely', '혼자 있는 시간은 자신을 만나는 소중한 시간이다.', 'Dear Me'],
                        ['lonely', '외로움은 다른 사람과의 단절이 아니라 자기 자신과의 단절이다.', '폴 틸리히'],
                        ['lonely', '가장 맑은 별은 가장 어두운 밤하늘에서 홀로 빛난다.', 'Dear Me'],
                        ['lonely', '혼자 걷는 길은 당신의 내면을 단단하게 만드는 시간이다.', 'Dear Me'],
                        ['lonely', '새들도 홀로 날아오를 때 가장 아름다운 날갯짓을 한다.', 'Dear Me'],
                        ['lonely', '외롭다고 느껴질 때 마음의 문을 열고 세상을 바라보세요.', 'Dear Me'],
                        ['lonely', '고독 속에서 비로소 진정한 자아를 발견하게 된다.', '니체'],
                        ['lonely', '당신은 결코 혼자가 아닙니다. 세상은 당신을 향해 열려 있습니다.', 'Dear Me'],
                        ['lonely', '외로움을 느낀다는 것은 사랑을 나눌 준비가 되었다는 뜻이다.', 'Dear Me'],

                        // lethargy (무기력 😴)
                        ['lethargy', '너무 잘하려고 애쓰지 마라.', '정희재'],
                        ['lethargy', '아무것도 하지 않는 것도 휴식의 한 방법이다.', '고다'],
                        ['lethargy', '에너지가 고갈되었을 땐 그저 누워 쉬는 것이 정답이다.', 'Dear Me'],
                        ['lethargy', '천천히 걸어도 괜찮다. 멈추지만 않으면 된다.', '공자'],
                        ['lethargy', '지친 마음에 억지로 힘을 불어넣지 마세요. 쉴 때입니다.', 'Dear Me'],
                        ['lethargy', '작은 한 걸음부터 시작하라. 거창할 필요는 전혀 없다.', 'Dear Me'],
                        ['lethargy', '쉼표가 있어야 다음 문장이 힘차게 이어질 수 있다.', 'Dear Me'],
                        ['lethargy', '오늘 하루는 온전히 나를 위한 휴식의 날로 삼아보세요.', 'Dear Me'],
                        ['lethargy', '자연도 겨울에는 성장을 멈추고 깊은 휴식을 취한다.', '서양 격언'],
                        ['lethargy', '무기력은 영혼이 보내는 휴식의 신호입니다.', 'Dear Me'],

                        // anxiety (불안 😰)
                        ['anxiety', '우리가 두려워해야 할 것은 두려움 그 자체뿐이다.', '루스벨트'],
                        ['anxiety', '폭풍우가 지나가면 반드시 맑은 하늘이 온다.', '서양 격언'],
                        ['anxiety', '내일은 내일의 태양이 뜬다. 미리 걱정하지 말자.', '마가렛 미첼'],
                        ['anxiety', '지금 이 순간 숨을 깊이 들이마시고 내쉬어 보세요.', 'Dear Me'],
                        ['anxiety', '일어나지 않은 일로 현재의 평화를 깨뜨리지 마라.', '라 로슈푸코'],
                        ['anxiety', '안개 낀 길도 한 걸음씩 걷다 보면 목적지에 닿기 마련이다.', 'Dear Me'],
                        ['anxiety', '당신의 내면은 당신이 생각하는 것보다 훨씬 더 강합니다.', 'Dear Me'],
                        ['anxiety', '불안은 앞으로 나아가고자 하는 마음의 또 다른 얼굴이다.', '키에르케고르'],
                        ['anxiety', '가장 어두운 밤이 지나면 반드시 눈부신 아침이 온다.', 'Dear Me'],
                        ['anxiety', '마음의 평화는 외부가 아닌 내면의 조절에서 비롯된다.', '에픽테토스'],

                        // flutter (설렘 💕)
                        ['flutter', '사랑은 가장 위대한 모험이다.', 'Dear Me'],
                        ['flutter', '당신의 심장 소리가 들리는 곳으로 가라.', '스티브 잡스'],
                        ['flutter', '설렘은 새로운 세상이 열리고 있다는 신호다.', '고다'],
                        ['flutter', '기대감은 매일 아침 우리를 깨우는 마법의 열쇠다.', 'Dear Me'],
                        ['flutter', '새로운 만남은 언제나 마음에 봄바람을 불어넣는다.', 'Dear Me'],
                        ['flutter', '가슴이 뛰는 일을 찾는 것, 그것이 살아있음의 증거다.', 'Dear Me'],
                        ['flutter', '두근거림을 느낀다면 망설이지 말고 도전하세요.', 'Dear Me'],
                        ['flutter', '삶의 모든 첫 순간들은 설렘이라는 꽃을 피운다.', 'Dear Me'],
                        ['flutter', '사랑하고 설레는 마음을 아낌없이 표현해 보세요.', 'Dear Me'],
                        ['flutter', '내일 무슨 일이 일어날지 모른다는 것이 인생의 묘미다.', 'Dear Me']
                    ];
                    const insertSql = 'INSERT INTO system_quotes (emotion, text, author) VALUES ?';
                    db.query(insertSql, [initialQuotes], (insertErr) => {
                        if (!insertErr) console.log('✅ system_quotes 80개 엄선 명언 마이그레이션 완료!');
                    });
                });
            }
        });
    });

    // [6] 유저가 하트(공감) 표기한 명언을 담는 보관함 전용 테이블
    db.query(`
        CREATE TABLE IF NOT EXISTS saved_quotes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50),
            text TEXT NOT NULL,
            author VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_saved_quote (username, text(200))
        )
    `);

    // 포춘쿠키 테이블 생성
    db.query(`
        CREATE TABLE IF NOT EXISTS fortune_cookies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            text VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (!err) {
            db.query('SELECT COUNT(*) as count FROM fortune_cookies', (err, results) => {
                if (!err && results[0].count === 0) {
                    const initialCookies = [
                        ['오늘은 예상치 못한 행운이 찾아올 거예요.'],
                        ['당신의 미소가 누군가의 하루를 밝게 해줄 것입니다.'],
                        ['새로운 도전이 당신을 기다리고 있습니다. 주저하지 마세요!'],
                        ['잠시 쉬어가는 것도 좋은 선택입니다. 당신을 돌보세요.'],
                        ['곧 좋은 소식이 들려올 것입니다. 기대하셔도 좋습니다.']
                    ];
                    db.query('INSERT INTO fortune_cookies (text) VALUES ?', [initialCookies]);
                }
            });
        }
    });

    // [우체통] 편지 원본 테이블
    db.query(`
        CREATE TABLE IF NOT EXISTS letters (
            id INT AUTO_INCREMENT PRIMARY KEY,
            author VARCHAR(50) DEFAULT '익명',
            content TEXT NOT NULL,
            is_replied TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // [우체통] 편지 답장 테이블
    db.query(`
        CREATE TABLE IF NOT EXISTS replies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            letter_id INT NOT NULL,
            author VARCHAR(50) DEFAULT '익명',
            content TEXT NOT NULL,
            is_read TINYINT(1) DEFAULT 0,
            star INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // [🐣 다마고치] 반려 동물 테이블
    db.query(`
        CREATE TABLE IF NOT EXISTS pets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE,
            pet_type VARCHAR(20) DEFAULT 'chick',
            exp INT DEFAULT 0,
            level INT DEFAULT 1,
            last_checkin DATE DEFAULT NULL,
            total_completions INT DEFAULT 0,
            completed_types TEXT DEFAULT '',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // [펫 커럼 보강] 기존 테이블에 신규 커럼 추가 (이미 있으면 무시)
    db.query(`ALTER TABLE pets ADD COLUMN IF NOT EXISTS total_completions INT DEFAULT 0`);
    db.query(`ALTER TABLE pets ADD COLUMN IF NOT EXISTS completed_types TEXT DEFAULT ''`);

    // [나노 바나나 2의 핵심 처방 2] 기존 board_posts 테이블의 content 컬럼을 LONGTEXT로 강제 변경
    db.query(`ALTER TABLE board_posts MODIFY COLUMN content LONGTEXT NOT NULL`, (err) => {
        if (err) console.error("❌ DB 컬럼 확장 실패 (이미 변경되었을 수 있음):", err.message);
        else console.log("✅ 게시글 본문 저장 용량이 LONGTEXT로 확장되었습니다.");
    });

    // [보강 장치] 기존 테이블 컬럼 추가 확인
    db.query(`ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS title VARCHAR(255) AFTER username`);
    db.query(`ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS views INT DEFAULT 0 AFTER likes`);
    db.query(`ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS dislikes INT DEFAULT 0 AFTER likes`);
    db.query(`ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS reply_target_id INT DEFAULT NULL AFTER parent_id`);
    db.query(`ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS is_notice TINYINT(1) DEFAULT 0 AFTER is_hidden`);

    // [핵심 추가] 초기 공지사항 자동 생성 (관리자)
    db.query('SELECT COUNT(*) as count FROM board_posts WHERE is_notice = 1', (err, results) => {
        if (!err && results && results[0].count === 0) {
            const noticeInitSql = `
                INSERT INTO board_posts (username, title, content, views, is_notice, created_at) 
                VALUES ('관리자', '익명게시판 이용규칙 안내', '안녕하세요! 익명게시판은 서로를 존중하며 따뜻하게 소통하는 공간입니다.<br>비방이나 욕설은 자제 부탁드립니다. 😊', 0, 1, NOW())
            `;
            db.query(noticeInitSql);
        }
    });
});

// 기본 명언 데이터 (하준 씨가 주신 모든 데이터 100% 유지)
// --- [A] 익명 게시판 API ---

// 1. 모든 게시물 가져오기
app.get('/api/board/posts', (req, res) => {
    const { type, keyword } = req.query;
    let sql = `
        SELECT p.*,
               (SELECT COUNT(*) FROM board_posts c WHERE c.parent_id = p.id) as comment_count
        FROM board_posts p
        WHERE p.id NOT IN (26, 27, 28, 29, 30) 
        AND p.parent_id IS NULL
    `;
    const params = [];

    if (keyword && keyword.trim() !== "") {
        if (type === "제목") {
            sql += " AND p.title LIKE ?";
            params.push(`%${keyword}%`);
        } else if (type === "내용") {
            sql += " AND p.content LIKE ?";
            params.push(`%${keyword}%`);
        } else {
            sql += " AND (p.title LIKE ? OR p.content LIKE ?)";
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
    }

    sql += ' ORDER BY id DESC';

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json([]);
        res.json(results);
    });
});

// 2. 게시글 상세 보기 (클릭할 때만 조회수 상승 & 공지 내용 강제 주입)
app.get('/api/board/post/:id', (req, res) => {
    const postId = req.params.id;
    const isListView = req.query.isListView === 'true';

    const sendData = () => {
        const sql = 'SELECT * FROM board_posts WHERE id = ? OR parent_id = ? ORDER BY created_at ASC';
        db.query(sql, [postId, postId], (err, results) => {
            if (err || !results || results.length === 0) return res.status(404).json(null);
            res.json(results);
        });
    };

    if (!isListView) {
        db.query('UPDATE board_posts SET views = views + 1 WHERE id = ?', [postId], (updateErr) => {
            if (updateErr) console.error("❌ 조회수 업데이트 실패:", updateErr);
            sendData();
        });
    } else {
        sendData();
    }
});

// 3. 게시글 작성
app.post('/api/board/posts', (req, res) => {
    const { username, title, content, parent_id, reply_target_id, is_notice } = req.body;
    if (!content) return res.status(400).json({ success: false, message: "내용이 없습니다." });
    const sql = 'INSERT INTO board_posts (username, title, content, parent_id, reply_target_id, is_notice) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [username || '익명', title || '제목 없음', content, parent_id || null, reply_target_id || null, is_notice ? 1 : 0], (err) => {
        if (err) return res.status(500).json({ success: false, message: "서버 저장 실패" });
        res.json({ success: true });
    });
});

// [추가 포인트 1] 게시글 실제 수정 처리 API (PUT)
app.put('/api/board/post/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content, is_notice } = req.body;
    const sql = 'UPDATE board_posts SET title = ?, content = ?, is_notice = ? WHERE id = ?';
    db.query(sql, [title, content, is_notice ? 1 : 0, postId], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// 4. 좋아요 기능
app.post('/api/board/like/:id', (req, res) => {
    const postId = req.params.id;
    const { username } = req.body;

    // 1. 싫어요 내역 확인 및 삭제 (상호 배제)를 확실히 끝내기 위해 콜백 체이닝
    db.query('SELECT * FROM post_dislikes WHERE post_id = ? AND username = ?', [postId, username], (err, dislikes) => {
        if (dislikes && dislikes.length > 0) {
            db.query('DELETE FROM post_dislikes WHERE post_id = ? AND username = ?', [postId, username], () => {
                db.query('UPDATE board_posts SET dislikes = dislikes - 1 WHERE id = ?', [postId], () => {
                    executeLikeToggle();
                });
            });
        } else {
            executeLikeToggle();
        }
    });

    function executeLikeToggle() {
        db.query('SELECT * FROM post_likes WHERE post_id = ? AND username = ?', [postId, username], (err, results) => {
            if (results && results.length > 0) {
                db.query('DELETE FROM post_likes WHERE post_id = ? AND username = ?', [postId, username], () => {
                    db.query('UPDATE board_posts SET likes = likes - 1 WHERE id = ?', [postId], () => res.json({ success: true, action: 'unliked' }));
                });
            } else {
                db.query('INSERT INTO post_likes (post_id, username) VALUES (?, ?)', [postId, username], () => {
                    db.query('UPDATE board_posts SET likes = likes + 1 WHERE id = ?', [postId], () => res.json({ success: true, action: 'liked' }));
                });
            }
        });
    }
});

// 4-2. 싫어요 기능
app.post('/api/board/dislike/:id', (req, res) => {
    const postId = req.params.id;
    const { username } = req.body;

    // 1. 좋아요 내역 확인 및 삭제 (상호 배제)
    db.query('SELECT * FROM post_likes WHERE post_id = ? AND username = ?', [postId, username], (err, likes) => {
        if (likes && likes.length > 0) {
            db.query('DELETE FROM post_likes WHERE post_id = ? AND username = ?', [postId, username], () => {
                db.query('UPDATE board_posts SET likes = likes - 1 WHERE id = ?', [postId], () => {
                    executeDislikeToggle();
                });
            });
        } else {
            executeDislikeToggle();
        }
    });

    function executeDislikeToggle() {
        db.query('SELECT * FROM post_dislikes WHERE post_id = ? AND username = ?', [postId, username], (err, results) => {
            if (results && results.length > 0) {
                db.query('DELETE FROM post_dislikes WHERE post_id = ? AND username = ?', [postId, username], () => {
                    db.query('UPDATE board_posts SET dislikes = dislikes - 1 WHERE id = ?', [postId], () => res.json({ success: true, action: 'undisliked' }));
                });
            } else {
                db.query('INSERT INTO post_dislikes (post_id, username) VALUES (?, ?)', [postId, username], () => {
                    db.query('UPDATE board_posts SET dislikes = dislikes + 1 WHERE id = ?', [postId], () => res.json({ success: true, action: 'disliked' }));
                });
            }
        });
    }
});

// 5. 관리자: 게시글 숨기기
app.put('/api/admin/board/hide/:id', (req, res) => {
    db.query('UPDATE board_posts SET is_hidden = ? WHERE id = ?', [req.body.isHidden, req.params.id], () => res.json({ success: true }));
});

// 6. 게시글 삭제 (+ 자손 대댓글 재귀적 일괄 삭제)
app.delete('/api/board/post/:id', (req, res) => {
    const postId = req.params.id;
    const { username, isAdmin } = req.body;

    db.query('SELECT username FROM board_posts WHERE id = ?', [postId], (err, results) => {
        if (!results || results.length === 0) return res.status(404).json({ success: false });

        const author = results[0].username;
        // 권한 체크: 관리자이거나, 데이터베이스에 저장된 진짜 작성자일 때만 허용
        if (isAdmin || author === username) {

            // 트리 형태로 얽혀있는 자식(대댓글)들을 모조리 긁어서 재귀적으로 지우는 함수
            function deleteRecursively(targetId, callback) {
                db.query('SELECT id FROM board_posts WHERE reply_target_id = ?', [targetId], (err, children) => {
                    if (children && children.length > 0) {
                        let pendingCount = children.length;
                        children.forEach(child => {
                            deleteRecursively(child.id, () => {
                                if (--pendingCount === 0) performDelete();
                            });
                        });
                    } else {
                        performDelete();
                    }
                });

                function performDelete() {
                    // 메인 게시글이면 parent_id 조건이 통하고, 댓글이면 id 조건이 통합니다.
                    db.query('DELETE FROM board_posts WHERE id = ? OR parent_id = ?', [targetId, targetId], () => {
                        callback();
                    });
                }
            }

            deleteRecursively(postId, () => {
                res.json({ success: true });
            });

        } else {
            res.status(403).json({ success: false, message: '권한이 없습니다.' });
        }
    });
});

// --- [B] 명언 및 고민 히스토리 관련 API ---
app.post('/api/user/update-emotion', (req, res) => {
    const { username, emotion } = req.body;
    if (!username || !emotion) return res.json({ success: false });
    const sql = "UPDATE users SET top_emotion = ? WHERE TRIM(username) = TRIM(?)";
    db.query(sql, [emotion, username], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});


// 나만의 명언 등록하기 전용 API (새 테이블 사용)
app.post('/api/register-custom-quote', (req, res) => {
    const { username, emotion, text, author } = req.body;
    const sql = 'INSERT INTO custom_quotes (username, emotion, text, author) VALUES (?, ?, ?, ?)';
    db.query(sql, [username || '익명', emotion || 'joy', text, author || '익명'], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});


// --- [추가] 명언 보관함 (Library) API ---
app.post('/api/save-to-library', (req, res) => {
    const { username, text, author } = req.body;
    const sql = 'INSERT IGNORE INTO saved_quotes (username, text, author) VALUES (?, ?, ?)';
    db.query(sql, [username, text, author], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.delete('/api/remove-from-library', (req, res) => {
    const { username, text } = req.body;
    const sql = 'DELETE FROM saved_quotes WHERE TRIM(username) = TRIM(?) AND text = ?';
    db.query(sql, [username, text], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.get('/api/is-saved-quote', (req, res) => {
    const { username, text } = req.query;
    if (!username || !text) return res.json({ saved: false });
    const sql = 'SELECT COUNT(*) as count FROM saved_quotes WHERE TRIM(username) = TRIM(?) AND text = ?';
    db.query(sql, [username, text], (err, results) => {
        if (err || results.length === 0) return res.json({ saved: false });
        res.json({ saved: results[0].count > 0 });
    });
});

app.get('/api/my-library', (req, res) => {
    const { username } = req.query;
    // 원래 데이터베이스의 컬럼명이 saved_at 이므로 해당 문제 해결을 위해 id 기준으로 최근순 정렬합니다.
    const sql = 'SELECT * FROM saved_quotes WHERE TRIM(username) = TRIM(?) ORDER BY id DESC';
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json(results || []);
    });
});

app.get('/api/random-quote', (req, res) => {
    const emotion = req.query.emotion || 'joy';
    const sql = `
        SELECT text, author FROM system_quotes WHERE emotion = ?
        UNION ALL
        SELECT text, author FROM custom_quotes WHERE emotion = ?
    `;
    db.query(sql, [emotion, emotion], (err, combined) => {
        if (err || !combined || combined.length === 0) {
            return res.json({ text: "해당 감정의 명언을 찾을 수 없습니다.", author: "Dear Me" });
        }
        res.json(combined[Math.floor(Math.random() * combined.length)]);
    });
});

// --- [F] 포춘쿠키 API ---
app.get('/api/fortune-cookies', (req, res) => {
    db.query('SELECT * FROM fortune_cookies ORDER BY RAND() LIMIT 1', (err, results) => {
        if (err || results.length === 0) {
            return res.json({ message: "운세가 준비되지 않았습니다." });
        }
        res.json(results[0]);
    });
});

app.get('/api/admin/fortune-cookies', (req, res) => {
    db.query('SELECT * FROM fortune_cookies ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json(results);
    });
});

app.post('/api/admin/fortune-cookie', (req, res) => {
    const { text } = req.body;
    db.query('INSERT INTO fortune_cookies (text) VALUES (?)', [text], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.delete('/api/admin/fortune-cookie/:id', (req, res) => {
    db.query('DELETE FROM fortune_cookies WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.get('/api/user-stats', (req, res) => {
    const username = req.query.username;
    const sql = `SELECT 
        (SELECT COUNT(*) FROM custom_quotes WHERE TRIM(username) = TRIM(?)) AS myQuotes, 
        (SELECT COUNT(*) FROM saved_quotes WHERE TRIM(username) = TRIM(?)) AS savedCount, 
        top_emotion AS topEmotion, created_at 
        FROM users WHERE TRIM(username) = TRIM(?) LIMIT 1`;
    db.query(sql, [username, username, username], (err, results) => {
        if (err || !results || results.length === 0) return res.status(500).json({ success: false });
        res.json(results[0]);
    });
});

// --- [D] 피드백 시스템 API ---

app.post('/api/feedback', (req, res) => {
    const { username, content } = req.body;
    db.query('INSERT INTO feedbacks (username, content) VALUES (?, ?)', [username || '익명', content], () => res.json({ success: true }));
});

app.put('/api/feedback/:id', (req, res) => {
    const { content } = req.body;
    db.query('UPDATE feedbacks SET content = ? WHERE id = ?', [content, req.params.id], () => res.json({ success: true }));
});

app.delete('/api/feedback/:id', (req, res) => {
    db.query('DELETE FROM feedbacks WHERE id = ?', [req.params.id], () => res.json({ success: true }));
});

app.get('/api/my-feedbacks', (req, res) => {
    const { username } = req.query;
    db.query('SELECT * FROM feedbacks WHERE TRIM(username) = TRIM(?) ORDER BY id DESC', [username], (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json(results || []);
    });
});

app.get('/api/admin/all-feedbacks', (req, res) => {
    // 관리자(admin, 관리자)용 전체 문의 조회
    db.query('SELECT * FROM feedbacks ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json(results || []);
    });
});

app.put('/api/feedback/reply/:id', (req, res) => {
    const { reply, isAdmin } = req.body;
    if (!isAdmin) return res.status(403).json({ success: false });
    db.query('UPDATE feedbacks SET reply = ? WHERE id = ?', [reply, req.params.id], () => res.json({ success: true }));
});

// --- [E] 계정 설정(보안/탈퇴) 시스템 API ---

app.post('/api/verify-password', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE TRIM(username) = TRIM(?) AND password = ?', [username, password], (err, results) => {
        if (err || results.length === 0) return res.json({ success: false });
        res.json({ success: true });
    });
});

app.post('/api/change-password', (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    // 보안을 위해 WHERE 절에 현재 비밀번호를 한 번 더 체크합니다.
    db.query('UPDATE users SET password = ? WHERE TRIM(username) = TRIM(?) AND password = ?', [newPassword, username, currentPassword], (err, results) => {
        if (err || results.affectedRows === 0) return res.json({ success: false });
        res.json({ success: true });
    });
});

app.delete('/api/withdraw', (req, res) => {
    const { username } = req.body;
    if (username === '관리자' || username === 'admin') {
        return res.json({ success: false, message: "관리자 계정은 탈퇴할 수 없습니다." });
    }
    db.query('DELETE FROM users WHERE TRIM(username) = TRIM(?)', [username], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// --- [G] 우체통 (Postbox) 고급 API ---

const badWords = ['씨발', '개새끼', '병신', '죽어', '바보', '멍청이', '자살', '쓰레기'];

function containsBadWord(text) {
    return badWords.some(word => text.includes(word));
}

// 편지 보내기 (키워드 필터 적용)
app.post('/api/postbox/letter', (req, res) => {
    const { author, content } = req.body;
    if (containsBadWord(content)) {
        return res.json({ success: false, message: '따뜻한 위로가 필요한 공간입니다. 고운 말을 사용해주세요. 😊' });
    }
    db.query('INSERT INTO letters (author, content) VALUES (?, ?)', [author || '익명', content], (err) => {
        if (err) return res.status(500).json({ success: false, message: '서버 오류' });
        res.json({ success: true });
    });
});

// 랜덤 편지 1개 가져오기 (자기가 쓴 편지 제외, 아직 답장이 없는 편지)
app.get('/api/postbox/random', (req, res) => {
    const { username } = req.query;
    db.query('SELECT * FROM letters WHERE is_replied = 0 AND TRIM(author) != TRIM(?) ORDER BY RAND() LIMIT 1', [username], (err, results) => {
        if (err || results.length === 0) return res.json({ letter: null });
        res.json({ letter: results[0] });
    });
});

// 편지 답장하기 (키워드 필터 적용)
app.post('/api/postbox/reply', (req, res) => {
    const { letter_id, author, content } = req.body;
    if (containsBadWord(content)) {
        return res.json({ success: false, message: '따뜻한 위로가 필요한 공간입니다. 고운 말을 사용해주세요. 😊' });
    }
    db.query('INSERT INTO replies (letter_id, author, content) VALUES (?, ?, ?)', [letter_id, author || '익명', content], (err) => {
        if (err) return res.status(500).json({ success: false, message: '서버 오류' });
        db.query('UPDATE letters SET is_replied = 1 WHERE id = ?', [letter_id], () => {
            res.json({ success: true });
        });
    });
});

// 내 편지에 달린 답장함 가져오기
app.get('/api/postbox/inbox', (req, res) => {
    const { username } = req.query;
    const sql = `
        SELECT r.id as reply_id, r.content as reply_content, r.author as reply_author, r.created_at as reply_date, r.is_read, r.star,
               l.id as letter_id, l.content as letter_content
        FROM replies r
        JOIN letters l ON r.letter_id = l.id
        WHERE TRIM(l.author) = TRIM(?)
        ORDER BY r.id DESC
    `;
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json(results || []);
    });
});

// 읽음 처리
app.post('/api/postbox/read', (req, res) => {
    const { reply_id } = req.body;
    db.query('UPDATE replies SET is_read = 1 WHERE id = ?', [reply_id], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// 별(좋아요) 남기기 (토글 기능)
app.post('/api/postbox/star', (req, res) => {
    const { reply_id } = req.body;
    db.query('UPDATE replies SET star = IF(star=1, 0, 1) WHERE id = ?', [reply_id], (err) => {
        if (err) return res.status(500).json({ success: false });

        db.query('SELECT star FROM replies WHERE id = ?', [reply_id], (err2, results) => {
            if (err2 || results.length === 0) return res.status(500).json({ success: false });
            res.json({ success: true, star: results[0].star });
        });
    });
});

// 답장 삭제하기
app.delete('/api/postbox/reply/:id', (req, res) => {
    const replyId = req.params.id;
    const { username } = req.body;

    // 1. 해당 답장이 존재하며, 해당 답장의 편지 작성자가 현재 로그인 유저인지 확인
    const checkSql = `
        SELECT r.letter_id, l.author 
        FROM replies r 
        JOIN letters l ON r.letter_id = l.id 
        WHERE r.id = ?
    `;
    db.query(checkSql, [replyId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ success: false, message: '답장을 찾을 수 없습니다.' });

        if (TRIM(results[0].author) !== TRIM(username)) {
            return res.status(403).json({ success: false, message: '권한이 없습니다.' });
        }

        const letterId = results[0].letter_id;

        // 2. 답장 삭제
        db.query('DELETE FROM replies WHERE id = ?', [replyId], (delErr) => {
            if (delErr) return res.status(500).json({ success: false, message: '삭제 실패' });

            // 3. 해당 편지에 남은 다른 답장이 없다면 is_replied 를 0으로 되돌림
            db.query('SELECT COUNT(*) as count FROM replies WHERE letter_id = ?', [letterId], (countErr, countResults) => {
                if (!countErr && countResults[0].count === 0) {
                    db.query('UPDATE letters SET is_replied = 0 WHERE id = ?', [letterId]);
                }
                res.json({ success: true });
            });
        });
    });

    function TRIM(str) { return str ? str.toString().trim() : ''; }
});

// 로그인 시 안 읽은 답장 알림 조회
app.get('/api/postbox/unread', (req, res) => {
    const { username } = req.query;
    const sql = `
        SELECT COUNT(*) as count 
        FROM replies r
        JOIN letters l ON r.letter_id = l.id
        WHERE TRIM(l.author) = TRIM(?) AND r.is_read = 0
    `;
    db.query(sql, [username], (err, results) => {
        if (err || results.length === 0) return res.json({ count: 0 });
        res.json({ count: results[0].count });
    });
});

// 칭호 및 별점 통계 조회
app.get('/api/postbox/user-stats', (req, res) => {
    const { username } = req.query;
    const sql = `
        SELECT COUNT(*) as stars 
        FROM replies r
        JOIN letters l ON r.letter_id = l.id
        WHERE TRIM(r.author) = TRIM(?) AND r.star = 1
    `;
    db.query(sql, [username], (err, results) => {
        if (err) return res.json({ stars: 0, title: '받은 위로 별' });
        const stars = results[0].stars;
        let title = '받은 위로 별';
        if (stars >= 10) title = '천사 위로가';
        else if (stars >= 3) title = '따뜻한 위로가';
        res.json({ stars, title });
    });
});

// --- [C] 계정 및 페이지 라우팅 ---

// [추가 포인트 2] 수정 페이지 열어주는 라우팅 (상세보기보다 무조건 위에 있어야 함!)
app.get('/board/edit/:id', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'edit.html')); });

// 상세보기 페이지
app.get('/board/view/:id', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'view.html')); });

// 짱구 도감 페이지
app.get('/pet-collection', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'pet-collection.html')); });

app.post('/login-process', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE TRIM(username) = TRIM(?) AND password = ?', [username, password], (err, results) => {
        if (results && results.length > 0) {
            // 중복 로그인 방지 로직
            if (activeSessions[username] && (Date.now() - activeSessions[username] < 8000)) {
                return res.json({ success: false, message: "이미 다른 기기 또는 사이트(탭)에서 로그인 중인 사용자입니다." });
            }
            activeSessions[username] = Date.now();
            res.json({ success: true, username: username });
        } else {
            res.json({ success: false, message: "로그인 실패" });
        }
    });
});

app.get('/api/heartbeat', (req, res) => {
    const username = req.query.username;
    if (username) {
        activeSessions[username] = Date.now();
    }
    res.json({ success: true });
});

app.post('/api/logout', (req, res) => {
    const { username } = req.body;
    if (username) {
        delete activeSessions[username];
    }
    res.json({ success: true });
});

app.post('/register-process', (req, res) => {
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [req.body.username, req.body.password], (err) => {
        if (err) {
            // 중복된 아이디(username UNIQUE 제약조건 위반) 등 에러가 났을 때 처리
            return res.send('<script>alert("이미 존재하는 이름이거나 가입에 실패했습니다."); history.back();</script>');
        }
        // 가입 즉시 펫 레코드 자동 생성
        db.query('INSERT IGNORE INTO pets (username) VALUES (?)', [req.body.username]);
        res.send('<script>alert("가입 성공!"); location.href="/login";</script>');
    });
});

// --- [🐣 다마고치 펫 API] ---

// 펫 정보 조회 (없으면 자동 생성)
app.get('/api/pet', (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ success: false });
    db.query('INSERT IGNORE INTO pets (username) VALUES (?)', [username], () => {
        db.query('SELECT * FROM pets WHERE username = ?', [username], (err, results) => {
            if (err || results.length === 0) return res.status(500).json({ success: false });
            res.json({ success: true, pet: results[0] });
        });
    });
});

// 완료된 펫 목록 조회 API
app.get('/api/pet/completed/:username', (req, res) => {
    const { username } = req.params;
    db.query('SELECT completed_types FROM pets WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) return res.json({ success: true, completed: [] });
        const completedStr = results[0].completed_types || '';
        const completedArr = completedStr.split(',').filter(Boolean);
        res.json({ success: true, completed: completedArr });
    });
});

// 출석 체크 (+10 EXP, 하루 1회)
app.post('/api/pet/checkin', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ success: false });

    const today = getKSTDateString();

    db.query('INSERT IGNORE INTO pets (username) VALUES (?)', [username], () => {
        db.query('SELECT last_checkin, exp, level FROM pets WHERE username = ?', [username], (err, results) => {
            if (err || results.length === 0) return res.status(500).json({ success: false });
            const pet = results[0];
            if (pet.last_checkin) {
                const lastCheckinStr = getKSTDateString(pet.last_checkin);
                if (lastCheckinStr === today) {
                    return res.json({ success: false, message: '오늘 이미 출석체크를 완료했습니다! 💛' });
                }
            }
            const newExp = pet.exp + 10;
            const newLevel = calcLevel(newExp);
            const leveledUp = newLevel > pet.level;

            db.query('UPDATE pets SET exp = ?, level = ?, last_checkin = ? WHERE username = ?',
                [newExp, newLevel, today, username], (updateErr) => {
                    if (updateErr) return res.status(500).json({ success: false });
                    res.json({ success: true, gainedExp: 10, newExp, newLevel, leveledUp, message: '출석체크 완료! +10 EXP 💛' });
                });
        });
    });
});

// 활동별 EXP 획득
app.post('/api/pet/gain-exp', (req, res) => {
    const { username, activity } = req.body;
    if (!username || !activity) return res.status(400).json({ success: false });

    const expMap = { 'quote': 3, 'letter': 5, 'reply': 5, 'checkin': 10 };
    const gain = expMap[activity] || 0;
    if (gain === 0) return res.json({ success: false, message: '알 수 없는 활동입니다.' });

    db.query('INSERT IGNORE INTO pets (username) VALUES (?)', [username], () => {
        db.query('SELECT exp, level FROM pets WHERE username = ?', [username], (err, results) => {
            if (err || results.length === 0) return res.status(500).json({ success: false });
            const pet = results[0];
            const newExp = pet.exp + gain;
            const newLevel = calcLevel(newExp);
            const leveledUp = newLevel > pet.level;

            db.query('UPDATE pets SET exp = ?, level = ? WHERE username = ?',
                [newExp, newLevel, username], (updateErr) => {
                    if (updateErr) return res.status(500).json({ success: false });
                    res.json({ success: true, gainedExp: gain, newExp, newLevel, leveledUp });
                });
        });
    });
});

// KST 날짜 변환 헬퍼 (Asia/Seoul)
function getKSTDateString(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(date));
}

// 레벨 계산 헬퍼
function calcLevel(exp) {
    if (exp >= 150) return 4;
    if (exp >= 80) return 3;
    if (exp >= 30) return 2;
    return 1;
}

// 유효한 펫 타입 목록
const VALID_PET_TYPES = ['chick', 'rabbit', 'hamster', 'cat', 'dog', 'maenggu', 'miso', 'suji', 'cheolsu', 'miseon', 'cheolsu2', 'maenggu2', 'miseon2', 'miso2', 'namiri', 'chaesonghwa', 'dumok', 'rose', 'buriburi', 'couple', 'heukgom', 'gaydriver'];

// 전 동물 완료 후 새 동물 선택
app.post('/api/pet/new-animal', (req, res) => {
    const { username, pet_type } = req.body;
    if (!username || !pet_type) return res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
    if (!VALID_PET_TYPES.includes(pet_type)) return res.status(400).json({ success: false, message: '유효하지 않은 펫 타입입니다.' });

    db.query('SELECT level, pet_type, completed_types, total_completions FROM pets WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ success: false, message: '펫 정보를 새로 고친 다시 시도해주세요.' });
        const pet = results[0];

        if (pet.level < 4) return res.status(403).json({ success: false, message: '아직 최고 레벨에 도달하지 못했어요!' });
        if (pet_type === pet.pet_type) return res.status(400).json({ success: false, message: '이미 키우고 있는 동물입니다!' });

        // 완료 동물 목록 업데이트
        const prevCompleted = pet.completed_types ? pet.completed_types : '';
        const completedArr = prevCompleted ? prevCompleted.split(',').filter(Boolean) : [];
        if (!completedArr.includes(pet.pet_type)) completedArr.push(pet.pet_type);
        const newCompleted = completedArr.join(',');
        const newCompletions = (pet.total_completions || 0) + 1;

        db.query(
            'UPDATE pets SET pet_type = ?, exp = 0, level = 1, total_completions = ?, completed_types = ? WHERE username = ?',
            [pet_type, newCompletions, newCompleted, username],
            (updateErr) => {
                if (updateErr) return res.status(500).json({ success: false });
                res.json({ success: true, newPetType: pet_type, completedType: pet.pet_type });
            }
        );
    });
});

// 나머지 일반 경로들 (write, board, recommend, library, mypage 등)
app.get('/board/write', (req, res) => res.sendFile(path.join(__dirname, 'public', 'write.html')));
app.get('/board', (req, res) => res.sendFile(path.join(__dirname, 'public', 'board.html')));
app.get('/recommend', (req, res) => res.sendFile(path.join(__dirname, 'public', 'recommend.html')));
app.get('/library', (req, res) => res.sendFile(path.join(__dirname, 'public', 'library.html')));
app.get('/mypage', (req, res) => res.sendFile(path.join(__dirname, 'public', 'mypage.html')));
app.get('/feedback-page', (req, res) => res.sendFile(path.join(__dirname, 'public', 'feedback.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/postbox', (req, res) => res.sendFile(path.join(__dirname, 'public', 'postbox.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
// [최종 장치] 정적 파일 설정을 맨 아래에 두어 라우팅 방해 방지
app.use(express.static('public'));

app.listen(port, () => console.log(`🚀 Dear Me 시스템 가동 완료: http://localhost:${port}`));