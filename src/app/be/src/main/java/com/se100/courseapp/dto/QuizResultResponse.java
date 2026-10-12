package com.se100.courseapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Khớp FE: { scorePercentage, correctCount, totalQuestions, isPassed, nextLessonId } */
public record QuizResultResponse(
        int scorePercentage,
        int correctCount,
        int totalQuestions,
        @JsonProperty("isPassed") boolean isPassed,
        String nextLessonId) {
}
