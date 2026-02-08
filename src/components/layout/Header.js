import { Container, Nav, Navbar, Badge, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/Contexts";
import Avatar from "./Avatar";
import SearchBar from "./SearchBar";
import { FaBell, FaHome, FaUserFriends, FaAddressBook, FaUserCheck, FaSignOutAlt } from "react-icons/fa";
import { loadNotification } from "../../configs/LoadData";
import WebSocketService from "../../configs/WebSocketService";

const Header = () => {
  const [user, dispatch] = useContext(MyUserContext);
  const [notis, setNotis] = useState([]);
  const unreadCount = Array.isArray(notis)
    ? notis.filter(n => !(n.isRead || n.read)).length
    : 0;

  useEffect(() => {
    if (user) {
      const fetchNotis = async () => {
        try {
          const data = await loadNotification();
          setNotis(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Fetch notifications failed", err);
        }
      };
      fetchNotis();

      // Subscribe to real-time notifications
      WebSocketService.connect(() => {
        WebSocketService.subscribe(`/user/${user.id}/queue/notifications`, (newNoti) => {
          setNotis(prev => [newNoti, ...prev]);
        });
      });
    }
  }, [user]);

  const location = useLocation();

  const navItems = [
    { to: "/home", icon: <FaHome size={28} />, label: "Trang chủ" },
    { to: "/contacts", icon: <FaAddressBook size={28} />, label: "Người liên hệ" },
    { to: "/follower", icon: <FaUserFriends size={28} />, label: "Người theo dõi" },
    { to: "/following", icon: <FaUserCheck size={28} />, label: "Đang theo dõi" },
  ];

  const avatar = user?.avatar;
  const fullname = (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : "User";

  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm py-1 sticky-top position-relative">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3 me-3">
          ASN
        </Navbar.Brand>

        <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-auto">
          <div className="d-none d-lg-block" style={{ maxWidth: "300px", width: "100%" }}>
            <SearchBar />
          </div>
          <div className="d-lg-none flex-grow-1 me-2">
            <SearchBar />
          </div>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto my-2 my-lg-0 align-items-center justify-content-center flex-grow-1 nav-center-desktop">
            {navItems.map((item, index) => (
              <OverlayTrigger
                key={index}
                placement="bottom"
                overlay={<Tooltip className="d-none d-lg-block">{item.label}</Tooltip>}
              >
                <Nav.Link
                  as={Link}
                  to={item.to}
                  className={`mx-1 px-3 py-2 rounded-3 position-relative d-flex align-items-center ${location.pathname === item.to ? 'text-primary' : 'text-secondary hover-bg-light'}`}
                >
                  <div className={`nav-icon ${location.pathname === item.to ? 'active' : ''}`}>
                    {item.icon}
                  </div>
                  <span className="d-lg-none ms-3 fw-medium">{item.label}</span>
                  {item.isActive && <div className="active-indicator d-none d-lg-block"></div>}
                </Nav.Link>
              </OverlayTrigger>
            ))}

            {/* Notification Icon */}
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip className="d-none d-lg-block">Thông báo</Tooltip>}
            >
              <Nav.Link as={Link} to="/notification" className={`mx-1 px-3 py-2 rounded-3 position-relative d-flex align-items-center ${location.pathname === '/notification' ? 'text-primary' : 'text-secondary hover-bg-light'}`}>
                <div className="nav-icon position-relative">
                  <FaBell size={25} />
                  {unreadCount > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.6rem' }}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </div>
                <span className="d-lg-none ms-3 fw-medium">Thông báo</span>
              </Nav.Link>
            </OverlayTrigger>
          </Nav>

          {/* User Profile & Logout */}
          <div className="d-flex align-items-center mt-3 mt-lg-0 border-top border-lg-0 pt-3 pt-lg-0 justify-content-center justify-content-lg-end">
            <Link to="/my-profile" className="d-flex align-items-center text-decoration-none text-dark me-2 p-1 rounded-pill hover-bg-light">
              <Avatar src={avatar} size={35} className="border shadow-sm" />
              <span className="ms-2 fw-bold d-none d-lg-inline-block">{fullname}</span>
            </Link>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Đăng xuất</Tooltip>}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-light hover-bg-danger text-dark cursor-pointer shadow-sm transition-all"
                style={{ width: "40px", height: "40px" }}
                onClick={() => dispatch({ "type": "logout" })}
              >
                <FaSignOutAlt className="fs-6" />
              </div>
            </OverlayTrigger>
          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
