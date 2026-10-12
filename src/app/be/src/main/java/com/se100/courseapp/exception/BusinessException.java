package com.se100.courseapp.exception;

import org.springframework.http.HttpStatus;

/** Lỗi nghiệp vụ, ví dụ: bài học đang khóa, chưa xem xong video. */
public class BusinessException extends RuntimeException {

    private final HttpStatus status;

    public BusinessException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
