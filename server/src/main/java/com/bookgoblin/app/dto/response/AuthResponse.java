package com.bookgoblin.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private List<String> roles;
}
