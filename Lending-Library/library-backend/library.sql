\echo 'Delete and recreate library db?'
\prompt 'Return for yes or control-C to cancel > '

DROP DATABASE library;
CREATE DATABASE library;
\connect library

\i library-schema.sql
\i library-seed.sql

\echo 'Delete and recreate library_test db?'
\prompt 'Return for yes or control-C to cancel > '

DROP DATABASE library_test;
CREATE DATABASE library_test;
\connect library_test

\i library-schema.sql
