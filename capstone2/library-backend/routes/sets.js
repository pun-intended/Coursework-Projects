/** Routes for books. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureMaster, ensureAdmin } = require("../middleware/auth");
const Book = require("../models/book");

const checkInSchema = require("../schemas/checkIn.json");
const checkOutSchema = require("../schemas/checkOut.json");

const router = new express.Router();

/**
 * Add book set
 * 
 * Auth: Admin
 */
router.push("/new", ensureAdmin, async function(req, res, next) {
    try{
        
    }
});




module.exports = router;