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
            class_id: "1002",
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
            first_name: 'Caspar', 
            last_name: 'Stedson', 
            class_id: "1006",
            school_id: "102",
            title: "Max Has a Fish",
            has_read: ['679884645','375821791','375831150'],
            isbn: "448461587",
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
            first_name: 'Caspar', 
            last_name: 'Stedson', 
            class_id: "1006"
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

        expect(unread.length).toBe(6)
        expect(unread[0]).toEqual({
            id: 101, 
            isbn: '014130670X', 
            title: 'Turtle and Snake Go Camping', 
            stage: 1, 
            condition: 'Great',
            available: true
        });
    });
});
