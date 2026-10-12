package com.se100.courseapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Chưa có chức năng đăng nhập: lấy user từ header "X-User-Id",
 * nếu không có thì dùng user demo (app.demo-user-id).
 * Khi thêm Spring Security/JWT chỉ cần sửa class này.
 */
@Component
public class CurrentUserProvider {

    public static final String USER_HEADER = "X-User-Id";

    private final Long demoUserId;

    public CurrentUserProvider(@Value("${app.demo-user-id}") Long demoUserId) {
        this.demoUserId = demoUserId;
    }

    public Long resolve(Long headerUserId) {
        return headerUserId != null ? headerUserId : demoUserId;
    }
}
