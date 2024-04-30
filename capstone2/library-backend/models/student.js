"use strict"

// TODO - rerun tests

const db = require('../db')
const { NotFoundError } = require('../expressError');

class Student {

    /**
     * Create new student record
     * 
     * {data} = {created: {id, first_name, last_name, level}}
     * 
     * Data should be {first_name, last_name, level}
     */
    static async create(data){
        const res = await db.query(
            `INSERT INTO students (id, first_name, last_name, class_id)
            VALUES (DEFAULT, $1, $2, $3)
            RETURNING id, first_name, last_name, class_id`,
                [data.first_name, 
                data.last_name, 
                data.class_id]
        )
        return res.rows[0]
    }
    
    /**
     * Get all students in class
     * 
     * Returns {students: [{id, first_name, last_name, level, has_read, book_id, title, isbn, borrow_date}, ...]}
     *  borrowing id
     */
    static async getAllStudents(){

        const students = await db.query(`
        SELECT  S.id,
                S.first_name,
                S.last_name,
                S.class_id,
                ARRAY(
                    SELECT isbn 
                    FROM borrow_record
                    JOIN books ON books.id = borrow_record.book_id
                    WHERE student_id = s.id
                ) AS has_read, 
                q2.title,
                q2.isbn,
                q2.book_id,
                q2.borrow_date,
                schools.id AS school_id
        FROM students S
        JOIN classes C ON C.id = S.class_id
        JOIN schools ON schools.id = C.school_id
        LEFT OUTER JOIN 
            (SELECT B.id as book_id, 
                    M.title, 
                    B.isbn, 
                    rec.borrow_date, 
                    rec.student_id
            FROM books as B 
            JOIN master_books M ON M.isbn = B.isbn
            JOIN borrow_record AS rec ON B.id = rec.book_id
            WHERE return_date IS NULL) AS q2 
        ON s.id = q2.student_id`)
        
        return students.rows;
    }

    /**
     * Return details on Student
     * 
     * {id} => {id, first_name, last_name, level}
     * 
     * throws NotFoundError if student ID doesn't exist
     */
    static async getStudent(studentId){

        const res = await db.query(
            `SELECT id, first_name, last_name, class_id
            FROM students
            WHERE id = $1`,
            [studentId]
        );

        if (!res.rows[0]) {
            throw new NotFoundError(`No student found with id ${studentId}`);
        }
        return res.rows[0];
    }

    /**
     * Return array of book that have not been read by a given student
     * 
     * {Studentid, schoolId} => [{isbn, title, stage, available}, ...]
     */
    static async getUnreadBooks(studentId, schoolId){
        const unread = await db.query(
            `SELECT isbn, 
                    title, 
                    stage, 
                    isbn IN (SELECT B.isbn FROM books B 
                        FULL JOIN borrow_record rec ON rec.book_id = B.id
                        JOIN book_sets set ON set.set_id = B.set_id
                        WHERE (rec.return_date IS NOT NULL OR rec.borrow_date IS NULL) and set.school_id = $1) AS available
            FROM master_books
            WHERE isbn NOT IN
                (SELECT isbn
                    FROM borrow_record
                    JOIN books ON books.id = borrow_record.book_id
                    WHERE student_id = $2)`,
            [schoolId, studentId]
        );
        return unread.rows;
    }

    //TODO - STRETCH
    /**
     * Set students class
     */
    static async setClass(studentId, classId){

        const updatedClass = await db.query(
            `UPDATE students
            SET (class_id = $1)
            WHERE student_id = $2
            RETURNING student_id`,
            [classId, studentId]
        );

        if(!updatedClass.rows[0]) throw NotFoundError(`Incorrect student ID or class ID`);

        return updatedClass.rows[0];
    }

        /**
     * Return an array with book IDs for books student has read.
     * 
     * {id} => [{id, isbn, title, stage, condition}, ...] 
     * @param {} studentId 
     */
    static async getReadBooks(studentId){
        const booksRead = await db.query(
            `SELECT B.isbn, M.title, M.stage, B.condition
            FROM books B
            JOIN master_books M ON M.isbn = B.isbn
            JOIN borrow_record rec ON rec.book_id = B.id
            WHERE rec.student_id = $1`,
            [studentId]
        )

        if(!booksRead.rows[0]) throw new NotFoundError(`No books found for student ID ${studentId}`)

        return booksRead;
    }

    /**
     * Add list of students to a given class
     */
    static async addToClass(classId, students){
        
        const params = []
        for(let i = 2; i < students.length - 1; i++){
            params.push(`$${i}`)
        }

        const addStudents = await db.query(
            `UPDATE students
            SET class_id = $1
            WHERE student_id IN (` + params.join(',') + `)`,
            [classId, ...students]
        )
    }
    
}

module.exports = Student;