# Bộ agent SE100 — Hướng dẫn sử dụng

SE100 – Phương pháp phát triển phần mềm hướng đối tượng · Năm học 2026–2027

> *Mỗi nhóm phân tích, thiết kế và xây một hệ thống phần mềm nhỏ, trong đó phần lớn mã do agent AI viết; nhóm chịu trách nhiệm về yêu cầu, mô hình, quyết định thiết kế và giải thích được mọi thứ đã nộp. Trong cùng học kỳ, nhóm còn review chéo kho của một nhóm khác.*

Bộ gồm bốn agent viết dưới dạng tệp chỉ dẫn Markdown. Nhóm dùng các tệp này với công cụ agent sẵn có, không phải tự xây agent. Mỗi kho nhóm có sẵn bản sao của bộ trong thư mục `.se100/`.

## Bốn agent

| # | Tệp | Dùng để | Bắt buộc |
|---|---|---|---|
| 1 | `01_mo_phong_thay_doi.md` (kèm `01a_danh_muc_phieu.md`) | Sinh phiếu thay đổi may đo theo kho của nhóm, từ mã nhóm và mã đợt | **Có**, mỗi đợt một lần |
| 2 | `02_tu_kiem_goi.md` | Đọc báo cáo, tệp của gói và hạng mục so với yêu cầu và phiếu chấm, chỉ chỗ thiếu trước khi gắn thẻ; không chấm điểm. Phần thủ tục do `kiem-goi` và `kiem-pr` làm | Không |
| 3 | `03_luyen_van_dap.md` | Luyện trả lời câu hỏi về chính phần việc của mình trước buổi báo cáo cuối kỳ | Không |
| 4 | `04_gia_su.md` | Năm câu áp dụng sau mỗi buổi học; đóng vai khách hàng chị Hạnh; hỏi lại ví dụ biên của một luật, không viết test hộ; soát bản giao việc sáu dòng, không làm việc hộ | Không |

**Mã đợt** do giảng viên công bố đầu tuần 7 (đợt 1), đầu tuần 9 (đợt 2) và đầu tuần 11 (đợt 3); năm nay thứ Hai 19/10, 02/11, 16/11. Trong tuần đó nhóm chạy agent 1. Phiếu đợt 1 nộp cùng Gói 4, đợt 2 cùng Gói 5, đợt 3 cùng Gói 6, mỗi lần kèm log phiên và một ADR xử lý phiếu.

**Nộp bài.** Kết quả của agent 1 được đưa vào kho: phiếu tại `phieu-thay-doi/dot<k>_N<xx>_TD-xx.md`, log phiên tại `log-tac-tu/phieu-dot<k>.md`, phần xử lý trong `adr/NNNN-xu-ly-TD-xx.md`, hạng mục nhãn `phieu-thay-doi` trên tab Issues, PR hiện thực có `Đóng #`. Nhóm nộp gói bằng cách gắn và đẩy thẻ (`goi-2`…`goi-6`, `review-cheo`). Cấu trúc kho, quy trình một PR và cách chạy kiểm gói xem `README.md` ở gốc kho.

## Dữ liệu agent cần đọc

- **Tệp trong kho**: `README.md`, `docs/`, `diagrams/`, `adr/`, `src/`, `bao-cao/`, `phieu-thay-doi/`, `log-tac-tu/`, `AGENTS.md`, tệp khai báo phụ thuộc.
- **Hạng mục và PR** (bảng công việc là tab Issues của kho): agent dòng lệnh đọc bằng `gh` nếu đã đăng nhập, ví dụ `gh issue list --state all --limit 300` và `gh pr list --state all --limit 300`.
- **Kết quả kiểm gói**: tab **Actions** → **kiem-goi** → chọn lần chạy → **Summary**. Chép phần Summary vào `.se100/dau-vao/ket-qua-kiem-goi.md` nếu agent cần.

## Cách chạy

### (a) Agent dòng lệnh trong kho

1. Tạo một nhánh riêng cho phiên, ví dụ `se100/phieu-dot1`.
2. Tệp chưa nằm trong kho (bản xuất, kết quả kiểm gói đã chép) đặt vào `.se100/dau-vao/` và nói cho agent biết. Thư mục này không commit.
3. Mở agent tại gốc kho và ra lệnh, ví dụ:
   `Đọc .se100/01_mo_phong_thay_doi.md và làm theo. Mã nhóm N07, đợt 1, mã đợt <mã đợt>, người chạy N07-C.`
4. Đọc lại tệp agent ghi ra, rồi đưa vào nhánh chính bằng PR theo mẫu PR của kho và ba quy tắc dưới đây; PR phải qua `kiem-pr`. PR chỉ chứa phiếu và log phiên là PR tài liệu: chỉ cần dòng ba thông tin, không cần `Đóng #`. Kết quả phải có trên nhánh chính trước khi gắn thẻ gói thì mới được nộp.

Agent 2, 3, 4 chỉ đọc. Nhóm sửa tệp theo gợi ý thì sửa qua PR như mọi thay đổi khác.

### (b) Trợ lý hội thoại bậc miễn phí

1. Mở một cuộc hội thoại mới bằng tài khoản của một thành viên trong nhóm.
2. Tải lên tệp chỉ dẫn của agent cần dùng (agent 1 thì tải cả `01a_danh_muc_phieu.md`) và các tệp, bản xuất mà tệp chỉ dẫn yêu cầu.
3. Gõ: `Làm theo tệp chỉ dẫn đã tải lên.` kèm các thông tin đầu vào mà tệp yêu cầu.
4. Chép kết quả vào tệp tương ứng trong kho (phiếu vào `phieu-thay-doi/`, log vào `log-tac-tu/`) rồi đưa vào nhánh chính qua PR.

Bản xuất gọn cho chế độ (b), chạy tại gốc kho. Các lệnh không xuất tên tác giả hay tài khoản GitHub:

```
git log --date=iso --pretty=format:'%h|%ad|%s' --stat > xuat-git-log.txt
git ls-files > xuat-danh-sach-tep.txt
gh issue list --state all --limit 300 --json number,title,body,labels,milestone,state,createdAt,closedAt > xuat-hang-muc.json
gh pr list --state all --limit 300 --json number,title,body,state,mergedAt > xuat-pr.json
```

Kèm theo: `README.md`, `docs/`, `diagrams/`, `adr/`, tệp khai báo phụ thuộc, tệp biến môi trường mẫu nếu có, các tệp mô hình, route và dịch vụ trong `src/`. Công cụ giới hạn số tệp tải lên thì nén các thư mục thành một tệp nếu công cụ đọc được tệp nén.

Công cụ agent dùng được ở bậc miễn phí: xem tờ `cong-cu-mien-phi.md` của lớp.

## Quy tắc khi dùng

- **Không đưa dữ liệu ra ngoài tài khoản của nhóm.** Không dán dữ liệu đồ án vào cuộc hội thoại dùng chung với người ngoài nhóm, không bật liên kết chia sẻ công khai.
- **Giữ bút danh.** Mọi tệp đưa vào agent gọi thành viên bằng mã `N07-A`, `N07-B`… theo thứ tự gửi biểu mẫu Gói 1; không họ tên, không MSSV, không email, không tên tài khoản GitHub. Không đưa `THANH-VIEN.md` vào agent. Không cần đổi cấu hình git; chỉ cần dùng lệnh xuất ở trên. Kho của nhóm sẽ được agent đọc, và theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, môn học hạn chế tối đa dữ liệu cá nhân đưa vào công cụ.
- **Lưu log phiên.** Với agent 1, log là bắt buộc, lưu tại `log-tac-tu/phieu-dot<k>.md` và nộp cùng phiếu. Phiên agent nào dẫn tới một PR khác thì lưu log tại `log-tac-tu/PR-<số PR>.md`.
- **Không làm nhẹ phiếu thay đổi.** Mã phiếu xác định theo ma trận vị trí; tham số cố định. Giảng viên chạy lại agent 1 với cùng mã để đối chiếu loại phiếu, tham số và các chi tiết tính từ mã của phiếu nộp.
- Ba quy tắc agent áp dụng cho mọi phiên, kể cả phiên dùng Bộ agent:
  1. **Agent không merge.** Mọi thay đổi vào nhánh chính do người merge, sau khi một thành viên khác người điều khiển phiên agent đó đã review.
  2. **Mỗi PR ghi ba thông tin**: `Agent: <công cụ> · Điều khiển: N07-B · Review: N07-A`. PR không dùng agent ghi `Agent: không`.
  3. **Agent chỉ làm trên nhánh riêng**, không giữ khoá triển khai, không ghi vào cơ sở dữ liệu thật.
- Phụ lục phản tỉnh cá nhân của Gói 6 do từng người tự viết, không dùng agent.

## Ví dụ

Kết quả agent 1 với mã đợt giả (chỉ minh hoạ cách tra, không phải mã đợt thật):

| Nhóm | Đợt | Mã đợt giả | K · S | Mã phiếu |
|---|---|---|---|---|
| N03 (cụm 1, vị trí 3) | 1 | `K7Q2` | `N03-K7Q2` · 483 | TD-03 |
| N10 (cụm 2, vị trí 5) | 2 | `K7Q2` | `N10-K7Q2` · 481 | TD-11 |
| N15 (cụm 3, vị trí 5) | 2 | `K7Q2` | `N15-K7Q2` · 486 | TD-10 |
| N12 (cụm 3, vị trí 2) | 3 | `M4R8` | `N12-M4R8` · 489 | TD-13 |

Mã phiếu chỉ phụ thuộc vị trí, cụm và đợt. Mã đợt quyết định các chi tiết chọn bằng băm (use case, lớp, luật nào bị chạm).
