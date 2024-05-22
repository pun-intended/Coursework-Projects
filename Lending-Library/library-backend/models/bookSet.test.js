"use strict"

const db = require('../db.js');
const BookSet = require("./bookSet.js");
const {BadRequestError, NotFoundError } = require('../expressError.js');
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
 } = require('./_testCommon.js');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("getAll", function() {
    test("works", async function(){
        let allSets = await BookSet.getAll(101)
        expect(allSets.length).toEqual(22);
        expect(allSets[0]).toEqual(
            {isbn: '014130670X', 
            set_id: 1,
            title: 'Turtle and Snake Go Camping', 
            stage: 1}
        );
    });

    test("fails without school id", async function(){
        try{
            let allSets = await BookSet.getAll(101);
            fail();
        } catch(e) {
            expect(e instanceof BadRequestError).toBeTruthy;
        }
    });
});

describe("create", function(){
    test("works", async function(){
        let newSet = await BookSet.create(103);
        let result = await BookSet.getAll(103);
        expect(result.length).toEqual(11);
        expect(result[0]).toEqual(
            {isbn: '014130670X', 
            set_id: expect.any(Number),
            title: 'Turtle and Snake Go Camping', 
            stage: 1}
        );
    });

    test("works with stage definition", async function(){
        let newSet = await BookSet.create(103, 2);
        let result = await BookSet.getAll(103);
        expect(result.length).toEqual(4);
        expect(result[0]).toEqual(
            {isbn: '448463768', 
            set_id: expect.any(Number),
            title: 'On a Farm', 
            stage: 2}
        );
    });

    test("fails without school id", async function(){
        try{
            let allSets = await BookSet.create();
            fail();
        } catch(e) {
            expect(e instanceof BadRequestError).toBeTruthy;
        }
    });
});

describe("patch", function(){
    test("works", async function(){
        let updateSet = await BookSet.patch(103, 3);
        let schoolBooks = await BookSet.getAll(103);
        expect(schoolBooks.length).toEqual(11);
    });

    test("fails with incorrect id", async function(){
        try{
            let allSets = await BookSet.patch(103, 0);
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy;
        }
    });
    test("Fails with incomplete data", async function(){
        try{
            let allSets = await BookSet.patch();
            fail();
        } catch(e) {
            expect(e instanceof BadRequestError).toBeTruthy;
        }
    });
});

describe("remove", function(){
    test("works", async function(){
        let deletedSet = await BookSet.remove(3);
        let schoolBooks = await BookSet.getAll(102);
        expect(deletedSet).toEqual({set_id: 3})
        expect(schoolBooks.length).toEqual(0);
    });
    test("Fails with incorrect ID", async function(){
        try{
            let deletedSet = await BookSet.remove(0);
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy;
        }
    });
});