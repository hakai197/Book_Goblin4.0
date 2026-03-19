package com.bookgoblin.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private String status = "TBR"; // TBR, Reading, Completed, DNF

    private Double rating = 0.0;

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

    private LocalDate dateAdded = LocalDate.now();
}
