import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
const Header = () => {
    return (
        <Navbar style={{ padding: '15px' }} bg="dark" expand="lg" variant='dark'>
            <Navbar.Brand href="/">ICET Lab Checksheet</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link href="/">Checksheet</Nav.Link>
                    <Nav.Link href="/schedule">Schedule</Nav.Link>
                    <Nav.Link href="/history">History</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
export default Header;
