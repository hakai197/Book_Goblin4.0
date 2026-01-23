package com.bookgoblin.controller;

import com.bookgoblin.model.Book;
import com.bookgoblin.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public String getBooksPage(Model model) {
        List<Book> books = bookService.getMyBooks();
        model.addAttribute("books", books);

        // Calculate stats
        long completed = books.stream().filter(b -> "Completed".equals(b.getStatus())).count();
        long reading = books.stream().filter(b -> "Reading".equals(b.getStatus())).count();
        long tbr = books.stream().filter(b -> "TBR".equals(b.getStatus())).count();

        model.addAttribute("stats", Map.of(
                "total", books.size(),
                "completed", completed,
                "reading", reading,
                "tbr", tbr
        ));

        return "books";
    }

    @GetMapping("/my-books")
    @ResponseBody
    public ResponseEntity<List<Book>> getMyBooks() {
        return ResponseEntity.ok(bookService.getMyBooks());
    }

    @GetMapping("/search")
    @ResponseBody
    public Flux<Book> searchBooks(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        return bookService.searchBooks(query, limit);
    }

    @GetMapping("/status/{status}")
    @ResponseBody
    public ResponseEntity<List<Book>> getBooksByStatus(@PathVariable String status) {
        List<Book> filteredBooks = bookService.getMyBooks().stream()
                .filter(book -> status.equalsIgnoreCase(book.getStatus()))
                .toList();
        return ResponseEntity.ok(filteredBooks);
    }

    @PostMapping("/{id}/status")
    @ResponseBody
    public ResponseEntity<Book> updateBookStatus(
            @PathVariable String id,
            @RequestParam String status) {
        // In a real app, update in database
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/rating")
    @ResponseBody
    public ResponseEntity<Book> updateBookRating(
            @PathVariable String id,
            @RequestParam int rating) {
        // In a real app, update in database
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getReadingStats() {
        List<Book> books = bookService.getMyBooks();

        // Mock reading progress data
        List<Map<String, Object>> monthlyProgress = List.of(
                Map.of("month", "March 2024", "books", 3, "pages", 850),
                Map.of("month", "February 2024", "books", 4, "pages", 1200),
                Map.of("month", "January 2024", "books", 5, "pages", 1500),
                Map.of("month", "December 2023", "books", 6, "pages", 1800)
        );

        Map<String, Object> stats = Map.of(
                "monthlyProgress", monthlyProgress,
                "totalBooks", 18,
                "totalPages", 5350,
                "increase", "12%"
        );

        return ResponseEntity.ok(stats);
    }
}