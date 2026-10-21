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

## Cài đặt lần đầu (môi trường local)

### Yêu cầu

- Docker Desktop
- JDK 21
- IntelliJ IDEA (hoặc IDE khác hỗ trợ Maven)

### Các cổng sử dụng

| Dịch vụ    | Địa chỉ                 |
| ---------- | ----------------------- |
| Backend    | http://localhost:8080   |
| PostgreSQL | localhost:5432          |
| Adminer    | http://localhost:8888   |
| Keycloak   | http://localhost:9090   |

### Bước 1. Tạo file `.env`

Copy `.env.example` thành `.env` ở thư mục gốc project, rồi điền:

```
DB_PASSWORD=<tự đặt>
KEYCLOAK_ADMIN_PASSWORD=<tự đặt>
KEYCLOAK_BACKEND_SECRET=      # để trống, điền ở bước 3
```

File `.env` đã nằm trong `.gitignore`, **không commit file này**.

### Bước 2. Khởi động Docker

```bash
docker compose up -d
```

Keycloak tự import realm `edurecall` từ `keycloak/import/edurecall-realm.json`.

> Keycloak chỉ import khi realm **chưa tồn tại**. Nếu máy bạn đã có realm `edurecall` từ trước, hãy xóa realm đó trong trang quản trị rồi chạy `docker compose restart keycloak`.

### Bước 3. Lấy client secret cho backend

1. Mở http://localhost:9090, đăng nhập bằng `admin` / mật khẩu `KEYCLOAK_ADMIN_PASSWORD`.
2. Chọn realm **edurecall** (góc trên bên trái).
3. **Clients** → `edurecall-backend` → tab **Credentials** → bấm **Regenerate**.
4. Copy secret, dán vào `KEYCLOAK_BACKEND_SECRET` trong file `.env`.

Secret trong file export đã bị che nên bắt buộc phải tạo mới. Mỗi máy có secret riêng.

### Bước 4. Kiểm tra quyền của service account

Vẫn ở client `edurecall-backend`, mở tab **Service account roles**. Phải có đủ 3 quyền của `realm-management`:

- `manage-users`
- `view-users`
- `query-users`

Nếu thiếu: **Assign role** → chọn **Filter by clients** → tìm `realm-management` → tick đủ 3 quyền trên.

### Bước 5. Tạo tài khoản Admin của EduRecall

File export không chứa user, mỗi người tự tạo trên máy mình:

1. **Users** → **Add user**.
2. Email: `admin@edurecall.local` (không dùng email cá nhân), bật **Email verified**, điền First name / Last name.
3. Để trống ô **Required user actions**, bấm **Create**.
4. Tab **Credentials** → **Set password**, tắt **Temporary**.
5. Tab **Role mapping** → **Assign role** → chọn `ADMIN`.

### Bước 6. Chạy backend

Nếu máy đặt múi giờ Việt Nam, thêm VM option để tránh lỗi TimeZone của PostgreSQL:

**Run → Edit Configurations…** → chọn `EduRecallApplication` → **Modify options** → **Add VM options** → điền:

```
-Duser.timezone=Asia/Ho_Chi_Minh
```

Chạy ứng dụng. Log khởi động phải có:

```
Successfully applied 2 migrations to schema "public"
```

Kiểm tra trong Adminer (http://localhost:8888, System: PostgreSQL, Server: `db`, Username: `postgres`, Database: `edurecall`): có 18 bảng, bảng `flyway_schema_history` và 6 dòng trong `categories`.

## Xử lý sự cố thường gặp

### Xóa database local để chạy lại migration

Tắt backend trước, rồi chạy:

```bash
docker compose exec db psql -U postgres -c "DROP DATABASE edurecall WITH (FORCE);" -c "CREATE DATABASE edurecall;"
```

> **Không dùng `docker compose down -v`**: lệnh này xóa luôn dữ liệu Keycloak (realm, user, secret).

### Lỗi `invalid value for parameter "TimeZone": "Asia/Saigon"`

Chưa thêm VM option ở bước 6.

### Lỗi `Could not resolve placeholder 'KEYCLOAK_BACKEND_SECRET'`

File `.env` chưa có hoặc thiếu biến. Kiểm tra lại bước 1 và bước 3.

### Lỗi `Validate failed: Migrations have failed validation` (checksum)

File migration đã chạy trên máy bạn bị sửa. Xóa database local theo hướng dẫn ở trên rồi chạy lại backend.
