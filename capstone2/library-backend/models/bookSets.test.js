"use strict"

const db = require('../db.js');
const BookSet = require("./bookSet.js")
const {BadRequestError, NotFoundError } = require('../expressError.js');
const {
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
 } = require('./_testCommon.js');

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("getAll", function() {
    test("works", async function(){})

    test("fails without school id", async function(){})
})

describe("create", function(){
    test("works", async function(){})

    test("works with stage definition", async function(){})

    test("fails without school id", async function(){})
})

describe("patch", function(){
    test("works", async function(){})
    test("fails with incorrect id", async function(){})
    test("Fails with incomplete data", async function(){})
})

describe("remove", function(){
    test("works", async function(){})
    test("Fails with incorrect ID", async function(){})
})