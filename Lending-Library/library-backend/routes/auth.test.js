"use strict";

const request = require("supertest");

const app = require("../app");
const Book = require("../models/book")

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    adminToken,
    } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /auth/register", function(){
    test("works for anon", async function(){
        const resp = await request(app)
            .post("/auth/register")
            .send({
                id: 21000,
                first_name: "newTest",
                last_name: "user",
                password: "password"
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual(
            {"token": expect.any(String)}
        );
    });

    test("bad request with missing data", async function(){
        const resp = await request(app)
            .post("/auth/register")
            .send({
                id: 21001
            });

        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function(){
        const resp = await request(app)
        .post("/auth/register")
        .send({
            id: "string",
            first_name: "newTest",
            last_name: "user",
            password: "password"
        });

        expect(resp.statusCode).toEqual(400);
    });
});

describe("POST /auth/token", function(){
    test("works", async function(){
        const resp = await request(app)
            .post("/auth/token")
            .send({
                id: 10001,
                password: "password"
            });

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            "token": expect.any(String)
        });
    });

    test("unauth with invalid user", async function(){
        const resp = await request(app)
            .post("/auth/token")
            .send({
                id: 0,
                password: "password"
            });
        
        expect(resp.statusCode).toEqual(401)
    });

    test("unauth with invalid password", async function(){
        const resp = await request(app)
            .post("/auth/token")
            .send({
                id: 10001,
                password: "wrong"
            });
        
        expect(resp.statusCode).toEqual(401)
    })

    test("bad request with missing data", async function(){
        const resp = await request(app)
            .post("/auth/token")
            .send({
                id: 10001
            });

        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function(){
        const resp = await request(app)
            .post("/auth/token")
            .send({
                id: "string",
                password: "password"
            });

        expect(resp.statusCode).toEqual(400);
    });
});