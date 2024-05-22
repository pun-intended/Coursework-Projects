import React from "react";
import { render, screen } from "@testing-library/react";
import CheckInModal from "./CheckInModal";

const modal = true;
const toggle = jest.fn();
const book = {
    id: "101",
    title: "test book",
    isbn: "	0-330-25864-8",
    stage: 2,
    condition: "great",
    available: true,
};
const book_id = "101"
const setUpdate = jest.fn();

// Smoke test
it("renders without crashing", () => {
    render(<CheckInModal modal={modal} toggle={toggle} book_id={book_id} setUpdate={setUpdate}/>)
})

// Snapshot
it("matches snapshot", () => {
    const {asFragment} = render(
        <CheckInModal   modal={modal} 
                        toggle={toggle} 
                        book_id={book_id} 
                        setUpdate={setUpdate}/>);
    expect(asFragment()).toMatchSnapshot();
});

// X button closes modal
it("closes modal on X click", () => {
    const {getAllByRole} = render(
        <CheckInModal   modal={modal} 
                        toggle={toggle} 
                        book_id={book_id} 
                        setUpdate={setUpdate}/>);
    const x = getAllByRole("button");
    x[0].click();
    expect(toggle).toHaveBeenCalled();
});

// cancel button calls toggle
it("closes modal on cancel click", () => {
    const {getAllByText} = render(
        <CheckInModal   modal={modal} 
                        toggle={toggle} 
                        book_id={book_id} 
                        setUpdate={setUpdate}/>);
    const cancel = getAllByText(/cancel/i);
    cancel[0].click();
    expect(toggle).toHaveBeenCalled();
});