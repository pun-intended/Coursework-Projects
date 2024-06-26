"use strict"

const db = require('../db');
const { NotFoundError } = require('../expressError');
// Error handlers
// sql for partial update method

// ----- After completion
class School {

    // get all schools
    static async getAll(){
        const allSchools = await db.query(
            `SELECT id, name
            FROM schools`
        );
        return allSchools.rows;
    }

    // Get school by ID
    static async get(id){
        const school = await db.query(
            ` SELECT id, name
            FROM schools
            WHERE id = $1`,
            [id]
        );
        if(!school.rows[0]) throw new NotFoundError(`No school found with ID ${id}`)
        return school.rows[0];
    }
    // Add school
    static async create(name){
        const newSchool = await db.query(
            `INSERT INTO schools (name)
            VALUES($1)
            RETURNING id, name`,
            [name]
        );

        return newSchool.rows[0];
    } 

    // Edit school details
    static async patch(schoolId, name){
        const updateSchool = await db.query(
            `UPDATE schools
            SET name = $1
            WHERE id = $2
            RETURNING id, name`,
            [name, schoolId]
        );

        if(!updateSchool.rows[0]) throw new NotFoundError(`No school found with ID ${schoolId}`);
        
        return updateSchool.rows[0];
    }

    // Delete school
    static async remove(schoolId){
        const deletedSchool = await db.query(
            `DELETE FROM schools
            WHERE id = $1
            RETURNING id`,
            [schoolId]
        );

        if(!deletedSchool.rows[0]) throw new NotFoundError(`No school found with ID ${schoolId}`)

        return deletedSchool.rows[0];
    }
}

module.exports = School;