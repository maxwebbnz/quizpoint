/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import {Navbar, Nav, Container} from 'react-bootstrap';
import './NavBar.css';
import logo from './logo.svg'

const NavBar = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container className="navbar-container">
                <Navbar.Brand className = "navbar-brand" href=""><img src={logo} width="40" height="40" alt="QuizPoint Logo"/>QuizPoint</Navbar.Brand>
                <Nav className="navbar-links">
                    <Nav.Link className="navbar-links-classes" href="">Your Classes</Nav.Link>
                </Nav>
            </Container>
      </Navbar>
    )
}

export default NavBar