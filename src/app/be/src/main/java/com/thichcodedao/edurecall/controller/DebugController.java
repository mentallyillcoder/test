package com.thichcodedao.edurecall.controller;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DebugController {
    @GetMapping("/api/debug/me")
    public Map<String, Object> me(JwtAuthenticationToken auth) {
        return Map.of(
                "email", auth.getToken().getClaimAsString("email"),
                "authorities", auth.getAuthorities().stream().map(Object::toString).toList());
    }
}