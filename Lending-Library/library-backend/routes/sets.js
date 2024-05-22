/** Routes for books. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureMaster, ensureAdmin } = require("../middleware/auth");
const BookSet = require("../models/bookSet");

const createSchema = require("../schemas/setCreate.json")
const patchSchema = require("../schemas/setPatch.json")

const router = new express.Router();

/** POST /new {schoolId} => {set}
 * Add book set
 * 
 * Auth: Admin
 */
router.post("/new", ensureAdmin, async function(req, res, next) {
    const data = req.body
    const validator = jsonschema.validate(data, createSchema)
    if(!validator.valid){
        const errs = validator.errors.map(e => e.stack)
        throw new BadRequestError(errs)
    }
    if(req.body.stage){
        try{
            const newSet = await BookSet.create(req.body.schoolId, req.body.stage);
            return res.status(201).json({ newSet });
        } catch(e) {
            return next(e);
        }
    } else{
        try{
            const newSet = await BookSet.create(req.body.schoolId);
            return res.status(201).json({ newSet });
        } catch(e) {
            return next(e);
        }
    }
    
});

/** PATCH /id {school_id} => {set}
 * Change the associated school for all 
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
        const patchSet = await BookSet.patch(req.body.schoolId, req.params.id);
        return res.json({ patchSet });
    } catch(e) {
        return next(e);
    }
})

/** DELETE /id => {id}
 * Delete a given set Id
 * 
 * Auth: Admin
 */
router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try{
        const deleteSet = await BookSet.remove(req.params.id);
        return res.json({ deleteSet });
    } catch(e){
        return next(e)
    }
})




module.exports = router;