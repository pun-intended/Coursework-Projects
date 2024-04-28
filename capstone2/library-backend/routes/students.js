"use strict";
// TODO - add student method (admin)

/** Routes for students. */

// const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Student = require("../models/student");

// const schema = require("../schemas/schema.json");

const router = new express.Router();

router.post("/", ensureAdmin, async function (req, res, next) {
    try{
        const newStudent = await Student.create(req.body);
        req.return({ newStudent });
    }catch(e){
        return next(e);
    }
})

/** GET / => {students: [{id, first_name, last_name, level}]}
 * 
 * Returns {id, first_name, last_name, level} for all students
 * 
 * Auth: login
 */
// TODO - Refine search to school/class
router.get("/", ensureLoggedIn, async function (req, res, next) {
    try{
        const students = await Student.getAllStudents();
        return res.json({students});
    }catch(e){
        return next(e);
    }
})

/** GET /[id] => {id, first_name, last_name, level}
 * 
 * Returns {id, first_name, last_name, level}
 * 
 * Auth: login
 */
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try{
        const student = await Student.getStudent(req.params.id);
        return res.json({student});
    } catch(e) {
        return next(e);
    }
})

/** GET /[id]/unread => {books: [{book}, ...]}
 * 
 * Returns {id, isbn, title, stage, condition} For all books 
 * not read by student
 * 
 * Auth: login
 */
router.get("/:id/unread", ensureLoggedIn, async function (req, res, next) {
    try{
        // fail fast if no student
        const student = await Student.getStudent(req.params.id);
        const unread = await Student.getUnreadBooks(req.params.id);
        return res.json({unread});
    }catch(e){
        return next(e);
    }
})

module.exports = router;