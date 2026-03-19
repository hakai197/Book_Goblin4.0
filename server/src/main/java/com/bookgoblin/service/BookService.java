package com.bookgoblin.service;

import com.bookgoblin.model.Book;
import com.bookgoblin.model.OpenLibraryDoc;
import com.bookgoblin.model.OpenLibraryResponse;
import com.bookgoblin.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final WebClient webClient;

    public BookService(BookRepository bookRepository, WebClient.Builder webClientBuilder) {
        this.bookRepository = bookRepository;
        this.webClient = webClientBuilder.baseUrl("https://openlibrary.org").build();
    }

    // --- CRUD ---

    public List<Book> getAllBooks() {
        return bookRepository.findByOrderByDateAddedDesc();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found: " + id));
    }

    public Book createBook(Book book) {
        if (book.getDateAdded() == null) {
            book.setDateAdded(LocalDate.now());
        }
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

    // --- Filtering ---

    public List<Book> getBooksByStatus(String status) {
        return bookRepository.findByStatus(status);
    }

    public List<Book> searchBooks(String query) {
        return bookRepository.search(query);
    }

    // --- Stats ---

    public Map<String, Object> getStats() {
        long total = bookRepository.count();
        long completed = bookRepository.countByStatus("Completed");
        long reading = bookRepository.countByStatus("Reading");
        long tbr = bookRepository.countByStatus("TBR");
        return Map.of(
                "total", total,
                "completed", completed,
                "reading", reading,
                "tbr", tbr
        );
    }

    // --- OpenLibrary external search ---

    public Flux<Book> searchOpenLibrary(String query, int limit) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.json")
                        .queryParam("q", query)
                        .queryParam("limit", limit)
                        .queryParam("fields", "key,title,author_name,first_publish_year,cover_i,isbn")
                        .build())
                .retrieve()
                .bodyToMono(OpenLibraryResponse.class)
                .flatMapMany(response -> {
                    if (response.getDocs() == null) return Flux.empty();
                    return Flux.fromIterable(response.getDocs().stream()
                            .map(this::convertToBook)
                            .toList());
                });
    }

    private Book convertToBook(OpenLibraryDoc doc) {
        Book book = new Book();
        book.setTitle(doc.getTitle());
        book.setAuthor(doc.getAuthorNames() != null && !doc.getAuthorNames().isEmpty()
                ? String.join(", ", doc.getAuthorNames()) : "Unknown");
        book.setPublishedYear(doc.getFirstPublishYear());
        book.setCoverUrl(doc.getCoverId() != null
                ? "https://covers.openlibrary.org/b/id/" + doc.getCoverId() + "-M.jpg" : null);
        if (doc.getIsbns() != null && !doc.getIsbns().isEmpty()) {
            book.setIsbn(doc.getIsbns().getFirst());
        }
        book.setStatus("TBR");
        book.setRating(0.0);
        return book;
    }

    // --- Seed data ---

    public void seedIfEmpty() {
        if (bookRepository.count() > 0) return;

        List<Book> seeds = List.of(
            createSeed("Project Hail Mary", "Andy Weir", "Science Fiction", "TBR", 0.0, 0, "Excited to read this!", "https://m.media-amazon.com/images/I/81DMp7F91LL._SL1500_.jpg"),
            createSeed("Dune", "Frank Herbert", "Science Fiction", "Completed", 5.0, 100, "Masterpiece!", "https://m.media-amazon.com/images/I/81DMp7F91LL._SL1500_.jpg"),
            createSeed("The Will Of The Many", "James Islington", "Fantasy", "Reading", 4.0, 65, "Great world-building", "https://m.media-amazon.com/images/I/71p5luifDjL._SL1500_.jpg"),
            createSeed("Shadow of the Gods", "John Gwynne", "Fantasy", "Completed", 4.5, 100, "Epic Viking fantasy", "https://m.media-amazon.com/images/I/815EJibD9DL._SY466_.jpg"),
            createSeed("The Name of the Wind", "Patrick Rothfuss", "Fantasy", "Reading", 4.5, 80, "Beautiful prose", null),
            createSeed("Mistborn: The Final Empire", "Brandon Sanderson", "Fantasy", "Completed", 5.0, 100, "Amazing magic system", "https://m.media-amazon.com/images/I/71xL5+QK5VL._SL1360_.jpg"),
            createSeed("The Poppy War", "R.F. Kuang", "Fantasy", "TBR", 0.0, 0, "Highly recommended", "https://m.media-amazon.com/images/I/41bnANqltqL._SY445_SX342_QL70_FMwebp_.jpg"),
            createSeed("Gideon the Ninth", "Tamsyn Muir", "Science Fiction", "TBR", 0.0, 0, "Lesbian necromancers in space!", "https://m.media-amazon.com/images/I/71GHKo78YBL._SL1500_.jpg")
        );

        bookRepository.saveAll(seeds);
    }

    private Book createSeed(String title, String author, String genre, String status, Double rating, Integer progress, String notes, String coverUrl) {
        Book b = new Book();
        b.setTitle(title);
        b.setAuthor(author);
        b.setGenre(genre);
        b.setStatus(status);
        b.setRating(rating);
        b.setProgress(progress);
        b.setNotes(notes);
        b.setCoverUrl(coverUrl);
        b.setDateAdded(LocalDate.now());
        return b;
    }
}
