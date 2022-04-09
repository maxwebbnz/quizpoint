/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import { Navbar, Nav, Dropdown, Container } from 'react-bootstrap';
import './NavBar.css';
import logo from './logo.svg'
// import {user} from '.'
import { user } from '../../firebase/fb.user'
import Image from 'react-bootstrap/Image'

const NavBar = () => {
    // if role is teacher, display link to page
    if (user.role === 'teacher') {
        return (
            <Navbar expand="lg">
                <Navbar.Brand className="navbar-brand" href="/"><img src={logo} width="40" height="40" alt="QuizPoint Logo" />QuizPoint</Navbar.Brand>
                <Nav className="navbar-links">
                    {/* Normal view --Note, dissapears once screen is small */}
                    <Nav.Link className="link" href="/classes">Your Classes</Nav.Link>
                    <Nav.Link className="link" href="/tcs">Teaching Home (Test)</Nav.Link>
                    <Nav.Link className="link" href="/logout">Logout</Nav.Link>
                    {/* Dropdown is hidden until screen size is small */}
                    <Dropdown className="navbar-dropdown">
                        <Dropdown.Toggle className="navbar-dropdown-toggle"></Dropdown.Toggle>
                        <Dropdown.Menu className="navbar-dropdown-menu position-absolute dropdown-menu-end">
                            <Dropdown.Item href="/classHome" className="">Your Classes</Dropdown.Item>
                            <Dropdown.Item href="/tcs" className="">Teaching Home</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
                <Nav>
                    <Navbar.Collapse className="nav-right">
                        <Nav.Link className="" href="/user/local"><Image roundedCircle src={user.picture} className="" width="50" height="50" alt="Profile" /></Nav.Link>
                    </Navbar.Collapse>
                </Nav>
            </Navbar>
        )
    } else {
        // else do not they cannot access it
        return (
            <Navbar expand="lg">
                <Navbar.Brand className="navbar-brand" href="/"><img src={logo} width="40" height="40" alt="QuizPoint Logo" />QuizPoint</Navbar.Brand>
                <Container>
                    <Nav className="navbar-links">
                        {/* Normal view --Note, dissapears once screen is small */}
                        <Nav.Link className="link" href="/classes">Your Classes</Nav.Link>
                        {/* <Nav.Link className="" href="/tcs">Teaching Home (Test)</Nav.Link> */}
                        <Nav.Link className="link" href="/logout">Logout</Nav.Link>
                        {/* Dropdown is hidden until screen size is small */}
                        <Dropdown className="navbar-dropdown">
                            <Dropdown.Toggle className="navbar-dropdown-toggle"></Dropdown.Toggle>
                            <Dropdown.Menu className="navbar-dropdown-menu position-absolute dropdown-menu-end">
                                <Dropdown.Item href="/classHome" className="">Your Classes</Dropdown.Item>
                                {/* <Dropdown.Item href="/tcs" className="">Teaching Home</Dropdown.Item> */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                    <Nav>
                        <Navbar.Collapse className="nav-right">
                            <Nav.Link className="" href="/user/local">
                                <Image roundedCircle src={user.picture} className="" width="50" height="50" alt="Profile" />

                                {user.name}
                            </Nav.Link>
                        </Navbar.Collapse>
                    </Nav>
                </Container>
            </Navbar>
        )
    }

}

export default NavBar