"use strict";

const request = require("supertest");

const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken,
    masterToken
    } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /classes", function(){
    test("works", async function(){
        const resp = await request(app)
            .get("/classes")
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(200);
        
        const allClasses = resp.body.classes
        expect(allClasses.length).toEqual(9);
        expect(allClasses[0]).toEqual({
            id: 1001,
            name: "Class A",
            school_id: 101
        });
    });
    
    test("unauth for users", async function(){
        const resp = await request(app)
            .get("/classes")
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/classes");
        
        expect(resp.statusCode).toEqual(401);
    });
});

describe("POST /classes/new", function(){
    test("works", async function(){
        const resp = await request(app)
            .post("/classes/new")
            .send({
                name: "test class",
                schoolId: 101
            })
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({newClass: {
            id: expect.any(Number),
            name: "test class",
            school_id: 101
        }});
    });

    test("unauth for users", async function(){
        const resp = await request(app)
            .post("/classes/new")
            .send({
                name: "test class",
                schoolId: 101
            })
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .post("/classes/new")
            .send({
                name: "test class",
                schoolId: 101
            });
        
        expect(resp.statusCode).toEqual(401);
    });

    test("fails with invalid data", async function(){
        const resp = await request(app)
            .post("/classes/new")
            .send({
                name: "test class",
                schoolId: "wrong school id"
            })
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(400);
    });

    test("fails with missing data", async function(){
        const resp = await request(app)
            .post("/classes/new")
            .send({
                schoolId: 101
            })
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(400);
    });

    test("not found with invalid school id", async function(){
        const resp = await request(app)
            .post("/classes/new")
            .send({
                name: "test class",
                schoolId: 1
            })
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(404);
    });
});

describe("GET /classes/:id", function(){
    test("works", async function(){
        const resp = await request(app)
            .get("/classes/1001")
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(200);
        
        const classInfo = resp.body.classInfo
        expect(classInfo).toEqual({
            id: 1001,
            name: "Class A",
            school_id: 101
        });
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/classes/1001");
        
        expect(resp.statusCode).toEqual(401);
    });

    test("not found with invalid id", async function(){
        const resp = await request(app)
            .get("/classes/0")
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(404);
    });
})

describe("PATCH /classes/:id", function(){
    test("works", async function(){
        const resp = await request(app)
            .patch("/classes/1001")
            .send({
                name: "test class"
            })
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(200);
        
        expect(resp.body).toEqual({ updatedClass: 
            {id: 1001,
            name: "test class",
            school_id: 101}
        });
    });

    test("unauth for users", async function(){
        const resp = await request(app)
            .patch("/classes/1001")
            .send({
                name: "test class"
            })
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .patch("/classes/1001")
            .send({
                name: "test class"
            });
        
        expect(resp.statusCode).toEqual(401);
    });

    test("fails with missing data", async function(){
        const resp = await request(app)
            .patch("/classes/1001")
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(400);
    });

    test("not found with invalid id", async function(){
        const resp = await request(app)
            .patch("/classes/0")
            .send({
                name: "test class"
            })
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(404);
    });
})

describe("DELETE /classes/:id", function(){
    test("works", async function(){
        const resp = await request(app)
            .delete("/classes/1001")
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({deletedClass: {id: 1001}})
    });
    
    test("unauth for users", async function(){
        const resp = await request(app)
            .delete("/classes/1001")
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .delete("/classes/1001");
        
        expect(resp.statusCode).toEqual(401);
    });

    test("fails for invalid id", async function(){
        const resp = await request(app)
            .delete("/classes/0")
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(404);
    });
})