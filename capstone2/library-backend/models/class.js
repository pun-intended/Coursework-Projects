"use strict"

const db = require('../db');
const { NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');
// Error handlers
// sql for partial update method

// ----- After completion
class Class {

    // Get Class
    static async get(id){
        const classInfo = await db.query(
            `SELECT id, name, school_id
            FROM classes
            WHERE id = $1`,
            [id]
        );

        if(!classInfo.rows[0]) throw new NotFoundError(`No class found with ID ${id}`)

        return classInfo.rows[0];
    }

    // get all classes
    static async getAll(school_id = null){
        const queryString = 
            `SELECT id, name, school_id
            FROM classes`
        let allClasses;

        if(school_id){
            queryString += ` WHERE school_id = $1`
            allClasses = await db.query(queryString, [school_id]);
        } else {
            allClasses = await db.query(queryString)
        }
        
        
        return allClasses.rows;
    }

    /**
     * Create new class with given name
     */
    static async create(className, schoolId){
        const school = await db.query(
            `SELECT id FROM schools
            WHERE id = $1`,
            [schoolId]
        )
        if(!school.rows[0]) throw new NotFoundError(`No school with number ${schoolId}`);
        
        const newClass = await db.query(
            `INSERT INTO classes (name, school_id)
            VALUES ($1, $2)
            RETURNING id, name, school_id`,
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
            WHERE id = $1
            RETURNING id`,
            [classId]
        );

        if(!deletedClass.rows[0]) throw new NotFoundError(`No class with id ${classId}`);

        return deletedClass.rows[0];
    }

    /**
     * Update class information
     */
    static async patch(classId, data){

        const {setCols, values} = sqlForPartialUpdate(data, {
            schoolId: 'school_id'
        })

        const classVarIdx = `$${values.length + 1}`

        const querySql = 
            `UPDATE classes
            SET ${setCols}
            WHERE id = ${classVarIdx}
            RETURNING id, name, school_id
            `
        
        const patchedClass = await db.query(querySql, [...values, classId]);

        if (!patchedClass.rows) throw new NotFoundError(`No class found with class id ${classId}`);

        return patchedClass.rows[0];
    }
}

module.exports = Class;
