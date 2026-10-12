const STORAGE_PREFIX = 'learning_app_';

export const storage = {
  getCourseProgress: (courseId) => {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}course_${courseId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Lỗi đọc LocalStorage:', error);
      return null;
    }
  },

  saveCourseProgress: (courseId, progressData) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}course_${courseId}`, JSON.stringify(progressData));
    } catch (error) {
      console.error('Lỗi ghi LocalStorage:', error);
    }
  },

  clearCourseProgress: (courseId) => {
    localStorage.removeItem(`${STORAGE_PREFIX}course_${courseId}`);
  }
};