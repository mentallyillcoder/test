-- =====================================================================
--  CourseApp - Database schema (MySQL 8.x)
--  Thiết kế dựa trên các tính năng của FE (demoModule-CourseApp/fe):
--    1. Chọn khóa học              -> courses
--    2. Lộ trình bài học tuần tự   -> lessons (order_index)
--    3. Xem video bài học          -> lessons.video_url, lesson_progress.video_watched
--    4. Bài kiểm tra trắc nghiệm   -> questions, question_options
--    5. Chấm điểm, đạt >= 75%      -> quiz_attempts, quiz_attempt_answers, lessons.pass_threshold
--    6. Mở khóa bài tiếp theo      -> lesson_progress.status (LOCKED/UNLOCKED/COMPLETED)
--    7. Reset tiến độ              -> xóa lesson_progress / quiz_attempts theo user + course
--  Bổ sung: users, enrollments (FE hiện lưu tiến độ ở localStorage,
--  khi lên backend cần gắn tiến độ theo từng người học).
-- =====================================================================

DROP DATABASE IF EXISTS course_app;
CREATE DATABASE course_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE course_app;

-- ---------------------------------------------------------------------
-- 1. Người dùng
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    role           ENUM('STUDENT','INSTRUCTOR','ADMIN') NOT NULL DEFAULT 'STUDENT',
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 2. Khóa học  (GET /courses  -> [{id, title}])
--    id dạng chuỗi (slug) để khớp FE: "react-101", "spring-boot-101"
-- ---------------------------------------------------------------------
CREATE TABLE courses (
    id             VARCHAR(50)  PRIMARY KEY,
    title          VARCHAR(200) NOT NULL,
    description    TEXT NULL,
    thumbnail_url  VARCHAR(500) NULL,
    instructor_id  BIGINT NULL,
    is_published   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_instructor FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------
-- 3. Ghi danh khóa học (người học tham gia khóa nào)
-- ---------------------------------------------------------------------
CREATE TABLE enrollments (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT      NOT NULL,
    course_id    VARCHAR(50) NOT NULL,
    enrolled_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME    NULL,
    CONSTRAINT uq_enrollment UNIQUE (user_id, course_id),
    CONSTRAINT fk_enroll_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_enroll_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 4. Bài học  (GET /courses/{courseId}/lessons)
--    order_index quyết định thứ tự học tuần tự / mở khóa
-- ---------------------------------------------------------------------
CREATE TABLE lessons (
    id              VARCHAR(50)  PRIMARY KEY,
    course_id       VARCHAR(50)  NOT NULL,
    title           VARCHAR(200) NOT NULL,
    video_url       VARCHAR(500) NOT NULL,
    order_index     INT          NOT NULL,
    pass_threshold  TINYINT UNSIGNED NOT NULL DEFAULT 75,   -- % tối thiểu để đạt quiz
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_lesson_order UNIQUE (course_id, order_index),
    CONSTRAINT chk_pass_threshold CHECK (pass_threshold BETWEEN 0 AND 100),
    CONSTRAINT fk_lesson_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 5. Câu hỏi trắc nghiệm của bài học  (lesson.questions[])
-- ---------------------------------------------------------------------
CREATE TABLE questions (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    lesson_id    VARCHAR(50) NOT NULL,
    content      TEXT        NOT NULL,              -- FE: question
    order_index  INT         NOT NULL,
    CONSTRAINT uq_question_order UNIQUE (lesson_id, order_index),
    CONSTRAINT fk_question_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 6. Đáp án của câu hỏi  (question.options[] + correctIndex)
--    option_index = vị trí trong mảng options ở FE (0,1,2,3)
-- ---------------------------------------------------------------------
CREATE TABLE question_options (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id   BIGINT       NOT NULL,
    option_index  TINYINT      NOT NULL,
    content       VARCHAR(500) NOT NULL,
    is_correct    BOOLEAN      NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_option_index UNIQUE (question_id, option_index),
    CONSTRAINT fk_option_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 7. Tiến độ học của từng người trên từng bài
--    status / videoWatched / quizPassed ở FE
--    POST /lessons/{id}/watch-status  -> video_watched = TRUE
-- ---------------------------------------------------------------------
CREATE TABLE lesson_progress (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT      NOT NULL,
    lesson_id         VARCHAR(50) NOT NULL,
    status            ENUM('LOCKED','UNLOCKED','COMPLETED') NOT NULL DEFAULT 'LOCKED',
    video_watched     BOOLEAN  NOT NULL DEFAULT FALSE,
    video_watched_at  DATETIME NULL,
    quiz_passed       BOOLEAN  NOT NULL DEFAULT FALSE,
    best_score        TINYINT UNSIGNED NULL,          -- điểm % cao nhất
    unlocked_at       DATETIME NULL,
    completed_at      DATETIME NULL,
    updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_progress UNIQUE (user_id, lesson_id),
    CONSTRAINT fk_progress_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 8. Lượt nộp bài quiz  (POST /lessons/{id}/submit-quiz
--    -> {scorePercentage, correctCount, totalQuestions, isPassed})
-- ---------------------------------------------------------------------
CREATE TABLE quiz_attempts (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT      NOT NULL,
    lesson_id         VARCHAR(50) NOT NULL,
    score_percentage  TINYINT UNSIGNED NOT NULL,
    correct_count     INT NOT NULL,
    total_questions   INT NOT NULL,
    is_passed         BOOLEAN NOT NULL,
    submitted_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attempt_user_lesson (user_id, lesson_id),
    CONSTRAINT fk_attempt_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_attempt_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 9. Chi tiết câu trả lời trong mỗi lượt nộp  (answers: {questionId: optionIndex})
-- ---------------------------------------------------------------------
CREATE TABLE quiz_attempt_answers (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    attempt_id          BIGINT  NOT NULL,
    question_id         BIGINT  NOT NULL,
    selected_option_id  BIGINT  NULL,
    is_correct          BOOLEAN NOT NULL,
    CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id),
    CONSTRAINT fk_answer_attempt  FOREIGN KEY (attempt_id)         REFERENCES quiz_attempts(id)    ON DELETE CASCADE,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id)        REFERENCES questions(id)        ON DELETE CASCADE,
    CONSTRAINT fk_answer_option   FOREIGN KEY (selected_option_id) REFERENCES question_options(id) ON DELETE SET NULL
);

-- =====================================================================
--  DỮ LIỆU MẪU (khớp với MOCK_COURSES / MOCK_LESSONS trong learningApi.js)
-- =====================================================================
INSERT INTO users (id, full_name, email, password_hash, role) VALUES
 (1, 'Giảng viên Demo', 'instructor@courseapp.local', '$2a$10$demoHashInstructor', 'INSTRUCTOR'),
 (2, 'Học viên Demo',   'student@courseapp.local',    '$2a$10$demoHashStudent',    'STUDENT');

INSERT INTO courses (id, title, instructor_id) VALUES
 ('react-101',       'Lập trình React.js Cơ Bản',      1),
 ('spring-boot-101', 'Lập trình Spring Boot REST API', 1);

INSERT INTO lessons (id, course_id, title, video_url, order_index) VALUES
 ('l1', 'react-101', 'Bài 1: Giới thiệu & Cài đặt môi trường', 'https://www.w3schools.com/html/mov_bbb.mp4', 1),
 ('l2', 'react-101', 'Bài 2: Component & JSX trong React',     'https://www.w3schools.com/html/movie.mp4',   2),
 ('l3', 'react-101', 'Bài 3: State & Props',                    'https://www.w3schools.com/html/mov_bbb.mp4', 3);

INSERT INTO questions (id, lesson_id, content, order_index) VALUES
 (1, 'l1', 'React.js là gì?', 1),
 (2, 'l1', 'Lệnh nào dùng để khởi tạo dự án React với Vite?', 2),
 (3, 'l2', 'JSX là gì trong React?', 1),
 (4, 'l2', 'Component trong React phải trả về gì?', 2),
 (5, 'l3', 'Hook nào dùng để quản lý state trong Functional Component?', 1);

INSERT INTO question_options (question_id, option_index, content, is_correct) VALUES
 (1, 0, 'Một Thư viện JavaScript', TRUE),
 (1, 1, 'Một Framework PHP', FALSE),
 (1, 2, 'Một Cơ sở dữ liệu', FALSE),
 (1, 3, 'Một Hệ điều hành', FALSE),
 (2, 0, 'npm start', FALSE),
 (2, 1, 'npm create vite@latest', TRUE),
 (2, 2, 'git init', FALSE),
 (2, 3, 'docker run', FALSE),
 (3, 0, 'Cú pháp mở rộng của JavaScript', TRUE),
 (3, 1, 'Dạng file video', FALSE),
 (3, 2, 'Một loại CSS', FALSE),
 (3, 3, 'Giao thức truyền tải', FALSE),
 (4, 0, 'Một chuỗi SQL', FALSE),
 (4, 1, 'Một phần tử JSX / HTML', TRUE),
 (4, 2, 'Một tệp JSON', FALSE),
 (4, 3, 'Không trả về gì cả', FALSE),
 (5, 0, 'useEffect', FALSE),
 (5, 1, 'useState', TRUE),
 (5, 2, 'useContext', FALSE),
 (5, 3, 'useReducer', FALSE);

-- Học viên demo ghi danh khóa React: bài đầu UNLOCKED, các bài sau LOCKED
INSERT INTO enrollments (user_id, course_id) VALUES (2, 'react-101');

INSERT INTO lesson_progress (user_id, lesson_id, status, unlocked_at)
SELECT 2, l.id,
       IF(l.order_index = 1, 'UNLOCKED', 'LOCKED'),
       IF(l.order_index = 1, NOW(), NULL)
FROM lessons l WHERE l.course_id = 'react-101';

-- =====================================================================
--  TRUY VẤN MẪU CHO CÁC API CỦA FE
-- =====================================================================
-- GET /courses/{courseId}/lessons  (lộ trình + trạng thái của user :uid)
-- SELECT l.id, l.title, l.video_url AS videoUrl, l.order_index,
--        COALESCE(p.status, 'LOCKED')  AS status,
--        COALESCE(p.video_watched, 0)  AS videoWatched,
--        COALESCE(p.quiz_passed, 0)    AS quizPassed
-- FROM lessons l
-- LEFT JOIN lesson_progress p ON p.lesson_id = l.id AND p.user_id = :uid
-- WHERE l.course_id = :courseId
-- ORDER BY l.order_index;
--
-- POST /lessons/{lessonId}/watch-status
-- UPDATE lesson_progress SET video_watched = TRUE, video_watched_at = NOW()
-- WHERE user_id = :uid AND lesson_id = :lessonId AND status <> 'LOCKED';
--
-- POST /lessons/{lessonId}/submit-quiz  (khi is_passed = TRUE)
-- UPDATE lesson_progress SET quiz_passed = TRUE, status = 'COMPLETED', completed_at = NOW()
-- WHERE user_id = :uid AND lesson_id = :lessonId;
-- UPDATE lesson_progress p JOIN lessons nxt ON nxt.id = p.lesson_id
--   JOIN lessons cur ON cur.id = :lessonId
-- SET p.status = 'UNLOCKED', p.unlocked_at = NOW()
-- WHERE p.user_id = :uid AND nxt.course_id = cur.course_id
--   AND nxt.order_index = cur.order_index + 1 AND p.status = 'LOCKED';
--
-- Reset tiến độ khóa học
-- DELETE qa FROM quiz_attempts qa JOIN lessons l ON l.id = qa.lesson_id
--   WHERE qa.user_id = :uid AND l.course_id = :courseId;
-- UPDATE lesson_progress p JOIN lessons l ON l.id = p.lesson_id
-- SET p.status = IF(l.order_index = 1,'UNLOCKED','LOCKED'), p.video_watched = FALSE,
--     p.video_watched_at = NULL, p.quiz_passed = FALSE, p.best_score = NULL,
--     p.completed_at = NULL
-- WHERE p.user_id = :uid AND l.course_id = :courseId;
