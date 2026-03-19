package com.bookgoblin.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Data;

@Data
public class OpenLibraryDoc {
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
