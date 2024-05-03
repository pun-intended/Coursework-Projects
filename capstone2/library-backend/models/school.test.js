"use strict"

const db = require('../db.js');
const School = require("./school.js")
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

describe("getAll", function(){
    test("works", async function(){
        const schools = await School.getAll();
        
        expect(schools.length).toEqual(3);
        expect(schools[0]).toEqual({
            id: 101,
            name: "school A"
        });
    });
});

describe("create", function(){
    test("works", async function(){
        const newSchool = await School.create("new school");

        expect(newSchool).toEqual({
            id: expect.any(Number)
        })
    });

    test("fails with incomplete data", async function(){
        try{
            const newSchool = await School.create();
            fail();
        } catch(e) {
            expect(e instanceof BadRequestError).toBeTruthy;
        }
    });
});

describe("patch", function(){
    test("works", async function(){
        const updateSchool = await School.patch(101, "test name");

        expect(updateSchool).toEqual({
            id: 101,
            name: "test name"
        })
    });
    test("fails with incomplete data", async function(){
        try{
            const updateSchool = await School.patch(101);
            fail();
        } catch(e) {
            expect(e instanceof BadRequestError).toBeTruthy;
        }
    });
    test("fails with incorrect ID", async function(){
        try{
            const updateSchool = await School.patch(1, "test school");
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy;
        }
    });
});

describe("remove", function(){
    test("works", async function(){
        const removedSchool = await School.remove(101);

        expect(removedSchool).toEqual({id: 101});
    });
    test("fails with incorrect ID", async function(){
        try{
            const removedSchool = await School.remove(1);
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError);
        }
    });
});