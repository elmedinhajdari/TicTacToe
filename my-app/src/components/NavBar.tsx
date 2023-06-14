import { Container, Nav, Navbar } from "react-bootstrap";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [navbar, setNavbar] = useState(true);

  const changeBackground = () => {
    if (window.scrollY >= 100) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    changeBackground();
    window.addEventListener("scroll", changeBackground);
  });

  return (
    <>
      <Navbar
        collapseOnSelect
        fixed="top"
        expand="lg"
        className={navbar ? "navbar" : "transparentNavbar"}
        variant="dark"
      >
        <Container className="text-center">
          <Navbar.Brand as={Link} to={"/"} className="navTitle">
            <i className="fa-solid fa-x me-2"></i>

            <i className="fa-solid fa-o ms-2"></i>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav navbarButtonToggle" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto ms-auto navbarStyle">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="typpinggame">
                Typper
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
export default NavBar;
