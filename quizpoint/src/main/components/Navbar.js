/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import {Navbar, Nav, Dropdown} from 'react-bootstrap';
import './NavBar.css';
import logo from './logo.svg'

const NavBar = () => {
    return (
        <Navbar expand="lg">
                <Navbar.Brand className = "navbar-brand" href="/"><img src={logo} width="40" height="40" alt="QuizPoint Logo"/>QuizPoint</Navbar.Brand>
                <Nav className="navbar-links">
                    {/* Normal view --Note, dissapears once screen is small */}
                    <Nav.Link className="" href="/classHome">Your Classes</Nav.Link>
                    <Nav.Link className="" href="/tcs">Teaching Home (Test)</Nav.Link>
                    <Nav.Link className="" href="/logout">Logout</Nav.Link>
                    {/* Dropdown is hidden until screen size is small */}
                    <Dropdown className="navbar-dropdown">
                        <Dropdown.Toggle className="navbar-dropdown-toggle"></Dropdown.Toggle>
                        <Dropdown.Menu className="navbar-dropdown-menu position-absolute dropdown-menu-end">
                            <Dropdown.Item href="/classHome" className="">Your Classes</Dropdown.Item>
                            <Dropdown.Item href="/tcs" className="">Teaching Home</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
        </Navbar>
    )
}

export default NavBar