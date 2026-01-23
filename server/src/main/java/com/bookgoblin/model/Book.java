package com.bookgoblin.model;

import lombok.Data;
import java.util.List;

@Data
public class Book {
    private String id;
    private String title;
    private List<String> authors;
    private Integer firstPublishedYear;
    private String coverId;
    private String isbn;
    private String status = "TBR"; // TBR, Reading, Completed
    private Integer rating = 0;

    public String getCoverUrl() {
        if (coverId != null && !coverId.isEmpty()) {
            return String.format("https://covers.openlibrary.org/b/id/%s-M.jpg", coverId);
        }
        return "/img/default-cover.jpg";
    }
}