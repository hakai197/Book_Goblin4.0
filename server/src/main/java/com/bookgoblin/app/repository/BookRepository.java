package com.bookgoblin.app.repository;

import com.bookgoblin.app.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByUserIdOrderByDateAddedDesc(Long userId);
    List<Book> findByUserIdAndStatus(Long userId, String status);

    @Query("SELECT b FROM Book b WHERE b.user.id = :uid AND (LOWER(b.title) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%',:q,'%')))")
    List<Book> search(@Param("uid") Long userId, @Param("q") String query);

    long countByUserIdAndStatus(Long userId, String status);
    long countByUserId(Long userId);
}
