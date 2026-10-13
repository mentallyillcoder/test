# Hồi cứu tuần 3 — TH2: Ghép luồng học tập và làm quiz

## 1. Bối cảnh

Ở phần demo ban đầu, N12-A phụ trách Frontend của luồng học tập và làm quiz. Sau đó, N12-C phụ trách Backend và hai phần được kết nối với nhau. Khi tích hợp, Frontend cần được điều chỉnh để phù hợp với cách Backend trả dữ liệu, xử lý lỗi và quản lý tiến độ học tập.

## 2. Vấn đề phát hiện khi ghép code

### 2.1. Gửi bài quiz và trạng thái giao diện

Trong `QuizForm.jsx`, phiên bản trước gọi `onSubmitQuiz(answers)` rồi cập nhật kết quả ngay sau khi lời gọi hoàn tất. Sau khi tích hợp, code bổ sung trạng thái `submitting`, đặt trạng thái này trước khi gọi hàm gửi bài, dùng `try/finally` để đảm bảo trạng thái được đặt lại, và chỉ gọi `setResult` khi có kết quả trả về. Nút gửi bài cũng bị vô hiệu hóa trong lúc đang chấm và nội dung nút đổi thành “Đang chấm...”.

Điều này cho thấy giao diện cần tính đến thời gian chờ của request và trường hợp không nhận được kết quả hợp lệ, thay vì chỉ xử lý tình huống thành công.

### 2.2. Nguồn dữ liệu tiến độ học tập

Trong `useLessonProgress.js`, phiên bản trước tải danh sách khóa học và bài học qua `learningApi`, đồng thời dùng dữ liệu lưu trong `localStorage` làm cache tiến độ. Sau khi tích hợp, code phân biệt chế độ Mock với chế độ có Backend: khi dùng Mock thì có thể dùng cache local; khi có Backend thì Backend được xem là nguồn dữ liệu chính. Code cũng bổ sung trạng thái lỗi và xử lý lỗi khi tải danh sách khóa học.

Bài học rút ra là hai phía phải thống nhất nguồn dữ liệu chính và điều kiện sử dụng dữ liệu cache. Nếu không thống nhất, giao diện có thể hiển thị tiến độ khác với trạng thái mà Backend quản lý.

### 2.3. Hợp đồng dữ liệu và xử lý lỗi

Trong hook, `handleQuizSubmit` được bổ sung `try/catch`; khi API lỗi, hook đặt thông báo lỗi và trả về `null`. `QuizForm.jsx` chỉ cập nhật kết quả nếu nhận được giá trị trả về. Code cũng có chú thích về việc mở khóa bài tiếp theo phải khớp với `nextLessonId` mà Backend trả về.

Những thay đổi này cho thấy Frontend và Backend cần thống nhất ít nhất các điểm sau:

- Dữ liệu đầu vào khi gửi bài quiz.
- Cấu trúc kết quả mà API trả về.
- Cách biểu diễn lỗi và cách giao diện hiển thị lỗi.
- Quy tắc xác định bài tiếp theo sau khi hoàn thành bài hiện tại.

Ảnh diff cho thấy có điều chỉnh để tương thích, nhưng không đủ để kết luận chính xác tên hoặc kiểu tham số ban đầu mà từng thành viên đã thống nhất bằng lời. Nhóm nên bổ sung chi tiết đó nếu còn nhớ hoặc có thể kiểm tra từ lịch sử code.

### 2.4. Reset tiến độ

Phiên bản trước xóa tiến độ trong `localStorage` rồi tải lại trang. Phiên bản sau chuyển sang gọi `learningApi.resetProgress(selectedCourseId)`, sau đó áp dụng danh sách bài học trả về. Điều này phù hợp hơn với trường hợp Backend quản lý tiến độ, vì thao tác reset cần được thực hiện và đồng bộ qua API thay vì chỉ xóa dữ liệu trên trình duyệt.

## 3. Nguyên nhân

Các phần Frontend và Backend được phát triển riêng nên một số giả định ở Frontend — như nguồn dữ liệu tiến độ, cách biểu diễn lỗi, kết quả gửi quiz và quy tắc mở khóa bài tiếp theo — cần được kiểm tra lại khi kết nối với API thực tế. Hợp đồng giao tiếp giữa hai phía chưa được thể hiện đầy đủ chỉ qua code Frontend ban đầu.

## 4. Cách xử lý

Nhóm điều chỉnh Frontend để:

- Thể hiện trạng thái đang gửi bài và ngăn gửi lặp trong lúc chờ.
- Chỉ cập nhật kết quả quiz khi có kết quả hợp lệ.
- Bắt lỗi khi gọi API và đưa lỗi vào state để giao diện xử lý.
- Phân biệt chế độ Mock với chế độ có Backend khi đọc tiến độ.
- Gọi API reset tiến độ và dùng dữ liệu trả về để cập nhật giao diện.
- Đối chiếu quy tắc mở khóa bài tiếp theo với `nextLessonId` từ Backend.

Sau khi chỉnh sửa, cần chạy thử toàn bộ luồng: chọn khóa học, mở bài học, gửi quiz, kiểm tra kết quả, chuyển sang bài tiếp theo và reset tiến độ.

## 5. Bài học rút ra

1. Trước khi chia việc, cần thống nhất hợp đồng API: đầu vào, đầu ra, kiểu dữ liệu, trường hợp lỗi và quy tắc nghiệp vụ.
2. Frontend cần xử lý cả trạng thái đang tải, thành công và thất bại; không nên giả định mọi request đều thành công.
3. Cần xác định rõ nguồn dữ liệu chính. Khi Backend quản lý tiến độ, `localStorage` chỉ nên được dùng theo một quy ước rõ ràng, chẳng hạn làm cache hoặc phục vụ Mock.
4. Khi ghép code, nên kiểm tra theo từng luồng nhỏ và ghi lại khác biệt giữa giả định ban đầu với API thực tế trước khi sửa, để nhóm hiểu nguyên nhân thay đổi.
