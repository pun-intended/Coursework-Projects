import React from "react";
import { render, screen } from "@testing-library/react";
import StudentList from "./StudentList";
import StudentContext from "../StudentContext";


const students = {
    students: [{
        first_name: "test",
        last_name: "student",
        id: "1001"
    },
    {
        first_name: "test",
        last_name: "student",
        id: "1002",
        book_id: "101"
    }]
};

const initializeList = jest.fn()

// Smoke test
it("renders without crashing", () => {
    render(<StudentContext.Provider value={students}>
        <StudentList />
        </StudentContext.Provider>);
});

// Snapshot
it("Matches snapshot", () => {
    const {asFragment} = render(<StudentContext.Provider value={students}>
        <StudentList />
        </StudentContext.Provider>);
    expect(asFragment()).toMatchSnapshot();
})

// List contains all students
it("contains all students from test data", () => {
    render(
        <StudentContext.Provider value={students}>
        <StudentList />
        </StudentContext.Provider>);
    // expect(getAllByRole('heading').length).toEqual(students.students.length);
    expect(screen.getAllByRole('heading', {name: /test student/i}).length).toEqual(students.students.length)
})
