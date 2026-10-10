# AGENTS.md — quy tắc và ràng buộc kiến trúc cho agent

> Hầu hết agent lập trình đọc tự động tệp này trước khi làm việc trong kho. Trong đây ghi những gì agent **phải** tuân theo và **không được** làm. Phần "Kiến trúc" viết ở Gói 5, sau khi đã có kiến trúc. Trước đó cứ để nguyên "Quy tắc làm việc", "Khi nhận việc" và "Quy ước chung".
>
> Muốn thử xem nó có tác dụng không thì giao cho agent một việc đụng tới ranh giới module. Agent xuyên qua ranh giới nghĩa là ràng buộc viết chưa đủ rõ, sửa tệp này trước rồi hãy sửa mã.

## Quy tắc làm việc (giữ nguyên)

1. Agent không merge và không đẩy thẳng lên nhánh chính. Mọi thay đổi vào nhánh chính đi qua PR, do người merge sau khi một thành viên khác người điều khiển đã review.
2. Mỗi PR ghi ba thông tin ở dòng đầu: `Agent: <công cụ> · Điều khiển: N07-B · Review: N07-A`, dòng sau ghi đúng một `Đóng #<số hạng mục>`. PR tài liệu (chỉ sửa `bao-cao/`, `docs/`, `diagrams/`, `adr/`, `phieu-thay-doi/`, `log-tac-tu/phieu-dot<k>.md` hoặc `.md` ở gốc) không cần `Đóng #`.
3. Agent chỉ làm trên nhánh riêng, không giữ khoá triển khai, không ghi vào cơ sở dữ liệu thật.
4. PR do agent tạo kèm `log-tac-tu/PR-<số>.md` theo khuôn trong `log-tac-tu/README.md`: yêu cầu ban đầu, số vòng, kết quả chạy test cuối, tóm tắt diff, người điều khiển, thời điểm. PR đưa phiếu thay đổi vào kho kèm log phiên `log-tac-tu/phieu-dot<k>.md`.
5. Gọi thành viên bằng mã `N07-A`, `N07-B`… Không ghi họ tên, MSSV, email vào tệp, commit hay log.
6. Agent không viết phụ lục phản tỉnh cá nhân trong `bao-cao/goi6-tong-ket.md`.
7. Test trong `tests/luat/` do người viết và là đặc tả. Agent không sửa, không xoá, không đổi tên, không đánh dấu bỏ qua test nào trong đó, không nới assert, không viết mã xử lý riêng đúng đầu vào của test.
8. Test mâu thuẫn với đặc tả, với test khác, hoặc không qua được nếu không sửa test: dừng lại, báo người điều khiển test nào, mâu thuẫn chỗ nào. Không tự chọn cách hiểu.

## Khi nhận việc (giữ nguyên)

Người điều khiển giao việc theo sáu dòng:

```
Bối cảnh: <đồ án, nhánh, tệp cần đọc>
Việc: <làm gì, xong thì có gì>
Ràng buộc: <tệp được sửa, quy ước phải theo>
Không được: <những gì không đụng tới>
Nhóm sẽ kiểm bằng: <test, đối chiếu sơ đồ, chạy thử, đọc diff>
Hỏi lại nếu: <chỗ chưa rõ thì dừng và hỏi>
```

- Việc gắn với một hạng mục trên Issues: đọc tiêu chí chấp nhận Given–When–Then của hạng mục đó; mã xong phải thoả từng khối.
- Thiếu dòng nào, hoặc việc cần một luật chưa có trong `docs/yeu-cau.md`, đặc tả, `diagrams/` hay `tests/luat/`: hỏi lại người điều khiển trước khi làm. Không tự chọn cách hiểu.
- Không tự thêm luật, giới hạn, con số hay trạng thái mà tài liệu của nhóm chưa có. Thấy cần thì nêu trong phần trả lời, không đưa vào mã.
- Xong việc thì báo: đã sửa tệp nào; đã chạy gì và kết quả nguyên văn; nhóm kiểm theo dòng "Nhóm sẽ kiểm bằng" ở đâu, ví dụ chạy thử ca nào, đối chiếu lớp nào; chỗ nào còn chưa chắc.

## Quy ước chung (giữ nguyên)

- Sơ đồ viết bằng Mermaid trong `diagrams/`, không dùng ảnh.
- Mỗi quyết định kiến trúc một tệp trong `adr/`, theo mẫu `adr/0000-mau.md`; xử lý phiếu thay đổi theo `adr/0000-mau-xu-ly-phieu.md`.
- Không commit khoá API, mật khẩu, tệp `.env`.
- Không sửa `.github/`, `scripts/`, `THANH-VIEN.md` và phiếu đã sinh trong `phieu-thay-doi/`.
- Commit message tiếng Việt hoặc Anh, một dòng, nói **vì sao** chứ không phải cái gì.

## Kiến trúc (viết ở Gói 5)

### Phân tầng
<!-- Ví dụ, thay bằng của nhóm:
- `src/domain/`: thực thể, giá trị, luật nghiệp vụ. KHÔNG import gì từ tầng khác.
- `src/app/`: use case, điều phối. Import domain. KHÔNG biết về HTTP hay CSDL.
- `src/infra/`: CSDL, gọi API ngoài, gửi thông báo. Hiện thực interface do domain/app định nghĩa.
- `src/ui/`: giao diện. Chỉ gọi app.
-->

### Bất biến nghiệp vụ — KHÔNG được vi phạm
<!-- Ví dụ:
- Một phòng không có hai lượt đặt trùng giờ. Kiểm tại `domain/DatCho.kiemTraTrung()`, không kiểm ở UI.
- Điểm thưởng không âm. Enforce trong constructor của `Diem`.
-->

### Ranh giới — agent KHÔNG được
<!-- Ví dụ:
- Không gọi CSDL trực tiếp từ `src/ui/` hay `src/domain/`.
- Không gọi `sendEmail`/`sendPush` từ bất kỳ đâu ngoài `infra/thong-bao/`.
- Không thêm thư viện mới mà không ghi ADR.
-->

### Khi thêm tính năng mới
<!-- Ví dụ:
1. Thêm use case vào `diagrams/use-case.mmd` trước.
2. Thêm lớp vào `diagrams/class.mmd`.
3. Rồi mới viết mã. Sơ đồ là nguồn sự thật.
-->

## Kiểm thử

- Test cho luật nghiệp vụ nằm trong `tests/luat/`, đặt tên theo mã luật (`test_BR03_quay_da_nhan_thi_khong_huy_duoc`), chạy không cần cơ sở dữ liệu.
- Test agent viết thêm đặt ngoài `tests/luat/`, ví dụ `tests/khac/`.
- Xong việc thì chạy toàn bộ test và dán kết quả cuối vào log.
<!-- Ghi lệnh chạy test của nhóm, ví dụ:
- Chạy: `python -m pytest tests -v` / `node --test` / `npm test`
-->
