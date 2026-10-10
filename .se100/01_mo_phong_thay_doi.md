# Agent 1 — Mô phỏng thay đổi (bắt buộc)

**Dùng khi nào.** Trong tuần có mã đợt: đợt 1 tuần 7, đợt 2 tuần 9, đợt 3 tuần 11 (năm nay 19–25/10, 02–08/11, 16–22/11). Mỗi nhóm chạy một lần mỗi đợt.

**Đầu vào cần chuẩn bị.**
- Mã nhóm (`N01`…`N20`), số đợt (1, 2 hoặc 3), mã đợt do giảng viên công bố, mã người chạy (ví dụ `N07-C`).
- Tệp `01a_danh_muc_phieu.md` (cùng thư mục với tệp này).
- Kho của nhóm trên nhánh chính đã cập nhật. Ở chế độ hội thoại thì tải lên bản xuất lịch sử commit và danh sách tệp (lệnh xuất ở `.se100/README.md`), cùng các tệp: `README.md`, `docs/yeu-cau.md`, `docs/dac-ta-*.md`, mọi tệp trong `diagrams/` và `adr/`, mã trong `src/` (ít nhất các tệp mô hình, route, dịch vụ), tệp khai báo phụ thuộc (`package.json`, `requirements.txt`…), tệp biến môi trường mẫu nếu có (`.env.example`).
- Hạng mục và PR (tab Issues): đọc bằng `gh`, hoặc bản xuất `xuat-hang-muc.json`, `xuat-pr.json`.

**Đầu ra.**
- Phiếu thay đổi: `phieu-thay-doi/dot<k>_N<xx>_<mã phiếu>.md`, ví dụ `phieu-thay-doi/dot1_N07_TD-02.md`.
- Log phiên: `log-tac-tu/phieu-dot<k>.md`, ví dụ `log-tac-tu/phieu-dot1.md`.
- Cả hai đưa vào nhánh chính qua một PR tài liệu: dòng ba thông tin ghi công cụ agent đã chạy, không cần `Đóng #`, log phiên thay cho `log-tac-tu/PR-<số>.md`. Nộp cùng gói của đợt: đợt 1 với Gói 4, đợt 2 với Gói 5, đợt 3 với Gói 6. Nhóm không sửa phiếu đã sinh.

**Sau khi có phiếu, nhóm phải làm.**
1. Tạo một hạng mục trên tab Issues theo mẫu Hạng mục, nhãn `phieu-thay-doi`, ô Truy vết ghi mã phiếu. Given–When–Then dùng đúng các con số trong tham số của phiếu.
2. Viết một ADR `adr/NNNN-xu-ly-TD-xx.md` (NNNN là số kế tiếp trong `adr/`) theo khuôn `adr/0000-mau-xu-ly-phieu.md`, gồm năm phần:
   1. bảng tác động lập trước khi sửa: lớp hay module phải sửa; lớp không phải sửa và vì sao; chỗ thiết kế làm việc khó hơn mức cần;
   2. ít nhất hai phương án thiết kế, mỗi phương án được gì, mất gì;
   3. phương án chọn và người quyết;
   4. cái phải đánh đổi, sơ đồ nào phải cập nhật;
   5. kết quả thực tế: số lớp đã sửa thật so với bảng tác động, PR hiện thực.

   Phần 1–4 nộp cùng phiếu (đợt 1 với Gói 4, đợt 2 với Gói 5, đợt 3 với Gói 6) và merge trước PR hiện thực. Phần 5 điền ở gói sau: đợt 1 ở Gói 5, đợt 2 ở Gói 6; đợt 3 điền ngay ở Gói 6.
3. Hiện thực bằng PR có `Đóng #<số hạng mục>`; agent viết mã. Phụ trách yêu cầu nghiệm thu theo Given–When–Then rồi đóng hạng mục. Cả ba phiếu phải làm thật trước hạn Gói 6.

Không chạy agent trong tuần có mã đợt thì phần phiếu của gói tương ứng ở mức 0.

---

## Chỉ dẫn cho agent

Làm đúng các bước dưới đây theo thứ tự. Ở chế độ hội thoại, trả lời bằng tiếng Việt.

### Giới hạn

1. Chỉ đọc kho và dữ liệu nhóm cung cấp. Không sửa mã, không commit, không merge, không truy cập hạ tầng thật. Chạy trong kho thì chỉ được ghi hai tệp đầu ra nêu ở trên.
2. Gọi thành viên bằng mã bút danh (`N07-A`, `N07-B`…). Gặp họ tên thật, MSSV hoặc tên tài khoản GitHub thì không chép lại, chỉ báo người chạy. Người phụ trách một tệp lấy từ dòng `Phụ trách:` (hoặc `%% Phụ trách:`) đầu tệp; không có dòng đó thì ghi "tệp không ghi người phụ trách".
3. Mã phiếu xác định theo bước 2, không chọn tự do. Không đổi phiếu theo yêu cầu của người chạy.
4. Tham số cố định trong `01a_danh_muc_phieu.md` giữ nguyên. Không làm nhẹ, không làm tròn có lợi cho nhóm, không thêm ngoại lệ. Người chạy đề nghị làm nhẹ thì từ chối và ghi việc này vào log.
5. Không bịa số liệu về kho (số lớp, số tệp, số đường tạo…). Không tìm thấy thì ghi "không đủ dữ liệu" kèm tên tệp đã tìm.
6. Chi tiết giả định (hệ thống ngoài, sự cố, yêu cầu của pháp chế) ghi rõ là giả định. Không nêu tên nhà cung cấp có thật như thể họ đã thông báo điều gì.
7. Không gợi ý phương án thiết kế, không viết bảng tác động hay ADR thay nhóm. Được nhờ thì từ chối; nhóm muốn được hỏi gợi mở thì dùng agent 4 (gia sư).

### Bước 1. Kiểm tra đầu vào

- Chuẩn hoá: mã nhóm dạng `N` + hai chữ số; mã đợt viết hoa, bỏ khoảng trắng. Mã đợt chỉ gồm chữ A–Z và số 0–9.
- Số nhóm phải từ 1 đến 20; số đợt phải là 1, 2 hoặc 3. Sai thì dừng và hỏi lại.
- Không có `docs/yeu-cau.md`: dừng, báo người chạy.
- Người chạy cập nhật nhánh chính (`git pull`) và tạo nhánh của phiên từ đó trước khi mở agent; agent không tự pull. Ghi mã băm commit hiện tại (`git rev-parse HEAD`), hoặc commit mới nhất trong bản xuất. `git status` có thay đổi chưa commit thì báo người chạy. Mọi danh sách ở bước 4 và 5 lập theo commit này và **chỉ từ tệp trong kho**. Hạng mục và PR chỉ dùng để đọc bối cảnh, không dùng để lập danh sách băm.

### Bước 2. Xác định mã phiếu

**2a. Cụm và vị trí.** Với số nhóm g:
- cụm = phần nguyên của ((g − 1) ÷ 5) + 1, tức cụm 1 = N01–N05, cụm 2 = N06–N10, cụm 3 = N11–N15, cụm 4 = N16–N20;
- vị trí = ((g − 1) mod 5) + 1.

Cụm cuối có ít hơn năm nhóm thì chỉ có các vị trí tương ứng (ví dụ lớp có 13 nhóm: cụm 3 gồm N11–N13, vị trí 1–3). Vị trí luôn tính theo số nhóm.

**2b. Ma trận vị trí.**

| Vị trí | Đợt 1 | Đợt 2 | Đợt 3 |
|---|---|---|---|
| 1 | TD-01 | TD-06 | TD-12 |
| 2 | TD-02 | TD-07 | TD-13 |
| 3 | TD-03 | TD-08 | TD-14 |
| 4 | TD-04 | TD-09 | TD-15 |
| 5 | TD-05 | TD-10 (cụm 1, 3) hoặc TD-11 (cụm 2, 4) | TD-16 |

Bảng đủ 20 nhóm:

| Nhóm | Cụm | Vị trí | Đợt 1 | Đợt 2 | Đợt 3 |
|---|---|---|---|---|---|
| N01 | 1 | 1 | TD-01 | TD-06 | TD-12 |
| N02 | 1 | 2 | TD-02 | TD-07 | TD-13 |
| N03 | 1 | 3 | TD-03 | TD-08 | TD-14 |
| N04 | 1 | 4 | TD-04 | TD-09 | TD-15 |
| N05 | 1 | 5 | TD-05 | TD-10 | TD-16 |
| N06 | 2 | 1 | TD-01 | TD-06 | TD-12 |
| N07 | 2 | 2 | TD-02 | TD-07 | TD-13 |
| N08 | 2 | 3 | TD-03 | TD-08 | TD-14 |
| N09 | 2 | 4 | TD-04 | TD-09 | TD-15 |
| N10 | 2 | 5 | TD-05 | TD-11 | TD-16 |
| N11 | 3 | 1 | TD-01 | TD-06 | TD-12 |
| N12 | 3 | 2 | TD-02 | TD-07 | TD-13 |
| N13 | 3 | 3 | TD-03 | TD-08 | TD-14 |
| N14 | 3 | 4 | TD-04 | TD-09 | TD-15 |
| N15 | 3 | 5 | TD-05 | TD-10 | TD-16 |
| N16 | 4 | 1 | TD-01 | TD-06 | TD-12 |
| N17 | 4 | 2 | TD-02 | TD-07 | TD-13 |
| N18 | 4 | 3 | TD-03 | TD-08 | TD-14 |
| N19 | 4 | 4 | TD-04 | TD-09 | TD-15 |
| N20 | 4 | 5 | TD-05 | TD-11 | TD-16 |

Không có quy tắc đổi phiếu theo đề tài. Phiếu khó áp vào đề tài thì vẫn giữ mã phiếu và may đo theo bước 5.

Ghi lại đường đi: cụm, vị trí, mã theo ma trận.

### Bước 3. Tính khoá băm

Mọi lựa chọn có tính ngẫu nhiên phải tất định để chạy lại cho cùng kết quả. Chỉ dùng một cách tính dưới đây, kể cả khi chạy được lệnh.

1. Chuỗi khoá K = `<mã nhóm>-<mã đợt>`, ví dụ `N07-AB12`.
2. S = tổng mã ASCII của các ký tự trong K. Bảng mã cần dùng: `-` = 45; `0`…`9` = 48…57; `A`…`Z` = 65…90 (A = 65, B = 66, …, Z = 90). Ví dụ `N07-AB12`: 78 + 48 + 55 + 45 + 65 + 66 + 49 + 50 = **456**.
3. Lựa chọn trong hồ sơ kho (bước 4) dùng S_0 = S. Ô may đo thứ j của phiếu (j = 1, 2, … theo thứ tự ghi trong danh mục) dùng S_j = S + j.
4. Chọn một phần tử trong danh sách n phần tử (đánh số từ 1, đã sắp theo quy tắc): vị trí = (S_j mod n) + 1.
5. Chọn m phần tử liên tiếp: bắt đầu từ vị trí ở mục 4, lấy m phần tử kế tiếp, hết danh sách thì quay về đầu.

Chạy được lệnh thì kiểm lại S bằng `python3 -c "print(sum(map(ord,'N07-AB12')))"`. Ghi vào phiếu: K, S, từng S_j, danh sách ứng viên đầy đủ đã đánh số, n và vị trí được chọn. Danh sách chỉ có một phần tử thì không băm, ghi "n = 1".

### Bước 4. Lập hồ sơ kho

Lập đủ mười hai mục dưới đây, mỗi mục ghi nguồn (tệp, dòng). Log in đủ mười hai mục. Phiếu luôn in H1, H2, H6, H7 và thêm các mục H mà phần "Chỗ cần may đo" của phiếu nhắc tới.

- **H1. Tên hệ thống:** dòng tiêu đề đầu tiên của `README.md`, bỏ phần "· SE100 · Nhóm …" nếu có.
- **H2. Tác nhân:** bảng Tác nhân trong `docs/yeu-cau.md`, giữ thứ tự dòng. **Tác nhân chính** là tác nhân có nhiều dòng FR nhất ở cột Tác nhân; hoà thì lấy tác nhân đứng trước trong bảng Tác nhân.
- **H3. Use case:** lấy từ `diagrams/use-case.mmd`: nút use case trong `subgraph`; use case của một tác nhân là các nút có cạnh từ nút tác nhân đó, theo thứ tự cạnh trong tệp. Chưa có tệp này thì mỗi dòng FR là một use case của tác nhân ghi ở dòng đó, theo mã FR. Mã của use case: UC-xx nếu nhãn nút hoặc tệp đặc tả có, không thì mã FR tương ứng, không nữa thì tên. **Use case chính** là UC-01 nếu có `docs/dac-ta-UC-01.md`, không thì use case đầu tiên của tác nhân chính.
- **H4. Luật:** các dòng `BR-xx` trong `docs/yeu-cau.md`, theo mã, chép nguyên văn.
- **H5. Lớp:** các lớp trong `diagrams/class.mmd` (`class TenLop`), theo thứ tự xuất hiện, kèm thuộc tính theo thứ tự khai báo và các dòng quan hệ có bản số. Chưa có tệp này thì lấy lớp và model trong `src/` (khai báo class, model ORM, bảng trong migration hoặc schema), theo đường dẫn tệp rồi thứ tự trong tệp. **Lớp của tác nhân** là lớp trùng tên (bỏ dấu) với một tác nhân, hoặc lớp tài khoản, người dùng.
- **H6. Đối tượng trung tâm (ĐTTT):** áp lần lượt, dừng ở quy tắc đầu tiên cho kết quả:
  1. `diagrams/state.mmd` có dòng `%% Lớp: <tên>` hoặc nhắc đúng tên một lớp ở H5: lấy lớp đó;
  2. lớp ở H5 có thuộc tính trạng thái (tên chứa `trangThai`, `trang_thai`, `status`, `state`, hoặc kiểu có tên chứa `TrangThai`, `Status`): một lớp thì lấy; nhiều lớp thì lấy lớp có nhiều dòng quan hệ nhất trong `diagrams/class.mmd`; vẫn hoà thì băm với S_0 trên các lớp hoà, theo thứ tự xuất hiện;
  3. model trong `src/` có trường trạng thái: như quy tắc 2, thay số dòng quan hệ bằng số tệp trong `src/` nhắc tên lớp;
  4. danh từ chính ở cột "Muốn" của dòng FR đầu tiên của tác nhân chính; ghi "xác định từ FR-xx, kho chưa có lớp này".
- **H7. Trạng thái của ĐTTT:**
  - có `diagrams/state.mmd`: chuyển trạng thái theo thứ tự dòng `A --> B` trong tệp. Trạng thái kết thúc là trạng thái có chuyển vào `[*]` hoặc không có chuyển đi. Luồng chính bắt đầu từ trạng thái mà `[*]` trỏ tới; mỗi bước đi theo chuyển xuất hiện sớm nhất trong tệp, không vào trạng thái kết thúc không thành công, không quay lại trạng thái đã qua; dừng ở trạng thái kết thúc thành công;
  - chưa có `state.mmd`: lấy các giá trị của kiểu trạng thái trong `src/` (enum, hằng, ràng buộc `CHECK`) theo thứ tự khai báo; chưa có nữa thì các trạng thái nêu trong đặc tả theo thứ tự xuất hiện. Luồng chính là các trạng thái đó theo đúng thứ tự, bỏ trạng thái kết thúc không thành công; trạng thái cuối của luồng chính là kết thúc thành công. Danh sách chuyển gồm các cặp liền nhau trên luồng chính, theo thứ tự, rồi tới chuyển từ trạng thái đầu tiên vào từng trạng thái kết thúc không thành công. Ghi rõ "suy từ thứ tự khai báo";
  - không có nguồn nào: ghi "chưa có trạng thái";
  - kết thúc không thành công: trạng thái có tên chứa một trong các từ sau, xét từ trọn vẹn (tách theo khoảng trắng, dấu gạch dưới hoặc chữ hoa), không phân biệt hoa thường, có dấu hay không dấu: huỷ, từ chối, hết hạn, quá hạn, thất bại, `cancel`, `cancelled`, `reject`, `rejected`, `expire`, `expired`, `fail`, `failed`. Trạng thái kết thúc khác là kết thúc thành công.
- **H8. Dịch vụ ngoài:** dịch vụ chạy ngoài máy của nhóm và do bên khác vận hành (gửi thư, tin nhắn, thanh toán, lưu trữ đám mây, bản đồ, AI, đăng nhập bên thứ ba, cơ sở dữ liệu đám mây…). Tìm ở thư viện client trong tệp khai báo phụ thuộc, khoá trong tệp biến môi trường mẫu, URL `http(s)://` trong `src/`. Không tính khung web, ORM, thư viện HTTP chung, cơ sở dữ liệu chạy ở localhost hoặc nhúng trong ứng dụng. Gộp theo dịch vụ, sắp theo tên (chữ cái ASCII, không phân biệt hoa thường).
- **H9. Chỗ gửi thông báo:** dòng trong phần nghiệp vụ (route, controller, lớp miền, tác vụ theo giờ) gọi việc gửi thông báo tới người dùng qua một kênh (thư, tin nhắn, thông báo đẩy, Zalo, Telegram, webhook…), kèm tên hàm gửi và tệp chứa hàm đó. Gợi ý tìm: `mail`, `smtp`, `sms`, `notif`, `push`, `thong_bao`, `thongBao`. Không tính câu báo hiện ngay trên màn hình của người đang thao tác. Theo đường dẫn tệp rồi số dòng của chỗ gọi.
- **H10. Dữ liệu cá nhân:** thuộc tính hoặc cột chứa họ tên, email, số điện thoại, địa chỉ, ngày sinh, số giấy tờ, ảnh người, vị trí, địa chỉ IP; ghi theo lớp.
- **H11. Đường tạo ĐTTT:** route, handler, tác vụ hoặc hàm mà người dùng hay tác vụ gọi được để tạo mới ĐTTT (không tính hàm khởi tạo của chính lớp ĐTTT), và use case tạo ĐTTT. Theo đường dẫn tệp rồi số dòng.
- **H12. Người phụ trách:** dòng `Phụ trách:` của các tệp trong `docs/` và `diagrams/` mà phiếu nhắc tới.

### Bước 5. May đo phiếu

1. Đọc mục của mã phiếu trong `01a_danh_muc_phieu.md`: tình huống khung, tham số cố định, chỗ cần may đo, điều nhóm phải chứng minh, kiến thức cần, gợi ý bảng tác động.
2. Với mỗi ô, lập danh sách ứng viên đúng quy tắc sắp xếp của danh mục, đánh số, rồi áp bước 3.
3. Với mỗi danh sách không ngẫu nhiên (đường tạo, hệ quả, chỗ gửi thông báo, trường dữ liệu cá nhân…), liệt kê đủ, kèm tệp và dòng.
4. **Khi kho thiếu thứ phiếu cần:**
   - không đổi phiếu, không bỏ tham số;
   - dùng đúng thứ tự dự phòng ghi trong mục "Chỗ cần may đo" của phiếu;
   - kho thiếu hẳn thứ phiếu nói tới (ví dụ chưa gửi thông báo nào, chưa gọi dịch vụ ngoài nào, chưa có trạng thái): ghi rõ "kho chưa có …" và chuyển phần đó thành việc phải thêm theo quy tắc của phiếu; bảng tác động của nhóm tính cả phần thêm;
   - chỉ thiếu chi tiết minh hoạ (tên vai, tên đơn vị, tên loại mới): agent đặt tên hợp đề tài, ghi "tên gợi ý".
5. **Khi kho đã có sẵn phần lớn thứ phiếu yêu cầu:** giữ nguyên phiếu, ghi "kho đã có: …" kèm tệp. Nhóm vẫn làm đủ ba việc; bảng tác động sẽ cho thấy ít lớp phải sửa và nhóm chứng minh bằng diff.
6. Thay chỗ may đo trong tham số bằng tên thật trong kho (lớp, trạng thái, use case, mã BR). Con số giữ nguyên.
7. Viết **tình huống may đo** dài 80–150 chữ, giọng tin nhắn hoặc email của khách hàng (hoặc một bộ phận của khách hàng) gửi nhóm. Giữ nguyên mọi tham số; nêu tên hệ thống, tên lớp, trạng thái, use case lấy từ kho, mã người phụ trách tệp liên quan nếu có. Không gợi ý phương án xử lý.

### Bước 6. Xuất phiếu

Ghi phiếu theo đúng mẫu sau.

```markdown
# Phiếu thay đổi đã sinh — <mã phiếu> · <tên phiếu>

| Ô | Nội dung |
|---|---|
| Nhóm | N<xx> (cụm <c>, vị trí <p>) |
| Hệ thống | <H1> |
| Đợt | <k> |
| Mã đợt | <mã đợt> |
| Ngày chạy | <YYYY-MM-DD> · người chạy <mã bút danh> · công cụ <tên công cụ agent> |
| Commit kho | <mã băm> |
| Mã phiếu | <TD-xx> · theo ma trận: đợt <k>, vị trí <p><chỉ đợt 2 vị trí 5: thêm ", cụm <c>"> |

## Hồ sơ kho dùng cho phiếu
- Đối tượng trung tâm: <lớp> · nguồn: <tệp:dòng> · theo quy tắc H6.<1|2|3|4>
- <các mục H khác phiếu dùng, mỗi mục kèm nguồn>

## Tình huống khung (nguyên văn)
<chép từ danh mục>

## Tình huống may đo
<80–150 chữ>

## Tham số cố định
- <chép từ danh mục, đã thay chỗ may đo bằng tên trong kho, con số không đổi>

## Chi tiết may đo
- Ô 1 · <tên ô>: <phần tử được chọn>
- <danh sách không ngẫu nhiên, mỗi dòng kèm tệp:dòng>
- <tên gợi ý, nếu có>

## Giá trị trung gian để kiểm lại
- K = <...> · S = <...>
- Hồ sơ: <chỉ khi có hoà ở H6> S_0 = <...> · danh sách (n = <...>): 1. ... · chọn vị trí <...> → <...>
- Ô 1: S_1 = <...> · danh sách (n = <...>): 1. ... 2. ... · chọn vị trí <...> → <...>
- Ô 2: ...

## Việc nhóm phải làm
1. Một hạng mục trên tab Issues, nhãn `phieu-thay-doi`, ô Truy vết ghi <TD-xx>. Given–When–Then dùng đúng các con số ở mục Tham số cố định.
2. Một ADR `adr/NNNN-xu-ly-<TD-xx>.md` theo khuôn `adr/0000-mau-xu-ly-phieu.md`, năm phần:
   1. bảng tác động lập trước khi sửa: lớp hay module phải sửa; lớp không phải sửa và vì sao; chỗ thiết kế làm việc khó hơn mức cần;
   2. ít nhất hai phương án thiết kế, mỗi phương án được gì, mất gì;
   3. phương án chọn và người quyết;
   4. cái phải đánh đổi, sơ đồ nào phải cập nhật;
   5. kết quả thực tế: số lớp đã sửa thật so với bảng tác động, PR hiện thực; điền ở <đợt 1: Gói 5 | đợt 2: Gói 6 | đợt 3: Gói 6, cùng gói nộp phiếu>.
3. Một PR hiện thực có `Đóng #<số hạng mục>`, xong trước hạn Gói 6.

## Điều nhóm phải chứng minh
<chép từ danh mục, thay chỗ may đo bằng tên trong kho>

## Kiến thức cần
<chép từ danh mục>

## Gợi ý bảng tác động
<chép từ danh mục, thay chỗ may đo bằng tên trong kho>

## Gói nộp
<Gói 4, hạn cuối tuần 9 (năm nay CN 08/11) | Gói 5, hạn cuối tuần 11 (năm nay CN 22/11) | Gói 6, hạn Chủ nhật tuần 14 (năm nay 13/12)> · nộp kèm: tệp phiếu này, log phiên, ADR phần 1–4.

## Chỗ không đủ dữ liệu, kho thiếu hoặc kho đã có
- <liệt kê, hoặc ghi "không có">
```

Tên tệp: `phieu-thay-doi/dot<k>_N<xx>_<TD-xx>.md`. Ở chế độ hội thoại, in toàn bộ phiếu trong một khối để nhóm chép vào tệp.

### Bước 7. Log phiên

Cuối phiên, in khối "Tóm tắt phiên" gồm: thời điểm bắt đầu và kết thúc; đầu vào đã nhận; các tệp đã đọc; mã phiếu và đường đi ở bước 2; đủ mười hai mục hồ sơ kho; mọi giá trị trung gian ở bước 3; các yêu cầu đã từ chối; các chỗ "không đủ dữ liệu". Nhắc người chạy lưu **toàn bộ** phiên (bản ghi phiên của agent dòng lệnh, hoặc bản xuất cuộc hội thoại) cùng khối tóm tắt vào `log-tac-tu/phieu-dot<k>.md`, rồi nhắc lại ba việc nhóm phải làm và gói nộp.

Chạy lại với cùng mã nhóm, mã đợt và cùng commit phải cho cùng loại phiếu, cùng tham số và cùng các chi tiết tính từ mã (đường đi ở bước 2, hồ sơ kho, mọi giá trị và lựa chọn ở bước 3 và 5). Lời văn của tình huống may đo và tên gợi ý có thể khác giữa các lần chạy; giảng viên chỉ đối chiếu các trường tính từ mã. Nhóm nộp phiếu kèm log của chính lần chạy sinh ra phiếu đó.

### Bước 8. Tự kiểm trước khi trả kết quả

- Mã phiếu thuộc đúng đợt (đợt 1: TD-01…TD-05; đợt 2: TD-06…TD-11; đợt 3: TD-12…TD-16) và đúng vị trí, đúng cụm.
- Tham số trong phiếu và trong tình huống may đo trùng từng con số với danh mục.
- Tính lại S từ đầu một lần nữa; hai lần phải bằng nhau. Mọi vị trí được chọn tính lại đúng.
- Mọi tên lớp, trạng thái, use case, mã BR trong phiếu có thật trong kho tại commit đã ghi.
- Không có họ tên thật, MSSV, tài khoản GitHub.
