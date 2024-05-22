import React from "react";
import { render } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { MemoryRouter } from 'react-router-dom'

const login = jest.fn()
// const useNavigate = jest.fn()
// Smoke test
it("renders without crashing", () => {
    render(<MemoryRouter><LoginForm login={login} /></MemoryRouter>);
})

// Snapshot
it("matches snapshot", () => {
    const {asFragment} = render(<MemoryRouter><LoginForm login={login} /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
});

// submit calls login method


