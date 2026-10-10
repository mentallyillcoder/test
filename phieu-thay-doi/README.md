# Phiếu thay đổi

Tệp trong thư mục này do agent mô phỏng thay đổi sinh ra (`.se100/01_mo_phong_thay_doi.md`, kèm danh mục `.se100/01a_danh_muc_phieu.md`). Không sửa phiếu đã sinh.

- **Ba đợt.** Đầu tuần 7, 9, 11 (năm nay thứ Hai 19/10, 02/11, 16/11), giảng viên công bố mã đợt. Trong tuần đó nhóm chạy agent với mã nhóm và mã đợt. Phiếu nào do agent quyết, nhóm không chọn.
- **Lưu.** Phiếu ở `phieu-thay-doi/dot<k>_N<xx>_TD-xx.md`, ví dụ `phieu-thay-doi/dot1_N07_TD-04.md`; log phiên ở `log-tac-tu/phieu-dot<k>.md`. Hai tệp vào nhánh chính qua một PR tài liệu.
- **Xử lý.**
  1. Tạo một hạng mục trên Issues, thêm nhãn `phieu-thay-doi`, ô Truy vết ghi mã phiếu.
  2. Trước khi sửa mã, viết `adr/NNNN-xu-ly-TD-xx.md` theo khuôn `adr/0000-mau-xu-ly-phieu.md`: bảng tác động, ít nhất hai phương án, phương án chọn và người quyết, đánh đổi và sơ đồ phải cập nhật.
  3. Hiện thực bằng PR có `Đóng #` hạng mục đó; agent viết mã.
  4. Phần "Kết quả thực tế" của ADR điền ở gói sau (phiếu đợt 3 điền ngay trong Gói 6).
- **Nộp.** Đợt 1 cùng Gói 4, đợt 2 cùng Gói 5, đợt 3 cùng Gói 6: phiếu, log phiên, ADR. Cả ba phiếu phải làm thật trước Gói 6.
- Không chạy agent trong tuần có mã đợt thì phần phiếu của gói đó ở mức 0.
