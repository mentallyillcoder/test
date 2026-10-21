# Đặc tả use case — UC-01 Học bài và làm bài kiểm tra

Phụ trách: N12-B

|                                |                                                                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tác nhân chính**             | Học viên                                                                                                                                                      |
| **Tác nhân phụ**               | Không có                                                                                                                                                      |
| **Điều kiện trước**            | Học viên đã đăng nhập, tài khoản không bị khóa. Học viên đã đăng ký khóa học. Khóa học đang Published. Bài học được chọn đã được mở cho học viên.             |
| **Điều kiện sau (thành công)** | Lượt làm bài được lưu kèm từng câu trả lời. Nếu đạt: bài hiện tại được đánh dấu hoàn thành, bài kế tiếp được mở, phần trăm hoàn thành của khóa được tính lại. |
| **Truy vết**                   | FR-04, FR-05, FR-06, FR-20                                                                                                                                    |

## Luồng chính

| Bước | Tác nhân làm                                           | Hệ thống đáp                                                                                                                                                                 |
| ---- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Học viên chọn một bài đang mở trong lộ trình khóa học. | Kiểm khóa học còn Published và bài đã được mở. Cấp đường dẫn video có thời hạn tối đa 60 phút, phát video từ vị trí học viên dừng lần trước.                                 |
| 2    | Học viên xem video.                                    | Định kỳ ghi lại vị trí xem xa nhất và tính phần trăm đã xem. Đoạn tua qua mà chưa xem không được tính.                                                                       |
| 3    | Học viên bấm "Làm bài kiểm tra".                       | Kiểm học viên đã xem ít nhất 90% video. Tạo một lượt làm bài, ghi lại điểm tối thiểu hiện tại của bài kiểm tra, hiện câu hỏi (trắc nghiệm, đúng/sai, điền từ, trả lời ngắn). |
| 4    | Học viên trả lời các câu hỏi và bấm "Nộp bài".         | Chấm từng câu ở máy chủ, lưu từng câu trả lời kèm đúng hay sai, tính điểm theo phần trăm.                                                                                    |
| 5    | Học viên xem kết quả.                                  | Điểm đạt điểm tối thiểu: đánh dấu bài hoàn thành, mở bài kế tiếp, tính lại phần trăm hoàn thành của khóa. Hiện điểm, điểm tối thiểu, các câu sai và nút "Học bài tiếp theo". |

## Luồng thay thế

**1a.** Học viên quay lại khi đang có một lượt làm bài chưa nộp của bài này.

- 1a.1. Hệ thống hiện lại lượt làm bài đó với đúng thứ tự câu hỏi như lần trước.
- 1a.2. Quay về bước 4.

**3a.** Học viên chưa xem đủ 90% video.

- 3a.1. Hệ thống báo: "Bạn cần xem ít nhất 90% video (hiện đã xem X%) trước khi làm bài kiểm tra." Không tạo lượt làm bài.
- 3a.2. Quay về bước 2.

**4a.** Máy chủ nhận lại lần nộp của một lượt đã chấm (học viên bấm nộp hai lần, hoặc bấm thử lại khi lần trước thực ra đã tới).

- 4a.1. Hệ thống không chấm lại, không tạo lượt mới, trả về đúng kết quả của lượt đó.
- 4a.2. Quay về bước 5.

**5a.** Điểm chưa đạt điểm tối thiểu.

- 5a.1. Hệ thống hiện điểm, điểm tối thiểu và các câu sai. Bài kế tiếp vẫn khóa.
- 5a.2. Học viên chọn "Làm lại": quay về bước 3 với một lượt làm bài mới. Hoặc chọn "Xem lại video": quay về bước 2.

**5b.** Bài vừa đạt là bài cuối của khóa.

- 5b.1. Hệ thống đánh dấu khóa học hoàn thành (100%), không mở thêm bài nào.
- 5b.2. Kết thúc use case.

## Luồng lỗi

**1e.** Khóa học đang bị Suspended.

- 1e.1. Hệ thống báo: "Khóa học đang tạm đình chỉ, bạn chưa học tiếp được. Tiến độ của bạn vẫn được giữ."
- 1e.2. Kết thúc use case, điều kiện sau **không** đạt.

**1f.** Học viên mở một bài đang khóa (gọi thẳng đường dẫn hoặc API).

- 1f.1. Hệ thống báo: "Bài học đang bị khóa. Hãy hoàn thành bài trước để mở khóa." Không cấp đường dẫn video.
- 1f.2. Kết thúc use case, điều kiện sau **không** đạt.

**4e.** Mất mạng hoặc máy chủ không phản hồi khi nộp bài.

- 4e.1. Hệ thống báo: "Chưa nộp được bài. Câu trả lời của bạn vẫn được giữ, bấm Thử lại." Trình duyệt giữ nguyên câu trả lời.
- 4e.2. Kết thúc use case, điều kiện sau **không** đạt. Học viên bấm "Thử lại" thì bắt đầu lại từ bước 4 với đúng lượt làm bài đó.

## Ràng buộc liên quan

BR-01: Học viên không được mở bài học tiếp theo khi chưa xem ít nhất 90% video **và** chưa đạt điểm tối thiểu của bài kiểm tra bài hiện tại. Bảo vệ tại bước 3, bước 5 và luồng 1f.

BR-06: Khóa học bị Suspended thì học viên không được học tiếp, nhưng tiến độ đã có không được mất. Bảo vệ tại bước 1, luồng 1e.

BR-12: Một lần nộp bài kiểm tra không được ghi thành hai lượt làm bài, kể cả khi học viên bấm nộp lại vì lỗi mạng. Bảo vệ tại bước 4, luồng 4a và 4e.
