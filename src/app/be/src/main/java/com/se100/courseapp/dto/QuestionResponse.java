package com.se100.courseapp.dto;

import com.se100.courseapp.entity.Question;
import com.se100.courseapp.entity.QuestionOption;

import java.util.List;

/**
 * Khớp cấu trúc FE: { id, question, options: ["...", "..."] }.
 * Không trả về đáp án đúng - server tự chấm điểm.
 */
public record QuestionResponse(Long id, String question, List<String> options) {

    public static QuestionResponse from(Question q) {
        return new QuestionResponse(
                q.getId(),
                q.getContent(),
                q.getOptions().stream().map(QuestionOption::getContent).toList());
    }
}
