"use strict";

/** Routes for schools. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureMaster, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Class = require("../models/school");
const School = require("../models/school");
const BookSet = require("../models/bookSet");

const router = new express.Router();

/** GET / => {schools: {id, name}}
 * get data for all schools
 * 
 * Auth: login
 */
router.get("/", ensureLoggedIn, async function (req, res, next){
    try{
        const schools = await School.getAll();
        return res.json({ schools });
    } catch(e) {
        return next(e);
    }
})

/** GET /id => {school_data}
 * Return data on single school
 * 
 * Auth: login
 */
router.get("/:id", ensureLoggedIn, async function(req, res, next){
    try{
        const school = await School.get(req.params.id);
        return res.json({ school });
    } catch(e) {
        return next(e);
    }
});

/** GET /:id/students => {students: [{id, first_name, last_name, class_id}]}
 * 
 * Returns {id, first_name, last_name, class_id} for all students at
 * school with parameter ID
 * 
 * Auth: login
 */
router.get("/:id/students", ensureLoggedIn, async function (req, res, next) {
    try{
        const students = await Student.getAllStudents(req.params.id);
        return res.json({students});
    }catch(e){
        return next(e);
    }
})

/** GET /:id/classes => {classes: [{id, name, school_id}]}
 * 
 * Returns {id, name, school_id} for all classes at
 * school with parameter ID
 * 
 * Auth: login
 */
router.get("/:id/classes", ensureLoggedIn, async function (req, res, next) {
    try{
        const classes = await Class.getAll(req.params.id);
        return res.json({classes});
    }catch(e){
        return next(e);
    }
})

/** GET /:id/books => {books: [{id, name, school_id}]}
 * 
 * Returns {id, name, school_id} for all classes at
 * school with parameter ID
 * 
 * Auth: login
 */
router.get("/:id/books", ensureLoggedIn, async function (req, res, next) {
    try{
        const books = await BookSet.getAll(req.params.id);
        return res.json({books});
    }catch(e){
        return next(e);
    }
})

/** POST /new {name} => {id, name}
 * 
 * create a new school
 * 
 * Auth: master
 */
router.post("/new", ensureMaster, async function (req, res, next){
    try{
        const newSchool = await School.create(req.body.name);
        return res.status(201).json({newSchool});
    } catch(e) {
        return next(e)
    }
})

/** PATCH /:id {name} => {id, name}
 * 
 * Edit school name
 * 
 * Auth: master
 */
router.patch("/:id", ensureMaster, async function (req, res, next){
    try{
        const patchSchool = await School.patch(req.params.id, req.body.name);
        return res.json({patchSchool});
    } catch(e) {
        return next(e);
    }
})

/** DELETE /:id => {id}
 * 
 * remove a school
 * 
 * Auth: master
 */
router.delete("/:id", ensureMaster, async function (req, res, next){
    try{
        const deleteSchool = await School.remove(req.params.id);
        return res.json({deleteSchool});
    } catch(e) {
        return next(e);
    }
})
module.exports = router;