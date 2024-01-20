"use strict"

/** Express app for library */

const express = require("express");
// QUESTION - what does this do?
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
const studentsRoutes = require("./routes/students");

// QUESTION - What does this do?
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/users", usersRoutes);
app.use("/students", studentsRoutes);

/** Handle 404 errors */
app.use(function (req, res, next) {
    return next(new NotFoundError());
})

/** Generic error handler */
app.use(function (err, req, res, next) {
    if(process.env.NODE_ENV !== "test") console.log(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: {message, status},
    });
})

module.exports = app;