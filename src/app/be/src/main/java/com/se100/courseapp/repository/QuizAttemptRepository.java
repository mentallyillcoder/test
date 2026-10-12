package com.se100.courseapp.repository;

import com.se100.courseapp.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByUserIdAndLessonIdOrderBySubmittedAtDesc(Long userId, String lessonId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from QuizAttempt a where a.user.id = :userId "
            + "and a.lesson.id in (select l.id from Lesson l where l.course.id = :courseId)")
    int deleteByUserAndCourse(@Param("userId") Long userId, @Param("courseId") String courseId);
}
