"use strict";

/** Routes for classes. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureMaster, ensureAdmin } = require("../middleware/auth");
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
        return res.json({ classes });
    } catch(e){
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
        const newClass = await Class.create(data.name, data.schoolId);
        return res.status(201).json({ newClass })
    } catch (e) {
        console.log(e)
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

/** PATCH /id {name} => {id, name, school_id}
 * 
 * Change the name of a class
 * returns id, name, school_id
 * 
 * Auth: Admin
 */
router.patch("/:id", ensureAdmin, async function (req, res, next) {
    try{
        const updatedClass = await Class.patch(req.params.id, req.body.name);
        return res.status(201).json({ updatedClass });
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