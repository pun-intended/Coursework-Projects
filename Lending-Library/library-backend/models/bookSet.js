"use strict"
const { NotFoundError } = require('../expressError.js')

const db = require('../db.js')

class BookSet {
    
    /**
     * Get all books sets
     * takes school id as optional parameter
     * 
     */
    static async getAll(schoolId = null){
        let sets
        let queryString = 
            `SELECT B.isbn, B.set_id, M.title, M.stage
            FROM books B
            JOIN book_sets sets ON B.set_id = sets.set_id
            JOIN master_books M on B.isbn = M.isbn`
        
        if(schoolId){
            queryString += ` WHERE sets.school_id = $1`
            sets = await db.query(queryString, [schoolId]);
        } else {
            sets = await db.query(queryString);
        };

        if (!sets.rows[0]) throw new NotFoundError(`No books found with school id ${schoolId}`);

        return sets.rows
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

        const setId = newSet.rows[0].set_id;
        
        let newBookSet;

        let stringQuery = `INSERT INTO books (isbn, set_id) 
        SELECT isbn, set_id FROM master_books                                       
        CROSS JOIN (SELECT set_id FROM book_sets WHERE set_id = $1) AS sets`

        if(!stage){
            const fullQuery = stringQuery + ` RETURNING set_id`
            newBookSet = await db.query(fullQuery,[setId]);
        } else{
            const fullQuery = stringQuery + `
                WHERE stage = $2 
                RETURNING set_id`
            newBookSet = await db.query(fullQuery,[setId, stage]);
        }

        

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
        
        if(!patchedSet.rows[0]) throw new NotFoundError(`No set found with ID ${setId}`);

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

        if (!deleteSet.rows[0]) throw new NotFoundError(`No set found with ID ${setId}`)

        return deleteSet.rows[0];
    }

}

module.exports = BookSet;