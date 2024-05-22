"use strict";

const request = require("supertest");

const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    adminToken,
    masterToken
    } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /schools", function(){
    test("works", async function(){
        const resp = await request(app)
            .get("/schools")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(200);

        const schools = resp.body.schools

        expect(schools.length).toEqual(3);
        expect(schools[0]).toEqual({
            id: 101,
            name: "school A"
        });
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/schools");

        expect(resp.statusCode).toEqual(401);
    });
});

describe("GET /schools/:id", function(){
    test("works", async function(){
        const resp = await request(app)
            .get("/schools/101")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(200);

        expect(resp.body).toEqual({school:{
            id: 101,
            name: "school A"
        }});
    });

    test("unauth for, anon", async function(){
        const resp = await request(app)
            .get("/schools/101");

        expect(resp.statusCode).toEqual(401);
    });

    test("fails with invalid id", async function(){
        const resp = await request(app)
            .get("/schools/0")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(404);
    });
});

describe("GET /schools/:id/students", function(){
    test("works", async function(){
        const resp = await request(app)
            .get("/schools/101/students")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(200);

        const students = resp.body.students;
        expect(students.length).toEqual(2);
        expect(students[0]).toEqual({
            "id": 1007,
            "first_name": 'Korella',
            "last_name": 'Glaister', 
            "class_id": 1001,
            "school_id": 101,
            "has_read": ['448461587'],
            "book_id": 124,
            "borrow_date": "2023-10-19",
            "isbn": "448461587",
            "last_name": "Glaister",
            "school_id": 101,
            "title": "Max Has a Fish"
        })
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/schools/101/students");

        expect(resp.statusCode).toEqual(401);
    });

    test("fails for invalid id", async function(){
        const resp = await request(app)
            .get("/schools/0/students")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(404);
    });
});

describe("GET /schools/:id/classes", function(){
    test("works", async function(){
        console.log("TESTING ID/CLASSES")
        const resp = await request(app)
            .get("/schools/101/classes")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(200)

        const classes = resp.body.classes;
        expect(classes.length).toEqual(3)
        expect(classes[0]).toEqual({
            "id": 1001,
            "name": "Class A",
            "school_id": 101
        });
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/schools/101/classes");

        expect(resp.statusCode).toEqual(401)
    });

    test("not found for invalid id", async function(){
        const resp = await request(app)
            .get("/schools/0/classes")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(404)
    });
});

describe("GET /schools/:id/books", function(){
    test("works", async function(){
        const resp = await request(app)
            .get("/schools/101/books")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(200)

        const books = resp.body.books;
        expect(books.length).toEqual(22);
        expect(books[0]).toEqual({
            "isbn": "014130670X", 
            "set_id": 1, 
            "title": "Turtle and Snake Go Camping", 
            "stage": 1
        })
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/schools/101/books");

        expect(resp.statusCode).toEqual(401)
    });

    test("fails for invalid id", async function(){
        const resp = await request(app)
            .get("/schools/0/books")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(404)
    });
});

describe("POST /schools/new", function(){
    test("works", async function(){
        const resp = await request(app)
            .post("/schools/new")
            .send({
                name: "test school"
            })
            .set("authorization", `Bearer ${masterToken}`);

        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            newSchool:
                {id: expect.any(Number),
                name: "test school"}
        });
    });

    test("unauth for school", async function(){
        const resp = await request(app)
            .post("/schools/new")
            .send({
                name: "test school"
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for users", async function(){
        const resp = await request(app)
            .post("/schools/new")
            .send({
                name: "test school"
            })
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .post("/schools/new")
            .send({
                name: "test school"
            });

        expect(resp.statusCode).toEqual(401);
    });

    test("fails for invalid data", async function(){
        const resp = await request(app)
            .post("/schools/new")
            .send({
                wrong: "test school"
            })
            .set("authorization", `Bearer ${masterToken}`);

        expect(resp.statusCode).toEqual(400);
    });

    test("fails for missing data", async function(){
        const resp = await request(app)
            .post("/schools/new")
            .set("authorization", `Bearer ${masterToken}`);

        expect(resp.statusCode).toEqual(400);
    });
});

describe("PATCH /schools/:id", function(){
    test("works", async function(){
        const resp = await request(app)
            .patch("/schools/101")
            .send({
                name: "test school"
            })
            .set("authorization", `Bearer ${masterToken}`);

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            patchSchool:
                {id: 101,
                name: "test school"}
        });
    });

    test("unauth for school", async function(){
        const resp = await request(app)
            .patch("/schools/101")
            .send({
                name: "test school"
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for users", async function(){
        const resp = await request(app)
            .patch("/schools/101")
            .send({
                name: "test school"
            })
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .patch("/schools/101")
            .send({
                name: "test school"
            });

        expect(resp.statusCode).toEqual(401);
    });

    test("fails for invalid data", async function(){
        const resp = await request(app)
            .patch("/schools/101")
            .send({
                id: 200
            })
            .set("authorization", `Bearer ${masterToken}`);

        expect(resp.statusCode).toEqual(400);
    });

    test("not found for invalid id", async function(){
        const resp = await request(app)
            .patch("/schools/0")
            .send({
                name: "test school"
            })
            .set("authorization", `Bearer ${masterToken}`);

        expect(resp.statusCode).toEqual(404);
    });
});

describe("DELETE /schools/:id", function(){
    test("works", async function(){
        const resp = await request(app)
            .delete("/schools/101")
            .set("authorization", `Bearer ${masterToken}`);

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({ deleteSchool:{
            id: 101
        }});
    });

    test("unauth for school", async function(){
        const resp = await request(app)
            .delete("/schools/101")
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for users", async function(){
        const resp = await request(app)
            .delete("/schools/101")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .delete("/schools/101");

        expect(resp.statusCode).toEqual(401);
    });

    test("fails for invalid id", async function(){
        const resp = await request(app)
            .delete("/schools/0")
            .set("authorization", `Bearer ${masterToken}`);

        expect(resp.statusCode).toEqual(404);
    });
});