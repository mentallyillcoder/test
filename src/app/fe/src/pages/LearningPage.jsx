import React, { useState } from "react";
import { useLessonProgress } from "../features/learning/hooks/useLessonProgress";
import { CourseSelector } from "../features/learning/components/CourseSelector";
import { LessonRoadmap } from "../features/learning/components/LessonRoadmap";
import { VideoPlayer } from "../features/learning/components/VideoPlayer";
import { QuizForm } from "../features/learning/components/QuizForm";

export function LearningPage() {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    lessons,
    activeLesson,
    setActiveLessonId,
    loading,
    handleVideoCompleted,
    handleQuizSubmit,
    resetProgress,
    error,
    clearError,
    progressVersion,
  } = useLessonProgress();

  const [activeTab, setActiveTab] = useState("video"); // 'video' hoặc 'quiz'

  if (loading)
    return <div style={{ padding: "20px" }}>Đang tải lộ trình học...</div>;

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Hệ Thống Học Tập Tuần Tự</h2>
        <button
          onClick={resetProgress}
          style={{
            padding: "6px 12px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 Reset Tiến Độ Dữ Liệu
        </button>
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 15px",
            marginBottom: "15px",
            background: "#f8d7da",
            color: "#721c24",
            borderRadius: "6px",
          }}
        >
          <span>⚠️ {error}</span>
          <button
            onClick={clearError}
            style={{
              background: "transparent",
              border: "none",
              color: "#721c24",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <CourseSelector
        courses={courses}
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
      />

      <div
        style={{
          display: "flex",
          border: "1px solid #ddd",
          borderRadius: "8px",
          minHeight: "500px",
          overflow: "hidden",
        }}
      >
        {/* Sidebar Roadmap bên trái */}
        <LessonRoadmap
          lessons={lessons}
          activeLessonId={activeLesson?.id}
          onSelectLesson={setActiveLessonId}
        />

        {/* Nội dung bài học bên phải */}
        <div style={{ flex: 1, padding: "20px", background: "#fafafa" }}>
          {activeLesson ? (
            <>
              <h2>{activeLesson.title}</h2>

              {/* Navigation Tabs */}
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
              >
                <button
                  onClick={() => setActiveTab("video")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid #007bff",
                    background: activeTab === "video" ? "#007bff" : "#fff",
                    color: activeTab === "video" ? "#fff" : "#007bff",
                    cursor: "pointer",
                  }}
                >
                  1. Video Bài Học
                </button>
                <button
                  onClick={() => setActiveTab("quiz")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid #007bff",
                    background: activeTab === "quiz" ? "#007bff" : "#fff",
                    color: activeTab === "quiz" ? "#fff" : "#007bff",
                    cursor: "pointer",
                  }}
                >
                  2. Bài Kiểm Tra (&ge;75%)
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "video" && (
                <VideoPlayer
                  videoUrl={activeLesson.videoUrl}
                  isWatched={activeLesson.videoWatched}
                  onVideoEnd={() => handleVideoCompleted(activeLesson.id)}
                />
              )}

              {activeTab === "quiz" && (
                <QuizForm
                  key={`${activeLesson.id}-${progressVersion}`}
                  questions={activeLesson.questions}
                  isVideoWatched={activeLesson.videoWatched}
                  isPassed={activeLesson.quizPassed}
                  onSubmitQuiz={(answers) =>
                    handleQuizSubmit(activeLesson.id, answers)
                  }
                />
              )}
            </>
          ) : (
            <div>Vui lòng chọn bài học.</div>
          )}
        </div>
      </div>
    </div>
  );
}
