"use strict"

const db = require('../db');
const bcrypt = require('bcrypt')
const { sqlForPartialUpdate } = require("../helpers/sql")
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {

    /**
     * Create a new user with the given data
     * 
     *  { data }=> 
     *      {id, first_name, last_name, class_id, school_id, role}
     * 
     * Data should be {id, first_name, last_name, class_id, school_id, password, role}
     * 
     * Throws BadRequestError if id found
     */
    static async create(data){
        const duplicateCheck = await db.query(
            `SELECT id
            FROM users
            WHERE id = $1`,
            [data.id]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate user ID: ${data.id}`);
        }
        
        const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

        const res = await db.query(`
        INSERT INTO users 
            (id,
            first_name,
            last_name,
            class_id,
            school_id,
            password,
            role)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, first_name, last_name, class_id, school_id, role`,
        [data.id, data.first_name, data.last_name, data.class_id, data.school_id, hashedPassword, data.role]);

        const user = res.rows[0];

        return user;
    }

    /**
     * Get a given user
     * 
     * {id} => {id, first_name, last_name, class_id, school_id, isAdmin}
     * 
     * Throws NotFoundError if user id not found
     */
    static async getUser(id){
        const res = await db.query(`
        SELECT id, first_name, last_name, class_id, school_id, role
        FROM users
        WHERE id = $1`,
        [id]);

        const user = res.rows[0];

        if (!user) throw new NotFoundError(`No user found with ID ${id}`);

        return user;
    }

    /**
     * Get all users
     * 
     * Returns {users: [{id, first_name, last_name, class_id, school_id, role}, ...]}
     */
    static async getAll(){
        const res = await db.query(`
        SELECT id, first_name, last_name, class_id, school_id, role
        FROM users`);
        
        return res.rows;
    }

    /**
     * Delete a given user
     * 
     * {id} => {deleted: id}
     * 
     * Throws NotFoundError if id not found
     */
    static async remove(id){
        const res = await db.query(`
        DELETE FROM users
        WHERE id = $1
        RETURNING id`,
        [id]);

        const user = res.rows[0];

        if (!user) throw new NotFoundError(`No user found with ID ${id}`);

        return user;
    }

    /**
     * Update user data
     * 
     * {data} => {updated: {id, first_name, last_name, is_admin}}
     * 
     * Data can include {firstName, lastName, password, isdmin}
     * 
     * Throws NotFoundError if id not found
     */
    // TODO - Check all instances of first_name etc for naming conventions
    // QUESTION - Why does jobly update method throw BadRequestError?
    static async updateUser(id, data) {
        if (data.password) {
          data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }
    
        const { setCols, values } = sqlForPartialUpdate(
            data, {});
        const userIdVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE users 
                          SET ${setCols} 
                          WHERE id = ${userIdVarIdx} 
                          RETURNING id,
                                    first_name,
                                    last_name,
                                    class_id,
                                    school_id,
                                    role`;
        const result = await db.query(querySql, [...values, id]);
        const user = result.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${id}`);
    
        delete user.password;
        return user;
      }

    /**
     * Authenticate username and Password
     * 
     * {id, password} => {id, first_name, last_name, is_admin}
     * 
     * Throws UnauthorizedError if user id or password is incorrect
     */
    static async authenticate(data){
        const result = await db.query(`
        SELECT  id, 
                password, 
                first_name,
                last_name,
                class_id,
                school_id,
                role
        FROM users
        WHERE id = $1`,
        [data.id]);

        const user = result.rows[0];

        if(user){
            const isValid = await bcrypt.compare(data.password, user.password);
            if(isValid){
                delete user.password;
                return user;
            }
        }
        throw new UnauthorizedError("Invalid id/password");
        

        
    }
}

module.exports = User