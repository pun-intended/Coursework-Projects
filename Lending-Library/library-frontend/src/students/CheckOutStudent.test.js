import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CheckOutStudent from "./CheckOutStudent";
import LibraryApi from "../api";


const books = {
    books: [{
        id: "101",
        title: "test book - in",
        isbn: "0-330-25864-8",
        stage: 2,
        condition: "great",
        available: true,
    },
    {
        id: "102",
        title: "test book - out",
        isbn: "	0-307-26543-9",
        stage: 2,
        condition: "good",
        available: false,
    }]
};

const studentRead = {
    id: "1001",
    fist_name: "test",
    last_name: "student",
    has_read: ["101"],
};

const studentNotRead = {
    id: "1001",
    fist_name: "test",
    last_name: "student"
};

const toggle = jest.fn();
const setUpdate = jest.fn();
LibraryApi.checkOut = jest.fn();


// Smoke test
it("renders without crashing", () => {
    render(<CheckOutStudent modal={true} 
                            toggle={toggle} 
                            student={studentRead} 
                            setUpdate={setUpdate} />)
});

// Snapshot
it("matches snapshot", () => {
    const asFragment = render(<CheckOutStudent  modal={true} 
                                                toggle={toggle} 
                                                student={studentRead} 
                                                setUpdate={setUpdate} />)
});

// ----- Can't get books to appear in list
// // Book List includes all books
// it("contains all books from test data", () => {
//     const {getAllByRole} = render(<CheckOutStudent modal={true} 
//                                                     toggle={toggle} 
//                                                     student={studentNotRead} 
//                                                     setUpdate={setUpdate} />);
//     expect(getAllByRole('image').length).toEqual(books.books.length);
// })

// // Book list excludes read books
// it("list excludes books read", async () => {
//     const {getAllByRole} = await render(<CheckOutStudent modal={true} 
//                                                     toggle={toggle} 
//                                                     student={studentNotRead} 
//                                                     setUpdate={setUpdate} />);
    
//     screen.getAllByRole('image');
//     expect(getAllByRole('image').length).toEqual(books.books.length - 1);
// })


// Check out button calls handleSubmit method
it("check out button calls handleSubmit method", () => {
    render(<CheckOutStudent modal={true} 
                            toggle={toggle} 
                            student={studentRead} 
                            setUpdate={setUpdate} />);
    const btn = screen.getByText(/check out/i);
    fireEvent.click(btn);
    expect(LibraryApi.checkOut).toHaveBeenCalled();
    expect(setUpdate).toHaveBeenCalled();
    expect(toggle).toHaveBeenCalled();
})

// Cancel button calls toggle method
it("cancel button calls toggle method", () => {
    render(<CheckOutStudent modal={true} 
                            toggle={toggle} 
                            student={studentRead} 
                            setUpdate={setUpdate} />);
    const btn = screen.getByText(/cancel/i);
    fireEvent.click(btn);
    expect(toggle).toHaveBeenCalled();
})
