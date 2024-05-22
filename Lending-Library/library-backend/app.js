"use strict"

/** Express app for library */

// TODO - disallow books from being double borrowed
// TODO - disallow students from borrowing more than one book

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
const studentsRoutes = require("./routes/students");
const classesRoutes = require("./routes/classes");
const schoolsRoutes = require("./routes/schools")
const setsRoutes = require("./routes/sets")

const morgan = require("morgan");

const app = express();

app.use(cors(
    {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
    }
));
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/users", usersRoutes);
app.use("/students", studentsRoutes);
app.use("/classes", classesRoutes);
app.use("/schools", schoolsRoutes);
app.use("/sets", setsRoutes);


app.get("/test", (req, res, next) => {
    res.send({result: "connected"})
})

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