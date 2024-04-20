CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    school_id INTEGER NOT NULL 
        REFERENCES schools(id) ON DELETE CASCADE,
    level VARCHAR(5) NOT NULL
);

CREATE TABLE master_books (
    isbn text PRIMARY KEY,
    title TEXT NOT NULL,
    stage INTEGER NOT NULL
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    class_id INTEGER
        REFERENCES classes(id) ON DELETE SET NULL,
    school_id INTEGER
        REFERENCES schools(id) ON DELETE SET NULL,
    password TEXT NOT NULL,
    role VARCHAR(14) NOT NULL DEFAULT 'user',
        CHECK (role IN ('user', 'school_admin', 'master_admin'))
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    class_id INTEGER
        REFERENCES classes(id) ON DELETE SET NULL
);

CREATE TABLE book_sets (
    set_id SERIAL PRIMARY KEY,
    school_id INTEGER 
        REFERENCES schools(id) ON DELETE SET NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    isbn TEXT NOT NULL
        REFERENCES master_books(isbn) ON DELETE CASCADE,
    book_set INTEGER
        REFERENCES book_sets(set_id) ON DELETE SET NULL,
    condition VARCHAR(10) DEFAULT 'Great'
);

-- // TODO - fix dateTime formatting
CREATE TABLE borrow_record (
    id SERIAL PRIMARY KEY, 
    student_id INTEGER NOT NULL
        REFERENCES students(id) ON DELETE CASCADE, 
    book_isbn TEXT NOT NULL
        REFERENCES master_books(isbn) ON DELETE CASCADE,
    borrow_date VARCHAR(12) NOT NULL,
    return_date VARCHAR(12)
);