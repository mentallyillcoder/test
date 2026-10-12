package com.se100.courseapp.controller;

import com.se100.courseapp.config.CurrentUserProvider;
import com.se100.courseapp.dto.CourseResponse;
import com.se100.courseapp.dto.LessonResponse;
import com.se100.courseapp.service.LearningService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final LearningService learningService;
    private final CurrentUserProvider currentUser;

    public CourseController(LearningService learningService, CurrentUserProvider currentUser) {
        this.learningService = learningService;
        this.currentUser = currentUser;
    }

    /** GET /api/courses */
    @GetMapping
    public List<CourseResponse> getCourses() {
        return learningService.getCourses();
    }

    /** GET /api/courses/{courseId}/lessons */
    @GetMapping("/{courseId}/lessons")
    public List<LessonResponse> getLessons(
            @PathVariable String courseId,
            @RequestHeader(value = CurrentUserProvider.USER_HEADER, required = false) Long userId) {
        return learningService.getLessons(courseId, currentUser.resolve(userId));
    }

    /** POST /api/courses/{courseId}/reset-progress */
    @PostMapping("/{courseId}/reset-progress")
    public List<LessonResponse> resetProgress(
            @PathVariable String courseId,
            @RequestHeader(value = CurrentUserProvider.USER_HEADER, required = false) Long userId) {
        return learningService.resetProgress(courseId, currentUser.resolve(userId));
    }
}
