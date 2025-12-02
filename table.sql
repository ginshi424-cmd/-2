CREATE DATABASE IF NOT EXISTS f1_tickets;
USE f1_tickets;

CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    year INT NOT NULL,
    image_url TEXT,
    flag_url TEXT,
    tickets JSON
);