"use strict"

const db = require('../db.js');
const Book = require("./book.js")
const {BadRequestError, NotFoundError } = require('../expressError.js');
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
 } = require('./_testCommon.js');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// TODO - fix dateTime formatting

// ---- Methods ----
// ----- checkOut
describe("checkOut", function () {
    let checkOutItem = {
        book_id: 111,
        student_id: 1002,
        date: '12-12-2023'
    };

    test("works", async function () {
        let checkedOut = await Book.checkOut(checkOutItem);
        expect(checkedOut).toEqual({
                book_id: 111,
                student_id: 1002,
                borrow_date: '12-12-2023',
                id: expect.any(Number)
        });
    });

    let wrongBook = {
        book_id: 1120,
        student_id: 1002,
        date: '12-12-2023'
    };
    test("throws NotFoundError on incorrect book", async function() {
        try{
            await Book.checkOut(wrongBook);
            fail()
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy()
        }
    })

    let wrongStudent = {
        book_id: 112,
        student_id: 10008,
        date: '12-12-2023'
    };
    test("throws NotFoundError on incorrect student id", async function() {
        try{
            await Book.checkOut(wrongStudent);
            fail()
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy()
        };
    });
});

// checkIn
describe("checkin", function() {
    let borrowedBook = {
        book_id: 111,
        student_id: 1002,
        date: '12-12-2023'
    };

    test("works", async function() {
        await Book.checkOut(borrowedBook);

        let returnData = {
            book_id: 111,
            date: '12-13-2023',
            condition: "Great"
        };

        let returned = await Book.checkIn(returnData)
        expect(returned).toEqual({
                id: expect.any(Number),
                return_date:'12-13-2023',
                condition: "Great"
            });
    });
    test("throws error if book not found", async function() {
        let returnData = {
            book_id: 1120,
            date: '12-13-2023',
            condition: "Great"
        };

        try{
            await Book.checkIn(returnData);
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        };
    });
});

// getBook
describe("getBook", function() {
    test("works", async function() {
        let book = await Book.getBook('123');

        expect(book).toEqual({
            book_id: 123, 
            isbn: '448461579', 
            title: 'We Are Twins', 
            stage: 1, 
            condition: 'Great'
        });
    });

    test("works with 'borrowing' field", async function() {
        let book = await Book.getBook('104');

        expect(book).toEqual({
            book_id: 104, 
            isbn: '448461587', 
            title: 'Max Has a Fish', 
            stage: 1, 
            condition: 'Great', 
            student: {
                id: 1001, 
                first_name: 'Caspar', 
                last_name: 'Stedson', 
                class_id: 1006, 
                borrow_date: '2023-10-24'}
        });
    });

    test("throws NotFoundError if no book found", async function() {
        try{
            await Book.getBook('1000')
            fail()
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy()
        };
    });
});

// getAllBooks
describe("getAllBooks", function() {
    // TODO - test failure without school id
    // TODO - test refined search with stage
    test("works", async function() {
        let books = await Book.getAllBooks(101);

        expect(books.length).toEqual(11);

        expect(books[0]).toEqual({
            isbn: '014130670X', 
            title: 'Turtle and Snake Go Camping', 
            stage: 1, 
            available: true
        });
    });
});

// getOutstanding
describe("getOutstanding", function() {
    test("works", async function(){
        let outstandingBooks = await Book.getOutstanding(101);

        expect(outstandingBooks.length).toEqual(6)

        expect(outstandingBooks[0]).toEqual({
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
});


