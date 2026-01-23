package com.bookgoblin.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class OpenLibraryResponse {
    private int numFound;
    private int start;
    private boolean numFoundExact;
    private List<OpenLibraryDoc> docs;
}

@Data
class OpenLibraryDoc {
    private String key;
    private String title;

    @JsonProperty("author_name")
    private List<String> authorNames;

    @JsonProperty("first_publish_year")
    private Integer firstPublishYear;

    @JsonProperty("cover_i")
    private String coverId;

    @JsonProperty("isbn")
    private List<String> isbns;

    @JsonProperty("edition_count")
    private Integer editionCount;

    private List<String> language;
}