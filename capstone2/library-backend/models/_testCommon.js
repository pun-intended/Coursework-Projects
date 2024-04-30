const db = require("../db.js");
const User = require("../models/user");
const Book = require("../models/book");
const Student = require("../models/student");
const { createToken } = require("../helpers/tokens");

// TODO - Rerun tests, correct data reference errors

async function commonBeforeAll() {


    await db.query(
      `DELETE FROM users`
    )

    await db.query(
      `DELETE FROM students`
    )

    await db.query(
      `DELETE FROM books`
    )

    await db.query(
      `DELETE FROM borrow_record`
    )

    await db.query(`
    INSERT INTO users (id, first_name, last_name, password, is_admin) 
    VALUES 
      ('10001', 'user', 'name', 
      '$2a$12$OnF1/U4/4QB4ccWdS5R4b.RLfGptno1kP4rGt8pPdAN24p8TULRnS', 'user'),
      ('10002', 'school', 'name', 
      '$2a$12$OnF1/U4/4QB4ccWdS5R4b.RLfGptno1kP4rGt8pPdAN24p8TULRnS', 'school_admin'),
      ('10003', 'master', 'user', 
      '$2a$12$OnF1/U4/4QB4ccWdS5R4b.RLfGptno1kP4rGt8pPdAN24p8TULRnS', 'master_admin')`
    );

    await db.query(`
    INSERT INTO schools(id, name)
    VALUES
      (101, 'school A'),
      (102, 'school B'),
      (103, 'school C')`
    );

    await db.query(`
    INSERT INTO classes (id, school_id, name)
    VALUES
      (1001, 101, 'Class A'),
      (1002, 101, 'Class B'),
      (1003, 101, 'Class C'),
      (1004, 102, 'Class A'),
      (1005, 102, 'Class B'),
      (1006, 102, 'Class C'),
      (1007, 103, 'Class A'),
      (1008, 103, 'Class B'),
      (1009, 103, 'Class C')`
    );

    await db.query(
    `INSERT INTO students (id, first_name, last_name, level)
    VALUES 
      (1001, 'Caspar', 'Stedson', 1006),
      (1002, 'Kira', 'Gashion', 1007),
      (1003, 'Rowan', 'Newe', 1008),
      (1004, 'Ellette', 'Lax', 1008),
      (1005, 'Terrijo', 'Winchester', 1004),
      (1006, 'Maureene', 'Jeremiah', 1008),
      (1007, 'Korella', 'Glaister', 1001),
      (1008, 'Bendick', 'Knightley', 1002),
      (1009, 'Goldi', 'Fairbrass', 1006),
      (1010, 'Nealy', 'Simonsen', 1004)`
    );

    await db.query(
    `INSERT INTO master_books (isbn, title, stage)
    VALUES
      ('014130670X', 'Turtle and Snake Go Camping', 1),
      ('448457636', 'Bake, Mice, Bake!', 1),
      ('448461579', 'We Are Twins', 1),
      ('448461587', 'Max Has a Fish', 1),
      ('448463059', 'Cat Days', 1),
      ('448462648', 'Clara and Clem Take a Ride', 1),
      ('9780448496467', 'Guppy Up!', 1),
      ('448463768', 'On a Farm', 2),
      ('0448461803', 'A New Friend', 2),
      ('448464713', 'At the Beach', 2),
      ('448467194', 'In the Forest', 2)`
    );
    
    await db.query(
    `INSERT INTO book_sets (set_id, school_id)
    VALUES
      ('1', '101'),
      ('2', '101'),
      ('3', '102')`
    );

    await db.query(
    `INSERT INTO books (id, isbn, set_id)
    VALUES
      ('101', '014130670X', '1'),
      ('102', '448457636', '1'),
      ('103', '448461579', '1'),
      ('104', '448461587', '1'),
      ('105', '448463059', '1'),
      ('106', '448462648', '1'),
      ('107', '9780448496467', '1'),
      ('108', '448463768', '1'),
      ('109', '0448461803', '1'),
      ('110', '448464713', '1'),
      ('112', '448467194', '1'),
      ('121', '014130670X', '2'),
      ('122', '448457636', '2'),
      ('123', '448461579', '2'),
      ('124', '448461587', '2'),
      ('125', '448463059', '2'),
      ('126', '448462648', '2'),
      ('127', '9780448496467', '2'),
      ('128', '448463768', '2'),
      ('129', '0448461803', '2'),
      ('130', '448464713', '2'),
      ('132', '448467194', '2'),
      ('141', '014130670X', '3'),
      ('142', '448457636', '3'),
      ('143', '448461579', '3'),
      ('144', '448461587', '3'),
      ('145', '448463059', '3'),
      ('146', '448462648', '3'),
      ('147', '9780448496467', '3'),
      ('148', '448463768', '3'),
      ('149', '0448461803', '3'),
      ('150', '448464713', '3'),
      ('152', '448467194', '3')`
    );

    await db.query(`
    INSERT INTO borrow_record (student_id, book_id, borrow_date, return_date)
    VALUES 
      ('1001', '102', '2023-10-10', '2023-10-17'),
      ('1001', '103', '2023-10-17', '2023-10-24'),
      ('1001', '104', '2023-10-24', NULL),
      ('1003', '103', '2023-10-27', NULL),
      ('1005', '102', '2023-10-19', NULL),
      ('1007', '124', '2023-10-19', NULL),
      ('1004', '111', '2023-10-18', NULL),
      ('1006', '102', '2023-10-17', NULL)`
    );
}
    

async function commonBeforeEach() {
    await db.query("BEGIN");
}
  
  async function commonAfterEach() {
    await db.query("ROLLBACK");
}
  
  async function commonAfterAll() {
    await db.end();
}

const u1Token = createToken({ id: "10001", role: 'user' });
const u2Token = createToken({ id: "10002", role: 'user' });
const adminToken = createToken({ id: "10003", role: 'school_admin' });
const masterToken = createToken({ id: "10004", role: 'master' });


module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    adminToken,
    masterToken
  };