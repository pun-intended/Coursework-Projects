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
const Book = require("../models/book");
const { NotFoundError } = require("../expressError");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /books/", function() {
    test("works for users", async function(){
        const resp = await request(app)
            .get("/books")
            .query({schoolId: "101"})
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(200);
        
        const allBooks = resp.body.books;

        expect(allBooks.length).toEqual(11);
        expect(allBooks[0]).toEqual({
            isbn: '014130670X', 
            title: 'Turtle and Snake Go Camping', 
            stage: 1, 
            available: true
        });
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/books")
            .query({schoolId: "101"});
            
        expect(resp.statusCode).toEqual(401);
    });
});

describe("GET /books/:id", function() {
    test("works for users", async function(){
        const resp = await request(app)
            .get("/books/101")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            book: {
            book_id: 101, 
            isbn: '014130670X', 
            title: 'Turtle and Snake Go Camping', 
            stage: 1,
            condition: 'Great'
            }});
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/books/101")
        
        expect(resp.statusCode).toEqual(401);
    });

    test("not found if book not found", async function(){
        const resp = await request(app)
            .get("/books/1")
            .set("authorization", `Bearer ${u1Token}`)
        
        expect(resp.statusCode).toEqual(404);
    });
});

describe("GET /books/outstanding", function() {
    test("works for users", async function(){
        const resp = await request(app)
        .get("/books/outstanding")
        .query({schoolId: "101"})
        .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(200);

        const books = resp.body.books

        expect(books.length).toEqual(6);
        expect(books[0]).toEqual({
            book_id: 102, 
            isbn: '448457636', 
            title: 'Bake, Mice, Bake!', 
            stage: 1, 
            condition: 'Great',
            student_id: 1005, 
            first_name: 'Terrijo', 
            last_name: 'Winchester', 
            borrow_date: '2023-10-19'
            });
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/books/outstanding")
            .query({schoolId: "101"})

            expect(resp.statusCode).toEqual(401);
    });
});

describe("POST /books/checkout", function() {
    test("works for users", async function(){
        const resp = await request(app)
            .post("/books/checkout")
            .send({
                book_id: 106,
                student_id: 1002, 
                date: "12-12-2024"})
            .set("authorization",`Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            borrowed: {
                id: expect.any(Number),
                book_id: 106,
                student_id: 1002,
                borrow_date: "12-12-2024"
            }
        });
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .post("/books/checkout")
            .send({
                book_id: 106,
                student_id: 1002, 
                date: "12-12-2024"});
        
        expect(resp.statusCode).toEqual(401);
    });

    test("not found if book not found", async function(){
        const resp = await request(app)
            .post("/books/checkout")
            .send({
                book_id: 1,
                student_id: 1002, 
                date: "12-12-2024"})
            .set("authorization",`Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(404);
    });

    test("not found if student not found", async function(){
        const resp = await request(app)
            .post("/books/checkout")
            .send({
                book_id: 103,
                student_id: 1, 
                date: "12-12-2024"})
            .set("authorization",`Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(404);
    });

    test("bad request if invalid data", async function(){
        const resp = await request(app)
            .post("/books/checkout")
            .send({
                book_id: "string",
                student_id: 1001,
                date: "12-12-2024"
            })
            .set("authorization",`Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(400);
    });

    test("bad request if missing data", async function(){
        const resp = await request(app)
            .post("/books/checkout")
            .send({
                book_id: 106,
                date: "12-12-2024"
            })
            .set("authorization",`Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(400);
    });

    // TODO - FUTURE FEATURE
    // test("book can not be checked out if already out", async function(){})

    // TODO - FUTURE FEATURE
    // test("student can not borrow 2 books at once", async function(){})
});

describe("POST /books/checkin", function() {
    test("works for users", async function(){
        const resp = await request(app)
            .post("/books/checkin")
            .send({
                book_id: 104,
                date: "12-12-2024",
                condition: "Great"
            })
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(201)
        expect(resp.body).toEqual({
            returned: {
                id: expect.any(Number),
                return_date: "12-12-2024",
                condition: "Great"
            }
        });
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .post("/books/checkin")
            .send({
                book_id: 104,
                date: "12-12-2024",
                condition: "Great"
            });

        expect(resp.statusCode).toEqual(401);
    });

    test("not found if record not found", async function(){
        const resp = await request(app)
            .post("/books/checkin")
            .send({
                book_id: 1,
                date: "12-12-2024",
                condition: "Great"
            })
            .set("authorization", `Bearer ${u1Token}`)

        expect(resp.statusCode).toEqual(404);
    });

    test("bad request if missing data", async function(){
        const resp = await request(app)
        .post("/books/checkin")
        .send({
            book_id: 106
        })
        .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(400)
    });
});

describe("DELETE /books/:id", function() {
    test("works", async function(){
        const resp = await request(app)
            .delete("/books/101")
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            book: {id: 101}
        });

        try{
            const check = await Book.get(101);
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy;
        }
    });

    test("unauth for users", async function(){
        const resp = await request(app)
           .delete("/books/101")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);
        
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
           .delete("/books/101");

        expect(resp.statusCode).toEqual(401);

    });
})