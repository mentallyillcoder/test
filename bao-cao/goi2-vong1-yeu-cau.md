# Báo cáo Gói 2: Vòng 1 và yêu cầu

**Nhóm N12** · Đề tài tự đề xuất: Nền tảng E-learning tích hợp Flashcard(EduRecall)· Gói 2 · Nhóm đang review: N11

| Thành viên | Vai                           |
| ---------- | ----------------------------- |
| N12-A      | Phụ trách yêu cầu             |
| N12-B      | Phụ trách mô hình và thiết kế |
| N12-C      | Phụ trách chất lượng và CI    |
| N12-A      | Điều phối Gói 2               |

## 1. Đã làm gì

- **Luồng lõi chạy trên URL** (`Bản chạy:` https://edurecall.hagiabao0506.workers.dev): chọn khóa → xem video → làm quiz → máy chủ chấm → đạt thì mở bài kế. Frontend React/Vite trên Cloudflare (commit 87d700f, deploy ở PR #5), backend Spring Boot trên Railway (commit 8718b46, PR #5). Kho mẫu vào qua PR #1, mã nguồn gom về `src/app/` ở PR #3. Ghi luồng lõi và cách lưu dữ liệu ở `docs/luong-loi.md`.
- **Yêu cầu:** `docs/yeu-cau.md` có 6 tác nhân, 20 FR có cột Ai làm, 9 NFR, 12 BR, ba mâu thuẫn MT-01…03 kèm cách gỡ. `docs/phong-van.md` ghi buổi phỏng vấn một người học, nối từng câu với dòng yêu cầu. `docs/cau-hoi-khach-hang.md` có 3 câu (e2d06a9). Đo trùng lặp lần 1 ở `docs/trung-lap.md` (d594580): FE 0%, BE 8,78%.
- **Chưa xong và lý do:**
  - Tiến độ lưu trong H2 in-memory nên mất khi máy chủ khởi động lại.
  - Chưa có đăng nhập, mọi người dùng chung user demo id 2.
  - Quiz mới có dạng trắc nghiệm.
  - Video chỉ là cờ đã xem.

  Cả bốn là phần vòng 1 làm nhanh. Bảng yêu cầu mới (FR-04, FR-05, BR-01, NFR-08) đã ghi lại để làm ở vòng 2.

## 2. Ba quyết định thiết kế lớn nhất

Chốt khi viết bảng yêu cầu, áp dụng cho vòng 2; ADR viết ở Gói 5.

1. Keycloak làm máy chủ xác thực, Spring Boot chỉ là Resource Server, thay user demo dùng chung của vòng 1 (`docs/yeu-cau.md` tác nhân Keycloak, FR-18, BR-10).
2. Supabase: PostgreSQL thay H2 in-memory để tiến độ không mất, Storage phát video qua signed URL (`docs/yeu-cau.md` NFR-02, NFR-04, NFR-08).
3. Hoàn thành bài học qua bài kiểm tra chấm ở máy chủ, lưu từng câu trả lời để chỉ ra câu sai (`docs/yeu-cau.md` FR-05, BR-01, BR-12; `QuizAttemptAnswer.java`).

## 3. Thẩm định

- **Lần 1, PR #7, `log-tac-tu/PR-7.md`.** Agent soạn bảng tác nhân và FR trong `docs/yeu-cau.md`. N12-A đối chiếu bảng tác nhân với ý tưởng đề tài và quy tắc của TH3 ("hai tác nhân muốn giống nhau thì là một"). Kết luận **sai**: agent tự thêm tác nhân "Khách chưa đăng nhập" dùng chatbot, trong khi nhóm chỉ cho dùng chatbot sau khi đăng nhập, và Khách với Học viên cùng muốn một thứ là tìm khóa học. Đã sửa: bỏ tác nhân Khách, chuyển FR-01, FR-02 và BR-02 về Học viên.
- **Lần 2, PR #7, `log-tac-tu/PR-7.md`.** Agent nháp mục 2 của báo cáo này. N12-A đọc bản nháp và đối chiếu với yêu cầu ô 2 trong Mục 4.1 của hướng dẫn ("ba quyết định lớn nhất của gói") và với kiến trúc nhóm đã chốt cho vòng 2. Kết luận **sai**: agent chỉ mô tả lại những gì mã demo vòng 1 đang làm (localStorage làm bộ đệm, chặn bài khóa bằng 403, đổi ngưỡng qua bài), không phải quyết định thiết kế của nhóm, và bỏ sót Keycloak cùng Supabase dù cả hai đã có trong `docs/yeu-cau.md`. Đã sửa: viết lại mục 2 thành ba quyết định Keycloak làm máy chủ xác thực, Supabase cho dữ liệu và video, và chấm bài ở máy chủ có lưu từng câu trả lời; sửa mục 5 cho khớp.

## 4. Retro ba dòng

- **Làm tốt:** luồng lõi chạy hết từ đầu đến cuối trên URL công khai; luật khóa bài nằm ở backend và có test luồng (`LearningFlowTests.java`, 2 ca).
- **Chưa tốt:** không thống nhất luật và hợp đồng API trước khi chia việc, nên cùng một luật có ba phiên bản. Chưa PR nào kèm log agent. README trên `main` còn sót dấu xung đột merge, đã sửa ở PR #7.
- **Sẽ đổi:** từ Gói 3, mọi PR dùng agent phải giao việc bằng khuôn sáu dòng và kèm `log-tac-tu/PR-<số>.md` (N12-C theo dõi). Luật được chốt trong đặc tả trước rồi mới giao agent viết mã (N12-A theo dõi).

## 5. Hồi cứu vòng 1

**Hiểu sai 1: điều kiện qua bài có ba phiên bản.**

- README (597c801) và `diagrams/class.mmd` (5ec8798: `BaiHoc *-- BoFlashcard`, `diemToiThieu` 80%) nói qua bài bằng bộ Flashcard 80%.
- Backend (8718b46) lại làm quiz trắc nghiệm với `pass_threshold DEFAULT 75` (`db/schema.sql`).
- Không ai thấy lệch vì người vẽ sơ đồ và người giao agent viết backend không đối chiếu với nhau.
- **Phát hiện** ở tuần 5–6, khi viết `docs/yeu-cau.md` phải ghi đúng một ngưỡng vào BR-01 thì thấy ba nơi ba con số (ghi ở MT-03).
- **Vòng 2:** luật chỉ ghi một chỗ (BR-01); ngưỡng là thuộc tính của bài kiểm tra do giáo viên đặt; `class.mmd` thay `BoFlashcard` trong `BaiHoc` bằng lớp bài kiểm tra ở Gói 4; sơ đồ vẽ trước rồi mới giao agent viết mã.

**Hiểu sai 2: "dữ liệu còn sau khi tải lại trang" bị hiểu là chỉ cần tải lại trình duyệt.**

- `docs/luong_loi.md` (8723b77) ghi chọn `localStorage`, nhưng khi ghép thì tiến độ chuyển về backend dùng H2 in-memory (`application.yml`). Mỗi lần Railway khởi động lại hay deploy lại, toàn bộ tiến độ mất.
- `CurrentUserProvider` cho mọi người dùng chung user demo id 2.
- **Phát hiện** nhờ câu 5 và câu 9 của buổi phỏng vấn ("không được làm mất kết quả học tập") và lúc viết NFR-08.
- **Vòng 2:** chuyển sang PostgreSQL trên Supabase, ghi ADR chọn cơ sở dữ liệu ở Gói 5, thêm đăng nhập qua Keycloak để tiến độ gắn với từng người (quyết định 1 và 2 ở mục 2).

**Hiểu sai 3: luật "phải xem video" chỉ nằm ở giao diện.**

- `POST /api/lessons/{id}/watch-status` nhận cờ đã xem mà không kiểm gì (`LessonProgress.markVideoWatched()`), nên gọi thẳng API là bỏ qua được video.
- **Phát hiện** khi đối chiếu BR-01 mới với `LearningService` lúc soạn báo cáo này.
- **Vòng 2:** backend nhận vị trí đã xem và kiểm ≥ 90% trong lớp miền; viết test trong `tests/luat/` gọi thẳng API để chứng minh luật vẫn giữ.

Ngoài ra, khi ghép FE và BE ở TH2, hai bên lệch nhau về kết quả nộp quiz, cách báo lỗi và nguồn dữ liệu tiến độ (`docs/hoi-cuu-tuan3.md`). Cùng một nguyên nhân với hiểu sai 1: không có hợp đồng viết ra trước khi chia việc.
