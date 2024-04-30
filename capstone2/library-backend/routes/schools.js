"use strict";

/** Routes for schools. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureMaster, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Class = require("../models/school");
const School = require("../models/school");

const router = new express.Router();

/** GET
 * get all schools
 */
router.get("/", ensureAdmin, async function (req, res, next){
    try{
        const schools = await School.getAll();
        return res.json({ schools });
    } catch(e) {
        return next(e);
    }
})

/** GET /:id/students => {students: [{id, first_name, last_name, level}]}
 * 
 * Returns {id, first_name, last_name, level} for all students at
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

/** GET /id => {school_data}
 * Return data on single school
 * 
 * 
 */
router.get("/:id", ensureLoggedIn, async function(req, res, next){
    try{
        const school = await School.get(req.params.id);
        return res.json({ school });
    } catch(e) {
        return next(e);
    }
});

/** POST
 * create a new school
 */
router.post("/new", ensureMaster, async function (req, res, next){
    try{
        const newSchool = await School.create(req.body.name);
        return res.status(201).json({newSchool});
    } catch(e) {
        return next(e)
    }
})

/** PATCH
 * Edit school name
 */
router.patch("/:id", ensureMaster, async function (req, res, next){
    try{
        const patchSchool = await School.patch(req.params.id, req.body.name);
        return res.json({patchSchool});
    } catch(e) {
        return next(e);
    }
})

/** DELETE
 * remove a school
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