package com.thichcodedao.edurecall.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

/**
 * Tài liệu API tự sinh: http://localhost:8080/swagger-ui.html
 * Nút "Authorize" cho phép dán access token (không cần chữ "Bearer") để gọi thử API cần đăng nhập.
 */
@Configuration
@OpenAPIDefinition(
        info = @Info(title = "EduRecall API", version = "v1"),
        security = @SecurityRequirement(name = "bearerAuth"))
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT")
public class OpenAPIconfig {
}