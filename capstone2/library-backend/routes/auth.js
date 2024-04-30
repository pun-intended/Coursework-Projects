"use strict";

/** Routes for auth. */

// TODO - change naming conventions to match JSON standards - camelCase over underscore

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { createToken } = require("../helpers/tokens");
const User = require("../models/user");

const authRegisterSchema = require("../schemas/authRegister.json");
const authTokenSchema = require("../schemas/authToken.json");

const router = new express.Router();

/** POST /auth/register { user } => { token }
 * 
 * user should be {id, first_name, last_name, password}
 * 
 * Returns JWT for the user
 * 
 * Auth: none
 */
router.post("/register", async function(req, res, next){
    
    try{
        const validator = jsonschema.validate(req.body, authRegisterSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const data = req.body;
        const user = await User.create({...data, role: "user"});
    
        const token = createToken(user);
        return res.status(201).json({token});
    } catch (e) {
        return next(e);
    };
});

/** POST /auth/token { id, password } => { token }
 * 
 * Returns JWT for user
 * 
 * Auth: none
 */
router.post("/token", async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, authTokenSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const user = await User.authenticate(req.body);
        const token = createToken(user);
        return res.json({token});
    } catch (e) {
        return next(e);
    };
});


module.exports = router;