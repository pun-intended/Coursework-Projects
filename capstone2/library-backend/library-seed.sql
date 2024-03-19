INSERT INTO users (id, first_name, last_name, password, role) 
VALUES 
    ('10001', 'user', 'name', 
    '$2a$12$OnF1/U4/4QB4ccWdS5R4b.RLfGptno1kP4rGt8pPdAN24p8TULRnS', 'user'),
    ('10002', 'school', 'name', 
    '$2a$12$OnF1/U4/4QB4ccWdS5R4b.RLfGptno1kP4rGt8pPdAN24p8TULRnS', 'school');
    ('10003', 'master', 'user', 
    '$2a$12$OnF1/U4/4QB4ccWdS5R4b.RLfGptno1kP4rGt8pPdAN24p8TULRnS', 'master');

INSERT INTO students (id, first_name, last_name, level)
VALUES 
    ('1001', 'Charlie', 'Kelly', 'K1'),
    ('1002', 'Dennis', 'Reynolds', 'K3'),
    ('1003', 'Ronald', 'McDonald', 'K2'),
    ('1004', 'Deandra', 'Reynolds', 'K3'),
    ('1005', 'Frank', 'Reynolds', 'K3'),
    ('1006', 'Matty', 'Mara', 'K1'),
    ('1007', 'Liam', 'McPoyle', 'K1'),
    ('1008', 'Ryan', 'McPoyle', 'K2'),
    ('1009', 'Frank', 'Kelly', 'K2'),
    ('1010', 'Luther', 'McDonald', 'K2');

INSERT INTO books (id, isbn, title, stage, condition)
VALUES
    ('101', '978-0-7653-2635-5', 'The Way of Kings', 2, 'good'),
    ('102', '978-0-7653-2636-2', 'Words of Radiance', 2, 'great'),
    ('103', '978-0-7653-2637-9', 'Oathbringer', 2, 'good'),
    ('104', '978-0765326386', 'Rhythms of War', 3, 'good'),
    ('105', '978-0-316-12908-4', 'Leviathan Wakes', 3, 'great'),
    ('106', '978-0-316-12906-0', 'Caliban''s War', 3, 'good'),
    ('107', '978-0-316-12907-7', 'Abaddon''s Gate', 1, 'poor'),
    ('108', '978-0-316-21762-0', 'Cibola Burn', 1, 'great'),
    ('109', '978-0-316-21758-3', 'Nemesis Games', 1, 'poor'),
    ('110', '978-0-316-33474-7', 'Babylon''s Ashes', 4, 'poor'),
    ('111', '978-0-316-33283-5', 'Persepolis Rising', 4, 'good'),
    ('112', '978-0-316-33287-3', 'Tiamat''s Wrath', 1, 'great'),
    ('113', '978-0-316-33291-0', 'Leviathan Falls', 2, 'poor');

INSERT INTO borrow_record (student_id, book_id, borrow_date, return_date)
VALUES 
    ('1001', '102', '2023-10-10', '2023-10-17'),
    ('1001', '103', '2023-10-17', '2023-10-24'),
    ('1001', '104', '2023-10-24', NULL),
    ('1003', '113', '2023-10-27', NULL),
    ('1005', '112', '2023-10-19', NULL),
    ('1004', '111', '2023-10-18', NULL),
    ('1006', '102', '2023-10-17', NULL);