# Log agent

Thư mục chứa hai loại log.

**Log PR agent.** Mỗi PR có dòng `Agent:` khác `không` phải thêm tệp `log-tac-tu/PR-<số PR>.md` ngay trong PR đó; thiếu thì `kiem-pr` báo chưa đạt và không merge được. Số PR có sau khi mở PR: mở PR trước, rồi đẩy thêm commit chứa log. PR tài liệu (chỉ sửa `bao-cao/`, `docs/`, `diagrams/`, `adr/`, `phieu-thay-doi/`, `log-tac-tu/phieu-dot<k>.md` hoặc tệp `.md` ở gốc kho) có dùng agent cũng phải kèm log.

**Log phiên tạo phiếu thay đổi.** Mỗi đợt một tệp `log-tac-tu/phieu-dot<k>.md` (k = 1, 2, 3), lưu toàn bộ phiên chạy agent mô phỏng thay đổi. PR tài liệu đưa phiếu và log này vào kho ghi `Agent: <công cụ>`; log phiên trong PR đó được chấp nhận, không cần thêm `PR-<số>.md`. Nộp cùng gói: đợt 1 với Gói 4, đợt 2 với Gói 5, đợt 3 với Gói 6.

## Khuôn log PR agent

Chép khuôn dưới đây vào `log-tac-tu/PR-<số>.md` và điền đủ các mục. Có thể dán thêm bản ghi phiên của công cụ ở cuối tệp.

```markdown
# Log PR #<số> · Hạng mục #<số>

- Người điều khiển: N07-B
- Thời điểm: <bắt đầu> → <kết thúc>
- Công cụ agent: 
- Số vòng: <số lần giao việc lại cho agent>

## Yêu cầu ban đầu

<câu lệnh hoặc đặc tả giao cho agent, chép nguyên văn>

## Kết quả chạy test cuối

<lệnh chạy test và kết quả: số ca đạt, số ca hỏng>

## Tóm tắt diff

<các tệp thay đổi, số dòng thêm và xoá, thay đổi chính>

## Thẩm định

<nhóm kiểm kết quả này bằng gì (test, đối chiếu sơ đồ, đọc diff, chạy thử), kết luận đúng hay sai; nếu sai thì sai chỗ nào và đã sửa ở commit nào>
```

Log ghi bằng mã thành viên. Không dán khoá, mật khẩu, họ tên, MSSV hay email vào log.
