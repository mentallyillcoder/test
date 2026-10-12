package com.se100.courseapp.dto;

import com.se100.courseapp.entity.Course;

/** GET /api/courses -> [{ id, title, description }] */
public record CourseResponse(String id, String title, String description) {

    public static CourseResponse from(Course c) {
        return new CourseResponse(c.getId(), c.getTitle(), c.getDescription());
    }
}
