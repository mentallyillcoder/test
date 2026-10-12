package com.se100.courseapp.controller;

import com.se100.courseapp.config.CurrentUserProvider;
import com.se100.courseapp.dto.QuizResultResponse;
import com.se100.courseapp.dto.SubmitQuizRequest;
import com.se100.courseapp.dto.WatchStatusResponse;
import com.se100.courseapp.service.LearningService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LearningService learningService;
    private final CurrentUserProvider currentUser;

    public LessonController(LearningService learningService, CurrentUserProvider currentUser) {
        this.learningService = learningService;
        this.currentUser = currentUser;
    }

    /** POST /api/lessons/{lessonId}/watch-status */
    @PostMapping("/{lessonId}/watch-status")
    public WatchStatusResponse markVideoWatched(
            @PathVariable String lessonId,
            @RequestHeader(value = CurrentUserProvider.USER_HEADER, required = false) Long userId) {
        return learningService.markVideoWatched(lessonId, currentUser.resolve(userId));
    }

    /** POST /api/lessons/{lessonId}/submit-quiz   body: { "answers": { "1": 0, "2": 1 } } */
    @PostMapping("/{lessonId}/submit-quiz")
    public QuizResultResponse submitQuiz(
            @PathVariable String lessonId,
            @Valid @RequestBody SubmitQuizRequest request,
            @RequestHeader(value = CurrentUserProvider.USER_HEADER, required = false) Long userId) {
        return learningService.submitQuiz(lessonId, currentUser.resolve(userId), request.answers());
    }
}
