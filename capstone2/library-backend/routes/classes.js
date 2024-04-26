"use strict";

/** Routes for classes. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureMaster, ensureAdmin, ensureAdmin } = require("../middleware/auth");
const Class = require("../models/class");

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
        req.return({ classes });
    } catch(e){
        return next(e)
    }
})


/** POST /new {data} => {class_id, name, school_id}
 * 
 * Create a new class with the provided name and school id
 * returns the class_id, name and school name
 * 
 * Auth: Admin
 */
router.post("/new", ensureAdmin, async function(req, res, next){
    try{
        const newClass = await Class.create(data.name, data.schoolId);
        req.return({ newClass })
    } catch (e) {
        return next(e)
    };
});

/** PATCH /id {name} => {class_id, name, school_id}
 * 
 * Change the name of a class
 * returns class_id, name, school_id
 * 
 * Auth: Admin
 */
router.patch("/:id", ensureAdmin, async function (req, res, next) {
    try{
        const updatedClass = await Class.patch(req.params.id, req.body.name);
        req.return({ updatedClass });
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
        req.return({ deletedClass });
    } catch(e) {
        return next(e);
    }
})

module.exports = router;