package com.se100.courseapp.repository;

import com.se100.courseapp.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByLessonIdOrderByOrderIndexAsc(String lessonId);
}
