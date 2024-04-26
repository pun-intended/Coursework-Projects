"use strict";

/** Routes for schools. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureMaster, ensureAdmin, ensureAdmin } = require("../middleware/auth");
const Class = require("../models/school");
const School = require("../models/school");

const router = new express.Router();

/** GET
 * get all schools
 */
router.get("/", ensureAdmin, async function (req, res, next){
    try{
        const schools = await School.getAll();
        req.return({ schools });
    } catch(e) {
        return next(e);
    }
})

/** POST
 * create a new school
 */
router.post("/new", ensureMaster, async function (req, res, next){
    try{
        const newSchool = await School.create(req.body.name);
        req.return(newSchool);
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
        req.return(patchSchool);
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
        req.return(deleteSchool);
    } catch(e) {
        return next(e);
    }
})