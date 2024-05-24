"use strict";

/** Routes for classes. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Class = require("../models/class");
const Student = require("../models/student")
const createSchema = require("../schemas/classCreate.json")
const patchSchema = require("../schemas/classPatch.json")

const router = new express.Router();

/** GET / => {classes: {class}...}
 * 
 * Get all classes
 * {class} contains {id, name, school_id}
 * 
 * Auth: Admin
 */
router.get("/", ensureAdmin, async function(req, res, next){
    try{
        const classes = await Class.getAll();
        return res.json({ classes });
    } catch(e){
        console.log(e)
        return next(e)
    }
})

/** POST /new {data} => {id, name, school_id}
 * 
 * Create a new class with the provided name and school id
 * returns the id, name and school_id
 * 
 * Auth: Admin
 */
router.post("/new", ensureAdmin, async function(req, res, next){
    try{
        const data = req.body;
        const validator = jsonschema.validate(data, createSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const newClass = await Class.create(data.name, data.schoolId);
        return res.status(201).json({ newClass })
    } catch (e) {
        return next(e)
    };
});

/** GET /id => {id, name, school_id}
 * 
 * Get id, name, and school id of a given class
 * 
 * Auth: Login
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try{
        const classInfo = await Class.get(req.params.id);
        return res.json({ classInfo });
    } catch(e) {
        return next(e)
    }
})

/** GET /id/students => {students...}
 * 
 * Get a list of all students in that class
 * Student data includes
 * 
 * Auth: Login
 */

router.get("/:id/students", ensureLoggedIn, async function (req, res, next) {
    try{
        const students = await Student.getAllStudents(null, req.params.id);
        return res.json({ students });
    } catch(e) {
        return next(e)
    }
})

/** PATCH /id {name} => {id, name, school_id}
 * 
 * Change the name of a class
 * returns id, name, school_id
 * 
 * Auth: Admin
 */
router.patch("/:id", ensureAdmin, async function (req, res, next) {
    try{
        const data = req.body
        const validator = jsonschema.validate(data, patchSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const updatedClass = await Class.patch(req.params.id, data);
        return res.status(200).json({ updatedClass });
    } catch (e) {
        return next(e);
    };
})

/** DELETE /id => {class_id}
 * 
 * Deletes class for a given class_id
 * 
 * Auth: Admin
 */
router.delete("/:id", ensureAdmin, async function(req, res, next) {
    try{
        const deletedClass = await Class.remove(req.params.id);
        return res.json({ deletedClass });
    } catch(e) {
        return next(e);
    }
})

module.exports = router;