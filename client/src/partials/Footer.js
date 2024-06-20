import { Navbar, Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <Navbar fixed="bottom" bg="dark" variant="dark">
            <Container>
                <Navbar.Text style={{fontSize: '0.6em'}}>©2024 SETAS - ICET Department. All rights reserved.</Navbar.Text>
            </Container>
        </Navbar>
    );
};

export default Footer;