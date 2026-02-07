import { Container, Nav, Navbar, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyUserContext } from "../../configs/Contexts";
import Avatar from "./Avatar";
import SearchBar from "./SearchBar";

const Header = () => {
  const [user, dispatch] = useContext(MyUserContext);
  console.log("DEBUG - Header User State:", user);

  const avatar = user?.avatar;
  const fullname = (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : "User";
  const position = user?.profile?.position || "";

  return (
    <Navbar bg="light" className="border-bottom shadow-sm py-3" expand="lg">
      <Container fluid>
        <Row className="w-100 align-items-center">
          <Col md={3} className="d-flex align-items-center">
            <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
              Alumni Social Network
            </Navbar.Brand>
          </Col>

          <Col md={6}>
            <Nav className="justify-content-center">
              <SearchBar />
              <Nav.Link as={Link} to="/home" className="mx-2">
                Trang chủ
              </Nav.Link>
              <Nav.Link as={Link} to="/follower" className="mx-2">
                Người theo dõi
              </Nav.Link>
              <Nav.Link as={Link} to="/following" className="mx-2">
                Đang theo dõi
              </Nav.Link>
              <Nav.Link as={Link} to="/notification" className="mx-2">
                Thông báo
              </Nav.Link>
              <Nav.Link as={Link} to="/" className="mx-2" onClick={() => dispatch({ "type": "logout" })}>
                Thoát
              </Nav.Link>
            </Nav>
          </Col>

          <Col md={3} className="d-flex justify-content-end align-items-center">
            <Link
              to="/my-profile"
              className="d-flex align-items-center text-decoration-none text-dark"
            >
              <div className="text-end me-2">
                <div className="fw-semibold">{fullname}</div>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                  {position}
                </div>
              </div>
              <Avatar src={avatar} size={50} className="me-2" />
            </Link>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
