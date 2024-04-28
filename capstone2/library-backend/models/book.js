"use strict"
const { NotFoundError } = require('../expressError.js')

const db = require('../db')

class Book {
    /**
     * ---OK
     * Given a student ID and book ID, create a borrow record, and 
     * return the data.
     * 
     *  {data} => {id, book_id, student_id, borrow_date}
     * Data should be {book_id, student_id, date}
     * 
     * Throws NotFoundError if student or book is not found
     */
    static async checkOut(data){

        const checkBookExists = await db.query(
            `SELECT id FROM books WHERE id = $1`,
            [data.book_id]
        )

        const checkStudentExists = await db.query(
            `SELECT id FROM students WHERE id = $1`,
            [data.student_id]
        )

        if(!checkBookExists.rows[0] || !checkStudentExists.rows[0]){
            throw new NotFoundError("Error in book id or Student id");
        }

        const res = await db.query(
            `INSERT INTO borrow_record
            (book_id, student_id, borrow_date)
            VALUES ($1, $2, $3)
            RETURNING id, book_id, student_id, borrow_date`,
            [data.book_id, 
            data.student_id, 
            data.date]
        )
        const borrowRecord = res.rows[0]

        return borrowRecord
    }

    /**
     * Given a book ID, check the book in
     * 
     * {data} => {id, return_date}
     * 
     * {data} should be {book_id, date, condition}
     */
    static async checkIn(data){
        const res = await db.query(
            `UPDATE borrow_record
            SET return_date = $1, condition = $2
            WHERE book_id = $3 AND return_date IS NULL
            RETURNING id, return_date
            `,
            [data.date, data.condition, data.book_id]
        )
        const checkIn = res.rows[0]

        if (!checkIn) {
            throw new NotFoundError(`No outstanding record found for book id ${data.book_id}`)
        }

        return checkIn;
    }

    /**
     * Get all book data given the ID
     * 
     * {book_id} => {book_id, isbn, title, stage, condition, student}
     *  where student is {student_id, first_name, last_name, class_id, borrowDate}
     */
    static async getBook(bookId){
        const bookRes = await db.query(
            `SELECT B.id AS book_id,
                    B.isbn,
                    M.title,
                    M.stage,
                    B.condition
            FROM books B JOIN master_books M ON B.isbn = M.isbn

            WHERE id = $1`,
            [bookId]);

        const book = bookRes.rows[0]

        if (!book) throw new NotFoundError(`No book with ID ${bookId}`)

        const borrowRes = await db.query(
            `SELECT S.id,
                    S.first_name,
                    S.last_name,
                    S.class_id,
                    rec.borrow_date
            FROM borrow_record rec
            JOIN students S ON S.id = rec.student_id
            JOIN books B ON B.id = rec.book_id
            WHERE B.id = $1 AND rec.return_date IS NULL`,
            [bookId]
        )

        const borrowing = borrowRes.rows[0]

        if(borrowing){
            book.student = borrowing;
        }

        return book;
    }

    /**
     * ---OK
     * Get all books in school library.
     * 
     * Returns [{isbn, title, stage, available}, ...] 
     */
    static async getAllBooks(school_id, stage = null){

        // Will the available field cause false positives when a book is taken out a second time? Limit IDs to null return dates?
        const baseQuery = 
            `SELECT isbn,
            title,
            stage,
            isbn IN (SELECT B.isbn FROM books B
                            FULL JOIN borrow_record rec ON rec.book_id = B.id
                            JOIN book_sets set ON set.set_id = b.set_id
                    WHERE (rec.return_date IS NOT NULL OR rec.borrow_date IS NULL) AND set.school_id = $1) AS available
            FROM master_books`
        
        const stageFilter = stage ? ` WHERE stage = ${stage}`: ""

        const books = await db.query(baseQuery.concat(stageFilter), [school_id])
        return books.rows
    }

    /**
     * Get all outstanding books
     * 
     * Returns [{book_id, isbn, title, stage, condition, student_id, first_name, last_name, borrow_date}, ...]
     */
    static async getOutstanding(schoolId){
        // console.log(`school Id - ` + schoolId)
        const books = await db.query(
            `SELECT B.id AS book_id,
                    M.isbn,
                    M.title,
                    M.stage,
                    B.condition,
                    S.id AS student_id,
                    S.first_name,
                    S.last_name,
                    rec.borrow_date
            FROM books B
            JOIN borrow_record AS rec ON B.id = rec.book_id
            JOIN book_sets AS set ON set.set_id = B.set_id
            JOIN master_books AS M on B.isbn = M.isbn
            JOIN students AS S on S.id = rec.student_id
            WHERE rec.return_date IS NULL AND set.school_id = $1`,
            [schoolId]
        )
        return books.rows
    }

    // Add individual book
    static async add(isbn, set){
        const newBook = await db.query(
            `INSERT INTO books (isbn, set_id)
            VALUES ($1, $2)
            RETURNING id`
            [isbn, set]
        )
        return newBook.rows
    }

    // Update book
    static async update(data, id){
        // try to update data in book record
        const { setCols, values } = sqlForPartialUpdate(
            data, {});
        const bookIdVarIdx = `$${values.length +1}`
        const queryStr = `
            UPDATE books
            SET ${setCols}
            WHERE id = ${bookIdVarIdx}
            RETURNING id`;
        const updateBook = await db.query(`${queryStr}`, [...values, id]);

        const book = updateBook.rows[0];

        return book;

    }

    // Delete individual book
    static async remove(book_id){
        
        const book = await db.query(
            `DELETE FROM books
            WHERE id = $1
            RETURNING id`,
            [book_id]
        )

        const deleted = book.rows[0];
        
        if(!book) throw new NotFoundError(`No book found with ID: ${book_id}`)
        return book
    }
}

module.exports = Book;