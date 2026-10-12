package com.se100.courseapp.repository;

import com.se100.courseapp.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, String> {

    List<Lesson> findByCourseIdOrderByOrderIndexAsc(String courseId);

    /** Bài học kế tiếp trong cùng khóa học. */
    Optional<Lesson> findFirstByCourseIdAndOrderIndexGreaterThanOrderByOrderIndexAsc(String courseId, Integer orderIndex);
}
