CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    address TEXT
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    school_id INTEGER NOT NULL 
        FOREIGN KEY REFERENCES schools(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    class_id INTEGER
        FOREIGN KEY REFERENCES classes(id) ON DELETE SET NULL,
    school_id INTEGER
        FOREIGN KEY REFERENCES schools(id) ON DELETE SET NULL,
    password TEXT NOT NULL,
    role VARCHAR(14) NOT NULL DEFAULT "user",
        CHECK (role IN ("user", "school_admin", "master_admin"))
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    school_id INTEGER
        FOREIGN KEY REFERENCES schools(id) ON DELETE SET NULL,
    class_id INTEGER
        FOREIGN KEY REFERENCES classes(id) ON DELETE SET NULL,
    level TEXT NOT NULL
);

CREATE TABLE master_books (
    isbn text PRIMARY KEY,
    title TEXT NOT NULL,
    stage INTEGER NOT NULL,
)

CREATE TABLE book_sets (
    set_id SERIAL PRIMARY KEY,
    school_id INTEGER 
        FOREIGN KEY REFERENCES schools(id) ON DELETE SET NULL,
)

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    isbn TEXT NOT NULL
        FOREIGN KEY REFERENCES master_books(isbn) ON DELETE CASCADE,
    set INTEGER
        FOREIGN KEY REFERENCES book_sets(set_id) ON DELETE SET 0,
    school_id INTEGER
        FOREIGN KEY REFERENCES schools(id) ON DELETE SET NULL,
    condition VARCHAR(10) NOT NULL
);

-- // TODO - fix dateTime formatting
CREATE TABLE borrow_record (
    id SERIAL PRIMARY KEY, 
    student_id INTEGER NOT NULL
        FOREIGN KEY REFERENCES students(id) ON DELETE CASCADE, 
    book_isbn INTEGER NOT NULL
        FOREIGN KEY REFERENCES master_books(isbn) ON DELETE CASCADE,
    borrow_date VARCHAR(12) NOT NULL,
    return_date VARCHAR(12)
);