"use strict"

const db = require('../db')
// Error handlers
// sql for partial update method

// ----- After completion
class Class {

    /**
     * Create new class with given name
     */
    static async create(className, schoolId){
        const newClass = await db.query(
            `INSERT INTO classes (name, school_id)
            VALUES ($1, $2)
            RETURNING name, school`,
            [className, schoolId]
        )
        
        return newClass.rows[0];
    }

    /**
     * Remove class record
     */
    static async remove(){}

    /**
     * Update class information
     */
    static async patchClass(){}
}

module.exports = Class;
