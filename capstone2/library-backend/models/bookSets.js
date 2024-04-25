"use strict"
const { NotFoundError } = require('../expressError.js')

const db = require('../db')

class BookSet {
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

    // Delete set
    static async remove(setId){
        const deleteSet = db.query(
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