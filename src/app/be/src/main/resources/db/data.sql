-- =====================================================================
--  CourseApp - Dữ liệu khởi tạo (khớp MOCK_COURSES / MOCK_LESSONS ở FE)
--  Không chèn id cứng cho bảng IDENTITY để sequence không bị trùng khi
--  ứng dụng insert thêm dữ liệu.
-- =====================================================================

-- Users: id 1 = giảng viên, id 2 = học viên demo (app.demo-user-id)
INSERT INTO users (full_name, email, password_hash, role) VALUES
    ('Giảng viên Demo', 'instructor@courseapp.local', '$2a$10$demoHashInstructor', 'INSTRUCTOR'),
    ('Học viên Demo',   'student@courseapp.local',    '$2a$10$demoHashStudent',    'STUDENT');

-- Courses
INSERT INTO courses (id, title, description, instructor_id) VALUES
    ('react-101',       'Lập trình React.js Cơ Bản',      'Làm quen với React, JSX, Component, State & Props.',
        (SELECT id FROM users WHERE email = 'instructor@courseapp.local')),
    ('spring-boot-101', 'Lập trình Spring Boot REST API', 'Xây dựng REST API với Spring Boot và JPA.',
        (SELECT id FROM users WHERE email = 'instructor@courseapp.local'));

-- Lessons
INSERT INTO lessons (id, course_id, title, video_url, order_index) VALUES
    ('l1', 'react-101', 'Bài 1: Giới thiệu & Cài đặt môi trường', 'https://www.w3schools.com/html/mov_bbb.mp4', 1),
    ('l2', 'react-101', 'Bài 2: Component & JSX trong React',     'https://www.w3schools.com/html/movie.mp4',   2),
    ('l3', 'react-101', 'Bài 3: State & Props',                    'https://www.w3schools.com/html/mov_bbb.mp4', 3),
    ('sb1', 'spring-boot-101', 'Bài 1: Khởi tạo project Spring Boot', 'https://www.w3schools.com/html/mov_bbb.mp4', 1),
    ('sb2', 'spring-boot-101', 'Bài 2: Viết REST Controller',         'https://www.w3schools.com/html/movie.mp4',   2);

-- Questions
INSERT INTO questions (lesson_id, content, order_index) VALUES
    ('l1',  'React.js là gì?', 1),
    ('l1',  'Lệnh nào dùng để khởi tạo dự án React với Vite?', 2),
    ('l2',  'JSX là gì trong React?', 1),
    ('l2',  'Component trong React phải trả về gì?', 2),
    ('l3',  'Hook nào dùng để quản lý state trong Functional Component?', 1),
    ('sb1', 'Công cụ nào thường dùng để khởi tạo project Spring Boot?', 1),
    ('sb2', 'Annotation nào đánh dấu một class là REST controller?', 1);

-- Options
INSERT INTO question_options (question_id, option_index, content, is_correct) VALUES
    ((SELECT id FROM questions WHERE lesson_id = 'l1' AND order_index = 1), 0, 'Một Thư viện JavaScript', TRUE),
    ((SELECT id FROM questions WHERE lesson_id = 'l1' AND order_index = 1), 1, 'Một Framework PHP', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'l1' AND order_index = 1), 2, 'Một Cơ sở dữ liệu', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'l1' AND order_index = 1), 3, 'Một Hệ điều hành', FALSE),

    ((SELECT id FROM questions WHERE lesson_id = 'l1' AND order_index = 2), 0, 'npm start', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'l1' AND order_index = 2), 1, 'npm create vite@latest', TRUE),
    ((SELECT id FROM questions WHERE lesson_id = 'l1' AND order_index = 2), 2, 'git init', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'l1' AND order_index = 2), 3, 'docker run', FALSE),

    ((SELECT id FROM questions WHERE lesson_id = 'l2' AND order_index = 1), 0, 'Cú pháp mở rộng của JavaScript', TRUE),
    ((SELECT id FROM questions WHERE lesson_id = 'l2' AND order_index = 1), 1, 'Dạng file video', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'l2' AND order_index = 1), 2, 'Một loại CSS', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'l2' AND order_index = 1), 3, 'Giao thức truyền tải', FALSE),

    ((SELECT id FROM questions WHERE lesson_id = 'l2' AND order_index = 2), 0, 'Một chuỗi SQL', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'l2' AND order_index = 2), 1, 'Một phần tử JSX / HTML', TRUE),
    ((SELECT id FROM questions WHERE lesson_id = 'l2' AND order_index = 2), 2, 'Một tệp JSON', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'l2' AND order_index = 2), 3, 'Không trả về gì cả', FALSE),

    ((SELECT id FROM questions WHERE lesson_id = 'l3' AND order_index = 1), 0, 'useEffect', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'l3' AND order_index = 1), 1, 'useState', TRUE),
    ((SELECT id FROM questions WHERE lesson_id = 'l3' AND order_index = 1), 2, 'useContext', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'l3' AND order_index = 1), 3, 'useReducer', FALSE),

    ((SELECT id FROM questions WHERE lesson_id = 'sb1' AND order_index = 1), 0, 'Spring Initializr (start.spring.io)', TRUE),
    ((SELECT id FROM questions WHERE lesson_id = 'sb1' AND order_index = 1), 1, 'create-react-app', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'sb1' AND order_index = 1), 2, 'Composer', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'sb1' AND order_index = 1), 3, 'pip', FALSE),

    ((SELECT id FROM questions WHERE lesson_id = 'sb2' AND order_index = 1), 0, '@Entity', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'sb2' AND order_index = 1), 1, '@Service', FALSE),
    ((SELECT id FROM questions WHERE lesson_id = 'sb2' AND order_index = 1), 2, '@RestController', TRUE),
    ((SELECT id FROM questions WHERE lesson_id = 'sb2' AND order_index = 1), 3, '@Repository', FALSE);

-- Học viên demo ghi danh khóa React: bài 1 mở, các bài sau khóa
INSERT INTO enrollments (user_id, course_id)
    SELECT id, 'react-101' FROM users WHERE email = 'student@courseapp.local';

INSERT INTO lesson_progress (user_id, lesson_id, status, unlocked_at)
    SELECT u.id, l.id,
           CASE WHEN l.order_index = 1 THEN 'UNLOCKED' ELSE 'LOCKED' END,
           CASE WHEN l.order_index = 1 THEN CURRENT_TIMESTAMP ELSE NULL END
    FROM users u CROSS JOIN lessons l
    WHERE u.email = 'student@courseapp.local' AND l.course_id = 'react-101';
