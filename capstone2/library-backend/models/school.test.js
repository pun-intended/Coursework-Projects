"use strict"

const db = require('../db.js');
const School = require("./school.js")
const {BadRequestError, NotFoundError } = require('../expressError.js');
const {
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
 } = require('./_testCommon.js');

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("getAll", function(){
    test("works", async function(){});
});

describe("create", function(){
    test("works", async function(){});
    test("fails with incomplete data", async function(){});
});

describe("patch", function(){
    test("works", async function(){});
    test("fails with incomplete data", async function(){});
    test("fails with incorrect ID", async function(){});
});

describe("remove", function(){
    test("works", async function(){});
    test("fails with incorrect ID", async function(){});
});