# Luồng lõi

1. Học viên chọn một khóa học trên web và mở bài học đang được mở khóa.
2. Học viên xem video, làm bài kiểm tra trắc nghiệm; máy chủ chấm điểm, đạt ngưỡng thì đánh dấu bài hoàn thành và mở khóa bài tiếp theo.
3. Cách lưu dữ liệu: vòng 1 ban đầu chọn `localStorage`. Khi ghép với backend (PR #5), tiến độ chuyển về backend Spring Boot lưu trong H2 in-memory, còn `localStorage` chỉ còn làm bộ đệm phía trình duyệt. Tải lại trang không mất dữ liệu, nhưng khởi động lại máy chủ thì mất. Vòng 2 sẽ chuyển sang PostgreSQL (xem mục Hồi cứu trong `bao-cao/goi2-vong1-yeu-cau.md`).
