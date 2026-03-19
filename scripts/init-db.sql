-- ============================================
-- Book Goblin - Database Initialization Script
-- MySQL 8.x
-- ============================================

CREATE DATABASE IF NOT EXISTS bookgoblin
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bookgoblin;

-- ----------------------------
-- Users table
-- ----------------------------
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    username    VARCHAR(255)    NOT NULL,
    email       VARCHAR(255)    NOT NULL,
    password    VARCHAR(255)    NOT NULL,
    role        VARCHAR(255)    NOT NULL DEFAULT 'ROLE_USER',
    created_at  DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email    UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Books table
-- ----------------------------
CREATE TABLE IF NOT EXISTS books (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    title           VARCHAR(255)    NOT NULL,
    author          VARCHAR(255)    NOT NULL,
    genre           VARCHAR(255),
    status          VARCHAR(255)    NOT NULL DEFAULT 'TBR',
    rating          DOUBLE          DEFAULT 0.0,
    progress        INT             DEFAULT 0,
    notes           VARCHAR(500),
    cover_url       VARCHAR(255),
    isbn            VARCHAR(255),
    published_year  INT,
    pages           INT,
    publisher       VARCHAR(255),
    description     VARCHAR(1000),
    date_added      DATE,
    user_id         BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT fk_books_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Indexes for common queries
-- ----------------------------
CREATE INDEX idx_books_user_id        ON books (user_id);
CREATE INDEX idx_books_status         ON books (status);
CREATE INDEX idx_books_user_status    ON books (user_id, status);
CREATE INDEX idx_books_date_added     ON books (date_added DESC);

-- ----------------------------
-- Default admin user
-- Password: Admin123! (BCrypt encoded)
-- ----------------------------
INSERT INTO users (username, email, password, role, created_at)
VALUES (
    'admin',
    'admin@bookgoblin.com',
    '$2b$10$O0ubuzHpZMeutrO2HYo3kObfnHYbVvqDkZLrzSDa4P0hhLnonpcf.',
    'ROLE_ADMIN',
    NOW()
)
ON DUPLICATE KEY UPDATE id = id;
