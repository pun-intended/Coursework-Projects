import React, { useContext } from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import UserContext from "./UserContext";

const NavBar = () =>{
    const currentUser = useContext(UserContext);
  
  return (
    <div>
      <Navbar expand="md">
        <NavLink exact="true" to="/" className="navbar-brand">
          Library
        </NavLink>
        {currentUser && <NavLink to="/profile" className="navbar-brand">
          {`${currentUser.id} - ${currentUser.first_name}`}
        </NavLink>}

        <Nav className="ml-auto" navbar>
          {currentUser &&
          <NavItem>
            <NavLink to="/books">Books</NavLink>
          </NavItem>}
          {currentUser &&
          <NavItem>
            <NavLink to="/students">Students</NavLink>
          </NavItem>}
          {!currentUser &&
          <NavItem>
            <NavLink to="/login">Login</NavLink>
          </NavItem>}
          {/* {!currentUser &&
          <NavItem>
            <NavLink to="/signup">Signup</NavLink>
          </NavItem>} */}
          {currentUser && 
          <NavItem>
            <NavLink to="/logout"> Logout </NavLink>
          </NavItem>}
        </Nav>
        
      </Navbar>
    </div>
  );
}

export default NavBar;
