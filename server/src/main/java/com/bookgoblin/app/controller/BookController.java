package com.bookgoblin.app.controller;

import com.bookgoblin.app.model.Book;
import com.bookgoblin.app.model.User;
import com.bookgoblin.app.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookService.getAllBooks(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book, @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.createBook(book, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Book>> getBooksByStatus(@AuthenticationPrincipal User user, @PathVariable String status) {
        return ResponseEntity.ok(bookService.getBooksByStatus(user.getId(), status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@AuthenticationPrincipal User user, @RequestParam String q) {
        return ResponseEntity.ok(bookService.searchBooks(user.getId(), q));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookService.getStats(user.getId()));
    }

    @PostMapping("/seed")
    public ResponseEntity<Void> seedBooks(@AuthenticationPrincipal User user) {
        bookService.seedBooksForUser(user);
        return ResponseEntity.ok().build();
    }
}
