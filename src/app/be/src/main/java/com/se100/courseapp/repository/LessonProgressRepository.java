package com.se100.courseapp.repository;

import com.se100.courseapp.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    Optional<LessonProgress> findByUserIdAndLessonId(Long userId, String lessonId);

    List<LessonProgress> findByUserIdAndLessonCourseId(Long userId, String courseId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from LessonProgress p where p.user.id = :userId "
            + "and p.lesson.id in (select l.id from Lesson l where l.course.id = :courseId)")
    int deleteByUserAndCourse(@Param("userId") Long userId, @Param("courseId") String courseId);
}
