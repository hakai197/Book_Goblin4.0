package com.bookgoblin.app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private record Bucket(AtomicInteger count, long windowStart) {}

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    private static final int AUTH_LIMIT = 10;
    private static final int DEFAULT_LIMIT = 60;
    private static final long WINDOW_MS = 60_000;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String ip = getClientIp(request);
        boolean isAuth = request.getRequestURI().startsWith("/api/auth/");
        int limit = isAuth ? AUTH_LIMIT : DEFAULT_LIMIT;

        Bucket bucket = buckets.compute(ip, (k, b) -> {
            long now = System.currentTimeMillis();
            if (b == null || now - b.windowStart() >= WINDOW_MS)
                return new Bucket(new AtomicInteger(1), now);
            b.count().incrementAndGet();
            return b;
        });

        if (bucket.count().get() > limit) {
            response.setStatus(429);
            response.getWriter().write("Too many requests");
            return;
        }
        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        return (forwarded != null) ? forwarded.split(",")[0].trim() : request.getRemoteAddr();
    }
}
