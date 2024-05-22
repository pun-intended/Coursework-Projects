"use strict";

const request = require("supertest");

const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken
    } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /students/", function() {
    test("works for admin", async function(){
        const resp = await request(app)
            .get("/students")
            .set("authorization", `Bearer ${adminToken}`);
        
        const students = resp.body.students
        expect(resp.statusCode).toEqual(200);
        expect(students.length).toEqual(10);
        expect(students[0]).toEqual({
                id: 1001, 
                first_name: 'Caspar', 
                last_name: 'Stedson', 
                class_id: 1006,
                has_read: [
                    "448457636",
                    "448461579",
                    "448461587"
                ],
                book_id: 104,
                borrow_date: "2023-10-24",
                isbn: "448461587",
                school_id: 102,
                title: "Max Has a Fish"
        });
    });

    test("unauth for user", async function(){
        const resp = await request(app)
            .get("/students")
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);
    }); 
    
    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/students");
        
        expect(resp.statusCode).toEqual(401);
    }); 
});

describe("GET /students/:id", function() {
    test("works for users", async function(){
        const resp = await request(app)
            .get("/students/1001")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({
            student: {
                id: 1001, 
                first_name: 'Caspar', 
                last_name: 'Stedson', 
                class_id: 1006
            }
        });
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/students/1001");
        
        expect(resp.statusCode).toEqual(401);
    });

    test("not found if student not found", async function(){
        const resp = await request(app)
            .get("/students/1")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(404);
    });
});

describe("GET /students/:id/unread", function() {
    test("works for users", async function(){
        const resp = await request(app)
            .get("/students/1006/unread")
            .set("authorization", `Bearer ${u1Token}`);

        const unread = resp.body.unread
        expect(unread.length).toEqual(10)
        expect(unread[0]).toEqual({
            isbn: '014130670X', 
            title: 'Turtle and Snake Go Camping', 
            stage: 1,
            available: false
        });
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/students/1001/unread");

        expect(resp.statusCode).toEqual(401);
    });

    test("not found if student not found", async function(){
        const resp = await request(app)
            .get("/students/1/unread")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(404);
    });
})