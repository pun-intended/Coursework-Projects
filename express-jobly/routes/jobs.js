"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

const router = new express.Router();

/** POST / { job } =>  { job }
 *
 * Job should be { title, salary, equity, company_handle }
 *
 * Returns { id, title, salary, equity, company_handle }
 *
 * Authorization required: Admin
 */
router.post('/', ensureAdmin, async function(req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, jobNewSchema)
        if (!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        const job = await Job.create(req.body)
        return res.status(201).json({job})
    }catch (err) {
        return next(err)
    }
})

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, company_handle }, ...] }
 *
 * Can filter on provided search filters:
 * - title
 * - minSalary
 * - hasEquity
 *
 * Authorization required: user
 */
router.get('/',ensureLoggedIn, async function(req, res, next) {
    if(Object.keys(req.query).length > 0){
        try{
        const jobs = await Job.findFiltered(req.query)
        return res.json({ jobs });
        } catch(err) {
          return next(err)
        }}
    try{
        const jobs = await Job.findAll();
        return res.json({ jobs })
    } catch (err){
        return next(err)
    }

})

/** PATCH /[id] { fld1, fld2, ... } => { job }
 *
 * Patches job data.
 *
 * fields can be: { title, salary, hasEquity }
 *
 * Returns { id, title, salary, equity, company_handle }
 *
 * Authorization required: Admin
 */
router.patch('/:id',ensureAdmin, async function(req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, jobUpdateSchema)
        if (!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const job = await Job.update(req.params.id, req.body)
        return res.json({job})
    }catch (err) {
        console.log(err)
        return next(err)
    }
})

/** DELETE /[id]  =>  { deleted: jobId }
 *
 * Authorization: Admin
 */
router.delete('/:id', ensureAdmin, async function(req, res, next) {
    try{
        const result = await Job.remove(req.params.id);
        return res.json(result)
    } catch (err){
        return next(err)
    }
})

module.exports = router