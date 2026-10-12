package com.se100.courseapp.service;

import com.se100.courseapp.dto.*;
import com.se100.courseapp.entity.*;
import com.se100.courseapp.exception.BusinessException;
import com.se100.courseapp.exception.ResourceNotFoundException;
import com.se100.courseapp.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Nghiệp vụ học tập tuần tự:
 * xem video -> làm quiz -> đạt >= pass_threshold -> hoàn thành & mở khóa bài kế tiếp.
 */
@Service
@Transactional
public class LearningService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository progressRepository;
    private final QuizAttemptRepository attemptRepository;
    private final QuizAttemptAnswerRepository attemptAnswerRepository;

    public LearningService(UserRepository userRepository,
                           CourseRepository courseRepository,
                           EnrollmentRepository enrollmentRepository,
                           LessonRepository lessonRepository,
                           LessonProgressRepository progressRepository,
                           QuizAttemptRepository attemptRepository,
                           QuizAttemptAnswerRepository attemptAnswerRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
        this.progressRepository = progressRepository;
        this.attemptRepository = attemptRepository;
        this.attemptAnswerRepository = attemptAnswerRepository;
    }

    // 1. Danh sách khóa học
    @Transactional(readOnly = true)
    public List<CourseResponse> getCourses() {
        return courseRepository.findByPublishedTrueOrderByTitleAsc().stream()
                .map(CourseResponse::from)
                .toList();
    }

    // 2. Lộ trình bài học kèm tiến độ của user (tự ghi danh nếu chưa có)
    public List<LessonResponse> getLessons(String courseId, Long userId) {
        User user = findUser(userId);
        Course course = findCourse(courseId);
        return buildRoadmap(user, course);
    }

    // 3. Đánh dấu đã xem xong video
    public WatchStatusResponse markVideoWatched(String lessonId, Long userId) {
        LessonProgress progress = findUnlockedProgress(lessonId, userId);
        progress.markVideoWatched();
        return new WatchStatusResponse(true, lessonId, true);
    }

    // 4. Nộp bài quiz, chấm điểm, mở khóa bài tiếp theo
    public QuizResultResponse submitQuiz(String lessonId, Long userId, Map<Long, Integer> answers) {
        LessonProgress progress = findUnlockedProgress(lessonId, userId);
        if (!progress.isVideoWatched()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST,
                    "Bạn cần xem xong video bài học trước khi làm bài kiểm tra");
        }

        Lesson lesson = progress.getLesson();
        User user = progress.getUser();
        List<Question> questions = lesson.getQuestions();

        QuizAttempt attempt = new QuizAttempt(user, lesson);
        int correctCount = 0;
        for (Question q : questions) {
            Integer selectedIndex = answers.get(q.getId());
            QuestionOption selected = q.getOptions().stream()
                    .filter(o -> o.getOptionIndex().equals(selectedIndex))
                    .findFirst()
                    .orElse(null);
            boolean correct = selected != null && selected.isCorrect();
            if (correct) {
                correctCount++;
            }
            attempt.addAnswer(new QuizAttemptAnswer(q, selected, correct));
        }

        int total = questions.size();
        int score = total == 0 ? 100 : Math.round(correctCount * 100f / total);
        boolean passed = score >= lesson.getPassThreshold();

        attempt.setCorrectCount(correctCount);
        attempt.setTotalQuestions(total);
        attempt.setScorePercentage(score);
        attempt.setPassed(passed);
        attemptRepository.save(attempt);

        progress.recordScore(score);

        String nextLessonId = null;
        if (passed) {
            progress.markCompleted();
            Optional<Lesson> next = lessonRepository
                    .findFirstByCourseIdAndOrderIndexGreaterThanOrderByOrderIndexAsc(
                            lesson.getCourse().getId(), lesson.getOrderIndex());
            if (next.isPresent()) {
                nextLessonId = next.get().getId();
                LessonProgress nextProgress = progressRepository
                        .findByUserIdAndLessonId(user.getId(), nextLessonId)
                        .orElseGet(() -> progressRepository.save(
                                new LessonProgress(user, next.get(), LessonStatus.LOCKED)));
                nextProgress.unlock();
            } else {
                // Bài cuối cùng -> hoàn thành khóa học
                enrollmentRepository.findByUserIdAndCourseId(user.getId(), lesson.getCourse().getId())
                        .ifPresent(e -> e.setCompletedAt(LocalDateTime.now()));
            }
        }

        return new QuizResultResponse(score, correctCount, total, passed, nextLessonId);
    }

    // 5. Reset tiến độ khóa học về ban đầu
    public List<LessonResponse> resetProgress(String courseId, Long userId) {
        User user = findUser(userId);
        Course course = findCourse(courseId);

        attemptAnswerRepository.deleteByUserAndCourse(userId, courseId);
        attemptRepository.deleteByUserAndCourse(userId, courseId);
        progressRepository.deleteByUserAndCourse(userId, courseId);
        enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .ifPresent(e -> e.setCompletedAt(null));

        return buildRoadmap(user, course);
    }

    // ------------------------------------------------------------------

    /** Tạo enrollment + lesson_progress còn thiếu rồi trả về lộ trình. */
    private List<LessonResponse> buildRoadmap(User user, Course course) {
        if (enrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId()).isEmpty()) {
            enrollmentRepository.save(new Enrollment(user, course));
        }

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(course.getId());
        Map<String, LessonProgress> progressByLesson = progressRepository
                .findByUserIdAndLessonCourseId(user.getId(), course.getId()).stream()
                .collect(Collectors.toMap(p -> p.getLesson().getId(), Function.identity()));

        LessonProgress previous = null;
        for (int i = 0; i < lessons.size(); i++) {
            Lesson lesson = lessons.get(i);
            LessonProgress progress = progressByLesson.get(lesson.getId());
            if (progress == null) {
                // Bài đầu tiên, hoặc bài trước đã hoàn thành -> mở khóa
                boolean unlocked = i == 0
                        || (previous != null && previous.getStatus() == LessonStatus.COMPLETED);
                progress = progressRepository.save(new LessonProgress(user, lesson,
                        unlocked ? LessonStatus.UNLOCKED : LessonStatus.LOCKED));
                progressByLesson.put(lesson.getId(), progress);
            }
            previous = progress;
        }

        return lessons.stream()
                .map(l -> LessonResponse.from(l, progressByLesson.get(l.getId())))
                .toList();
    }

    private LessonProgress findUnlockedProgress(String lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài học: " + lessonId));
        LessonProgress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElseGet(() -> {
                    // Chưa có tiến độ -> khởi tạo lộ trình cho khóa học này
                    buildRoadmap(findUser(userId), lesson.getCourse());
                    return progressRepository.findByUserIdAndLessonId(userId, lessonId).orElseThrow();
                });
        if (progress.isLocked()) {
            throw new BusinessException(HttpStatus.FORBIDDEN,
                    "Bài học đang bị khóa. Hãy hoàn thành bài trước để mở khóa");
        }
        return progress;
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng: " + userId));
    }

    private Course findCourse(String courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khóa học: " + courseId));
    }
}
