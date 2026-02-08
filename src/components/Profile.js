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
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "react-bootstrap";
import { authApis, endpoints } from "../configs/Apis";
import ChatPopup from "./ChatPopup";
import { getChatRoomId as fetchRoomId } from "../configs/LoadData";
import { useContext } from "react";
import BasicInfoProfile from "./layout/BasicInfoProfile";
import CareerInfoProfile from "./layout/CareerInfoProfile";
import { MyUserContext } from "../configs/Contexts";

const Profile = ({ profile, role, user }) => {
  // const [isFollowing, setIsFollowing] = useState(false); // Managed by React Query now
  const [showChat, setShowChat] = useState(false);
  const [currentUser] = useContext(MyUserContext);
  const [showModal, setShowModal] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState(null);

  const { data: followData } = useQuery({
    queryKey: ["follow", user?.id],
    queryFn: async () => {
      if (!user?.id) return { following: false };
      const res = await authApis().get(endpoints["check-follow"](user.id));
      return res.data;
    },
    enabled: !!user?.id,
  });

  const queryClient = useQueryClient();

  const mutationFollow = useMutation({
    mutationFn: (id) => authApis().post(endpoints["follow"](id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
    onError: (err) => {
      console.error("Follow thất bại:", err);
    }
  });

  const mutationUnfollow = useMutation({
    mutationFn: (id) => authApis().delete(endpoints["follow"](id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
    onError: (err) => {
      console.error("Hủy follow thất bại:", err);
    }
  });

  const handleImageClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (!user) {
    return (
      <Container className="mt-4 text-center">
        <div className="alert alert-warning">Đang tải thông tin...</div>
      </Container>
    );
  }

  const isFollowing = followData?.following || false;

  const handleOpenChat = async () => {
    if (!currentUser?.id || !user?.id) return;
    try {
      const rid = await fetchRoomId(currentUser.id, user.id);
      setActiveRoomId(rid);
      setShowChat(true);
    } catch (err) {
      console.error("Lỗi khi mở chat:", err);
    }
  };

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
                onClick={handleOpenChat}
              >
                Nhắn tin
              </Button>
              {isFollowing ? (
                <Button variant="success" onClick={() => mutationUnfollow.mutate(user.id)} disabled={mutationUnfollow.isPending}>
                  {mutationUnfollow.isPending ? "Đang xử lý..." : "Đã theo dõi"}
                </Button>
              ) : (
                <Button variant="primary" onClick={() => mutationFollow.mutate(user.id)} disabled={mutationFollow.isPending}>
                  {mutationFollow.isPending ? "Đang xử lý..." : "Theo dõi"}
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
      {showChat && activeRoomId && (
        <ChatPopup
          roomId={activeRoomId}
          currentUser={currentUser || user}
          targetUser={user}
          onClose={() => setShowChat(false)}
        />
      )}
    </Container>
  );
};

export default Profile;
