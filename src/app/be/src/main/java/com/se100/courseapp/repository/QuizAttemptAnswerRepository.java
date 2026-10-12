package com.se100.courseapp.repository;

import com.se100.courseapp.entity.QuizAttemptAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuizAttemptAnswerRepository extends JpaRepository<QuizAttemptAnswer, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from QuizAttemptAnswer ans where ans.attempt.id in ("
            + "select a.id from QuizAttempt a where a.user.id = :userId and a.lesson.course.id = :courseId)")
    int deleteByUserAndCourse(@Param("userId") Long userId, @Param("courseId") String courseId);
}
