# Log PR #7 · PR tài liệu Gói 2 (không có hạng mục)

- Người điều khiển: N12-A
- Thời điểm: 2026-10-14 → 2026-10-15
- Công cụ agent: Claude (Cowork)
- Số vòng: 9 (sửa vai Teacher/Admin; chốt dạng câu hỏi; soạn bảng yêu cầu; bỏ tác nhân Khách; chép sang khuôn `yeu-cau.md`; chuyển bản phỏng vấn; soạn báo cáo Gói 2; sửa phần đầu và cách xưng hô của bản phỏng vấn; viết lại mục 2 của báo cáo)

## Yêu cầu ban đầu

> giờ bạn có thể làm tài liệu SRS nhưng mà theo cái mẫu này (chủ yếu là A,B,C,D, còn lại là bạn đọc để xem rõ chỉ dẫn hoặc là ý thầy nói gì) của thầy giúp tôi. Hỏi lại nếu chưa rõ ý, đến khi nào hiểu rõ thì thôi, ngoài 3 actor chính ra chúng tôi dự định sẽ có thể 3 actor này, xem coi nó có phải actor không nha

Kèm tệp `TH3-thu-thap-yeu-cau.md` và bảng 4 dịch vụ ngoài (Supabase, email, LLM, Keycloak).

## Kết quả chạy test cuối

`python scripts/kiem_goi.py --goi 2 --ma-nhom N12`. Kết quả: mọi mục Kiểm M0, M1 và tệp `docs/phong-van.md` đạt, gồm 6 tác nhân, 20 FR, 9 NFR có số kèm đơn vị và 12 BR. Không có cảnh báo email hay MSSV.

## Tóm tắt diff

- `docs/yeu-cau.md`: điền toàn bộ khuôn: 6 tác nhân, FR-01…FR-20, NFR-01…NFR-09, BR-01…BR-12, mục mâu thuẫn MT-01…MT-03, câu hỏi còn mở.
- `docs/luong-loi.md`: đổi tên từ `luong_loi.md` theo đúng tên hướng dẫn yêu cầu, ghi đúng cách lưu dữ liệu hiện tại.
- `README.md`: xoá dấu xung đột merge ở dòng 1 và 144, viết lại 5 dòng mô tả theo bảng yêu cầu mới, thêm dòng `Bản chạy:`.

## Thẩm định

1. **Đối chiếu bảng tác nhân với ý tưởng đề tài (N12-A).** Kết luận sai: agent thêm tác nhân "Khách chưa đăng nhập" dùng chatbot, trong khi nhóm chỉ cho dùng chatbot sau khi đăng nhập, và Khách với Học viên cùng muốn tìm khóa học. Nhóm yêu cầu bỏ; agent bỏ tác nhân Khách, chuyển FR-01, FR-02, BR-02 về Học viên.
2. **Đọc bản nháp mục 2 của báo cáo (N12-A).** Đối chiếu với yêu cầu ô 2 trong Mục 4.1 của hướng dẫn và với kiến trúc nhóm đã chốt cho vòng 2. Kết luận sai: agent chỉ mô tả lại mã demo vòng 1 (localStorage làm bộ đệm, chặn bài khóa bằng 403, đổi ngưỡng qua bài), bỏ sót Keycloak và Supabase dù hai dịch vụ này đã có trong `docs/yeu-cau.md`. Nhóm yêu cầu viết lại thành ba quyết định: Keycloak làm máy chủ xác thực, Spring Boot chỉ là Resource Server; Supabase cho PostgreSQL và Storage có signed URL; hoàn thành bài học qua bài kiểm tra chấm ở máy chủ, lưu từng câu trả lời. Agent sửa mục 2 và sửa mục 5 cho khớp.
