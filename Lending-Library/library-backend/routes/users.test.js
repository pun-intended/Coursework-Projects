"use strict";

const request = require("supertest");

const app = require("../app");
const User = require("../models/user")

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    adminToken,
    masterToken,
    } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /users/create", function() {
    test("works for admin", async function(){
        const resp = await request(app)
            .post("/users/create")
            .send({
                id: 20001,
                first_name: "test",
                last_name: "last",
                password: "pass",
                role: "user"
            })
            .set("authorization", `Bearer ${adminToken}`);
        
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            user: {
                id: 20001,
                first_name: "test",
                last_name: "last",
                role: "user",
                class_id: null,
                school_id: null
            }
        });
    });

    test("Works for creating 'Master'", async function(){
        const resp = await request(app)
            .post("/users/create")
            .send({
                id: 20001,
                first_name: "test",
                last_name: "last",
                password: "pass",
                role: "master_admin"
            })
        .set("authorization", `Bearer ${masterToken}`);

        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            user: {
                id: 20001,
                first_name: "test",
                last_name: "last",
                role: "master_admin",
                class_id: null,
                school_id: null
            }
        });
    });

    test("unauth for creating 'master' without 'master' permissions", async function() {
        console.log(`------- TESTING HERE -------`)
        const resp = await request(app)
            .post("/users/create")
            .send({
                id: 20001,
                first_name: "test",
                last_name: "last",
                password: "pass",
                role: "master_admin"
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for users", async function(){
        const resp = await request(app)
            .post("/users/create")
            .send({
                id: 20001,
                first_name: "test",
                last_name: "last",
                password: "pass",
                role: "user"
            })
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .post("/users/create")
            .send({
                id: 20001,
                first_name: "test",
                last_name: "last",
                password: "pass",
                role: "user"
            });
        
        expect(resp.statusCode).toEqual(401);
    });

    test("bad request with missing fields", async function(){
        const resp = await request(app)
            .post("/users/create")
            .send({
                first_name: "test",
                last_name: "last",
                password: "pass",
                role: "user"
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function(){
        const resp = await request(app)
            .post("/users/create")
            .send({
                id: "string",
                first_name: "test",
                last_name: "last",
                password: "pass",
                role: "user"
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(400);
    });
});

describe("GET /users", function() {
    test("works for admin", async function(){
        const resp = await request(app)
            .get("/users")
            .set("authorization", `Bearer ${adminToken}`);

        const users  = resp.body.users
        expect(users.length).toEqual(3)
        expect(users[0]).toEqual({
                id: 10001,
                first_name:'user', 
                last_name: 'name', 
                role: "user",
                class_id: null,
                school_id: null
            });
    });

    test("unauth for users", async function(){
        const resp = await request(app)
            .get("/users")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);
    });
    
    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/users");

        expect(resp.statusCode).toEqual(401);
    });
})

describe("GET /users/:id", function() {
    test("works for admin", async function(){
        const resp = await request(app)
            .get("/users/10001")
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.body).toEqual({
            user: {
                id: 10001,
                first_name:'user', 
                last_name: 'name', 
                role: 'user',
                class_id: null,
                school_id: null
            }});
    });

    test("works for same user", async function(){
        const resp = await request(app)
            .get("/users/10001")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({
                user: {
                    id: 10001,
                    first_name:'user', 
                    last_name: 'name', 
                    role: 'user',
                    class_id: null,
                    school_id: null
            }});
    });

    test("unauth for other users", async function(){
        const resp = await request(app)
            .get("/users/10001")
            .set("authorization", `Bearer ${u2Token}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .get("/users/10001")

        expect(resp.statusCode).toEqual(401);
    })

    test("not found if user not found", async function(){
        const resp = await request(app)
            .get("/users/1")
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(404);
    });
})

describe("PATCH /users/:id", function() {
    test("works for admin", async function(){
        const resp = await request(app)
            .patch("/users/10001")
            .send({
                first_name: "newName",
                last_name: "newLast",
                password: "newPass",
                class_id: 1001,
                school_id: 101
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.body).toEqual({
            updated: {
                id: 10001,
                first_name: "newName",
                last_name: "newLast",
                role: "user",
                class_id: 1001,
                school_id: 101
            }
        });
    });

    test("works for same user", async function(){
        const resp = await request(app)
            .patch("/users/10001")
            .send({
                first_name: "newName",
                last_name: "newLast",
                password: "newPass",
                class_id: 1001,
                school_id: 101
            })
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({
            updated: {
                first_name: "newName",
                last_name: "newLast",
                class_id: 1001,
                school_id: 101,
                role: "user",
                id: 10001
            }
        });
    });

    test("unauth for other users", async function(){
        const resp = await request(app)
            .patch("/users/10001")
            .send({
                first_name: "newName",
                last_name: "newLast",
                password: "newPass"
            })
            .set("authorization", `Bearer ${u2Token}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .patch("/users/10001")
            .send({
                first_name: "newName",
                last_name: "newLast",
                password: "newPass"
            });

            expect(resp.statusCode).toEqual(401);
    })

    test("not found if user not found", async function(){
        const resp = await request(app)
            .patch("/users/1")
            .send({
                first_name: "newName",
                last_name: "newLast",
                password: "newPass"
            })
            .set("authorization", `Bearer ${adminToken}`);


            expect(resp.statusCode).toEqual(404);
    });
});

describe("DELETE /users/:id", function() {
    test("works for admin", async function(){
        const resp = await request(app)
            .delete("/users/10001")
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.body).toEqual({deleted: {id:10001}});
    });

    test("unauth for same user", async function(){
        const resp = await request(app)
            .delete("/users/10001")
            .set("authorization", `Bearer ${u1Token}`);

            expect(resp.statusCode).toEqual(401);
    });

    test("unauth for users", async function(){
        const resp = await request(app)
            .delete("/users/10001")
            .set("authorization", `Bearer ${u2Token}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .delete("/users/10001");

        expect(resp.statusCode).toEqual(401);
    });

    test("not found if user not found", async function(){
        const resp = await request(app)
            .delete("/users/1")
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(404)
    });
});