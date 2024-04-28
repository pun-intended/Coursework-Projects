"use strict"

const db = require('../db');
const { NotFoundError } = require('../expressError');
// Error handlers
// sql for partial update method

// ----- After completion
class School {

    // get all schools
    static async getAll(){
        const allSchools = db.query(
            `SELECT id, name
            FROM schools`
        );
        return allSchools.rows;
    }

    // Add school
    static async create(name){
        const newSchool = db.query(
            `INSERT INTO schools
            VALUES($1)
            RETURNING id`,
            [name]
        );

        return newSchool.rows[0];
    } 

    // Edit school details
    static async patch(schoolId, name){
        const updateSchool = db.query(
            `UPDATE schools
            SET (name = $1)
            WHERE id = $2
            RETURNING id, name`,
            [name, schoolId]
        );

        if(!updateSchool.rows[0]) throw NotFoundError(`No school found with ID ${updateSchool}`);
        
        return updateSchool.rows[0];
    }

    // Delete school
    static async remove(schoolId){
        const deletedSchool = db.query(
            `DELETE FROM schools
            WHERE id = $1
            RETURNING id`,
            [schoolId]
        );

        if(!deletedSchool.rows[0]) throw NotFoundError(`No school found with ID ${schoolId}`)

        return deletedSchool.rows[0];
    }
}

module.exports = School;