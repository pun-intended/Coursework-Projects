"use strict"

const db = require('../db.js');
const User = require("../models/user")

const {BadRequestError, NotFoundError, UnauthorizedError } = require('../expressError.js');
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

// ---- User Methods ----

// create
describe("create", function(){
    let newUser = {
        id: 1, 
        first_name: "test", 
        last_name: "user", 
        password: "password", 
        role: "user"
    }

    test("works", async function(){
        let user = await User.create(newUser);

        expect(user).toEqual({
            id: 1, 
            first_name: "test", 
            last_name: "user", 
            role: "user",
            class_id: null,
            school_id: null
        });

        const found = await db.query("SELECT * FROM users WHERE id = 1");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].role).toEqual('user');
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    let dupeId = {
        id: 10001, 
        first_name: "user", 
        last_name: "name", 
        password: "password", 
        role: "user"
    };

    test("throws BadRequestError for duplicate IDs", async function(){
        try{
            await User.create(dupeId);
            fail();
        } catch(e) {
            expect(e instanceof BadRequestError).toBeTruthy()
        };
    });
});

// getUser
describe("getUser", function(){
    
    test("works", async function(){
        let user = await User.getUser(10001);
        expect(user).toEqual({
            id: 10001, 
            first_name: "user", 
            last_name: "name", 
            role: "user",
            class_id: null,
            school_id: null
        });
    });

    test("throws error if not found", async function(){
        try{
            await User.getUser(0);
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy()
        };
    });
});

// getAll
describe("getAll", function(){
    test("works", async function(){
        let users = await User.getAll();
        expect(users.length).toEqual(3)
        expect(users[0]).toEqual({
            id: 10001, 
            first_name: "user", 
            last_name: "name", 
            role: "user",
            class_id: null,
            school_id: null
        });
    });
});

// remove
describe("remove", function(){
    test("works", async function(){
        await User.remove(10001);
        const res = await db.query(
            "SELECT * FROM users WHERE id='10001'");
        expect(res.rows.length).toEqual(0);
    });

    test("throws error if not found", async function(){
        try{
            await User.remove(0);
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        };
    });
});

// updateUser
describe("updateUser", function(){
    let newData = {
        first_name: "newFirst",
        last_name: "newLast",
        role: "school_admin"
        };
    test("works", async function(){
        let updatedData = await User.updateUser(10001, newData);

        expect(updatedData).toEqual({
            id: 10001,
            class_id: null,
            school_id: null,
            ...newData
        });
    });

    test("works: update password", async function(){
        let passUpdate = await User.updateUser(10001, {
            password: "new",
          });
          expect(passUpdate).toEqual({
            id: 10001,
            first_name: "user",
            last_name: "name",
            role: "user",
            class_id: null,
            school_id: null
          });
          const found = await db.query("SELECT * FROM users WHERE id = 10001");
          expect(found.rows.length).toEqual(1);
          expect(found.rows[0].password.startsWith("$2b$")).toEqual(true)
    });

    test("throws error if user not found", async function(){
        try{
            await User.updateUser(1, newData);
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        };
    });
});    

// authenticate
describe("authenticate", function(){
    test("works", async function(){
        const data = {
            id: 10001,
            password: "password"
        }
        let user = await User.authenticate(data);
        expect(user).toEqual({
            id: 10001,
            first_name: "user",
            last_name: "name",
            role: "user",
            class_id: null,
            school_id: null
        });
    });

    test("throws error for invalid password", async function(){
        try{
            const data = {
                id: 10001,
                password: "wrong"
            }
            await User.authenticate(data);
            fail();
        } catch(e) {
            expect(e instanceof UnauthorizedError).toBeTruthy()
        };
    });
});

