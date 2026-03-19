package com.bookgoblin.config;

import com.bookgoblin.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final BookService bookService;

    @Override
    public void run(String... args) {
        bookService.seedIfEmpty();
    }
}
