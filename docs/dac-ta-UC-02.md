# Đặc tả use case — UC-02 Duyệt khóa học

Phụ trách: N12-A

|                                |                                                                                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tác nhân chính**             | Quản trị viên                                                                                                                                                                   |
| **Tác nhân phụ**               | Dịch vụ email                                                                                                                                                                   |
| **Điều kiện trước**            | Quản trị viên đã đăng nhập. Có ít nhất một bản khóa học ở trạng thái Pending do giáo viên gửi qua UC-11: bản đầu của một khóa mới, hoặc bản sửa của một khóa đã Published.      |
| **Điều kiện sau (thành công)** | Bản được duyệt trở thành bản học viên đang thấy, khóa học ở trạng thái Published. Với bản sửa, học viên đang học không mất bài đã hoàn thành. Giáo viên nhận email báo kết quả. |
| **Truy vết**                   | FR-12, FR-13, FR-14, FR-16                                                                                                                                                      |

## Luồng chính

| Bước | Tác nhân làm                                   | Hệ thống đáp                                                                                                                                                                                         |
| ---- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Quản trị viên mở danh sách khóa học chờ duyệt. | Liệt kê các bản Pending, bản gửi sớm nhất đứng đầu. Mỗi dòng ghi tên khóa, mã giáo viên, và đây là bản đầu hay bản sửa.                                                                              |
| 2    | Quản trị viên chọn một bản.                    | Hiện toàn bộ nội dung của bản: thông tin khóa, từng bài học kèm video và bài kiểm tra kèm đáp án. Với bản sửa, đánh dấu bài nào được thêm, sửa hay xoá so với bản đang phát hành.                    |
| 3    | Quản trị viên xem xong, bấm "Phát hành".       | Đặt bản này làm bản đang phát hành của khóa, khóa chuyển sang Published. Bản phát hành trước đó, nếu có, thôi hiệu lực.                                                                              |
| 4    |                                                | Với bản sửa: chuyển tiến độ của từng học viên đang học sang bản mới. Bài đã hoàn thành ở bản cũ vẫn tính hoàn thành ở bài tương ứng của bản mới; phần trăm hoàn thành tính lại theo tổng số bài mới. |
| 5    |                                                | Ghi nhật ký người duyệt, thời điểm, trạng thái trước và sau. Nhờ Dịch vụ email gửi thư báo giáo viên. Báo Quản trị viên: "Đã phát hành khóa học."                                                    |

## Luồng thay thế

**1a.** Không có bản nào chờ duyệt.

- 1a.1. Hệ thống báo: "Không có khóa học nào đang chờ duyệt."
- 1a.2. Kết thúc use case.

**3a.** Quản trị viên quyết định từ chối.

- 3a.1. Quản trị viên nhập lý do và bấm "Từ chối".
- 3a.2. Hệ thống chuyển bản sang Rejected và lưu lý do. Nếu là bản đầu của khóa mới: khóa chuyển sang Rejected. Nếu là bản sửa của khóa đã Published: khóa vẫn Published với bản cũ, học viên không thấy gì thay đổi.
- 3a.3. Quay về bước 5, thư gửi giáo viên kèm lý do từ chối. Giáo viên sửa bản bị từ chối rồi gửi lại qua UC-11.

## Luồng lỗi

**3e.** Quản trị viên bấm "Từ chối" mà để trống lý do.

- 3e.1. Hệ thống báo: "Phải nhập lý do khi từ chối khóa học." Trạng thái bản và khóa không đổi.
- 3e.2. Kết thúc use case, điều kiện sau **không** đạt.

**3f.** Bản đã được một quản trị viên khác xử lý trong lúc đang xem.

- 3f.1. Hệ thống báo: "Bản này đã được quản trị viên khác xử lý." và tải lại danh sách.
- 3f.2. Kết thúc use case, điều kiện sau **không** đạt.

**5e.** Dịch vụ email không gửi được thư.

- 5e.1. Hệ thống báo: "Đã xử lý khóa học, nhưng chưa gửi được email cho giáo viên." Kết quả duyệt vẫn giữ nguyên; thư chưa gửi được ghi lại để gửi lại.
- 5e.2. Kết thúc use case, điều kiện sau **không** đạt.

## Ràng buộc liên quan

BR-02: Khóa học không ở trạng thái Published thì không được hiển thị trong kết quả tìm kiếm của học viên, không được chatbot gợi ý, và không nhận đăng ký mới. Bảo vệ tại bước 3.

BR-04: Giáo viên không được sửa nội dung khóa học trong lúc khóa đang Pending, để Quản trị viên không duyệt nhầm một bản khác với bản đang xem. Bảo vệ ở điều kiện trước: bản Pending không sửa được trong suốt bước 1–3.

BR-05: Bản chỉnh sửa của khóa học đã Published không được hiển thị cho học viên trước khi Quản trị viên duyệt. Bảo vệ tại bước 3 và luồng 3a.

BR-09: Không được từ chối hoặc đình chỉ khóa học, hoặc từ chối hồ sơ giáo viên, khi chưa có lý do. Bảo vệ tại luồng 3e.

BR-11: Khi bản sửa của khóa học được duyệt, học viên không được mất những bài đã hoàn thành; chỉ tổng số bài và phần trăm hoàn thành được tính lại. Bảo vệ tại bước 4.
