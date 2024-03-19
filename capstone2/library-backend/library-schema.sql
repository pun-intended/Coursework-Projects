CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    address TEXT NOT NULL
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    school_id INTEGER NOT NULL
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    class_id INTEGER
        REFERENCES classes ON DELETE SET NULL,
    school_id INTEGER
        REFERENCES schools ON DELETE SET NULL,
    password TEXT NOT NULL,
    role string NOT NULL DEFAULT "user",
        CHECK (role IN ("user", "school_admin", "master"))
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    school_id INTEGER
        REFERENCES schools ON DELETE SET NULL,
    class_id INTEGER
        REFERENCES classes ON DELETE SET NULL,
    level TEXT NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    isbn TEXT NOT NULL,
    title TEXT NOT NULL,
    stage INTEGER NOT NULL,
    set INTEGER,
    school_id INTEGER,
    condition VARCHAR(10) NOT NULL
);

-- // TODO - fix dateTime formatting
CREATE TABLE borrow_record (
    id SERIAL PRIMARY KEY, 
    student_id INTEGER NOT NULL
        REFERENCES students ON DELETE CASCADE, 
    book_id INTEGER NOT NULL
        REFERENCES books ON DELETE CASCADE,
        -- This will be a problem for record keeping. How to replace with generic code?
        -- TRIGGER? MasterBooks table? Normalization could complicate function calls
    borrow_date VARCHAR(12) NOT NULL,
    return_date VARCHAR(12)
    -- returned_by INTEGER 
        -- REFERENCES users ON DELETE SET NULL
);