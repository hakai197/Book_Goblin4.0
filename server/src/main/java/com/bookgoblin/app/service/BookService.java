package com.bookgoblin.app.service;

import com.bookgoblin.app.model.Book;
import com.bookgoblin.app.model.User;
import com.bookgoblin.app.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> getAllBooks(Long userId) {
        return bookRepository.findByUserIdOrderByDateAddedDesc(userId);
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found: " + id));
    }

    public Book createBook(Book book, User user) {
        book.setUser(user);
        if (book.getDateAdded() == null) book.setDateAdded(LocalDate.now());
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book updated) {
        Book book = getBookById(id);
        book.setTitle(updated.getTitle());
        book.setAuthor(updated.getAuthor());
        book.setGenre(updated.getGenre());
        book.setStatus(updated.getStatus());
        book.setRating(updated.getRating());
        book.setProgress(updated.getProgress());
        book.setNotes(updated.getNotes());
        book.setCoverUrl(updated.getCoverUrl());
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public List<Book> getBooksByStatus(Long userId, String status) {
        return bookRepository.findByUserIdAndStatus(userId, status);
    }

    public List<Book> searchBooks(Long userId, String query) {
        return bookRepository.search(userId, query);
    }

    public Map<String, Object> getStats(Long userId) {
        return Map.of(
                "total", bookRepository.countByUserId(userId),
                "completed", bookRepository.countByUserIdAndStatus(userId, "Completed"),
                "reading", bookRepository.countByUserIdAndStatus(userId, "Reading"),
                "tbr", bookRepository.countByUserIdAndStatus(userId, "TBR")
        );
    }

    public void seedBooksForUser(User user) {
        if (bookRepository.countByUserId(user.getId()) > 0) return;

        List<Book> seeds = List.of(
            seed("Project Hail Mary", "Andy Weir", "Science Fiction", "TBR", 0.0, 0, "Excited to read this!", null, user),
            seed("Dune", "Frank Herbert", "Science Fiction", "Completed", 5.0, 100, "Masterpiece!", "https://m.media-amazon.com/images/I/81DMp7F91LL._SL1500_.jpg", user),
            seed("The Will Of The Many", "James Islington", "Fantasy", "Reading", 4.0, 65, "Great world-building", "https://m.media-amazon.com/images/I/71p5luifDjL._SL1500_.jpg", user),
            seed("Shadow of the Gods", "John Gwynne", "Fantasy", "Completed", 4.5, 100, "Epic Viking fantasy", "https://m.media-amazon.com/images/I/815EJibD9DL._SY466_.jpg", user),
            seed("The Name of the Wind", "Patrick Rothfuss", "Fantasy", "Reading", 4.5, 80, "Beautiful prose", null, user),
            seed("Mistborn: The Final Empire", "Brandon Sanderson", "Fantasy", "Completed", 5.0, 100, "Amazing magic system", "https://m.media-amazon.com/images/I/71xL5+QK5VL._SL1360_.jpg", user),
            seed("The Poppy War", "R.F. Kuang", "Fantasy", "TBR", 0.0, 0, "Highly recommended", "https://m.media-amazon.com/images/I/41bnANqltqL._SY445_SX342_QL70_FMwebp_.jpg", user),
            seed("Gideon the Ninth", "Tamsyn Muir", "Science Fiction", "TBR", 0.0, 0, "Lesbian necromancers in space!", "https://m.media-amazon.com/images/I/71GHKo78YBL._SL1500_.jpg", user)
        );
        bookRepository.saveAll(seeds);
    }

    private Book seed(String title, String author, String genre, String status, Double rating, Integer progress, String notes, String coverUrl, User user) {
        return Book.builder()
                .title(title).author(author).genre(genre).status(status)
                .rating(rating).progress(progress).notes(notes).coverUrl(coverUrl)
                .dateAdded(LocalDate.now()).user(user)
                .build();
    }
}
