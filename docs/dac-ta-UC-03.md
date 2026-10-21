# Đặc tả use case — UC-03 Duyệt hồ sơ giáo viên

Phụ trách: N12-C

|                                |                                                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tác nhân chính**             | Quản trị viên                                                                                                                                                             |
| **Tác nhân phụ**               | Keycloak, Dịch vụ email                                                                                                                                                   |
| **Điều kiện trước**            | Quản trị viên đã đăng nhập. Có ít nhất một hồ sơ giáo viên ở trạng thái Pending do người dùng nộp qua UC-09. Người nộp chưa có quyền giáo viên.                           |
| **Điều kiện sau (thành công)** | Hồ sơ ở trạng thái Approved, lưu người duyệt và thời điểm. Tài khoản người nộp có vai trò giáo viên trên Keycloak và tạo được khóa học. Người nộp nhận email báo kết quả. |
| **Truy vết**                   | FR-14, FR-21, FR-22                                                                                                                                                       |

## Luồng chính

| Bước | Tác nhân làm                                          | Hệ thống đáp                                                                                                              |
| ---- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1    | Quản trị viên mở danh sách hồ sơ giáo viên chờ duyệt. | Liệt kê các hồ sơ Pending, hồ sơ nộp sớm nhất đứng đầu.                                                                   |
| 2    | Quản trị viên chọn một hồ sơ.                         | Hiện chuyên môn, phần giới thiệu, đường dẫn minh chứng, tệp CV, và các lần nộp trước của cùng người kèm lý do bị từ chối. |
| 3    | Quản trị viên bấm "Duyệt".                            | Nhờ Keycloak gán vai trò giáo viên cho tài khoản người nộp.                                                               |
| 4    |                                                       | Keycloak xác nhận đã gán. Hệ thống chuyển hồ sơ sang Approved, lưu người duyệt và thời điểm, ghi nhật ký.                 |
| 5    |                                                       | Nhờ Dịch vụ email gửi thư báo kết quả cho người nộp. Báo Quản trị viên: "Đã duyệt hồ sơ giáo viên."                       |

## Luồng thay thế

**1a.** Không có hồ sơ nào chờ duyệt.

- 1a.1. Hệ thống báo: "Không có hồ sơ giáo viên nào đang chờ duyệt."
- 1a.2. Kết thúc use case.

**3a.** Quản trị viên quyết định từ chối.

- 3a.1. Quản trị viên nhập lý do và bấm "Từ chối".
- 3a.2. Hệ thống chuyển hồ sơ sang Rejected, lưu lý do, người duyệt và thời điểm. Không gọi Keycloak.
- 3a.3. Quay về bước 5, thư gửi người nộp kèm lý do từ chối. Người nộp sửa và nộp lại thành một hồ sơ Pending mới qua UC-09.

## Luồng lỗi

**3e.** Quản trị viên bấm "Từ chối" mà để trống lý do.

- 3e.1. Hệ thống báo: "Phải nhập lý do khi từ chối hồ sơ giáo viên." Trạng thái hồ sơ không đổi.
- 3e.2. Kết thúc use case, điều kiện sau **không** đạt.

**3f.** Hồ sơ đã được một quản trị viên khác xử lý trong lúc đang xem.

- 3f.1. Hệ thống báo: "Hồ sơ này đã được quản trị viên khác xử lý." và tải lại danh sách.
- 3f.2. Kết thúc use case, điều kiện sau **không** đạt.

**4e.** Keycloak không phản hồi hoặc báo lỗi khi gán vai trò.

- 4e.1. Hệ thống báo: "Chưa cấp được quyền giáo viên do lỗi hệ thống xác thực. Hồ sơ vẫn đang chờ, hãy thử lại sau." Hồ sơ vẫn Pending, không chuyển Approved.
- 4e.2. Kết thúc use case, điều kiện sau **không** đạt.

**5e.** Dịch vụ email không gửi được thư.

- 5e.1. Hệ thống báo: "Đã xử lý hồ sơ, nhưng chưa gửi được email cho người nộp." Kết quả duyệt vẫn giữ nguyên; thư chưa gửi được ghi lại để gửi lại.
- 5e.2. Kết thúc use case, điều kiện sau **không** đạt.

## Ràng buộc liên quan

BR-09: Không được từ chối hoặc đình chỉ khóa học, hoặc từ chối hồ sơ giáo viên, khi chưa có lý do. Bảo vệ tại luồng 3e.

BR-13: Tài khoản giáo viên chưa được Quản trị viên duyệt hồ sơ không được tạo khóa học, sửa khóa học hay tải video lên. Bảo vệ tại bước 3–4 và luồng 4e: hồ sơ chỉ chuyển Approved sau khi Keycloak đã gán vai trò, nên không có hồ sơ Approved mà tài khoản vẫn thiếu quyền.
