import React, { useState } from "react";

export function QuizForm({
  questions,
  isVideoWatched,
  isPassed,
  onSubmitQuiz,
}) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await onSubmitQuiz(answers);
      // res = null khi Backend trả lỗi (lỗi được hiển thị ở LearningPage)
      if (res) setResult(res);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isVideoWatched) {
    return (
      <div
        style={{
          padding: "20px",
          background: "#fff3cd",
          borderRadius: "6px",
          color: "#856404",
        }}
      >
        ⚠️ Bạn cần **xem xong Video** bài học trước khi làm bài kiểm tra!
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #ddd",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Bài Kiểm Tra Đánh Giá (Yêu cầu &ge; 75%)</h3>

      {isPassed && (
        <div
          style={{
            padding: "10px",
            background: "#d4edda",
            color: "#155724",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          🎉 Bạn đã vượt qua bài thi này! Bài học tiếp theo đã được mở khóa.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: "15px", textAlign: "left" }}>
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Câu {idx + 1}: {q.question}
            </p>
            {q.options.map((opt, optIdx) => (
              <label
                key={optIdx}
                style={{
                  display: "block",
                  marginBottom: "6px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name={`question_${q.id}`}
                  checked={answers[q.id] === optIdx}
                  onChange={() => handleOptionSelect(q.id, optIdx)}
                  style={{ marginRight: "8px" }}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting || Object.keys(answers).length < questions.length}
          style={{
            padding: "10px 20px",
            background:
              submitting || Object.keys(answers).length < questions.length
                ? "#ccc"
                : "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {submitting ? "Đang chấm..." : "Nộp Bài"}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "6px",
            background: result.isPassed ? "#d4edda" : "#f8d7da",
            color: result.isPassed ? "#155724" : "#721c24",
          }}
        >
          <h4>Kết quả: {result.scorePercentage}%</h4>
          <p>
            Số câu đúng: {result.correctCount}/{result.totalQuestions}
          </p>
          <p>
            {result.isPassed
              ? "🔑 ĐẠT! Đã mở khóa bài học tiếp theo."
              : "❌ CHƯA ĐẠT! Cần tối thiểu 75% để mở khóa bài tiếp theo. Hãy thử lại!"}
          </p>
        </div>
      )}
    </div>
  );
}
