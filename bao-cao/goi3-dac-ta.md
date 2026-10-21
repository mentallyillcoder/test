# Báo cáo Gói 3: Use case và đặc tả

**Nhóm N12** · Đề tài tự đề xuất: Nền tảng E-learning tích hợp Flashcard (EduRecall) · Gói 3 · Nhóm đang review: N11

| Thành viên | Vai                           | Phần Gói 3                                                                         |
| ---------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| N12-A      | Phụ trách yêu cầu             | `diagrams/use-case.mmd`, `docs/dac-ta-UC-02.md`, `diagrams/seq-duyet-khoa-hoc.mmd` |
| N12-B      | Phụ trách mô hình và thiết kế | `docs/dac-ta-UC-01.md`, `diagrams/seq-hoc-va-kiem-tra.mmd`                         |
| N12-C      | Phụ trách chất lượng và CI    | `docs/dac-ta-UC-03.md`, `diagrams/seq-duyet-ho-so-giao-vien.mmd`                   |
| N12-A      | Điều phối Gói 3               |                                                                                    |

## 1. Đã làm gì

- Sơ đồ use case `diagrams/use-case.mmd` có 15 use case, 3 tác nhân người dùng và 3 hệ thống ngoài. Không có use case "Đăng nhập" hay "Quản lý…".
- Ba đặc tả đủ luồng chính, luồng thay thế và luồng lỗi: UC-01 Học bài và làm bài kiểm tra, UC-02 Duyệt khóa học, UC-03 Duyệt hồ sơ giáo viên.
- Ba sơ đồ tuần tự, mỗi sơ đồ ứng với một đặc tả UC-01, UC-02, UC-03. Tên lớp đặt bằng tiếng Anh, lấy từ danh từ trong đặc tả (đăng ký, tiến độ bài học, lượt làm bài, bản khóa học, hồ sơ giáo viên); hệ thống ngoài vẽ dạng tác nhân.
- Bổ sung yêu cầu hồ sơ giáo viên vào `docs/yeu-cau.md`: FR-21, FR-22, BR-13. Giữ nguyên số FR, BR đã nộp ở Gói 2.
- Hạng mục #15–#18 gắn milestone Gói 3; PR #19.
- **Chưa xong:** không có

## 2. Ba quyết định thiết kế lớn nhất

1. Mỗi use case một tác nhân chính: tách "Gửi khóa học đi duyệt" (UC-11, Giáo viên) khỏi "Duyệt khóa học" (UC-02, Quản trị viên), và "Nộp hồ sơ giáo viên" (UC-09) khỏi "Duyệt hồ sơ giáo viên" (UC-03) (`diagrams/use-case.mmd`).
2. Duyệt bản sửa của khóa đã phát hành không đụng bản học viên đang học; tiến độ chỉ được chuyển sang bản mới ở bước duyệt (`docs/dac-ta-UC-02.md` bước 4, `diagrams/seq-duyet-khoa-hoc.mmd`, BR-05, BR-11).
3. Hồ sơ giáo viên chỉ chuyển Approved sau khi Keycloak đã gán vai trò; Keycloak lỗi thì hồ sơ giữ Pending (`docs/dac-ta-UC-03.md` luồng 4e, BR-13).

## 3. Thẩm định

- **Lần 1, PR #19, `log-tac-tu/PR-19.md` mục Thẩm định 1.** N12-A đối chiếu ba đặc tả do agent soạn với khuôn `docs/dac-ta-mau.md`. Kết luận **sai**: agent tự thêm dòng "Lớp tham gia" không có trong mẫu, ghi tên lớp vào điều kiện và mã BR vào dòng Truy vết. Đã sửa: làm lại ba đặc tả đúng mẫu; luồng "nộp lại lượt đã chấm" của UC-01 chuyển từ luồng lỗi 4f sang luồng thay thế 4a.
- **Lần 2, cùng PR, mục Thẩm định 3.** N12-A đối chiếu sơ đồ tuần tự với tiến độ môn học. Kết luận **sai**: agent dựng sơ đồ từ ERD nháp làm trước tiến độ, đưa chi tiết lưu trữ và lớp kỹ thuật (`EmailNotifier`, `KeycloakAdminClient`) vào Gói 3 khi mới có đặc tả. Đã sửa: làm lại ba sơ đồ chỉ dùng danh từ và hành động trong đặc tả, hệ thống ngoài vẽ dạng tác nhân. Cũng ở lần đối chiếu với Mục 3.4 của hướng dẫn, phát hiện agent bỏ sót sơ đồ cho UC-03 nên đã thêm `seq-duyet-ho-so-giao-vien.mmd` (mục Thẩm định 2).

## 4. Retro ba dòng

- **Làm tốt:** chốt use case, người phụ trách và tên lớp trước khi viết, nên mỗi use case có đủ đặc tả và sơ đồ tuần tự của cùng một người; cả ba đặc tả và ba sơ đồ qua kiểm gói ngay lần đầu chạy.
- **Chưa tốt:** dựng sơ đồ tuần tự từ ERD nháp trước khi có mô hình miền, phải làm lại cả ba sơ đồ; `yeu-cau.md` được sửa trên bản cũ chưa pull từ `main` nên trùng số FR-20, BR-11 với bản đã nộp ở Gói 2.
- **Sẽ đổi:** ở Gói 4 vẽ `class.mmd` và `state.mmd` từ danh từ trong đặc tả trước, ERD chỉ dùng để đối chiếu và đưa vào Gói 5 (N12-B theo dõi); luôn `git pull` từ `main` trước khi sửa tài liệu chung (N12-A theo dõi).
