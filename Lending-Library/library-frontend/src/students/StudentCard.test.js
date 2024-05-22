import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StudentCard from "./StudentCard";


const setUpdate = jest.fn()
const toggleOut = jest.fn()
// const toggleIn = jest.fn()
const studentHas = {
    first_name: "test",
    last_name: "student",
    book_id: "101",
};
const studentHasNot = {
    first_name: "test",
    last_name: "student",
};
// Smoke test
it("renders without crashing", () => {
    render(<StudentCard student={studentHas} setUpdate={setUpdate} />)
})

// Snapshot
it("matches snapshot", () => {
    const {asFragment} = render(<StudentCard student={studentHas} setUpdate={setUpdate} />);
    expect(asFragment()).toMatchSnapshot();
})


// Check in button opens modal
it("opens check in modal when check in clicked", () => {
    render(<StudentCard student={studentHas} setUpdate={setUpdate} />)
    const btn = screen.getAllByText(/check in/i)
    fireEvent.click(btn[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
})

// // check_out button calls toggleOut method
it("opens check in modal when check in clicked", () => {
    render(<StudentCard student={studentHasNot} setUpdate={setUpdate} />)
    const btn = screen.getAllByText(/check out/i)
    fireEvent.click(btn[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
});

// // card contains student name
it("Contains student name", () => {
    render(<StudentCard student={studentHas} setUpdate={setUpdate} />)
    expect(screen.getByText(/test student/i)).toBeInTheDocument()
})

// Shows check out button for student without book
it("Shows check out button for student without book", () => {
    render(<StudentCard student={studentHasNot} setUpdate={setUpdate} />)
    expect(screen.getByText(/check out/i)).toBeInTheDocument()
})


// Shows check in button for student with book
it("Shows check in button for student with book", () => {
    render(<StudentCard student={studentHas} setUpdate={setUpdate} />)
    expect(screen.getByText(/check in/i)).toBeInTheDocument()
})