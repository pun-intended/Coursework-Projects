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

describe("POST /sets/new", function(){
    test("works - no stage", async function(){
        const resp = await request(app)
            .post("/sets/new")
            .send({
                schoolId: 101
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            "newSet": {
                "set_id": expect.any(Number)
            }
        });
    });

    test("works - with stage", async function(){
        const resp = await request(app)
            .post("/sets/new")
            .send({
                schoolId: 101,
                stage: 2
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            "newSet": {
                "set_id": expect.any(Number)
            }
        });
    })

    test("unauth for user", async function(){
        const resp = await request(app)
            .post("/sets/new")
            .send({
                schoolId: 101,
                stage: 2
            })
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .post("/sets/new")
            .send({
                schoolId: 101,
                stage: 2
            });

        expect(resp.statusCode).toEqual(401);
    });

    test("fails without school id", async function(){});
});

describe("PATCH, /sets/:id", function(){
    test("works", async function(){
        const resp = await request(app)
            .patch("/sets/3")
            .send({
                schoolId: 101
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({"set_id": 3});
    });

    test("unauth for user", async function(){
        const resp = await request(app)
            .patch("/sets/3")
            .send({
                schoolId: 101
            })
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .patch("/sets/3")
            .send({
                schoolId: 101
            });

        expect(resp.statusCode).toEqual(401);
    });

    test("fails without school id", async function(){
        const resp = await request(app)
            .patch("/sets/3")
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(400);
    });

    test("not found with invalid set_id", async function(){
        const resp = await request(app)
            .patch("/sets/0")
            .send({
                schoolId: 101
            })
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(404);

    });
});

describe("DELETE /sets/:id", function(){
    test("works", async function(){
        const resp = await request(app)
            .delete("/sets/2")
            .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            "deleteSet":{
                "set_id": 2
            }
        });
    });

    test("unauth for user", async function(){
        const resp = await request(app)
            .delete("/sets/2")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
        const resp = await request(app)
            .delete("/sets/2");

        expect(resp.statusCode).toEqual(401);
    });

    test("not found with invalid set_id", async function(){
        const resp = await request(app)
            .delete("/sets/0")
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(404);
    })
});


