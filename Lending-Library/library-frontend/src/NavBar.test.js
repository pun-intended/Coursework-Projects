import React from "react";
import { render } from "@testing-library/react";
import NavBar from "./NavBar";
import {MemoryRouter} from 'react-router-dom'

// Smoke test
it("renders without crashing", () => {
    render(<MemoryRouter> <NavBar /> </MemoryRouter>)
})

// Snapshot
it("matches snapshot", () => {
    const {asFragment} = render(<MemoryRouter> <NavBar /> </MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
});

// Wrap in context provider
// Displays correctly when logged in

// displays correctly when not logged in