# Yêu cầu — [tên hệ thống]

*Gói 2. Kiểm gói đếm: ≥ 3 tác nhân, ≥ 6 FR, ≥ 3 NFR, ≥ 1 BR, và **mỗi dòng NFR phải có ít nhất một con số kèm đơn vị**. Nhớ giữ đúng tiền tố `FR-`, `NFR-`, `BR-` ở cột đầu, kiểm gói đếm theo đó.*

## Tác nhân

| Tác nhân | Là ai | Muốn gì từ hệ thống |
|---|---|---|
| | | |
| | | |
| | | |

## Yêu cầu chức năng

Viết dạng: *Là [tác nhân], tôi muốn [làm gì] để [đạt gì]*. Đánh số để sau này còn truy vết. Cột **Ai làm** ghi gọn phần việc của người và phần việc của phần mềm, ví dụ *Người: chọn khung giờ · Phần mềm: chặn trùng giờ*.

| # | Tác nhân | Muốn | Để | Ai làm |
|---|---|---|---|---|
| FR-01 | | | | |
| FR-02 | | | | |

## Yêu cầu phi chức năng

**Mỗi dòng phải có con số.** Viết "nhanh", "ổn định", "an toàn" thì kiểm gói báo chưa đạt.

Mỗi dòng đủ bốn phần: *[Chỉ số] phải [ngưỡng] khi [điều kiện đo], đo bằng [cách nào]*. Ít nhất một dòng không nói về tốc độ. Ví dụ:
- Thời gian phản hồi trang đặt chỗ ≤ 500 ms tại phân vị 95, khi 50 người dùng đồng thời, đo bằng k6 trên bản deploy.
- Hệ thống chịu được 200 yêu cầu/giây trong 10 phút giờ cao điểm, đo bằng k6.
- Dữ liệu đặt chỗ không mất khi máy chủ khởi động lại (bền vững 100%), kiểm bằng cách khởi động lại máy chủ giữa lúc đặt rồi đếm lại bản ghi.

| # | Chỉ số | Ngưỡng | Điều kiện đo | Cách đo | Ảnh hưởng tới thiết kế nào |
|---|---|---|---|---|---|
| NFR-01 | | | | | |
| NFR-02 | | | | | |
| NFR-03 | | | | | |

## Ràng buộc nghiệp vụ — điều KHÔNG được phép xảy ra

| # | Ràng buộc | Ai chịu trách nhiệm bảo vệ (lớp nào, điền ở Gói 4) |
|---|---|---|
| BR-01 | | |
| BR-02 | | |

## Câu hỏi còn mở cho khách hàng

- 
