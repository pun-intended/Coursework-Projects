import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import BookCard from "./BookCard";
import StudentContext from "../StudentContext";


const bookIn = {
    id: "101",
    title: "test book - in",
    isbn: "0-330-25864-8",
    stage: 2,
    condition: "great",
    available: true,
};

const bookOut = {
    id: "102",
    title: "test book - out",
    isbn: "	0-307-26543-9",
    stage: 2,
    condition: "good",
    available: false,
};

const students = {
    students: [{
        fist_name: "test",
        last_name: "student",
    },
    {
        fist_name: "test",
        last_name: "student",
    }]
};

const setUpdate = jest.fn();

// Smoke test
it("renders without crashing", () => {
    render(<BookCard book={bookIn} setUpdate={setUpdate} />)
});

// Snapshot
const {asFragment} = render(<BookCard book={bookIn} setUpdate={setUpdate} />);
expect(asFragment()).toMatchSnapshot();

// Check-out button shown for available book
it("renders check-out button for available book", () => {
    const { getByText } = render(<BookCard book={bookIn} setUpdate={setUpdate} />);
    expect(getByText("Check-out")).toBeInTheDocument();
});

// Check-in button shown for unavailable book
it("renders check-in button for unavailable book", () => {
    const { getByText } = render(<BookCard book={bookOut} setUpdate={setUpdate} />);
    expect(getByText("Check-in")).toBeInTheDocument();
});

// check-in button opens check-in modal
it("opens check-in modal", () => {
    const { getAllByText } = render(<BookCard book={bookOut} setUpdate={setUpdate} />);
    const btn = getAllByText(/check-in/i);
    fireEvent.click(btn[0]); 
    expect(screen.getByRole('dialog')).toBeInTheDocument();
}); 

// check-out button opens check-out modal
it("opens check-out modal", () => {
    const { getAllByText } = render(
        <StudentContext.Provider value={students}>
        <BookCard book={bookIn} setUpdate={setUpdate} />
        </StudentContext.Provider>);
    const btn = getAllByText(/check-out/i);
    fireEvent.click(btn[0]); 
    expect(screen.getByRole('dialog')).toBeInTheDocument();
});