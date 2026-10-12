package com.se100.courseapp.dto;

/** POST /api/lessons/{id}/watch-status */
public record WatchStatusResponse(boolean success, String lessonId, boolean videoWatched) {
}
