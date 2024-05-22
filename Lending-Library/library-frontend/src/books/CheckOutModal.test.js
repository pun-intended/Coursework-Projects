import React from "react";
import { fireEvent, render } from "@testing-library/react";
import CheckOutModal from "./CheckOutModal";
import StudentContext from "../StudentContext";

const modal = true;
const toggle = jest.fn();
const setUpdate = jest.fn();

const book = {
    id: "101",
    title: "test book",
    isbn: "	0-330-25864-8",
    stage: 2,
    condition: "great",
    available: true,
};
const bookNeverBorrowed = {
    id: "102",
    title: "test book",
    isbn: "	0-330-25864-8",
    stage: 2,
    condition: "great",
    available: true,
};

const students = {
        students: [{
        id: "1",
        first_name: "test",
        last_name: "student",
        has_read: ["101"]
    },
    {
        id: "2",
        first_name: "test",
        last_name: "student"
    }]
};

// Smoke test
it("renders without crashing", () => {
    render(
        <StudentContext.Provider value={students}>
        <CheckOutModal modal={modal} toggle={toggle} book={book} setUpdate={setUpdate}/>
        </StudentContext.Provider>);
})

// Snapshot
it("matches snapshot", () => {
    const {asFragment} = render(
        <StudentContext.Provider value={students}>
        <CheckOutModal  modal={modal} 
                        toggle={toggle} 
                        book={book} 
                        setUpdate={setUpdate}/>
        </StudentContext.Provider>);
    expect(asFragment()).toMatchSnapshot();
});



// X button closes modal
it("Calls toggle on X button", () => {
    const {getAllByRole} = render(
        <StudentContext.Provider value={students}>
        <CheckOutModal  modal={modal} 
                        toggle={toggle} 
                        book={book} 
                        setUpdate={setUpdate}/>
        </StudentContext.Provider>);
    const button = getAllByRole("button");
    button[0].click();
    expect(toggle).toHaveBeenCalled();
})

// Cancel button closes modal
it("Calls toggle on cancel button", () => {
    const {getByText} = render(
        <StudentContext.Provider value={students}>
        <CheckOutModal  modal={modal} 
                        toggle={toggle} 
                        book={book} 
                        setUpdate={setUpdate}/>
        </StudentContext.Provider>);
    const button = getByText(/cancel/i);
    button.click();
    expect(toggle).toHaveBeenCalled();
})

// Check-out calls toggle
it("Calls toggle on check-out", () => {
    const {getByText, queryAllByRole, getByRole} = render(
        <StudentContext.Provider value={students}>
        <CheckOutModal  modal={modal} 
                        toggle={toggle} 
                        book={book} 
                        setUpdate={setUpdate}/>
        </StudentContext.Provider>);
    const button = getByRole('button', {name: "Check Out"});
    const student = queryAllByRole('option', {name: /test student/i})
    const dropdown = getByRole('combobox')
    fireEvent.change(dropdown, {target: {value: "1"}})
    fireEvent.click(button);
    expect(toggle).toHaveBeenCalled(); 
})

// list contains students from context
it("Contains all all students from the test data", () => {
    const {getAllByText} = render(
        <StudentContext.Provider value={students}>
        <CheckOutModal  modal={modal} 
                        toggle={toggle} 
                        book={bookNeverBorrowed} 
                        setUpdate={setUpdate}/>
        </StudentContext.Provider>);
    const student = getAllByText(/test student/i);
    expect(student).toHaveLength(2);
})

// list excludes students who have read the book
it("Excludes students who have read the book", () => {
    const {getAllByText} = render(
        <StudentContext.Provider value={students}>
        <CheckOutModal  modal={modal} 
                        toggle={toggle} 
                        book={book} 
                        setUpdate={setUpdate}/>
        </StudentContext.Provider>);
    const student = getAllByText(/test student/i);
    expect(student).toHaveLength(1);
})
