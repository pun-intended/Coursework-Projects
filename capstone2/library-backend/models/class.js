"use strict"

const db = require('../db');
const { NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');
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
        );
        
        return newClass.rows[0];
    }

    /**
     * Remove class record
     */
    static async remove(classId){
        const deletedClass = await db.query(
            `DELETE FROM classes
            WHERE class_id = $1
            RETURNING class_id`,
            [classId]
        );

        if(!deletedClass.rows[0]) throw NotFoundError(`No class with id ${classId}`);

        return deletedClass.rows[0];
    }

    /**
     * Update class information
     */
    static async patchClass(classId, data){
        
        const {setCols, values} = sqlForPartialUpdate(data)

        const classVarIdx = `$${values.length + 1}`

        const querySql = 
            `UPDATE classes
            SET ${setCols}
            WHERE class_id = ${classVarIdx}
            RETURNING class_id, class_name, school_id
            `
        
        const patchedClass = db.query(querySql, [...values, classId]);

        if (!patchedClass.rows[0]) throw NotFoundError(`No class found with class id ${classId}`);

        return patchedClass.rows[0];
    }
}

module.exports = Class;
