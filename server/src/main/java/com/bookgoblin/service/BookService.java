package com.bookgoblin.service;

import com.bookgoblin.model.Book;
import com.bookgoblin.model.OpenLibraryResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final WebClient webClient;

    @Value("${openlibrary.search.url}")
    private String openLibraryUrl;

    public BookService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://openlibrary.org").build();
    }

    public Flux<Book> searchBooks(String query, int limit) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.json")
                        .queryParam("q", query)
                        .queryParam("limit", limit)
                        .queryParam("fields", "key,title,author_name,first_publish_year,cover_i,isbn")
                        .build())
                .retrieve()
                .bodyToMono(OpenLibraryResponse.class)
                .flatMapMany(response -> Flux.fromIterable(
                        response.getDocs().stream()
                                .map(this::convertToBook)
                                .collect(Collectors.toList())
                ));
    }

    public Mono<Book> getBookById(String id) {
        return webClient.get()
                .uri("/works/{id}.json", id)
                .retrieve()
                .bodyToMono(String.class)
                .map(data -> {
                    // Parse JSON response and convert to Book
                    // This is a simplified version
                    Book book = new Book();
                    book.setId(id);
                    // Add proper JSON parsing here
                    return book;
                });
    }

    private Book convertToBook(OpenLibraryDoc doc) {
        Book book = new Book();
        book.setId(doc.getKey());
        book.setTitle(doc.getTitle());
        book.setAuthors(doc.getAuthorNames());
        book.setFirstPublishedYear(doc.getFirstPublishYear());
        book.setCoverId(doc.getCoverId());

        if (doc.getIsbns() != null && !doc.getIsbns().isEmpty()) {
            book.setIsbn(doc.getIsbns().get(0));
        }

        // Default status based on some logic
        if (book.getFirstPublishedYear() != null &&
                book.getFirstPublishedYear() < 2000) {
            book.setStatus("Completed");
        }

        // Random rating for demo (1-5)
        book.setRating((int) (Math.random() * 5) + 1);

        return book;
    }

    public List<Book> getMyBooks() {
        // This would normally come from a database
        // For now, return some hardcoded books that match the frontend
        return List.of(
                createBook("Project Hail Mary", List.of("Andy Weir"), "54493401", "TBR", 3),
                createBook("Dune", List.of("Frank Herbert"), "447674", "Completed", 5),
                createBook("The Will of the Many", List.of("James Islington"), "63215324", "Reading", 4),
                createBook("The Shadow of the Gods", List.of("John Gwynne"), "56213084", "Completed", 4)
        );
    }

    private Book createBook(String title, List<String> authors, String coverId, String status, int rating) {
        Book book = new Book();
        book.setTitle(title);
        book.setAuthors(authors);
        book.setCoverId(coverId);
        book.setStatus(status);
        book.setRating(rating);
        return book;
    }
}