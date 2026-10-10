# Danh mục 16 phiếu thay đổi — dùng cho agent 1

Tệp dữ liệu của agent Mô phỏng thay đổi (`01_mo_phong_thay_doi.md`). Tham số cố định không được làm nhẹ.

Chữ trong ngoặc nhọn là chỗ may đo theo kho của nhóm, lấy từ hồ sơ kho (bước 4 của `01_mo_phong_thay_doi.md`):

- <ĐTTT>: đối tượng trung tâm của hệ thống (đơn, đặt chỗ, hồ sơ, yêu cầu…), thứ mà sơ đồ trạng thái của nhóm mô tả;
- <tác nhân chính>: tác nhân có nhiều yêu cầu chức năng nhất;
- <lớp …>, <trạng thái …>, <use case …>, <BR-xx>: tên đúng như trong kho.

"Ô 1", "ô 2" là chỗ chọn bằng băm theo bước 3 của `01_mo_phong_thay_doi.md`, đánh số theo thứ tự ghi trong mục "Chỗ cần may đo". Tên gợi ý (tên loại mới, tên vai, tên đơn vị, tên bên thứ ba) do agent đặt cho hợp đề tài; nhóm được đổi tên, không được đổi tham số.

## Phân đợt

| Đợt | Mã đợt công bố | Phiếu | Kiến thức cần | Nộp cùng |
|---|---|---|---|---|
| 1 | Đầu tuần 7 (năm nay 19/10) | TD-01 · TD-02 · TD-03 · TD-04 · TD-05 | Buổi 5–9: yêu cầu, use case, sequence, mô hình miền, trạng thái, bảng tác động | Gói 4 (cuối tuần 9, năm nay 08/11) |
| 2 | Đầu tuần 9 (năm nay 02/11) | TD-06 · TD-07 · TD-08 · TD-09 · TD-10 · TD-11 | Thêm buổi 10–11: thiết kế dữ liệu, thiết kế kiến trúc | Gói 5 (cuối tuần 11, năm nay 22/11) |
| 3 | Đầu tuần 11 (năm nay 16/11) | TD-12 · TD-13 · TD-14 · TD-15 · TD-16 | Thêm buổi 12–14: giao diện, triển khai, CI/CD | Gói 6 (Chủ nhật tuần 14, năm nay 13/12) |

## Ma trận vị trí

| Vị trí trong cụm | Đợt 1 | Đợt 2 | Đợt 3 |
|---|---|---|---|
| 1 | TD-01 | TD-06 | TD-12 |
| 2 | TD-02 | TD-07 | TD-13 |
| 3 | TD-03 | TD-08 | TD-14 |
| 4 | TD-04 | TD-09 | TD-15 |
| 5 | TD-05 | TD-10 (cụm 1, 3) · TD-11 (cụm 2, 4) | TD-16 |

Bảng đủ 20 nhóm ở bước 2 của `01_mo_phong_thay_doi.md`.

## Việc nhóm làm với mọi phiếu

1. Một hạng mục trên tab Issues, nhãn `phieu-thay-doi`, ô Truy vết ghi mã phiếu. Given–When–Then dùng đúng các con số trong tham số.
2. Một ADR `adr/NNNN-xu-ly-TD-xx.md`, năm phần:
   1. bảng tác động lập trước khi sửa: lớp hay module phải sửa; lớp không phải sửa và vì sao; chỗ thiết kế làm việc khó hơn mức cần;
   2. ít nhất hai phương án thiết kế, mỗi phương án được gì, mất gì;
   3. phương án chọn và người quyết;
   4. cái phải đánh đổi, sơ đồ nào phải cập nhật;
   5. kết quả thực tế, điền ở gói sau: số lớp đã sửa thật so với bảng tác động, PR hiện thực.
3. Một PR hiện thực có `Đóng #<số hạng mục>`; agent viết mã.

---

## TD-01 · Thêm một loại mới · đợt 1 · vị trí 1

**Tình huống khung:** Khách hàng muốn hệ thống phục vụ thêm một loại <ĐTTT> mới, chạy song song với loại đang có. Loại mới đi qua cùng các bước như loại cũ nhưng có vài luật riêng. Khách nói trước: năm sau có thể thêm loại thứ ba.

**Tham số cố định:**
- Đúng **một** loại mới. Loại cũ và dữ liệu cũ giữ nguyên hành vi.
- Loại mới khác loại cũ ở đúng **ba** điểm:
  1. con số đầu tiên trong luật ô 1, với loại mới, giảm còn **một nửa** (làm tròn xuống theo đơn vị của con số đó, nhỏ nhất là 1);
  2. loại mới có thêm đúng **một** thông tin bắt buộc mà loại cũ không có;
  3. với loại mới, chuyển trạng thái ô 2 chỉ hợp lệ trong **24 giờ** kể từ lúc <ĐTTT> vào trạng thái nguồn của chuyển đó; quá 24 giờ thì bị từ chối.
- Phần 5 của ADR ghi thêm số lớp phải sửa nếu thêm loại thứ ba cùng kiểu.

**Chỗ cần may đo:**
- Ô 1 · luật bị đổi số: các dòng BR rồi các dòng FR trong `docs/yeu-cau.md` có ít nhất một con số, theo thứ tự mã. Chọn một. Không có dòng nào: luật ô 1 là thời hạn hiệu lực, loại cũ không đổi, loại mới hết hiệu lực sau 7 ngày kể từ lúc tạo.
- Ô 2 · chuyển có điều kiện thêm: các chuyển trạng thái của <ĐTTT> trong hồ sơ, bỏ chuyển từ `[*]` và chuyển vào `[*]`, theo thứ tự trong hồ sơ. Chọn một. Chưa có trạng thái nào: ô 2 là "huỷ <ĐTTT>", 24 giờ tính từ lúc tạo.
- Tên loại mới và tên thông tin bắt buộc: gợi ý theo đề tài.

**Điều nhóm phải chứng minh:** Thêm loại mới bằng cách mở rộng chứ không sửa rải rác: luật riêng của mỗi loại nằm ở một chỗ (lớp con, đối tượng chiến lược hay dữ liệu cấu hình; nhóm chọn và nói vì sao); đếm được số lớp phải sửa khi thêm loại thứ ba.

**Kiến thức cần:** buổi 5 (luật nghiệp vụ), 8 (kế thừa và đa hình, sơ đồ trạng thái), 9 (bảng tác động).

**Gợi ý bảng tác động:** tìm mọi chỗ dùng luật ô 1 và mọi chỗ thực hiện chuyển ô 2: lớp miền, controller, giao diện, truy vấn. Mỗi chỗ một dòng. `if` hay `switch` theo loại lặp lại ở nhiều lớp là chỗ thiết kế làm việc khó hơn.

## TD-02 · Giới hạn trên nhiều đối tượng · đợt 1 · vị trí 2

**Tình huống khung:** Sau một thời gian chạy thử, khách hàng thấy vài <tác nhân chính> giữ rất nhiều <ĐTTT> chưa xong cùng lúc, làm người khác không dùng được. Khách yêu cầu luật mới: mỗi <tác nhân chính> chỉ được có một số <ĐTTT> đang mở. Luật phải đúng dù <ĐTTT> được tạo từ đâu. Quản trị viên được cho một người vượt giới hạn khi có lý do.

**Tham số cố định:**
- Mỗi <tác nhân chính> có tối đa **3** <ĐTTT> đang mở. "Đang mở" là ở bất kỳ trạng thái nào trừ trạng thái kết thúc.
- Lần tạo thứ 4 bị từ chối ngay lúc tạo, thông báo nêu rõ giới hạn 3. Không được tạo rồi mới huỷ.
- Luật áp ở **mọi** đường tạo <ĐTTT> có trong kho (liệt kê trong phiếu) và mọi đường thêm sau này.
- Quản trị viên cho phép vượt từng lần: mỗi lần cho tạo thêm đúng **1** <ĐTTT>, bắt buộc ghi lý do; hệ thống lưu mã người cho phép và thời điểm.

**Chỗ cần may đo:**
- Không có ô băm.
- Liệt kê mọi đường tạo <ĐTTT>: use case, route hoặc hàm trong `src/` (hồ sơ H11), kèm tệp và dòng.
- Chưa có trạng thái nào: "đang mở" là "tạo trong 24 giờ gần nhất". Ghi rõ.

**Điều nhóm phải chứng minh:** Luật trên một tập đối tượng nằm ở một lớp chịu trách nhiệm rõ, mọi đường tạo đều đi qua lớp đó, không nằm ở controller hay giao diện; phân biệt luật của một đối tượng với luật của nhiều đối tượng; đặc tả (luồng lỗi) và sequence cập nhật đúng chỗ kiểm.

**Kiến thức cần:** buổi 5 (luật nghiệp vụ), 6 (luồng lỗi), 7 (sequence), 8 (trách nhiệm lớp), 9 (bảng tác động).

**Gợi ý bảng tác động:** mỗi đường tạo một dòng; lớp nào hiện biết "người này đang có mấy <ĐTTT> mở"; quyền vượt giới hạn là use case mới hay luồng thay thế.

## TD-03 · Người làm thay · đợt 1 · vị trí 3

**Tình huống khung:** Khách hàng muốn <tác nhân chính> uỷ quyền được cho người khác làm thay mình (người nhà, thư ký, trợ lý…). Người được uỷ quyền dùng tài khoản riêng, làm được một số việc thay người uỷ quyền nhưng không phải mọi việc. Việc nào làm thay cũng phải biết ai làm, làm cho ai.

**Tham số cố định:**
- Người được uỷ quyền đăng nhập bằng tài khoản của chính mình; không dùng chung mật khẩu, không "đăng nhập thành" người uỷ quyền.
- Làm thay được đúng **hai** use case ô 1; **không** làm thay được use case ô 2, dù người uỷ quyền làm được.
- Mỗi <tác nhân chính> uỷ quyền cho tối đa **2** người cùng lúc. Mỗi uỷ quyền có hạn tối đa **30 ngày**; người uỷ quyền thu hồi được bất cứ lúc nào, có hiệu lực ngay.
- Mỗi việc làm thay lưu cả người thực hiện và người được làm thay. Người uỷ quyền xem được danh sách việc đã được làm thay.

**Chỗ cần may đo:**
- Danh sách use case của <tác nhân chính> trong hồ sơ, theo thứ tự trong hồ sơ, bỏ đăng ký, đăng nhập, đăng xuất.
- Ô 1: hai use case liên tiếp.
- Ô 2: một use case trong phần còn lại của danh sách sau khi bỏ hai use case ô 1, giữ thứ tự.
- Danh sách có đúng hai use case: ô 1 chọn một, ô 2 là use case còn lại; tham số "hai" thành "một", ghi rõ. Danh sách có một use case: ô 1 là use case đó, ô 2 là "đổi thông tin tài khoản của người uỷ quyền".
- Tên vai người được uỷ quyền: gợi ý theo đề tài.

**Điều nhóm phải chứng minh:** Thêm tác nhân mà không nhân đôi use case: mô hình miền tách "ai đang thao tác" khỏi "thao tác cho ai"; quyền kiểm ở một chỗ thay vì `if` theo vai rải khắp nơi; sơ đồ use case, đặc tả và sơ đồ lớp cập nhật khớp nhau.

**Kiến thức cần:** buổi 5 (yêu cầu), 6 (tác nhân, use case), 8 (lớp, quan hệ), 9 (bảng tác động).

**Gợi ý bảng tác động:** mọi chỗ lấy "người dùng hiện tại" làm chủ của <ĐTTT>; mọi chỗ kiểm vai; ba use case trong phiếu đi qua những lớp nào.

## TD-04 · Một thành nhiều · đợt 1 · vị trí 4

**Tình huống khung:** Hiện mỗi <ĐTTT> gắn với đúng một <lớp liên quan>. Khách hàng muốn từ nay một <ĐTTT> gồm nhiều <lớp liên quan>. Từng phần có thể bị từ chối riêng, các phần khác vẫn đi tiếp.

**Tham số cố định:**
- Một <ĐTTT> gồm từ **1 đến 5** <lớp liên quan>; phần thứ 6 bị từ chối.
- Mỗi phần có trạng thái riêng; từ chối một phần không huỷ phần khác.
- <ĐTTT> hoàn tất khi mọi phần đã ở trạng thái kết thúc và có ít nhất **một** phần thành công. Mọi phần bị từ chối thì <ĐTTT> bị huỷ.
- Luật đang áp cho <lớp liên quan> (sức chứa, tồn kho, khung giờ…) áp cho từng phần.
- Dữ liệu cũ (mỗi <ĐTTT> một phần) vẫn đúng, không phải nhập lại.

**Chỗ cần may đo:**
- Ô 1 · <lớp liên quan>: các lớp mà <ĐTTT> gắn với bản số một (đầu phía lớp kia ghi `"1"` trong `diagrams/class.mmd`, hoặc một khoá ngoại đơn trong mô hình ở `src/`), theo thứ tự xuất hiện, bỏ lớp của <tác nhân chính>. Chọn một.
- Danh sách rỗng (<ĐTTT> đã gắn nhiều, hoặc không gắn lớp nào khác): <lớp liên quan> là người nhận; một <ĐTTT> có 1–5 người nhận, mỗi người xác nhận hoặc từ chối riêng. Ghi rõ.

**Điều nhóm phải chứng minh:** Đổi bản số là đổi mô hình chứ không chỉ thêm bảng: trạng thái nằm ở <ĐTTT> hay ở từng phần; composition giữa <ĐTTT> và phần; luật hoàn tất tính ở lớp nào; sơ đồ lớp, sơ đồ trạng thái và sequence cập nhật khớp nhau.

**Kiến thức cần:** buổi 7 (`loop` trong sequence), 8 (quan hệ, bản số, composition, trạng thái), 9 (bảng tác động).

**Gợi ý bảng tác động:** mọi chỗ đọc thẳng một <lớp liên quan> từ <ĐTTT>; chỗ tính tổng, hiển thị, kiểm luật của <lớp liên quan>; sơ đồ trạng thái thành hai mức.

## TD-05 · Bước chờ có hạn giờ · đợt 1 · vị trí 5

**Tình huống khung:** Khách hàng muốn thêm một bước chờ trước khi <ĐTTT> có hiệu lực. Trong lúc chờ, <ĐTTT> giữ chỗ nhưng chưa có hiệu lực. Quá hạn mà không ai xác nhận thì hệ thống tự trả lại như chưa từng giữ.

**Tham số cố định:**
- Thêm đúng **một** trạng thái mới, chen vào giữa cặp trạng thái ô 1. Các chuyển khác giữ nguyên.
- Ở trạng thái mới đủ **15 phút** mà chưa được xác nhận thì tự chuyển sang trạng thái kết thúc không thành công (dùng trạng thái huỷ có sẵn nếu có) và trả lại thứ đang giữ.
- Xác nhận đến khi đã đủ 15 phút bị từ chối, kể cả khi việc tự huỷ chưa kịp chạy.
- Người xác nhận là tác nhân ô 2.
- Trong 15 phút đó, không ai khác lấy được thứ đang giữ.

**Chỗ cần may đo:**
- Ô 1: các cặp trạng thái liền nhau trên luồng chính của <ĐTTT> (hồ sơ H7), theo thứ tự trên luồng. Chọn một. Chưa có trạng thái: dùng luồng tối thiểu "mới tạo → hoàn tất". Ghi rõ.
- Ô 2: các tác nhân khác <tác nhân chính> trong bảng Tác nhân, theo thứ tự. Chọn một. Không có tác nhân nào khác: <tác nhân chính> tự xác nhận.
- Thứ đang giữ: lấy từ một luật BR có giới hạn (sức chứa, tồn kho, suất…), dòng đầu tiên theo mã. Không có: bỏ ý giữ chỗ, các tham số khác giữ nguyên. Ghi rõ.

**Điều nhóm phải chứng minh:** Sơ đồ trạng thái mở rộng được: hết giờ là một sự kiện trong mô hình chứ không phải việc sửa dữ liệu từ bên ngoài; luật chuyển nằm ở lớp <ĐTTT>; chặn được xác nhận trễ; ca biên đúng 15 phút được nêu trong đặc tả.

**Kiến thức cần:** buổi 6 (luồng thay thế, luồng lỗi), 7 (sequence), 8 (sơ đồ trạng thái), 9 (bảng tác động).

**Gợi ý bảng tác động:** mọi chỗ gán trạng thái trực tiếp; chỗ tính "còn bao nhiêu" của thứ đang giữ; ai phát sự kiện hết giờ.

## TD-06 · Nhiều đơn vị · đợt 2 · vị trí 1

**Tình huống khung:** Khách hàng mở rộng: từ nay hệ thống phục vụ nhiều <đơn vị> độc lập. Mỗi <đơn vị> có danh mục, nhân sự và số liệu riêng; người của đơn vị này không được thấy dữ liệu của đơn vị kia. Một quản trị chung xem được số liệu tổng của mọi đơn vị nhưng không sửa dữ liệu nghiệp vụ.

**Tham số cố định:**
- Ít nhất **3** đơn vị chạy cùng lúc trên **một** bản triển khai và **một** cơ sở dữ liệu.
- Mỗi bản ghi nghiệp vụ thuộc đúng **một** đơn vị.
- Truy cập chéo đơn vị: **0** trường hợp, ở mọi màn hình, mọi đường API, mọi truy vấn. Ẩn nút trên giao diện không tính là chặn.
- Tài khoản <tác nhân chính> dùng chung cho mọi đơn vị; tài khoản nhân sự của đơn vị thuộc đúng một đơn vị.
- Luật ô 1 áp riêng cho từng đơn vị; con số trong luật do quản trị của đơn vị đặt.
- Dữ liệu hiện có chuyển vào một đơn vị mặc định bằng **một** migration, không nhập tay.
- Quản trị chung chỉ đọc số liệu tổng.

**Chỗ cần may đo:**
- Ô 1: các dòng BR có con số, theo mã. Chọn một. Không có: luật ô 1 là "danh mục và giá riêng theo đơn vị". Ghi rõ.
- Liệt kê lớp và bảng nghiệp vụ (`diagrams/class.mmd`, migration hoặc schema, model trong `src/`); đánh dấu lớp nào là dữ liệu dùng chung (ví dụ tài khoản <tác nhân chính>). Không ngẫu nhiên.
- Tên <đơn vị>: gợi ý theo đề tài (chi nhánh, cơ sở, câu lạc bộ, lớp…).

**Điều nhóm phải chứng minh:** Thêm một chiều dữ liệu: ánh xạ (khoá đơn vị, khoá ngoại, ràng buộc duy nhất trong một đơn vị); việc lọc theo đơn vị nằm ở tầng nào và vì sao; dữ liệu nào dùng chung, dữ liệu nào theo đơn vị; C4 container và ADR ghi rõ quyết định.

**Kiến thức cần:** buổi 8 (mô hình miền), 9 (bảng tác động), 10 (ánh xạ, khoá, ràng buộc ở tầng nào, migration), 11 (kiến trúc, ADR).

**Gợi ý bảng tác động:** đếm truy vấn và đường API hiện có; lọc rải ở từng truy vấn thì mỗi chỗ một dòng; ràng buộc duy nhất nào phải đổi thành "duy nhất trong một đơn vị".

## TD-07 · Dữ liệu từ hệ thống ngoài · đợt 2 · vị trí 2

**Tình huống khung:** Khách hàng đã có một hệ thống khác giữ <lớp ô 1>. Từ nay hệ thống của nhóm không tự lưu <lớp ô 1> nữa mà đọc từ hệ thống kia qua API. Hệ thống kia chậm và thỉnh thoảng ngừng; khi nó ngừng, người dùng vẫn phải dùng được những gì đã có.

**Tham số cố định:**
- <lớp ô 1> do hệ thống ngoài làm chủ. Hệ thống của nhóm chỉ đọc; bỏ việc thêm, sửa, xoá <lớp ô 1> trong hệ thống của nhóm.
- API ngoài (giả định) trả lời trong **0,2 đến 3 giây**; mỗi ngày ngừng **một** lần, mỗi lần **10 phút**, không báo trước; giới hạn **60** lệnh gọi mỗi phút.
- Khi API ngừng: luồng chính vẫn chạy với dữ liệu cũ không quá **1 giờ**. Dữ liệu cũ hơn 1 giờ thì báo rõ cho người dùng, không im lặng dùng tiếp.
- Nhóm tự dựng bản giả của API theo đúng các con số trên và mô tả bản giả trong ADR. Không gọi dịch vụ thật.

**Chỗ cần may đo:**
- Ô 1: các lớp trong `diagrams/class.mmd` (chưa có thì mô hình trong `src/`) mà <ĐTTT> tham chiếu và <tác nhân chính> không có use case thêm, sửa, xoá; theo thứ tự xuất hiện, bỏ <ĐTTT> và lớp của các tác nhân. Chọn một. Danh sách rỗng: xét mọi lớp <ĐTTT> tham chiếu, trừ lớp của tác nhân.
- Liệt kê mọi tệp trong `src/` đọc hoặc ghi <lớp ô 1>.

**Điều nhóm phải chứng minh:** Coupling với hạ tầng: phần nghiệp vụ phụ thuộc một giao diện do nhóm định nghĩa chứ không phụ thuộc thẳng HTTP hay ORM; một bộ chuyển cho API thật, một cho bản giả; xử lý khi phụ thuộc ngoài không sẵn sàng; ánh xạ dữ liệu khi bảng cũ bị bỏ; C4 có thêm hệ thống ngoài.

**Kiến thức cần:** buổi 9 (coupling), 10 (ánh xạ, migration), 11 (kiến trúc, C4, ADR).

**Gợi ý bảng tác động:** mọi chỗ truy vấn thẳng bảng của <lớp ô 1>; khoá ngoại từ <ĐTTT> tới <lớp ô 1> còn giữ được không; chỗ nào cần dữ liệu mới nhất, chỗ nào dùng dữ liệu cũ được.

## TD-08 · Xoá dữ liệu cá nhân · đợt 2 · vị trí 3

**Tình huống khung:** Bộ phận pháp chế của khách hàng yêu cầu, để tuân thủ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15: người dùng tự gửi được yêu cầu xoá dữ liệu cá nhân của mình. Xoá xong thì không còn nhận ra người đó từ dữ liệu, nhưng số liệu kinh doanh không được thay đổi.

**Tham số cố định:**
- Xoá xong trong **72 giờ** kể từ khi người dùng gửi yêu cầu. Người dùng huỷ được yêu cầu trong **24 giờ** đầu.
- Sau khi xoá, mọi trường dữ liệu cá nhân của người đó (danh sách trong phiếu) bị xoá hoặc thay bằng giá trị không truy ngược được.
- Số liệu thống kê trước và sau khi xoá trùng nhau **từng con số**.
- Người đang có <ĐTTT> chưa kết thúc: yêu cầu được giữ lại và thực hiện trong 72 giờ sau khi <ĐTTT> cuối cùng của người đó kết thúc; người dùng được báo điều này lúc gửi yêu cầu.
- Hệ thống giữ bản ghi về việc xoá (mã yêu cầu, lúc gửi, lúc xong), không chứa dữ liệu cá nhân.
- 72 giờ và 24 giờ là yêu cầu của khách hàng; phiếu không khẳng định đó là con số trong Luật.

**Chỗ cần may đo:**
- Liệt kê trường dữ liệu cá nhân (hồ sơ H10), lớp hoặc bảng chứa chúng, và mọi khoá ngoại trỏ tới lớp người dùng. Không ngẫu nhiên.
- Ô 1: các lớp nghiệp vụ tham chiếu tới người dùng (<ĐTTT>, đánh giá, bình luận, thanh toán…), theo thứ tự xuất hiện. Chọn một; tình huống nêu lớp này làm ví dụ.
- Kho chỉ có tài khoản, không có trường cá nhân nào khác: dữ liệu cá nhân tối thiểu là email hoặc tên đăng nhập; vẫn giữ đủ tham số.

**Điều nhóm phải chứng minh:** Tách dữ liệu cá nhân khỏi dữ liệu nghiệp vụ trong mô hình và trong ánh xạ lớp sang bảng; khoá ngoại và xoá dây chuyền không làm sai số liệu; luật "chưa kết thúc thì chờ" nằm ở lớp miền; yêu cầu tuân thủ không thương lượng như yêu cầu chức năng.

**Kiến thức cần:** buổi 5 (yêu cầu, luật), 8 (trạng thái của yêu cầu xoá), 10 (ánh xạ, khoá, ràng buộc), 11 (kiến trúc).

**Gợi ý bảng tác động:** mọi bảng có khoá ngoại tới người dùng; truy vấn thống kê đang đếm theo người dùng hay theo bản ghi; log hay tệp xuất có chép dữ liệu cá nhân không.

## TD-09 · Lịch sử thay đổi · đợt 2 · vị trí 4

**Tình huống khung:** Sau một lần tranh chấp với khách, chủ hệ thống không chứng minh được <ĐTTT> đã ở trạng thái nào, ai đã đổi, lúc nào. Khách hàng yêu cầu giữ lại mọi thay đổi của <ĐTTT> và xem lại được nó ở một thời điểm bất kỳ trong quá khứ.

**Tham số cố định:**
- Ghi mọi thay đổi trạng thái và mọi thay đổi của **ba** thuộc tính ô 1: giá trị trước, giá trị sau, người đổi (mã người dùng; ghi "hệ thống" nếu do tác vụ tự chạy), thời điểm.
- Xem được <ĐTTT> đầy đủ (trạng thái và ba thuộc tính) tại một thời điểm bất kỳ trong **12 tháng** gần nhất.
- Lịch sử không sửa, không xoá được qua ứng dụng, kể cả với quản trị viên.
- Mọi đường sửa đều vào lịch sử: giao diện, API, tác vụ theo giờ, script quản trị.

**Chỗ cần may đo:**
- Ô 1: thuộc tính của <ĐTTT> trong `diagrams/class.mmd` (chưa có thì trong mô hình ở `src/`), theo thứ tự khai báo, bỏ mã định danh và trạng thái. Chọn ba thuộc tính liên tiếp. Ít hơn ba: lấy tất cả, ghi n và sửa tham số "ba" cho đúng số đó.

**Điều nhóm phải chứng minh:** Thiết kế dữ liệu theo thời gian: ADR so ít nhất hai cách (bảng lịch sử, chuỗi sự kiện, phiên bản hoá bản ghi…); lớp nào chịu trách nhiệm ghi lịch sử để không đường sửa nào lọt; ràng buộc "không sửa được" nằm ở tầng nào.

**Kiến thức cần:** buổi 8 (thực thể, trạng thái), 10 (ánh xạ, ràng buộc ở tầng nào), 11 (ADR).

**Gợi ý bảng tác động:** mọi chỗ ghi vào <ĐTTT> (gán thuộc tính, `UPDATE`, lưu qua ORM); chỗ nào sửa thẳng cơ sở dữ liệu, không qua lớp miền; truy vấn "tại thời điểm" chạm những bảng nào.

## TD-10 · Tranh chấp suất cuối · đợt 2 · vị trí 5 (cụm 1 và 3)

**Tình huống khung:** Giờ cao điểm, hai người cùng lúc lấy <thứ có giới hạn> cuối cùng và cả hai đều thành công. Khách hàng phải xin lỗi một người. Khách yêu cầu: không bao giờ được vượt giới hạn, kể cả khi hệ thống chạy nhiều tiến trình.

**Tham số cố định:**
- **50** yêu cầu gần như cùng lúc giành **1** suất cuối: đúng **1** thành công, **49** bị từ chối với thông báo rõ; vượt giới hạn **0** lần.
- Vẫn đúng khi ứng dụng chạy **2** tiến trình song song dùng chung cơ sở dữ liệu. Không dựa vào biến hay khoá trong bộ nhớ của một tiến trình.
- Nhóm có một bài thử tái hiện được (script gửi 50 yêu cầu đồng thời), chạy trước và sau khi sửa; kết quả hai lần chạy ghi ở phần 5 của ADR.

**Chỗ cần may đo:**
- Ô 1 · luật giới hạn: các dòng BR nói về giới hạn số lượng (sức chứa, tồn kho, số suất, hạn mức, "tối đa", "không quá"), theo mã. Chọn một. Không có: dùng ràng buộc không trùng của <ĐTTT> (một <lớp liên quan> không gắn với hai <ĐTTT> trong cùng thời điểm). Vẫn không có: "mỗi <tác nhân chính> tối đa một <ĐTTT> mỗi ngày". Ghi rõ.

**Điều nhóm phải chứng minh:** Ràng buộc nằm ở tầng nào: lớp miền kiểm luật, nhưng bảo đảm cuối cùng nằm ở chỗ chịu được đồng thời (ràng buộc cơ sở dữ liệu, khoá, giao dịch); lớp miền không bị kéo chi tiết cơ sở dữ liệu vào; ADR so các phương án.

**Kiến thức cần:** buổi 7 (sequence có hai tác nhân song song), 8 (luật ở lớp nào), 10 (ràng buộc ở tầng nào), 11 (ADR).

**Gợi ý bảng tác động:** đường đi từ lúc đọc "còn bao nhiêu" tới lúc ghi; khoảng hở giữa kiểm và ghi; ràng buộc nào chỉ có trong mã mà không có trong lược đồ.

## TD-11 · Nhập dữ liệu cũ · đợt 2 · vị trí 5 (cụm 2 và 4)

**Tình huống khung:** Khách hàng có dữ liệu nhiều năm trong một bảng tính và muốn đưa vào hệ thống trước khi chạy chính thức. Dữ liệu cũ do người nhập tay nên có nhiều dòng trái luật của hệ thống mới. Không được bỏ dòng nào mà không báo, và không được nới luật cho vừa dữ liệu cũ.

**Tham số cố định:**
- Tệp CSV **5.000** dòng <ĐTTT> cũ, trong đó đúng **400** dòng (8%) trái luật: **200** dòng trái luật ô 1, **200** dòng trái luật ô 2. Nhóm tự sinh tệp giả theo đúng các con số này, không dùng dữ liệu thật.
- Dòng đúng được nhập. Mỗi dòng sai được báo: số dòng, mã luật bị trái, giá trị sai.
- Dòng nào hệ thống từ chối khi tạo qua giao diện thì cũng bị từ chối khi nhập, và ngược lại.
- Nhập lại cùng tệp lần hai không tạo bản ghi trùng.
- Nhập xong 5.000 dòng trong **5 phút** trên máy của nhóm.

**Chỗ cần may đo:**
- Ô 1 và ô 2: các dòng BR trong `docs/yeu-cau.md`, theo mã. Chọn hai luật liên tiếp (một lần băm, dùng S_1). Chỉ có một BR: ô 1 là BR đó, ô 2 là "thiếu thông tin bắt buộc". Không có BR: ô 1 là "thiếu thông tin bắt buộc", ô 2 là "trùng mã". Ghi rõ.
- Liệt kê cột của tệp CSV theo thuộc tính của <ĐTTT>.

**Điều nhóm phải chứng minh:** Luật nằm ở lớp miền nên dùng lại được cho đường vào thứ hai; ánh xạ dữ liệu ngoài vào mô hình; nhập lại không trùng; lỗi nào cơ sở dữ liệu bắt, lỗi nào lớp miền bắt và vì sao.

**Kiến thức cần:** buổi 5 (luật nghiệp vụ), 8 (lớp miền), 10 (ánh xạ, ràng buộc, dữ liệu bẩn), 11 (kiến trúc).

**Gợi ý bảng tác động:** luật ô 1, ô 2 đang được kiểm ở đâu (giao diện, controller, lớp miền, cơ sở dữ liệu); đường nhập mới đi qua những lớp nào.

## TD-12 · Tách phần thông báo · đợt 3 · vị trí 1

**Tình huống khung (nguyên văn):** Toàn bộ phần thông báo (email, tin nhắn, thông báo đẩy, hoặc bất kỳ kênh nào hệ thống đang dùng để báo cho người dùng) phải tách thành một dịch vụ độc lập: có thể tắt, thay bằng nhà cung cấp khác, hoặc chạy trên máy khác, mà không sửa một dòng nào trong phần còn lại của hệ thống. Nếu dịch vụ thông báo chết, phần còn lại vẫn hoạt động bình thường.

**Tham số cố định:**
- Tắt dịch vụ thông báo **30 phút**: mọi luồng nghiệp vụ vẫn chạy, người dùng không gặp lỗi.
- Thông báo phát sinh trong lúc tắt không mất: được gửi sau khi dịch vụ chạy lại, mỗi thông báo đúng **một** lần.
- Đổi nhà cung cấp gửi, hoặc chuyển sang bản giả ghi ra tệp: **0** dòng sửa ngoài dịch vụ thông báo, chỉ đổi cấu hình.
- Dịch vụ thông báo chạy được ở tiến trình hoặc container riêng; sơ đồ triển khai thể hiện điều này.

**Chỗ cần may đo:**
- Liệt kê mọi chỗ trong `src/` gửi thông báo (hồ sơ H9), mỗi chỗ kèm sự kiện nghiệp vụ dẫn tới nó.
- Ô 1: một sự kiện trong danh sách trên, theo thứ tự đường dẫn tệp rồi số dòng. Chọn một; tình huống nêu sự kiện này.
- Kho chưa gửi thông báo nào: phiếu ghi rõ "kho chưa có phần thông báo". Khi đó ô 1 chọn **hai** chuyển liền nhau trong danh sách chuyển của <ĐTTT> ở hồ sơ H7 (bỏ chuyển từ `[*]` và vào `[*]`); nhóm thêm thông báo cho hai sự kiện đó, làm ngay dưới dạng dịch vụ riêng; bảng tác động tính cả phần thêm.

**Điều nhóm phải chứng minh (nguyên văn):** Coupling với một mối quan tâm cắt ngang (cross-cutting concern); có dùng sự kiện, hàng đợi hay gọi trực tiếp; xử lý lỗi khi phụ thuộc ngoài không sẵn sàng.

**Kiến thức cần:** buổi 7 (thông điệp bất đồng bộ), 9 (coupling), 11 (kiến trúc), 13 (sơ đồ triển khai), 14 (pipeline cho thành phần thứ hai).

**Gợi ý bảng tác động:** mỗi lời gọi gửi thông báo nằm trong lớp nào (lớp miền, controller, dịch vụ); lớp nào biết tên nhà cung cấp; `sendEmail()` gọi thẳng từ logic nghiệp vụ thì mỗi chỗ một dòng.

## TD-13 · Hoàn tác sau khi đã hoàn tất · đợt 3 · vị trí 2

**Tình huống khung (nguyên văn):** Đối tượng trung tâm của hệ thống (<ĐTTT>, thứ mà sơ đồ trạng thái của nhóm mô tả) từ nay có thể bị huỷ hoặc hoàn tác sau khi đã ở trạng thái hoàn tất, trong một khung thời gian do quản trị viên cấu hình. Khi hoàn tác, mọi hệ quả đã xảy ra phải được đảo ngược: tồn kho trả lại, điểm thu hồi, tiền hoàn, thông báo gửi đi, số liệu thống kê điều chỉnh. Hệ thống phải ghi lại rõ ai hoàn tác và lúc nào.

**Tham số cố định:**
- Khung thời gian mặc định **7 ngày** kể từ lúc hoàn tất; quản trị viên đổi được trong khoảng **1–30 ngày** mà không phải triển khai lại. Hết khung thì bị từ chối.
- Đảo ngược **mọi** hệ quả trong danh sách của phiếu, bỏ sót **0** hệ quả. Hệ quả không đảo được (thông báo đã gửi) thì gửi thông báo đính chính.
- Mỗi <ĐTTT> hoàn tác tối đa **một** lần; đã hoàn tác thì không hoàn tất lại, không hoàn tác lại.
- Ghi mã người hoàn tác, thời điểm, lý do.

**Chỗ cần may đo:**
- Ô 1 · trạng thái hoàn tất: các trạng thái kết thúc thành công của <ĐTTT> (hồ sơ H7), theo thứ tự trên luồng. Chọn một. Chưa có trạng thái: "hoàn tất" là trạng thái cuối của luồng chính trong đặc tả. Ghi rõ.
- Liệt kê mọi hệ quả của việc vào trạng thái hoàn tất có trong kho: đoạn mã chạy khi <ĐTTT> chuyển sang trạng thái đó, lớp hoặc bảng bị đổi. Không ngẫu nhiên.
- Kho có ít hơn hai hệ quả: liệt kê hệ quả có thật, thêm "số liệu thống kê điều chỉnh" làm hệ quả bắt buộc. Ghi rõ.

**Điều nhóm phải chứng minh (nguyên văn):** Bất biến nghiệp vụ có được bảo vệ ở một chỗ không; các hệ quả có bị rải rác qua nhiều lớp không; sơ đồ trạng thái có đủ để mở rộng không.

**Kiến thức cần:** buổi 8 (sơ đồ trạng thái), 9 (bảng tác động), 10 (dữ liệu), 11 (kiến trúc), 13 (hiện thực thay đổi trên thiết kế).

**Gợi ý bảng tác động:** mỗi hệ quả một dòng: lớp nào gây ra, lớp nào phải đảo; hệ quả nào đang làm trong controller thay vì gắn với chuyển trạng thái.

## TD-14 · Thêm môi trường thử · đợt 3 · vị trí 3

**Tình huống khung:** Khách hàng không muốn thử tính năng mới trên bản đang có người dùng thật. Khách yêu cầu một môi trường thử chạy song song với môi trường thật: cùng mã, khác cấu hình, khác dữ liệu, không bao giờ gửi gì ra ngoài thật.

**Tham số cố định:**
- Hai môi trường chạy **cùng một** bản build từ cùng commit; **0** dòng mã khác nhau, khác biệt chỉ nằm ở cấu hình ngoài mã (biến môi trường, tệp cấu hình không commit).
- Môi trường thử dùng cơ sở dữ liệu riêng. Mọi dịch vụ ngoài (ô 1 và các dịch vụ khác trong danh sách) chạy ở chế độ sandbox hoặc bản giả; **0** lệnh gọi tới dịch vụ thật.
- Merge vào nhánh chính thì pipeline tự triển khai lên môi trường thử. Môi trường thật chỉ nhận bản khi người gắn thẻ phát hành. Agent không giữ khoá triển khai.
- Một lệnh tạo dữ liệu mẫu cho môi trường thử.

**Chỗ cần may đo:**
- Liệt kê dịch vụ ngoài (hồ sơ H8) và mọi giá trị cấu hình đang viết cứng trong `src/` (URL, khoá, cổng, đường dẫn), kèm tệp và dòng.
- Ô 1: một dịch vụ ngoài trong danh sách, theo thứ tự. Chọn một; tình huống nêu dịch vụ này. Kho không gọi dịch vụ ngoài nào: phiếu ghi rõ; hai thứ phải khác giữa hai môi trường là cơ sở dữ liệu và URL.

**Điều nhóm phải chứng minh:** Cấu hình tách khỏi mã; phụ thuộc hạ tầng được đưa vào từ ngoài chứ không tạo thẳng trong lớp nghiệp vụ; sơ đồ triển khai có hai môi trường; pipeline có cổng trước môi trường thật; ba quy tắc agent vẫn giữ.

**Kiến thức cần:** buổi 11 (kiến trúc), 13 (sơ đồ triển khai), 14 (CI/CD, phát hành).

**Gợi ý bảng tác động:** mỗi giá trị viết cứng một dòng; lớp nào tự tạo kết nối cơ sở dữ liệu hay client của dịch vụ ngoài; workflow nào phải sửa.

## TD-15 · Bên thứ ba qua API · đợt 3 · vị trí 4

**Tình huống khung (nguyên văn):** Từ nay hệ thống phải cho phép một bên thứ ba (đối tác, cơ quan quản lý, hoặc hệ thống bên ngoài, nhóm tự chọn cho phù hợp với đề tài) truy cập vào một phần dữ liệu của hệ thống qua giao diện lập trình, với quyền hạn khác người dùng thường: đọc được một số thứ người dùng không đọc được, nhưng không được làm một số việc người dùng làm được. Bên thứ ba phải xác thực bằng cơ chế riêng, không dùng chung tài khoản người dùng.

**Tham số cố định:**
- Bên thứ ba đọc được đúng **hai** loại dữ liệu ô 1 trên toàn hệ thống (của mọi người dùng), thứ mà <tác nhân chính> không đọc được.
- Bên thứ ba **không** làm được use case ô 2: gọi thẳng đường API của việc đó phải nhận lỗi từ chối quyền (HTTP 403).
- Ngoài hai điều trên, bên thứ ba chỉ đọc: không thêm, sửa, xoá gì.
- Xác thực bằng khoá API hoặc token riêng cho từng bên thứ ba; thu hồi có hiệu lực trong **1 phút**, không phải triển khai lại.
- Tối đa **100** lệnh gọi mỗi phút cho mỗi bên thứ ba. Mỗi lệnh gọi ghi nhật ký: bên nào, lúc nào, đọc gì.

**Chỗ cần may đo:**
- Ô 1: hai mục liên tiếp trong danh sách cố định (n = 4):
  1. chi tiết từng <ĐTTT>, đã bỏ các trường dữ liệu cá nhân;
  2. số liệu tổng hợp theo ngày của <ĐTTT> (số lượng theo từng trạng thái);
  3. lịch sử chuyển trạng thái của <ĐTTT>;
  4. các <ĐTTT> đã bị huỷ hoặc từ chối, kèm lý do.
- Ô 2: các use case của <tác nhân chính> có ghi dữ liệu (tạo, đặt, gửi, sửa, huỷ, thanh toán, xoá…), theo thứ tự trong hồ sơ. Chọn một.
- Tên bên thứ ba: gợi ý theo đề tài.

**Điều nhóm phải chứng minh (nguyên văn):** Thiết kế phân quyền có mở rộng được không, hay đang cứng bằng if/else theo vai trò; ranh giới API có tách khỏi giao diện không.

**Kiến thức cần:** buổi 6 (tác nhân), 9 (bảng tác động), 10 (dữ liệu), 11 (ranh giới kiến trúc), 12 (API là một giao diện), 13 (triển khai), 14 (pipeline).

**Gợi ý bảng tác động:** mọi chỗ kiểm vai; logic nghiệp vụ nào nằm trong controller của giao diện web (phải chép lại cho API); lớp nào biết "người gọi là ai".

## TD-16 · Thêm tiếng Anh · đợt 3 · vị trí 5

**Tình huống khung:** Khách hàng sắp phục vụ cả người nước ngoài. Toàn bộ giao diện phải có thêm tiếng Anh; người dùng tự chọn và hệ thống nhớ lựa chọn. Thông báo lỗi khi vi phạm luật nghiệp vụ cũng phải đúng ngôn ngữ đã chọn; tiền và ngày giờ hiển thị theo cách quen của ngôn ngữ đó.

**Tham số cố định:**
- Hai ngôn ngữ: tiếng Việt (mặc định) và tiếng Anh. **100%** chuỗi người dùng thấy trên các màn hình của luồng chính (danh sách trong phiếu) có bản tiếng Anh.
- **Mọi** thông báo lỗi do luật BR sinh ra hiện đúng ngôn ngữ đã chọn; nội dung luật không đổi.
- Lựa chọn ngôn ngữ được nhớ cho lần đăng nhập sau. Đổi ngôn ngữ giữa chừng không mất dữ liệu đang nhập.
- Ngày và tiền hiển thị theo ngôn ngữ (tiếng Việt: 31/12/2026, 1.250.000 ₫; tiếng Anh: 12/31/2026 hoặc Dec 31, 2026, VND 1,250,000). Giá trị lưu trong cơ sở dữ liệu không đổi.
- Thuộc tính `lang` của trang đổi theo ngôn ngữ đang hiển thị (WCAG 2.2, tiêu chí 3.1.1).
- Phần 5 của ADR ghi số tệp phải sửa nếu thêm ngôn ngữ thứ ba.

**Chỗ cần may đo:**
- Liệt kê màn hình của luồng chính (theo đặc tả use case chính và route trong `src/`) và mọi chỗ sinh thông báo lỗi của luật BR, kèm tệp và dòng.
- Ô 1: các dòng BR, theo mã. Chọn một; tình huống nêu thông báo lỗi của luật này làm ví dụ. Không có BR: lấy thông báo lỗi đầu tiên tìm thấy trong `src/` theo thứ tự đường dẫn tệp.

**Điều nhóm phải chứng minh:** Lớp miền không giữ câu chữ hiển thị (báo lỗi bằng mã hoặc kiểu lỗi, tầng giao diện chuyển thành câu); định dạng là việc của tầng trình bày; thành phần giao diện dùng chung; đếm được số tệp phải sửa khi thêm ngôn ngữ thứ ba.

**Kiến thức cần:** buổi 8 (lớp miền), 11 (phân tầng), 12 (giao diện và tiếp cận), 14 (kiểm trong pipeline).

**Gợi ý bảng tác động:** mỗi chỗ câu tiếng Việt nằm trong lớp miền hay controller một dòng; chỗ định dạng tiền, ngày; thành phần giao diện nào lặp lại ở nhiều màn hình.
