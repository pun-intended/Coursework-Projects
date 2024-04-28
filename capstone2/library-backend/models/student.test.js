"use strict"

const db = require('../db.js');
const Student = require("../models/student.js")
const { NotFoundError } = require('../expressError.js');
const {
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
 } = require('./_testCommon.js');

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// ---- Methods ----

describe("create", function() {
    const newStudent = {
        first_name: "test",
        last_name: "student",
        class_id: "1002"
    }
    test("works", async function(){
        let student = await Student.create(newStudent);
        expect(student).toEqual({
            first_name: "test",
            last_name: "student",
            class_id: "k2",
            id: expect.any(Number)
        });
    });
});

describe("getAllStudents", function(){
    test("works", async function(){
        let students = await Student.getAllStudents();

        expect(students.length).toEqual(6)
        expect(students[0]).toEqual({
            id: 1001, 
            first_name: 'Charlie', 
            last_name: 'Kelly', 
            level: 'K1',
            title: "Rhythms of War",
            isbn: "978-0765326386",
            book_id: 104,
            borrow_date: "2023-10-24"
        });
    });
});

describe("getStudent", function(){
    test("works", async function(){
        let student = await Student.getStudent(1001)

        expect(student).toEqual({
            id: 1001, 
            first_name: 'Charlie', 
            last_name: 'Kelly', 
            level: 'K1'
        });
    });

    test("throws error if student not found", async function(){
        try{
            student = await Student.getStudent(0);
            fail()
        } catch(e){
            expect(e instanceof NotFoundError).toBeTruthy
        }
    });
});

describe("getUnread", function(){
    test("works", async function(){
        let unread = await Student.getUnreadBooks(1001);

        expect(unread.length).toBe(4)
        expect(unread[0]).toEqual({
            id: 101, 
            isbn: '978-0-7653-2635-5', 
            title: 'The Way of Kings', 
            stage: 2, 
            condition: 'good',
            available: true
        });
    });
});
