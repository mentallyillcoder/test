<<<<<<< HEAD

# [EduRecall - Nền tảng E-learning tích hợp Flashcard] — SE100 · Nhóm N12

Học viên sử dụng hệ thống để đăng ký khóa học, học qua video bài giảng và bắt buộc hoàn thành bài kiểm tra ôn tập bằng bộ từ vựng (Flashcard) để mở khóa tiến trình. Học viên cũng có thể tự tạo bộ Flashcard cá nhân để tự học.

Giáo viên dùng hệ thống để xây dựng cấu trúc khóa học, tải lên video và biên soạn bộ Flashcard bắt buộc đính kèm cho từng bài học. Đồng thời, giáo viên có thể theo dõi tỷ lệ hoàn thành khóa học trung bình của học viên.

Quản trị viên truy cập hệ thống để kiểm duyệt chất lượng nội dung (video, flashcard) trước khi cho phép phát hành, quản lý danh sách tài khoản và xử lý các báo cáo vi phạm liên quan đến khóa học.

Về tiến trình học: Hệ thống tuyệt đối không cho phép học viên mở khóa hoặc xem trước nội dung bài học tiếp theo nếu chưa đạt tỷ lệ hoàn thành bộ từ vựng (Flashcard) của bài học hiện tại theo quy định.

Về toàn vẹn dữ liệu: Hệ thống nghiêm cấm giáo viên sửa hoặc xóa nội dung bài học/khóa học khi đang có người học dở dang. Quản trị viên chỉ được phép tạm đình chỉ, không được xóa vĩnh viễn khóa học đã có dữ liệu đăng ký của người học.

## URL

- Frontend (Cloudflare): https://edurecall.hagiabao0506.workers.dev
- Backend API (Railway):
  https://gallant-manifestation-production-e9e8.up.railway.app/api/courses
- Pipeline: xem tab Actions

## Thành viên

Danh sách thành viên ở `THANH-VIEN.md` (mã thành viên, tài khoản GitHub, nhóm trưởng). Tệp này do hệ thống đăng ký ghi, nhóm không sửa.

Trong mọi tệp, PR, log và báo cáo, thành viên được gọi bằng mã bút danh `N07-A`, `N07-B`… Không ghi họ tên, MSSV hay email. Mỗi đặc tả, sơ đồ và mục trong bảng tác động ghi mã người phụ trách, ví dụ dòng `Phụ trách: N07-B` đầu tệp `.md` hoặc `%% Phụ trách: N07-B` đầu tệp `.mmd`.

## Cấu trúc kho

```
bao-cao/          báo cáo các gói và review chéo (Markdown); hình đặt trong bao-cao/hinh/
docs/             yêu cầu, phỏng vấn, đặc tả use case, dữ liệu, mẫu thiết kế
diagrams/         sơ đồ Mermaid (.mmd): use case, lớp, tuần tự, trạng thái, C4
adr/              quyết định thiết kế, mỗi quyết định một tệp; có khuôn ADR thường và khuôn ADR xử lý phiếu
phieu-thay-doi/   phiếu thay đổi do agent sinh, dot<k>_N<xx>_TD-xx.md (không sửa)
log-tac-tu/       log của PR dùng agent PR-<số>.md, log phiên tạo phiếu phieu-dot<k>.md
src/              mã nguồn
tests/luat/       test cho luật nghiệp vụ, do nhóm viết; có sẵn test mẫu Python và JavaScript
.se100/           bộ agent SE100: mô phỏng thay đổi, tự kiểm gói, luyện vấn đáp, gia sư
.github/          mẫu Hạng mục, mẫu PR và hai kiểm tra tự động kiem-pr, kiem-goi (không sửa)
scripts/          mã của kiểm tra tự động và bộ thử của nó (không sửa)
AGENTS.md         quy tắc và ràng buộc kiến trúc cho agent đọc
THANH-VIEN.md     do hệ thống đăng ký ghi (không sửa)
```

## Bốn dữ liệu sống

Bốn thứ dưới đây cập nhật ngay trong lúc làm, không soạn lại vào cuối gói. Lúc hạn, giảng viên lấy cả bốn cùng bài nộp.

1. **Bảng công việc:** tab **Issues** của kho, mỗi việc một hạng mục theo mẫu **Hạng mục**, gắn milestone `Gói 3`, `Gói 4`, `Gói 5` hoặc `Gói 6`. Được chấm từ Gói 3; `kiem-pr` đòi dòng `Đóng #` ngay từ PR đầu tiên (trừ PR tài liệu và PR từ nhánh `kho-mau`).
2. **Kho mã và log agent:** mỗi PR theo mẫu; PR dùng agent kèm `log-tac-tu/PR-<số>.md`.
3. **Sơ đồ** trong `diagrams/`, khớp mã (`scripts/kiem_moc.py` kiểm).
4. **Sổ quyết định thiết kế:** thư mục `adr/`, kể cả ADR xử lý phiếu thay đổi.

## Quy trình một hạng mục

1. **Tạo hạng mục** ở tab Issues bằng mẫu **Hạng mục**: câu chuyện người dùng (Là… tôi muốn… để…), tiêu chí chấp nhận Given–When–Then, truy vết (UC-xx, BR-xx hoặc mã phiếu TD-xx), cách làm (`agent` hoặc `tay`), người phụ trách (mã). Gắn milestone của gói.
2. **Làm trên nhánh riêng**, mỗi hạng mục một nhánh. Agent chỉ làm trên nhánh này.
3. **Mở PR theo mẫu.** Dòng đầu ghi ba thông tin `Agent: <công cụ> · Điều khiển: N07-B · Review: N07-A` (PR không dùng agent ghi `Agent: không`), dòng sau ghi đúng một `Đóng #<số hạng mục>`. PR dùng agent thêm `log-tac-tu/PR-<số PR>.md` trong chính PR đó (khuôn ở `log-tac-tu/README.md`); mở PR trước để biết số, rồi đẩy thêm commit chứa log. Kiểm tra `kiem-pr` chạy mỗi khi mở PR, sửa mô tả hoặc đẩy thêm commit; chưa đạt thì không merge được. Xem kết quả ở tab Checks của PR. PR sửa, đổi tên hoặc xoá tệp đã có trong `tests/` mà dòng `Sửa hoặc xoá test đã có? Vì sao:` để trống thì `kiem-pr` cảnh báo; cảnh báo không chặn merge.
4. **Review**: một thành viên khác người điều khiển đọc diff, chạy thử và duyệt PR. Có tệp trong `tests/` thì đọc diff của chúng trước diff mã.
5. **Người merge**, sau khi có duyệt và `kiem-pr` đạt.
6. **Nghiệm thu**: Phụ trách yêu cầu kiểm theo từng khối Given–When–Then của hạng mục rồi đóng hạng mục. `Đóng #` không tự đóng hạng mục.

Làm lại sau khi đã merge thì mở PR mới ghi `Đóng #` cùng hạng mục.

**PR tài liệu.** PR chỉ sửa tệp trong `bao-cao/`, `docs/`, `diagrams/`, `adr/`, `phieu-thay-doi/`, `log-tac-tu/phieu-dot<k>.md` hoặc tệp `.md` ở gốc kho (trừ `THANH-VIEN.md`) là PR tài liệu: chỉ cần dòng ba thông tin, không cần `Đóng #`. `kiem-pr` tự nhận ra loại PR này theo danh sách tệp thay đổi. PR tài liệu có dùng agent vẫn phải kèm log: `log-tac-tu/PR-<số>.md`, hoặc `log-tac-tu/phieu-dot<k>.md` với PR đưa phiếu thay đổi vào kho.

## Kiểm thử

Test cho luật nghiệp vụ đặt trong `tests/luat/`, tên theo mã luật: `test_BR03_quay_da_nhan_thi_khong_huy_duoc`. Test trong `tests/luat/` do nhóm viết và là đặc tả: agent không sửa, không xoá (`AGENTS.md`, quy tắc 7 và 8).

Chạy ở gốc kho:

```bash
python -m pytest tests -v     # Python, cần pip install pytest
node --test                   # JavaScript, Node 20 trở lên, không cần cài gì
```

Hai tệp mẫu `tests/luat/test_vi_du.py` và `tests/luat/vi-du.test.js` tự chứa mã mẫu để chạy được ngay. Có test thật cho luật của nhóm thì xoá chúng. Cách viết test từ ví dụ Given–When–Then, cách giao việc cho agent theo kiểu test trước, chạy test khi không có laptop: tờ tra cứu TC8.

## Ba quy tắc agent

1. **Agent không merge.** Mọi thay đổi vào nhánh chính do người merge, sau khi một thành viên khác người điều khiển phiên agent đã review.
2. **Mỗi PR ghi ba thông tin:** `Agent: <công cụ> · Điều khiển: N07-B · Review: N07-A`. PR không dùng agent ghi `Agent: không`.
3. **Agent chỉ làm trên nhánh riêng**, không giữ khoá triển khai, không ghi vào cơ sở dữ liệu thật.

Vi phạm quy tắc 1: tiêu chí 1 của gói tương ứng bằng 0. Vi phạm quy tắc 2 hoặc 3: trừ ở tiêu chí 1 theo mức.

## Phiếu thay đổi

Agent mô phỏng thay đổi (`.se100/01_mo_phong_thay_doi.md`, kèm danh mục `.se100/01a_danh_muc_phieu.md`) là **bắt buộc ở cả ba đợt**. Đầu tuần 7, 9, 11 (năm nay thứ Hai 19/10, 02/11, 16/11), giảng viên công bố mã đợt; trong tuần đó nhóm chạy agent với mã nhóm và mã đợt, đưa phiếu và log phiên vào kho qua một PR tài liệu, rồi xử lý phiếu: một hạng mục nhãn `phieu-thay-doi`, một ADR theo khuôn `adr/0000-mau-xu-ly-phieu.md`, một PR hiện thực có `Đóng #` hạng mục đó. Chi tiết trong `phieu-thay-doi/README.md`.

## Các gói

| Gói         | Hạn năm nay (23:59)                            | Thẻ           | Nộp gì                                                                                                                                           | Báo cáo                         |
| ----------- | ---------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| 2           | CN 18/10, cuối tuần 6 (từ năm sau cuối tuần 5) | `goi-2`       | Luồng chính chạy trên URL deploy, hồi cứu vòng 1, `docs/yeu-cau.md`, `docs/phong-van.md`, `docs/cau-hoi-khach-hang.md`                           | `bao-cao/goi2-vong1-yeu-cau.md` |
| 3           | CN 25/10, cuối tuần 7                          | `goi-3`       | `diagrams/use-case.mmd`, ba `docs/dac-ta-UC-*.md`, ít nhất hai `diagrams/seq-*.mmd`; user story và Given–When–Then trên Issues (milestone Gói 3) | `bao-cao/goi3-dac-ta.md`        |
| 4           | CN 08/11, cuối tuần 9                          | `goi-4`       | `diagrams/class.mmd`, `diagrams/state.mmd`, mã khớp sơ đồ, `docs/tu-danh-gia-M3.md`; phiếu thay đổi đợt 1, log phiên, ADR xử lý phiếu            | `bao-cao/goi4-mo-hinh.md`       |
| Review chéo | CN 15/11, cuối tuần 10                         | `review-cheo` | Một báo cáo tối đa 2 trang về kho của nhóm mình review                                                                                           | `bao-cao/review-cheo.md`        |
| 5           | CN 22/11, cuối tuần 11                         | `goi-5`       | `diagrams/c4-context.mmd`, `c4-container.mmd`, `docs/du-lieu.md`, `adr/0001-*.md`, `AGENTS.md`; phiếu thay đổi đợt 2, log phiên, ADR xử lý phiếu | `bao-cao/goi5-kien-truc.md`     |
| 6           | CN 13/12, tuần 14                              | `goi-6`       | Pipeline xanh, URL sống, ba phiếu thay đổi đã làm thật (phiếu đợt 3, log phiên, ADR), `docs/trung-lap.md`, kho bàn giao được                     | `bao-cao/goi6-tong-ket.md`      |

Lớp đổi hạn thì theo thông báo của lớp. Báo cáo các gói 2–5 có bốn ô dài một trang: đã làm gì; ba quyết định thiết kế lớn nhất; thẩm định (hai lần nhóm kiểm kết quả của agent: kiểm bằng gì, kết luận đúng hay sai; agent làm đúng mà chứng minh được vẫn đạt); retro ba dòng. Gói 2 thêm hồi cứu vòng 1; Gói 4 thêm phần xử lý phiếu đợt 1; Gói 5 thêm phần trả lời review chéo và phần xử lý phiếu đợt 2. Báo cáo Gói 6 dài 3–4 trang. Khung có sẵn trong `bao-cao/`; viết xong mục nào thì xoá dòng giữ chỗ `<!-- điền: … -->` của mục đó.

Biểu mẫu Gói 1 và phiếu đánh giá đồng đẳng nộp qua biểu mẫu riêng, không đặt trong kho.

## Nộp bài bằng thẻ

Nộp một gói là gắn thẻ trên nhánh chính và đẩy thẻ lên trước 23:59 ngày hạn. Mọi tệp của gói phải merge vào nhánh chính trước khi gắn thẻ.

```bash
git checkout main && git pull
git tag goi-3 && git push origin goi-3
```

Tên thẻ: `goi-2` … `goi-6`, báo cáo review chéo gắn thẻ `review-cheo`. **Thẻ đã đẩy không xoá hay dời được**, nên chỉ gắn thẻ khi gói đã sẵn sàng. Bài được chấm tại commit mà thẻ trỏ tới.

## Kiểm gói

Khi đẩy thẻ, kiểm tra `kiem-goi` tự chạy. **Chạy tay trước khi gắn thẻ**: tab **Actions** → **kiem-goi** → **Run workflow** → chọn gói. Xem kết quả: chọn lần chạy → **Summary**.

`kiem-goi` kiểm:

- báo cáo của gói đúng tên và không còn dòng giữ chỗ;
- các tệp và sơ đồ của gói: đếm yêu cầu, sơ đồ parse được, participant trong sequence là lớp trong sơ đồ lớp, mọi lớp có trong `docs/`, ADR có ít nhất hai phương án…;
- Gói 3–6: có ít nhất một hạng mục gắn milestone của gói;
- Gói 4, 5, 6: có phiếu thay đổi của đợt 1, 2, 3 (`phieu-thay-doi/dot<k>_N<xx>_TD-xx.md`), log phiên `log-tac-tu/phieu-dot<k>.md`, và một ADR trong `adr/` nhắc mã phiếu đó;
- review chéo: đủ bốn phần, mỗi phát hiện trỏ tới tệp, dòng hoặc PR.

Mục **Cảnh báo** (email, dãy 8 chữ số giống MSSV trong tệp `.md`, hạng mục chưa gắn milestone) không làm gói trượt nhưng cần xem lại.

Chạy ở máy, tại gốc kho:

```bash
python scripts/kiem_goi.py --goi 4     # kiểm cả gói; phần Issues chỉ kiểm được trên Actions
python scripts/kiem_moc.py M3          # chỉ phần sơ đồ và tài liệu của Gói 4
```

Gói 2 = M0 + M1, Gói 3 = M2, Gói 4 = M3, Gói 5 = M4, Gói 6 = M5.

Kết quả kiểm gói là kiểm thủ tục, không phải điểm. Lần chạy có mục chưa đạt hiện dấu đỏ; thẻ vẫn được ghi nhận là đã nộp.

> > > > > > > 1157287d4663e6e62979195b7ac67d366612303d
