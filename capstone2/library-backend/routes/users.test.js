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

describe("POST /users/", function() {
    test("works for admin", async function(){
        const resp = await request(app)
            .post("/users")
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
                role: "user"
            }
        });
    });

    test("Works for creating 'Master'", async function(){
        const resp = await request(app)
            .post("/users")
            .send({
                id: 20001,
                first_name: "test",
                last_name: "last",
                password: "pass",
                role: "master"
            })
        .set("authorization", `Bearer ${masterToken}`);

        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            user: {
                id: 20001,
                first_name: "test",
                last_name: "last",
                role: "master"
            }
        });
    });

    test("unauth for creating 'master' without 'master' permissions", async function() {
        const resp = await request(app)
            .post("/users")
            .send({
                id: 20001,
                first_name: "test",
                last_name: "last",
                password: "pass",
                role: "master"
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for users", async function(){
        const resp = await request(app)
            .post("/users")
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
            .post("/users")
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
            .post("/users")
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
            .post("/users")
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

describe("GET /users/", function() {
    test("works for users", async function(){
        const resp = await request(app)
            .get("/users")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({
            users: [
                {id: 10001,
                first_name:'test', 
                last_name: 'user', 
                role: "user"},
                
                {id: 10002, 
                first_name: 'test', 
                last_name: 'user2',
                role: "user"},
                
                {id: 10003, 
                first_name: 'admin', 
                last_name: 'user',
                role: "school_admin"}]
            });
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
                first_name:'test', 
                last_name: 'user', 
                is_admin: false
            }});
    });

    test("works for same user", async function(){
        const resp = await request(app)
            .get("/users/10001")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({
                user: {
                id: 10001,
                first_name:'test', 
                last_name: 'user', 
                is_admin: false
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
                password: "newPass"
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.body).toEqual({
            updated: {
                id: 10001,
                first_name: "newName",
                last_name: "newLast",
                is_admin: false
            }
        });
    });

    test("works for same user", async function(){
        const resp = await request(app)
            .patch("/users/10001")
            .send({
                first_name: "newName",
                last_name: "newLast",
                password: "newPass"
            })
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({
            updated: {
                id: 10001,
                first_name: "newName",
                last_name: "newLast",
                is_admin: false
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

    test("works for same user", async function(){
        const resp = await request(app)
            .delete("/users/10001")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({deleted: {id:10001}});
    });

    test("unauth for other users", async function(){
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