# CourseApp Backend (Spring Boot)

Backend cho FE `demoModule-CourseApp/fe`, gồm hệ thống học tập tuần tự: xem video, làm quiz đạt từ 75% trở lên để mở khóa bài tiếp theo.

## Công nghệ
- Java 17+, Spring Boot 3.5, Maven
- Spring Web, Spring Data JPA, Validation, DevTools
- H2 in-memory (chế độ PostgreSQL); có sẵn driver PostgreSQL để chuyển sang DB thật

## Cấu trúc
```
backend/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/se100/courseapp/
    │   │   ├── CourseAppApplication.java
    │   │   ├── config/        # CORS, CurrentUserProvider
    │   │   ├── controller/    # CourseController, LessonController
    │   │   ├── dto/           # Request/Response khớp FE
    │   │   ├── entity/        # JPA entities (9 bảng)
    │   │   ├── exception/     # Xử lý lỗi chung
    │   │   ├── repository/    # Spring Data JPA
    │   │   └── service/       # LearningService (nghiệp vụ)
    │   └── resources/
    │       ├── application.yml            # H2 mem, MODE=PostgreSQL
    │       ├── application-postgres.yml   # profile Postgres thật
    │       └── db/
    │           ├── schema.sql   # tạo bảng (tự chạy khi start)
    │           └── data.sql     # dữ liệu mẫu (tự chạy khi start)
    └── test/java/com/se100/courseapp/LearningFlowTests.java
```

## Chạy
```bash
cd backend
mvn spring-boot:run          # hoặc chạy CourseAppApplication trong IntelliJ
mvn test                     # chạy test luồng học tập
```
- API: http://localhost:8080/api
- H2 Console: http://localhost:8080/h2-console
  (JDBC URL `jdbc:h2:mem:course_app`, user `sa`, password để trống)

## API
| Method | URL | Mô tả |
|---|---|---|
| GET  | `/api/courses` | Danh sách khóa học |
| GET  | `/api/courses/{courseId}/lessons` | Lộ trình kèm tiến độ của user |
| POST | `/api/lessons/{lessonId}/watch-status` | Đánh dấu đã xem video |
| POST | `/api/lessons/{lessonId}/submit-quiz` | Nộp bài `{ "answers": { "1": 0, "2": 1 } }` |
| POST | `/api/courses/{courseId}/reset-progress` | Reset tiến độ khóa học |

Chưa có đăng nhập: gửi header `X-User-Id` để chọn user; nếu không gửi thì dùng user demo có id 2 (`app.demo-user-id`).

## Kết nối FE
Trong `fe/src/features/learning/services/learningApi.js`, đổi `USE_MOCK = false`.
Sau đó xóa localStorage (key `learning_app_*`) để FE không dùng tiến độ cũ đã lưu.
