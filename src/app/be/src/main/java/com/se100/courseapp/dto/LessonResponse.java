package com.se100.courseapp.dto;

import com.se100.courseapp.entity.Lesson;
import com.se100.courseapp.entity.LessonProgress;
import com.se100.courseapp.entity.LessonStatus;

import java.util.List;

/**
 * Khớp cấu trúc FE:
 * { id, title, videoUrl, status, videoWatched, quizPassed, passThreshold, questions: [...] }
 */
public record LessonResponse(
        String id,
        String title,
        String videoUrl,
        Integer orderIndex,
        Integer passThreshold,
        LessonStatus status,
        boolean videoWatched,
        boolean quizPassed,
        Integer bestScore,
        List<QuestionResponse> questions) {

    public static LessonResponse from(Lesson l, LessonProgress p) {
        return new LessonResponse(
                l.getId(),
                l.getTitle(),
                l.getVideoUrl(),
                l.getOrderIndex(),
                l.getPassThreshold(),
                p != null ? p.getStatus() : LessonStatus.LOCKED,
                p != null && p.isVideoWatched(),
                p != null && p.isQuizPassed(),
                p != null ? p.getBestScore() : null,
                l.getQuestions().stream().map(QuestionResponse::from).toList());
    }
}
