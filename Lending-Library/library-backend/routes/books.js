"use strict";

/** Routes for books. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureMaster, ensureAdmin } = require("../middleware/auth");
const Book = require("../models/book");

const checkInSchema = require("../schemas/checkIn.json");
const checkOutSchema = require("../schemas/checkOut.json");

const router = new express.Router();


/** GET / {books: [{isbn, title, stage, available}...]}
 * 
 * Returns all books in library
 * 
 * Auth: login
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
    const books = await Book.getAllBooks(req.query.schoolId, req.query.stage);

    return res.json({ books });
})



/** GET /outstanding => {books: [{book_id, isbn, title, stage, condition, student_id, first_name, last_name, borrow_date}, ...]}
 * 
 * Returns all books that are still outstanding
 * 
 * Auth: login
 */
router.get("/outstanding", ensureLoggedIn, async function (req, res, next) {
    const books = await Book.getOutstanding(req.query.schoolId);

    return res.json({ books });
})

/** POST /checkout {book_id, student_id, date}
 *                  => {borrowed: {id, book_id, student_id, borrow_date}}
 * 
 * Returns borrow_record object for book
 * 
 * Auth: login
 */
router.post("/checkout", ensureLoggedIn, async function (req, res, next) {
    try{
        const data = req.body
        const validator = jsonschema.validate(data, checkOutSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const borrowed = await Book.checkOut(data);
        return res.status(201).json({ borrowed });
    } catch (e) {
        return next(e);
    }
})

/** POST /checkin {book_id, date, condition} => {returned: {id, return_date, condition}}
 * 
 * Returns {returned: {id, return_date}}
 * 
 * Auth: login
 */
router.post("/checkin", ensureLoggedIn, async function (req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, checkInSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const returned = await Book.checkIn(req.body);
        return res.status(201).json({ returned });
    }catch(e){
        return next(e);
    }
})

/** GET /[id] => {book}
 * 
 * Returns {id, isbn, title, stage, condition}
 * 
 * Auth: login
 */
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const book = await Book.getBook(req.params.id, req.query.schoolId);
        return res.json({ book });
    } catch (e) {
        return next(e);
    }
})


/** GET /[id] => {book}
 * 
 * Returns {id, isbn, title, stage, condition}
 * 
 * Auth: login
 */
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const book = await Book.getHasNotRead(req.params.id);
        return res.json({ book });
    } catch (e) {
        return next(e);
    }
})

/**
 * Delete book
 * 
 * Auth: Admin
 */
router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        const book = await Book.remove(req.params.id);
        return res.json({ book })
    } catch (e) {
        return next(e);
    }
})

/**
 * Update book 
 * 
 * Auth: login
 */
router.patch("/:id/update", ensureLoggedIn, async function (req, res, next) {
    
})
module.exports = router;