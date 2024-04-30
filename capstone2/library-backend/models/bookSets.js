"use strict"
const { NotFoundError } = require('../expressError.js')

const db = require('../db')

class BookSet {
    
    /**
     * Get all books sets in a given school
     * 
     */
    static async getAll(schoolId){
        const allSets = await db.query(
            `SELECT isbn, set_id, title, stage
            FROM books 
            JOIN book_sets ON book.set_id = book_sets.set_id
            WHERE school_id = $1
            `,
            [schoolId]
        )
    }
    
    /**
     * Create a new set of books
     * @param {*} schoolId 
     */
    static async create(schoolId, stage = null){
        const newSet = await db.query(
            `INSERT INTO book_sets (school_id)
            VALUES ($1)
            RETURNING set_id`,
            [schoolId]
        );

        const setId = newSet.rows[0];
        
        if(!stage){
        const newBookSet = await db.query(
            `INSERT INTO books (isbn, set_id) 
            SELECT isbn, set_id FROM master_books                                       
            CROSS JOIN (SELECT set_id FROM book_sets WHERE set_id = $1) AS sets
            RETURNING set_id
            `,
            [setId]
            );
        }

        const newBookSet = await db.query(
            `INSERT INTO books (isbn, set_id) 
            SELECT isbn, set_id FROM master_books                                       
            CROSS JOIN (SELECT set_id FROM book_sets WHERE set_id = $1) AS sets
            WHERE stage = $2
            RETURNING set_id
            `,
            [setId, stage]
            );

        return newBookSet.rows[0]
    }

    /**
     * Patch book set to change schools of entire set
     * 
     */
    static async patch(schoolId, setId){
        const patchedSet = await db.query(
            `UPDATE book_sets
            SET school_id = $1
            WHERE set_id = $2
            RETURNING set_id`,
            [schoolId, setId]
        );
        
        if(!patchedSet.rows[0]) throw NotFoundError(`No set found with ID ${setId}`);

        return patchedSet.rows[0];
    }

    /**
     * Delete set of books
     * 
     * @param {*} setId 
     * @returns 
     */
    static async remove(setId){
        const deleteSet = await db.query(
            `DELETE FROM book_sets
            WHERE set_id = $1
            RETURNING set_id`,
            [setId]
        );

        if (!deleteSet.rows[0]) throw NotFoundError(`No set found with ID ${setId}`)

        return deleteSet.row[0];
    }

}

module.exports = BookSet;