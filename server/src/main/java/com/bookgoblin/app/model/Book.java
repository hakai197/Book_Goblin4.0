package com.bookgoblin.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String genre;

    @Column(nullable = false)
    @Builder.Default
    private String status = "TBR";

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer progress = 0;

    @Column(length = 500)
    private String notes;

    private String coverUrl;
    private String isbn;
    private Integer publishedYear;
    private Integer pages;
    private String publisher;

    @Column(length = 1000)
    private String description;

    @Builder.Default
    private LocalDate dateAdded = LocalDate.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
