"use strict";
/** Routes for users. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, UnauthorizedError } = require("../expressError");
const { ensureAdmin, ensureCorrectUserOrAdmin, ensureLoggedIn } = require("../middleware/auth");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

const createSchema = require("../schemas/userCreate.json");
const patchSchema = require("../schemas/userUpdate.json");

const router = new express.Router();

/** POST / {user} => {user, token}
 * 
 * user should be {id, first_name, last_name, password, role}
 * 
 * Returns JWT for user
 * 
 * Auth: Admin
 */
router.post("/create", ensureAdmin, async function (req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, createSchema)
        if(req.body.role === "master_admin" && !(res.locals.user.role === "master_admin")){
            throw new UnauthorizedError();
        }
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const user = await User.create(req.body)
        return res.status(201).json({ user })
    }catch(e){
        return next(e)
    }
})

/** GET / => {users: [{user}...]}
 * 
 * user is {id, first_name, last_name, role}
 * 
 * Auth: School Admin
 */
router.get("/", ensureAdmin, async function (req, res, next) {
    try{
        const users = await User.getAll();
        return res.json({users})
    } catch (e) {
        return next(e)
    }
});

/** GET /[id] => {user}
 * 
 * user is {id, first_name, last_name, role, class_id, school_id}
 * 
 * Auth: Admin, or same user
 */
router.get("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try{
        const user = await User.getUser(req.params.id);
        return res.json({user})
    } catch (e) {
        return next(e)
    }
})

/** PATCH /[id] {data} => {user} 
 * 
 * data can include {first_name, last_name, password}
 * 
 * Returns {updated: {id, first_name, last_name, role}}
 * 
 * Auth: School Admin or same user
 */
// QUESTION - Best way to prevent someone from changing admins status while allowing admin change
router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, patchSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        
        const updated = await User.updateUser(req.params.id, req.body);
        return res.json({updated})
    } catch (e) {
        return next(e)
    }
})

/** DELETE /[id] => {deleted: id}
 * 
 * Delete user
 * 
 * Auth: School Admin
 */
router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try{
        const deleted = await User.remove(req.params.id);
        return res.json({deleted})
    } catch (e) {
        return next(e)
    }
})



module.exports = router;