import { Container, Row, Col, Card, Badge, Nav, Tab } from "react-bootstrap";
import Avatar from "./layout/Avatar";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { authApis, endpoints } from "../configs/Apis";
import ChatPopup from "./ChatPopup";
import { useContext } from "react";
import BasicInfoProfile from "./layout/BasicInfoProfile";
import CareerInfoProfile from "./layout/CareerInfoProfile";
import { MyUserContext } from "../configs/Contexts";

const Profile = ({ profile, role, user }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentUser] = useContext(MyUserContext);

  const checkFollowing = async () => {
    try {
      const res = await authApis().get(endpoints["check-follow"](user.id));
      setIsFollowing(res.data.following);
    } catch (err) {
      console.error("Lỗi khi kiểm tra theo dõi:", err);
    }
  };

  useEffect(() => {
    checkFollowing();
  }, []);

  const follow = async (id) => {
    try {
      if(user.id === id){
        return;
      }else {
        await authApis().post(endpoints["follow"](id));
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Follow thất bại:", err);
    }
  };

  const unfollow = async (id) => {
    try {
      await authApis().delete(endpoints["follow"](id));
      setIsFollowing(false);
    } catch (err) {
      console.error("Hủy follow thất bại:", err);
    }
  };

  const getChatRoomId = (id1, id2) => {
    const sorted = [id1, id2].sort((a, b) => a - b);
    return `room_${sorted[0]}_${sorted[1]}`;
  };

  const chatRoomId = getChatRoomId(currentUser.id, user.id);

  if (!profile) {
    return (
      <Container className="mt-4">
        <div className="alert alert-warning">Profile not found.</div>
      </Container>
    );
  }

  const getRoleInfo = (role) => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return { title: "Quản trị viên", variant: "danger" };
      case "ALUMNI":
        return { title: "Cựu sinh viên", variant: "primary" };
      case "LECTURER":
        return { title: "Giảng viên", variant: "success" };
      default:
        return { title: "Unknown", variant: "secondary" };
    }
  };

  const roleInfo = getRoleInfo(role);

  return (
    <Container className="mt-4">
      {/* Header */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={2} className="text-center">
              <Avatar src={user.avatar} size={100} className="me-2" />
            </Col>
            <Col md={7}>
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              <Badge bg={roleInfo.variant} className="mb-2">
                {roleInfo.title}
              </Badge>
            </Col>
            <Col md={3} className="text-end">
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => setShowChat(true)}
              >
                Nhắn tin
              </Button>
              {isFollowing === true ? (
                <Button variant="success" onClick={() => unfollow(user.id)}>
                  {" "}
                  Đã theo dõi{" "}
                </Button>
              ) : (
                <Button variant="primary" onClick={() => follow(user.id)}>
                  {" "}
                  Theo dõi{" "}
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tab.Container defaultActiveKey="basic-info">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="basic-info">Thông tin cơ bản</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="career-info">Thông tin sự nghiệp</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="basic-info">
            <BasicInfoProfile user={user} profile={profile} role={role} />
          </Tab.Pane>
          <Tab.Pane eventKey="career-info">
            <CareerInfoProfile profile={profile} role={role} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      {showChat && (
        <ChatPopup
          roomId={chatRoomId}
          currentUser={user}
          targetUser={profile}
          onClose={() => setShowChat(false)}
        />
      )}
    </Container>
  );
};

export default Profile;
