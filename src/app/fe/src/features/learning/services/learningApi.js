import api from "../../../services/apiConfig";

// Bật true để test độc lập FE không cần Backend, bật false khi kết nối Spring Boot
export const USE_MOCK = false;

const MOCK_COURSES = [
  { id: "react-101", title: "Lập trình React.js Cơ Bản" },
  { id: "spring-boot-101", title: "Lập trình Spring Boot REST API" },
];

const MOCK_LESSONS = [
  {
    id: "l1",
    title: "Bài 1: Giới thiệu & Cài đặt môi trường",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    status: "UNLOCKED", // UNLOCKED, LOCKED, COMPLETED
    videoWatched: false,
    quizPassed: false,
    questions: [
      {
        id: 1,
        question: "React.js là gì?",
        options: [
          "Một Thư viện JavaScript",
          "Một Framework PHP",
          "Một Cơ sở dữ liệu",
          "Một Hệ điều hành",
        ],
        correctIndex: 0,
      },
      {
        id: 2,
        question: "Lệnh nào dùng để khởi tạo dự án React với Vite?",
        options: [
          "npm start",
          "npm create vite@latest",
          "git init",
          "docker run",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "l2",
    title: "Bài 2: Component & JSX trong React",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    status: "LOCKED",
    videoWatched: false,
    quizPassed: false,
    questions: [
      {
        id: 3,
        question: "JSX là gì trong React?",
        options: [
          "Cú pháp mở rộng của JavaScript",
          "Dạng file video",
          "Một loại CSS",
          "Giao thức truyền tải",
        ],
        correctIndex: 0,
      },
      {
        id: 4,
        question: "Component trong React phải trả về gì?",
        options: [
          "Một chuỗi SQL",
          "Một phần tử JSX / HTML",
          "Một tệp JSON",
          "Không trả về gì cả",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "l3",
    title: "Bài 3: State & Props",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    status: "LOCKED",
    videoWatched: false,
    quizPassed: false,
    questions: [
      {
        id: 5,
        question: "Hook nào dùng để quản lý state trong Functional Component?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctIndex: 1,
      },
    ],
  },
];

export const learningApi = {
  // 1. Lấy danh sách khóa học
  getCourses: async () => {
    if (USE_MOCK) return MOCK_COURSES;
    const res = await api.get("/courses");
    return res.data;
  },

  // 2. Lấy danh sách bài học của khóa học
  getLessonsByCourse: async (courseId) => {
    if (USE_MOCK) return MOCK_LESSONS;
    const res = await api.get(`/courses/${courseId}/lessons`);
    return res.data;
  },

  // 3. Đánh dấu đã xem video
  markVideoWatched: async (lessonId) => {
    if (USE_MOCK) return { success: true, lessonId };
    const res = await api.post(`/lessons/${lessonId}/watch-status`);
    return res.data;
  },

  // 4. Nộp bài quiz -> Spring Boot sẽ trả về kết quả & tỷ lệ %
  submitQuiz: async (lessonId, userAnswers, lessonQuestions) => {
    if (USE_MOCK) {
      // Logic giả lập tính điểm
      let correctCount = 0;
      lessonQuestions.forEach((q) => {
        if (userAnswers[q.id] === q.correctIndex) {
          correctCount++;
        }
      });
      const scorePercentage = Math.round(
        (correctCount / lessonQuestions.length) * 100,
      );
      const isPassed = scorePercentage >= 75;

      return {
        scorePercentage,
        correctCount,
        totalQuestions: lessonQuestions.length,
        isPassed,
      };
    }

    // Khi kết nối Backend Spring Boot thực tế:
    const res = await api.post(`/lessons/${lessonId}/submit-quiz`, {
      answers: userAnswers,
    });
    return res.data;
  },

  // 5. Reset tiến độ khóa học -> Backend trả về lộ trình mới
  resetProgress: async (courseId) => {
    if (USE_MOCK) return MOCK_LESSONS;
    const res = await api.post(`/courses/${courseId}/reset-progress`);
    return res.data;
  },
};

// Lấy thông báo lỗi từ Backend (GlobalExceptionHandler trả về { message })
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === "ERR_NETWORK")
    return "Không kết nối được Backend (http://localhost:8080). Hãy kiểm tra server đã chạy chưa.";
  return error?.message || "Đã có lỗi xảy ra";
};
