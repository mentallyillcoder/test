package com.se100.courseapp.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Map;

/**
 * POST /api/lessons/{id}/submit-quiz
 * Body: { "answers": { "<questionId>": <optionIndex>, ... } }
 */
public record SubmitQuizRequest(@NotNull Map<Long, Integer> answers) {
}
