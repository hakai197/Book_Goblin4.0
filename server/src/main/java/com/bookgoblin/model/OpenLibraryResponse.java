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
