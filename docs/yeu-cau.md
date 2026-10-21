# Yêu cầu — Nền tảng E-learning tích hợp Flashcard (EduRecall)

Mô tả ngắn: Giáo viên tạo khóa học gồm nhiều bài học có thứ tự, mỗi bài gồm video và bài kiểm tra. Học viên phải xem video và làm đạt bài kiểm tra mới mở được bài tiếp theo. Học viên có thêm khu flashcard cá nhân để tự ôn (giống Quizlet). Khóa học phải qua Quản trị viên kiểm duyệt trước khi phát hành. Tài khoản giáo viên cũng phải được Quản trị viên duyệt hồ sơ trước khi được tạo khóa học. Hiện tại mọi khóa học đều miễn phí.

Vòng đời khóa học: `Draft → Pending → Published ⇄ Suspended`, `Pending → Rejected → (sửa) → Pending`.

Vòng đời hồ sơ giáo viên: `Pending → Approved`, `Pending → Rejected → (sửa) → Pending`.

## Tác nhân

| Tác nhân | Là ai | Muốn gì từ hệ thống |
|---|---|---|
| Học viên | Người dùng tự đăng ký tài khoản, sau đó chọn vai trò Học viên và dùng được ngay | Tìm được khóa học hợp với mình, học hết theo đúng lộ trình, tự ôn bằng flashcard riêng và biết mình đã học được bao nhiêu. |
| Giáo viên | Người dùng tự đăng ký tài khoản, sau đó chọn vai trò Giáo viên và chờ Quản trị viên duyệt hồ sơ | Đưa được khóa học của mình lên cho học viên học và biết bài giảng nào đang quá khó. |
| Quản trị viên | Người vận hành hệ thống, tài khoản do hệ thống cấp sẵn | Chỉ những khóa học và giáo viên đạt chất lượng mới đến được tay học viên, và xử lý được khóa học hoặc tài khoản vi phạm. |
| Keycloak | Hệ thống bên ngoài, quản lý danh tính | Nhận yêu cầu đăng ký, đăng nhập, quên mật khẩu và trả về token xác thực cho frontend và backend. |
| Dịch vụ email | Hệ thống bên ngoài, gửi thư | Nhận nội dung từ hệ thống để gửi email quên mật khẩu, thông báo kết quả duyệt khóa học và kết quả duyệt hồ sơ giáo viên. |
| Dịch vụ LLM | Hệ thống bên ngoài, mô hình ngôn ngữ | Nhận câu hỏi của học viên cùng danh sách khóa học do backend cung cấp, rồi sinh câu trả lời gợi ý khóa học. |

Ghi chú:

- **Dịch vụ lưu trữ (Supabase)** không được tính là tác nhân. Nhóm coi nó là hạ tầng lưu video và ảnh, cùng loại với cơ sở dữ liệu, nên nó xuất hiện ở NFR-02, NFR-04 và NFR-09.
- **Tác nhân Thời gian:** hiện chưa có việc nào tự chạy theo giờ. Nhóm đã xét qua và quyết định không đưa vào.
- **Keycloak** không có dòng FR riêng, vì đăng nhập, đăng ký và quên mật khẩu chỉ là bước làm, không phải việc người dùng muốn làm xong.
- **Chọn vai trò và hồ sơ giáo viên** diễn ra trong hệ thống, không diễn ra trên Keycloak. Keycloak chỉ giữ thông tin đăng nhập cơ bản (email, mật khẩu, tên); hồ sơ giáo viên (chuyên môn, kinh nghiệm, CV) do hệ thống lưu để Quản trị viên duyệt. Quyền giáo viên chỉ được cấp trên Keycloak sau khi hồ sơ được duyệt.

## Yêu cầu chức năng

| # | Tác nhân | Muốn | Để | Ai làm |
|---|---|---|---|---|
| FR-01 | Học viên | Tìm kiếm và xem thông tin các khóa học đã phát hành (mô tả, danh sách bài, giáo viên, số học viên) | Chọn được khóa phù hợp | Người: nhập từ khóa, lọc theo danh mục · Phần mềm: chỉ trả về khóa đang Published |
| FR-02 | Học viên, Dịch vụ LLM | Mô tả nhu cầu học của mình cho chatbot | Nhận gợi ý những khóa học có sẵn trên hệ thống phù hợp với mình | Người: nhập nhu cầu · Phần mềm: gửi câu hỏi kèm danh sách khóa Published cho LLM, lọc bỏ khóa không có thật · LLM: sinh câu trả lời |
| FR-03 | Học viên | Đăng ký tham gia một khóa học | Bắt đầu học theo lộ trình của khóa đó | Người: bấm đăng ký · Phần mềm: chặn đăng ký trùng, mở bài 1, khóa các bài sau |
| FR-04 | Học viên | Xem video bài giảng của bài học hiện tại | Nắm kiến thức trước khi làm kiểm tra | Người: xem video · Phần mềm: cấp đường dẫn video có thời hạn, ghi lại phần trăm đã xem |
| FR-05 | Học viên | Làm bài kiểm tra của bài học (trắc nghiệm, đúng/sai, điền từ, trả lời ngắn), biết điểm ngay, biết câu nào sai và điểm tối thiểu cần đạt, được làm lại nếu chưa đạt | Ôn đúng phần mình chưa hiểu rồi mở khóa bài học tiếp theo | Người: trả lời câu hỏi · Phần mềm: chấm điểm, chỉ ra câu sai, mở bài tiếp khi đã xem ≥ 90% video và đạt điểm tối thiểu |
| FR-06 | Học viên | Xem phần trăm hoàn thành và điểm các bài kiểm tra của từng khóa đang học | Biết mình còn thiếu gì | Người: mở trang tiến độ · Phần mềm: tính phần trăm số bài đã qua |
| FR-07 | Học viên | Tự tạo và chỉnh sửa các bộ flashcard của riêng mình | Ghi lại từ vựng và kiến thức cần ôn | Người: nhập thuật ngữ và định nghĩa · Phần mềm: lưu bộ thẻ, chỉ cho chủ sở hữu xem |
| FR-08 | Học viên | Ôn bộ flashcard bằng cách lật thẻ, hoặc tự tạo bài kiểm tra từ bộ thẻ (chọn số câu, trả lời bằng thuật ngữ hay định nghĩa, chọn dạng đúng/sai, trắc nghiệm, ghép thẻ, tự luận) | Kiểm tra mình đã nhớ được bao nhiêu | Người: chọn số câu, kiểu trả lời, dạng câu hỏi · Phần mềm: sinh câu hỏi từ bộ thẻ và chấm điểm |
| FR-09 | Học viên | Báo cáo một khóa học có nội dung lỗi hoặc chất lượng kém, kèm lý do | Quản trị viên xem xét | Người: chọn khóa học, ghi lý do · Phần mềm: đưa báo cáo vào hàng chờ của Quản trị viên |
| FR-10 | Giáo viên | Tạo khóa học, thêm bài học, tải video lên và sắp xếp thứ tự bài học | Dựng được lộ trình học cho khóa | Người: nhập thông tin, tải video, sắp thứ tự · Phần mềm: lưu video vào kho lưu trữ, lưu thứ tự bài |
| FR-11 | Giáo viên | Soạn bài kiểm tra cho từng bài học với 4 dạng câu hỏi (trắc nghiệm, đúng/sai, điền từ, trả lời ngắn) và đặt điểm tối thiểu để qua bài | Đảm bảo học viên nắm bài rồi mới học tiếp | Người: soạn câu hỏi, đáp án, điểm tối thiểu · Phần mềm: lưu câu hỏi theo từng bài học |
| FR-12 | Giáo viên | Gửi khóa học đi duyệt, và khi bị từ chối hoặc đình chỉ thì xem được lý do, sửa rồi gửi lại | Khóa học được phát hành | Người: gửi duyệt, sửa nội dung · Phần mềm: chặn gửi khi thiếu video hoặc bài kiểm tra, khóa chỉnh sửa khi đang Pending, chuyển trạng thái |
| FR-13 | Giáo viên | Chỉnh sửa khóa học đã phát hành và gửi bản sửa đi duyệt lại, trong lúc đó học viên vẫn học trên bản cũ | Cập nhật nội dung mà không làm gián đoạn việc học | Người: sửa nội dung · Phần mềm: lưu bản sửa riêng, giữ bản cũ cho học viên đến khi bản sửa được duyệt |
| FR-14 | Giáo viên, Dịch vụ email | Nhận email khi khóa học của mình được duyệt, bị từ chối hoặc bị đình chỉ, và khi hồ sơ giáo viên được duyệt hoặc bị từ chối | Xử lý kịp thời | Người: không cần thao tác · Phần mềm: soạn nội dung khi trạng thái khóa hoặc hồ sơ thay đổi · Dịch vụ email: gửi thư |
| FR-15 | Giáo viên | Xem số học viên đăng ký, tỷ lệ hoàn thành trung bình, tỷ lệ đạt và số lần làm lại trung bình của từng bài kiểm tra | Biết bài giảng nào quá khó | Người: mở trang thống kê · Phần mềm: tổng hợp số liệu từ kết quả học |
| FR-16 | Quản trị viên | Xem nội dung (video, bài kiểm tra) của khóa học đang chờ duyệt rồi phát hành hoặc từ chối kèm lý do | Chỉ khóa đạt chất lượng mới đến được học viên | Người: xem nội dung, quyết định, ghi lý do · Phần mềm: bắt buộc có lý do khi từ chối, chuyển trạng thái, báo cho giáo viên |
| FR-17 | Quản trị viên | Xem các báo cáo của học viên, bỏ qua báo cáo không hợp lệ hoặc đình chỉ khóa học kèm lý do, và khôi phục khóa sau khi giáo viên đã sửa | Xử lý khóa vi phạm | Người: xem báo cáo, quyết định · Phần mềm: chặn học viên học tiếp khóa bị đình chỉ nhưng giữ tiến độ |
| FR-18 | Quản trị viên | Khóa hoặc mở khóa tài khoản học viên và giáo viên | Ngăn người dùng vi phạm | Người: chọn tài khoản, khóa hoặc mở · Phần mềm: vô hiệu hóa tài khoản trên Keycloak |
| FR-19 | Quản trị viên | Thêm, sửa, xóa danh mục khóa học | Học viên tìm khóa học dễ hơn | Người: quản lý danh sách danh mục · Phần mềm: cập nhật bộ lọc tìm kiếm |
| FR-20 | Học viên | Biết rõ bài kiểm tra đã nộp thành công hay chưa, và nộp lại được khi mạng lỗi mà không phải làm lại từ đầu | Không mất câu trả lời đã làm | Người: bấm nộp, bấm thử lại khi được báo lỗi · Phần mềm: giữ câu trả lời trên trình duyệt đến khi máy chủ xác nhận, nhận một lần nộp đúng một lần dù gửi lại |
| FR-21 | Giáo viên | Gửi hồ sơ giáo viên (chuyên môn, kinh nghiệm giảng dạy, đường dẫn hoặc tệp CV) sau khi đăng ký, xem trạng thái hồ sơ và lý do nếu bị từ chối, sửa rồi nộp lại | Được cấp quyền tạo khóa học | Người: điền hồ sơ, tải CV · Phần mềm: lưu hồ sơ ở trạng thái chờ duyệt, chặn nộp hồ sơ mới khi đang có hồ sơ chờ duyệt |
| FR-22 | Quản trị viên | Xem các hồ sơ giáo viên đang chờ rồi duyệt hoặc từ chối kèm lý do | Chỉ người đủ chuyên môn mới được đưa nội dung lên hệ thống | Người: xem hồ sơ, quyết định, ghi lý do · Phần mềm: báo cho Quản trị viên khi có hồ sơ mới, bắt buộc có lý do khi từ chối, cấp quyền giáo viên trên Keycloak khi duyệt |

## Yêu cầu phi chức năng

**Giả định dùng để đặt số:** Nhóm chưa có số liệu thật nên đặt giả định sau, và sẽ đo lại ở tuần 13:

- Hệ thống có 1.000 học viên, 50 giáo viên và 200 khóa học.
- Giờ cao điểm (20h–22h) có khoảng 10% học viên online cùng lúc, tức 100 người. Trong đó khoảng 20%, tức 20 người, dùng chatbot.
- Mỗi video bài giảng dài 5–20 phút, độ phân giải 720p, nặng không quá 500 MB.

| # | Chỉ số | Ngưỡng | Điều kiện đo | Cách đo | Ảnh hưởng tới thiết kế nào |
|---|---|---|---|---|---|
| NFR-01 | Thời gian nộp bài kiểm tra và nhận điểm | ≤ 1 giây ở phân vị 95 | 100 học viên nộp bài cùng lúc | k6 trên bản deploy | Chấm điểm ngay ở backend; đánh chỉ mục bảng kết quả theo học viên và bài học |
| NFR-02 | Thời gian video bắt đầu phát kể từ lúc bấm phát | ≤ 4 giây ở phân vị 95 | Video 720p, mạng giả lập "Fast 4G" | Chrome DevTools, tab Network, đo 20 lần | Trình duyệt tải video thẳng từ kho lưu trữ qua đường dẫn có thời hạn, không đi qua backend |
| NFR-03 | Thời gian chatbot trả lời xong | ≤ 8 giây ở phân vị 95 | 20 người chat cùng lúc | k6 trên bản deploy | Chỉ gửi cho LLM danh sách khóa rút gọn (tên, mô tả ngắn); đặt thời gian chờ tối đa khi gọi LLM |
| NFR-04 | Thời hạn đường dẫn video và tỷ lệ chặn truy cập trái phép | Đường dẫn hết hạn sau ≤ 60 phút; người chưa đăng ký khóa bị từ chối 30/30 lần | Người chưa đăng ký khóa gọi API lấy đường dẫn; dùng lại đường dẫn cũ sau 60 phút | Script gọi API | Kho lưu trữ để chế độ riêng tư; backend kiểm tra quyền đăng ký trước khi cấp đường dẫn |
| NFR-05 | Tỷ lệ khóa học được gợi ý là khóa có thật và đang Published | 100% trên 50 câu hỏi | Bộ 50 câu hỏi mẫu do nhóm soạn | Script đối chiếu mã khóa học trong câu trả lời với cơ sở dữ liệu | Backend lọc kết quả của LLM theo mã khóa có trong cơ sở dữ liệu trước khi trả về |
| NFR-06 | Số bước từ trang chủ đến lúc bắt đầu xem bài học đầu tiên | ≤ 5 bước, ít nhất 4/5 người đạt | Học viên mới dùng lần đầu, không ai hướng dẫn, không tính form đăng ký | Cho 5 bạn ngoài nhóm dùng thử | Đặt nút "Đăng ký khóa học" và "Vào học" ngay trên trang chi tiết khóa |
| NFR-07 | Điểm Accessibility của 5 trang chính (trang chủ, chi tiết khóa, học bài, làm kiểm tra, flashcard) | ≥ 90/100 điểm ở cả 5 trang | Bản deploy, Chrome máy tính, mỗi trang đo 3 lần và lấy lần thấp nhất | Lighthouse | Dùng thẻ HTML đúng ngữ nghĩa, có chữ thay thế cho ảnh, độ tương phản màu đủ |
| NFR-08 | Thời gian khôi phục và lượng dữ liệu bị mất sau sự cố | Khôi phục ≤ 30 phút; mất ≤ 24 giờ dữ liệu | Giả lập mất cơ sở dữ liệu trên môi trường thử | Diễn tập khôi phục 1 lần từ bản sao lưu | Sao lưu cơ sở dữ liệu tự động mỗi ngày; có sẵn script khôi phục |
| NFR-09 | Tỷ lệ tải video lên thành công | ≥ 19/20 lần với video 500 MB | Mạng 20 Mbps | Tải thử 20 lần trên bản deploy | Trình duyệt tải thẳng lên kho lưu trữ, không đi qua backend; giới hạn dung lượng 500 MB |

## Ràng buộc nghiệp vụ — điều KHÔNG được phép xảy ra

| # | Ràng buộc | Ai chịu trách nhiệm bảo vệ (lớp nào, điền ở Gói 4) |
|---|---|---|
| BR-01 | Học viên không được mở bài học tiếp theo khi chưa xem ít nhất 90% video **và** chưa đạt điểm tối thiểu của bài kiểm tra bài hiện tại. | |
| BR-02 | Khóa học không ở trạng thái Published thì không được hiển thị trong kết quả tìm kiếm của học viên, không được chatbot gợi ý, và không nhận đăng ký mới. | |
| BR-03 | Khóa học không được gửi duyệt khi còn bài học thiếu video hoặc thiếu bài kiểm tra. | |
| BR-04 | Giáo viên không được sửa nội dung khóa học trong lúc khóa đang Pending, để Quản trị viên không duyệt nhầm một bản khác với bản đang xem. | |
| BR-05 | Bản chỉnh sửa của khóa học đã Published không được hiển thị cho học viên trước khi Quản trị viên duyệt. | |
| BR-06 | Khóa học bị Suspended thì học viên không được học tiếp, nhưng tiến độ đã có không được mất. | |
| BR-07 | Một học viên không được đăng ký cùng một khóa học hai lần. | |
| BR-08 | Không ai khác ngoài chính chủ được xem bộ flashcard cá nhân của học viên, kể cả giáo viên và học viên khác. | |
| BR-09 | Không được từ chối hoặc đình chỉ khóa học, hoặc từ chối hồ sơ giáo viên, khi chưa có lý do. | |
| BR-10 | Tài khoản bị khóa không được đăng nhập và không được thao tác gì trên hệ thống. | |
| BR-11 | Khi bản sửa của khóa học được duyệt, học viên không được mất những bài đã hoàn thành; chỉ tổng số bài và phần trăm hoàn thành được tính lại. | |
| BR-12 | Một lần nộp bài kiểm tra không được ghi thành hai lượt làm bài, kể cả khi học viên bấm nộp lại vì lỗi mạng. | |
| BR-13 | Tài khoản giáo viên chưa được Quản trị viên duyệt hồ sơ không được tạo khóa học, sửa khóa học hay tải video lên. | |

## Mâu thuẫn trong lời khách hàng và cách gỡ

| # | Mâu thuẫn | Nguồn | Cách gỡ |
|---|---|---|---|
| MT-01 | Mô tả vòng 1 "nghiêm cấm giáo viên sửa hoặc xoá nội dung khi đang có người học dở", nhưng người học được phỏng vấn lại chấp nhận khóa học được cập nhật, miễn tiến độ không mất. | README vòng 1; `docs/phong-van.md` câu 5 | Cho giáo viên sửa khóa đã phát hành dưới dạng bản sửa phải duyệt lại (FR-13, BR-05), học viên học bản cũ đến khi bản sửa được duyệt, và bài đã hoàn thành được giữ (BR-11). |
| MT-02 | Người học đồng ý "phải đạt điểm mới được học tiếp", nhưng không chấp nhận bị chặn mà không biết vì sao. | `docs/phong-van.md` câu 3, 7, 8 | Vẫn chặn bài sau (BR-01), nhưng kết quả phải cho biết điểm, điểm tối thiểu và câu sai (FR-05). |
| MT-03 | Vòng 1 ghi điều kiện qua bài là đạt Flashcard 80%, mã vòng 1 chấm quiz với ngưỡng 75%. | README, `diagrams/class.mmd`, `src/app/be/.../db/schema.sql` | Điều kiện qua bài là bài kiểm tra do giáo viên soạn và tự đặt điểm tối thiểu (FR-11, BR-01). Flashcard chỉ còn là công cụ ôn cá nhân (FR-07, FR-08). |

## Câu hỏi còn mở cho khách hàng

- Tài khoản giáo viên có được đăng ký học khóa học của giáo viên khác không?
- Mỗi học viên có bị giới hạn số câu hỏi chatbot mỗi ngày không, để tiết kiệm chi phí gọi LLM?
- Học viên đã đăng ký khóa học có nhận email khi khóa bị đình chỉ hoặc được khôi phục không?
