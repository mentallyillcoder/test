import React from "react";

export function LessonRoadmap({ lessons, activeLessonId, onSelectLesson }) {
  return (
    <div
      style={{
        width: "300px",
        background: "#ffffff",
        borderRight: "1px solid #e0e0e0",
        padding: "15px",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "18px" }}>
        Lộ Trình Bài Học
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {lessons.map((lesson, index) => {
          const isLocked = lesson.status === "LOCKED";
          const isCompleted = lesson.status === "COMPLETED";
          const isActive = lesson.id === activeLessonId;

          let badgeColor = "#6c757d"; // Xám - Locked
          let badgeText = "🔒 Khóa";

          if (isCompleted) {
            badgeColor = "#28a745"; // Xanh lá - Completed
            badgeText = "✓ Hoàn thành";
          } else if (!isLocked) {
            badgeColor = "#007bff"; // Xanh dương - Unlocked
            badgeText = "🔓 Đã mở";
          }

          return (
            <button
              key={lesson.id}
              disabled={isLocked}
              onClick={() => onSelectLesson(lesson.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "12px",
                borderRadius: "6px",
                border: isActive ? "2px solid #007bff" : "1px solid #ddd",
                background: isActive
                  ? "#e7f1ff"
                  : isLocked
                    ? "#f5f5f5"
                    : "#fff",
                cursor: isLocked ? "not-allowed" : "pointer",
                textAlign: "left",
                opacity: isLocked ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                {lesson.title}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  color: "#fff",
                  backgroundColor: badgeColor,
                }}
              >
                {badgeText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
