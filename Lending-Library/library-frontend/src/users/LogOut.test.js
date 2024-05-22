import React from "react";
import { render } from "@testing-library/react";
import LogOut from "./LogOut";
import { MemoryRouter } from 'react-router-dom'


const logout = jest.fn()

// Smoke test
it("renders without crashing", () => {
    render(<MemoryRouter><LogOut logout={logout}/></MemoryRouter>)
})

// Calls logout function
it("calls logout function when clicked", () => {
    render(<MemoryRouter><LogOut logout={logout}/></MemoryRouter>)
    expect(logout).toHaveBeenCalled()
})