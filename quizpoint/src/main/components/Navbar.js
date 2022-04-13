/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import { Navbar, Nav, Dropdown, Container } from 'react-bootstrap';
import './NavBar.css';
import logo from './logo.svg'
import icon from './icon.svg'
// import {user} from '.'
import { user } from '../../firebase/fb.user'
import Image from 'react-bootstrap/Image'
import { useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
// material ui
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

function urlContains(url, value) {
    return ~url.indexOf(value);
}

// functions for generating avatars for displaying
function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const NavBar = () => {
    const location = useLocation();

    // if role is teacher, display link to page
    if (user.role === 'teacher') {
        if (urlContains(location.pathname, "/tcs")) {
            return (
                <Navbar expand="lg" className='teachingsuite-nav'>
                    <Navbar.Brand className="navbar-brand" href="/"><img src={icon} width="40" height="40" alt="QuizPoint Logo" />QuizPoint</Navbar.Brand>
                    <Nav className="navbar-links">
                        {/* Normal view --Note, dissapears once screen is small */}
                        <Nav.Link className="link" href="/tcs/students/all"><i className="bi bi-people"></i> Students</Nav.Link>
                        <Nav.Link className="link" href="/tcs/classes"><i className="bi bi-house-door"></i> Classes</Nav.Link>
                        <Nav.Link className="link" href="/tcs/quizzes"><i className="bi bi-check2-square"></i> Quizzes</Nav.Link>
                        <Nav.Link className="link" href="/tcs/reporting"><i className="bi bi-file-earmark-bar-graph"></i> Report</Nav.Link>
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
                            <Nav.Link className="" href="/">
                                <i className="bi bi-box-arrow-left"></i> Exit
                            </Nav.Link>
                        </Navbar.Collapse>
                    </Nav>
                </Navbar>

            )
        } else {
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
                            <Nav.Link className="profileLink" href="/user/local">
                                <Avatar {...stringAvatar(user.name)} />{user.name}
                            </Nav.Link>
                        </Navbar.Collapse>
                    </Nav>
                </Navbar>

            )
        }
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