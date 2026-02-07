import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Nav,
  Tab,
  Image,
  Modal,
} from "react-bootstrap";
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      if (!user?.id) return;
      try {
        const res = await authApis().get(endpoints["check-follow"](user.id));
        setIsFollowing(res.data.following);
      } catch (err) {
        console.error("Lỗi khi kiểm tra theo dõi:", err);
      }
    };

    checkFollowing();
  }, [user?.id]);

  const handleImageClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (!user) {
    return (
      <Container className="mt-4 text-center">
        <div className="alert alert-warning">Đang tải thông tin...</div>
      </Container>
    );
  }

  const follow = async (id) => {
    if (!currentUser?.id) return;
    try {
      if (currentUser.id === id) {
        return;
      } else {
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

  const chatRoomId = (currentUser?.id && user?.id) ? getChatRoomId(currentUser.id, user.id) : null;

  if (!profile) {
    // Gracefully handle missing profile record (e.g. for some roles or internal errors)
    // We still render the main part of the user info fetched from 'user'
    console.warn("Profile details not found for user:", user.id);
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
      <Card className="mb-4 overflow-hidden">
        {profile?.coverImage ? (
          <div
            style={{
              backgroundImage: `url(${profile.coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "200px",
              width: "100%",
              cursor: "pointer",
            }}
            onClick={handleImageClick}
          />
        ) : (
          <div className="bg-secondary" style={{ height: "200px" }} />
        )}

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
              {isFollowing ? (
                <Button variant="success" onClick={() => unfollow(user.id)}>
                  Đã theo dõi
                </Button>
              ) : (
                <Button variant="primary" onClick={() => follow(user.id)}>
                  Theo dõi
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

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
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Body className="p-0">
          <Image src={profile.coverImage} fluid />
        </Modal.Body>
      </Modal>
      {showChat && chatRoomId && (
        <ChatPopup
          roomId={chatRoomId}
          currentUser={currentUser || user}
          targetUser={user}
          onClose={() => setShowChat(false)}
        />
      )}
    </Container>
  );
};

export default Profile;
