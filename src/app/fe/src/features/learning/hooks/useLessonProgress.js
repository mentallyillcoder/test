import { useState, useEffect, useCallback } from "react";
import {
  learningApi,
  getErrorMessage,
  USE_MOCK,
} from "../services/learningApi";
import { storage } from "../../../utils/storage";

export const useLessonProgress = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [lessons, setLessons] = useState([]);
  const [activeLessonId, setActiveLessonId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Tăng mỗi lần reset để các form (QuizForm) được làm mới
  const [progressVersion, setProgressVersion] = useState(0);

  const clearError = useCallback(() => setError(""), []);

  // Cập nhật state + lưu cache localStorage
  const applyLessons = useCallback((courseId, data, resetActive = false) => {
    setLessons(data);
    storage.saveCourseProgress(courseId, data);
    if (resetActive) setActiveLessonId(data[0]?.id || "");
  }, []);

  // Load danh sách khóa học
  useEffect(() => {
    learningApi
      .getCourses()
      .then((data) => {
        setCourses(data);
        if (data.length > 0) setSelectedCourseId(data[0].id);
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  // Load bài học khi chọn khóa học
  useEffect(() => {
    if (!selectedCourseId) return;

    const cached = storage.getCourseProgress(selectedCourseId);

    // Chế độ Mock: không có Backend lưu tiến độ -> dùng cache localStorage
    if (USE_MOCK && cached) {
      setLessons(cached);
      setActiveLessonId(cached[0]?.id || "");
      return;
    }

    // Có Backend: Backend là nguồn dữ liệu chính, cache chỉ để dự phòng
    setLoading(true);
    learningApi
      .getLessonsByCourse(selectedCourseId)
      .then((data) => applyLessons(selectedCourseId, data, true))
      .catch((err) => {
        setError(getErrorMessage(err));
        if (cached) {
          setLessons(cached);
          setActiveLessonId(cached[0]?.id || "");
        } else {
          setLessons([]);
          setActiveLessonId("");
        }
      })
      .finally(() => setLoading(false));
  }, [selectedCourseId, applyLessons]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || null;

  // Xử lý xem xong Video
  const handleVideoCompleted = async (lessonId) => {
    try {
      await learningApi.markVideoWatched(lessonId);
    } catch (err) {
      setError(getErrorMessage(err));
      return;
    }

    setLessons((prev) => {
      const updated = prev.map((item) =>
        item.id === lessonId ? { ...item, videoWatched: true } : item,
      );
      storage.saveCourseProgress(selectedCourseId, updated);
      return updated;
    });
  };

  // Xử lý nộp bài Quiz & mở khóa bài tiếp theo
  // Trả về kết quả, hoặc null nếu có lỗi (lỗi hiển thị qua state `error`)
  const handleQuizSubmit = async (lessonId, userAnswers) => {
    let result;
    try {
      result = await learningApi.submitQuiz(
        lessonId,
        userAnswers,
        activeLesson?.questions || [],
      );
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    }

    if (result.isPassed) {
      setLessons((prev) => {
        const currentIndex = prev.findIndex((l) => l.id === lessonId);
        const updated = [...prev];

        // Đánh dấu bài hiện tại COMPLETED
        updated[currentIndex] = {
          ...updated[currentIndex],
          quizPassed: true,
          status: "COMPLETED",
        };

        // Mở khóa bài tiếp theo (nếu có) - khớp với nextLessonId Backend trả về
        if (currentIndex + 1 < updated.length) {
          updated[currentIndex + 1] = {
            ...updated[currentIndex + 1],
            status: "UNLOCKED",
          };
        }

        storage.saveCourseProgress(selectedCourseId, updated);
        return updated;
      });
    }

    return result;
  };

  // Reset tiến độ: gọi Backend reset, rồi nạp lại lộ trình mới
  const resetProgress = async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      storage.clearCourseProgress(selectedCourseId);
      const data = await learningApi.resetProgress(selectedCourseId);
      applyLessons(selectedCourseId, data, true);
      setProgressVersion((v) => v + 1);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    lessons,
    activeLesson,
    setActiveLessonId,
    loading,
    error,
    clearError,
    progressVersion,
    handleVideoCompleted,
    handleQuizSubmit,
    resetProgress,
  };
};
