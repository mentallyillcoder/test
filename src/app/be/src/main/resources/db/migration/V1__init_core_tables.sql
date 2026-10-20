-- =====================================================================
-- V1: Lược đồ EduRecall theo YeuCau.md bản cuối (ERD v3)
-- Chỉ được sửa file này khi CHƯA merge vào main. Sau khi merge: tạo V<n> mới.
--
-- Quy ước:
--   * Khóa chính UUID, sinh bằng gen_random_uuid().
--   * Trạng thái lưu VARCHAR + CHECK, giá trị VIẾT HOA trùng enum Java
--     (@Enumerated(EnumType.STRING)).
--   * Thời gian TIMESTAMPTZ -> entity dùng Instant hoặc OffsetDateTime.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Người dùng (mật khẩu do Keycloak quản lý)
-- role là vai trò đã chọn lúc đăng ký. Giáo viên chỉ được cấp realm role
-- TEACHER trên Keycloak sau khi hồ sơ trong teacher_applications được duyệt.
-- ---------------------------------------------------------------------
CREATE TABLE users (
                       id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                       keycloak_id   VARCHAR(64)  NOT NULL UNIQUE,
                       email         VARCHAR(255) NOT NULL UNIQUE,
                       display_name  VARCHAR(100) NOT NULL,
                       role          VARCHAR(20)  NOT NULL CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN')),
                       is_locked     BOOLEAN      NOT NULL DEFAULT FALSE,                -- BR-10
                       created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
                       updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Hồ sơ xin làm giáo viên. Bị từ chối thì nộp hồ sơ mới (giữ lịch sử).
CREATE TABLE teacher_applications (
                                      id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                                      user_id        UUID         NOT NULL REFERENCES users (id),
                                      expertise      VARCHAR(255) NOT NULL,       -- lĩnh vực chuyên môn
                                      bio            TEXT,                        -- kinh nghiệm giảng dạy
                                      evidence_url        VARCHAR(500),           -- link LinkedIn / portfolio / CV online
                                      evidence_file_path  VARCHAR(500),           -- file CV (PDF) trong Supabase Storage
                                      status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING'
                                          CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
                                      review_reason  TEXT,
                                      reviewed_by    UUID         REFERENCES users (id),
                                      submitted_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
                                      reviewed_at    TIMESTAMPTZ,
                                      CONSTRAINT ck_teacher_app_reject_reason
                                          CHECK (status <> 'REJECTED' OR review_reason IS NOT NULL)
);
-- Mỗi người chỉ có một hồ sơ đang chờ duyệt
CREATE UNIQUE INDEX uq_teacher_app_one_pending
    ON teacher_applications (user_id) WHERE status = 'PENDING';
CREATE INDEX idx_teacher_app_status ON teacher_applications (status);

-- ---------------------------------------------------------------------
-- Danh mục (FR-19)
-- ---------------------------------------------------------------------
CREATE TABLE categories (
                            id    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                            name  VARCHAR(100) NOT NULL UNIQUE
);

-- ---------------------------------------------------------------------
-- Khóa học và phiên bản (FR-10, FR-12, FR-13, BR-04, BR-05)
--
-- courses: định danh khóa + trạng thái vòng đời
--   Draft -> Pending -> Published <-> Suspended ; Pending -> Rejected -> Pending
-- course_revisions: nội dung khóa (tên, mô tả, bài học, bài kiểm tra).
--   Revision 1 là bản đầu tiên. Sửa khóa đã Published = tạo revision mới;
--   học viên vẫn học trên published_revision_id cho tới khi bản mới được duyệt.
-- ---------------------------------------------------------------------
CREATE TABLE courses (
                         id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
                         teacher_id             UUID        NOT NULL REFERENCES users (id),
                         status                 VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                             CHECK (status IN ('DRAFT', 'PENDING', 'PUBLISHED', 'SUSPENDED', 'REJECTED')),
                         status_reason          TEXT,
                         published_revision_id  UUID,        -- khóa ngoại thêm ở dưới (tham chiếu vòng)
                         published_at           TIMESTAMPTZ,
                         created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
                         updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- BR-09: từ chối hoặc đình chỉ phải có lý do
                         CONSTRAINT ck_courses_reason
                             CHECK (status NOT IN ('REJECTED', 'SUSPENDED') OR status_reason IS NOT NULL),
    -- Đang phát hành hoặc bị đình chỉ thì phải có bản đã duyệt
                         CONSTRAINT ck_courses_published_revision
                             CHECK (status NOT IN ('PUBLISHED', 'SUSPENDED') OR published_revision_id IS NOT NULL)
);
CREATE INDEX idx_courses_status  ON courses (status);
CREATE INDEX idx_courses_teacher ON courses (teacher_id);

CREATE TABLE course_revisions (
                                  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                                  course_id       UUID         NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
                                  revision_no     INT          NOT NULL CHECK (revision_no > 0),
                                  status          VARCHAR(20)  NOT NULL DEFAULT 'DRAFT'
                                      CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'SUPERSEDED')),
                                  title           VARCHAR(200) NOT NULL,
                                  description     TEXT,
                                  category_id     UUID         REFERENCES categories (id) ON DELETE SET NULL,
                                  level           VARCHAR(20)  CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
                                  thumbnail_path  VARCHAR(500),
                                  review_reason   TEXT,
                                  reviewed_by     UUID         REFERENCES users (id),
                                  submitted_at    TIMESTAMPTZ,
                                  reviewed_at     TIMESTAMPTZ,
                                  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
                                  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
                                  CONSTRAINT uq_revision_no UNIQUE (course_id, revision_no),
                                  CONSTRAINT uq_revision_id_course UNIQUE (id, course_id),   -- phục vụ khóa ngoại kép bên dưới
                                  CONSTRAINT ck_revision_reject_reason
                                      CHECK (status <> 'REJECTED' OR review_reason IS NOT NULL)
);
-- Mỗi khóa chỉ có tối đa một bản đang sửa / chờ duyệt / bị từ chối
CREATE UNIQUE INDEX uq_revision_one_open
    ON course_revisions (course_id) WHERE status IN ('DRAFT', 'PENDING', 'REJECTED');
CREATE INDEX idx_revisions_category ON course_revisions (category_id);

-- Khóa ngoại kép: bản đang phát hành phải là revision CỦA CHÍNH khóa học này
ALTER TABLE courses
    ADD CONSTRAINT fk_courses_published_revision
        FOREIGN KEY (published_revision_id, id) REFERENCES course_revisions (id, course_id);

-- Bài học thuộc một revision. origin_lesson_id trỏ tới bài tương ứng ở
-- revision trước, dùng để chuyển tiến độ học viên khi bản mới được duyệt.
CREATE TABLE lessons (
                         id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                         revision_id       UUID         NOT NULL REFERENCES course_revisions (id) ON DELETE CASCADE,
                         origin_lesson_id  UUID         REFERENCES lessons (id) ON DELETE SET NULL,
                         title             VARCHAR(200) NOT NULL,
                         sequence_order    INT          NOT NULL CHECK (sequence_order > 0),
                         video_path        VARCHAR(500),
                         duration_seconds  INT          CHECK (duration_seconds >= 0),
                         created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
                         updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
                         CONSTRAINT uq_lessons_revision_order UNIQUE (revision_id, sequence_order)
                             DEFERRABLE INITIALLY DEFERRED
);
CREATE INDEX idx_lessons_origin ON lessons (origin_lesson_id);

-- ---------------------------------------------------------------------
-- Bài kiểm tra 4 dạng câu hỏi (FR-05, FR-11, BR-03)
-- ---------------------------------------------------------------------
CREATE TABLE lesson_quizzes (
                                id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
                                lesson_id   UUID        NOT NULL UNIQUE REFERENCES lessons (id) ON DELETE CASCADE,
                                pass_score  INT         NOT NULL CHECK (pass_score BETWEEN 1 AND 100),  -- % tối thiểu
                                created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                                updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quiz_questions (
                                id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
                                quiz_id      UUID        NOT NULL REFERENCES lesson_quizzes (id) ON DELETE CASCADE,
                                type         VARCHAR(20) NOT NULL
                                    CHECK (type IN ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'SHORT_ANSWER')),
                                prompt       TEXT        NOT NULL,
                                explanation  TEXT,                       -- giải thích hiện sau khi nộp
                                points       INT         NOT NULL DEFAULT 1 CHECK (points > 0),
                                sort_order   INT         NOT NULL
);
CREATE INDEX idx_questions_quiz ON quiz_questions (quiz_id);

-- Phương án cho MULTIPLE_CHOICE và TRUE_FALSE (đúng/sai = 2 phương án)
CREATE TABLE question_options (
                                  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
                                  question_id  UUID    NOT NULL REFERENCES quiz_questions (id) ON DELETE CASCADE,
                                  content      TEXT    NOT NULL,
                                  is_correct   BOOLEAN NOT NULL,
                                  sort_order   INT     NOT NULL
);
CREATE INDEX idx_options_question ON question_options (question_id);

-- Các đáp án chấp nhận cho FILL_BLANK và SHORT_ANSWER
CREATE TABLE question_accepted_answers (
                                           id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                                           question_id  UUID         NOT NULL REFERENCES quiz_questions (id) ON DELETE CASCADE,
                                           answer_text  VARCHAR(500) NOT NULL
);
CREATE INDEX idx_accepted_question ON question_accepted_answers (question_id);

-- ---------------------------------------------------------------------
-- Học tập (FR-03, FR-04, FR-05, FR-06, BR-01, BR-06, BR-07)
-- ---------------------------------------------------------------------
CREATE TABLE enrollments (
                             id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
                             student_id           UUID          NOT NULL REFERENCES users (id),
                             course_id            UUID          NOT NULL REFERENCES courses (id) ON DELETE RESTRICT,
                             progress_percentage  NUMERIC(5,2)  NOT NULL DEFAULT 0
                                 CHECK (progress_percentage BETWEEN 0 AND 100),
                             enrolled_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
                             completed_at         TIMESTAMPTZ,
                             last_accessed_at     TIMESTAMPTZ,
                             CONSTRAINT uq_enrollments_student_course UNIQUE (student_id, course_id)   -- BR-07
);
CREATE INDEX idx_enrollments_course ON enrollments (course_id);

-- Không có dòng = bài đang khóa. Dòng được tạo khi bài được mở.
CREATE TABLE lesson_progress (
                                 id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
                                 enrollment_id          UUID        NOT NULL REFERENCES enrollments (id) ON DELETE CASCADE,
                                 lesson_id              UUID        NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
                                 status                 VARCHAR(20) NOT NULL DEFAULT 'UNLOCKED'
                                     CHECK (status IN ('UNLOCKED', 'LEARNING', 'REVIEWING', 'COMPLETED')),
                                 watch_percent          INT         NOT NULL DEFAULT 0 CHECK (watch_percent BETWEEN 0 AND 100),
                                 max_watched_seconds    INT         NOT NULL DEFAULT 0 CHECK (max_watched_seconds >= 0),
                                 last_position_seconds  INT         NOT NULL DEFAULT 0 CHECK (last_position_seconds >= 0),
                                 unlocked_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
                                 completed_at           TIMESTAMPTZ,
                                 updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
                                 CONSTRAINT uq_lesson_progress UNIQUE (enrollment_id, lesson_id)
);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress (lesson_id);

CREATE TABLE quiz_attempts (
                               id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
                               enrollment_id  UUID          NOT NULL REFERENCES enrollments (id) ON DELETE CASCADE,
                               quiz_id        UUID          NOT NULL REFERENCES lesson_quizzes (id) ON DELETE CASCADE,
                               status         VARCHAR(20)   NOT NULL DEFAULT 'IN_PROGRESS'
                                   CHECK (status IN ('IN_PROGRESS', 'SUBMITTED')),
                               total_points   INT           NOT NULL CHECK (total_points > 0),
                               earned_points  NUMERIC(7,2)  CHECK (earned_points >= 0),
                               score          NUMERIC(5,2)  CHECK (score BETWEEN 0 AND 100),
                               pass_score     INT           NOT NULL CHECK (pass_score BETWEEN 1 AND 100),  -- snapshot
                               shuffle_seed   INT,          -- giữ nguyên thứ tự câu đã xáo khi học viên tải lại trang
                               is_passed      BOOLEAN,
                               started_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
                               submitted_at   TIMESTAMPTZ,
                               CONSTRAINT ck_attempt_submitted CHECK (
                                   status = 'IN_PROGRESS'
                                       OR (score IS NOT NULL AND is_passed IS NOT NULL AND submitted_at IS NOT NULL)
                                   )
);
-- NFR-01: tra kết quả theo học viên và bài kiểm tra
CREATE INDEX idx_quiz_attempts_enrollment_quiz ON quiz_attempts (enrollment_id, quiz_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts (quiz_id);           -- FR-15
CREATE UNIQUE INDEX uq_quiz_attempts_one_in_progress
    ON quiz_attempts (enrollment_id, quiz_id) WHERE status = 'IN_PROGRESS';

-- Lưu từng câu; cột *_snapshot giữ lịch sử kể cả khi câu hỏi bị sửa/xóa.
CREATE TABLE quiz_attempt_answers (
                                      id                       UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
                                      attempt_id               UUID          NOT NULL REFERENCES quiz_attempts (id) ON DELETE CASCADE,
                                      question_id              UUID          REFERENCES quiz_questions (id) ON DELETE SET NULL,
                                      question_type            VARCHAR(20)   NOT NULL
                                          CHECK (question_type IN ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'SHORT_ANSWER')),
                                      prompt_snapshot          TEXT          NOT NULL,
                                      correct_answer_snapshot  TEXT          NOT NULL,
                                      options_snapshot         JSONB,
                                      selected_option_id       UUID,         -- không đặt khóa ngoại: phương án có thể bị xóa
                                      given_answer             TEXT,
                                      is_correct               BOOLEAN,
                                      points_awarded           NUMERIC(7,2)  CHECK (points_awarded >= 0),
                                      CONSTRAINT uq_attempt_answers UNIQUE (attempt_id, question_id)
);

-- ---------------------------------------------------------------------
-- Flashcard cá nhân (FR-07, FR-08, BR-08)
-- Bài kiểm tra tự tạo từ bộ thẻ (FR-08) sinh và chấm ở frontend, không lưu.
-- ---------------------------------------------------------------------
CREATE TABLE personal_flashcard_sets (
                                         id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                                         owner_id     UUID         NOT NULL REFERENCES users (id),
                                         title        VARCHAR(200) NOT NULL,
                                         description  TEXT,
                                         created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
                                         updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_personal_sets_owner ON personal_flashcard_sets (owner_id);

CREATE TABLE personal_flashcards (
                                     id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                                     set_id      UUID         NOT NULL REFERENCES personal_flashcard_sets (id) ON DELETE CASCADE,
                                     term        VARCHAR(255) NOT NULL,
                                     definition  TEXT         NOT NULL,
                                     sort_order  INT          NOT NULL
);
CREATE INDEX idx_personal_cards_set ON personal_flashcards (set_id);

-- ---------------------------------------------------------------------
-- Báo cáo và log (FR-09, FR-17, BR-09)
-- ---------------------------------------------------------------------
CREATE TABLE reports (
                         id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                         course_id    UUID         NOT NULL REFERENCES courses (id),
                         reporter_id  UUID         NOT NULL REFERENCES users (id),
                         reason       VARCHAR(100) NOT NULL,
                         description  TEXT,
                         status       VARCHAR(20)  NOT NULL DEFAULT 'NEW'
                             CHECK (status IN ('NEW', 'DISMISSED', 'RESOLVED')),
                         admin_note   TEXT,
                         handled_by   UUID         REFERENCES users (id),
                         reported_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
                         resolved_at  TIMESTAMPTZ
);
-- Không gửi báo cáo mới khi báo cáo trước của chính mình cho khóa đó chưa xử lý
CREATE UNIQUE INDEX uq_reports_one_open
    ON reports (course_id, reporter_id) WHERE status = 'NEW';
CREATE INDEX idx_reports_status ON reports (status);

CREATE TABLE system_logs (
                             id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                             user_id      UUID         NOT NULL REFERENCES users (id),
                             action       VARCHAR(50)  NOT NULL,
                             target_type  VARCHAR(30)  NOT NULL,
                             target_id    UUID         NOT NULL,
                             from_status  VARCHAR(20),
                             to_status    VARCHAR(20),
                             reason       TEXT,
                             created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_system_logs_target ON system_logs (target_type, target_id);

-- ---------------------------------------------------------------------
-- Supabase: chặn REST API tự sinh đọc thẳng các bảng (Spring Boot là chủ
-- sở hữu bảng nên không bị ảnh hưởng; trên PostgreSQL local thì vô hại).
-- ---------------------------------------------------------------------
DO $$
DECLARE t TEXT;
BEGIN
FOR t IN SELECT tablename FROM pg_tables
         WHERE schemaname = 'public' AND tablename <> 'flyway_schema_history'
             LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
END LOOP;
END $$;