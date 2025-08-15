import { useEffect, useState } from "react";
import MySpinner from "./layout/MySpinner";
import UserCard from "./layout/UserCard";
import { Row, Col, Container } from "react-bootstrap";
import { loadFollowing } from "../configs/LoadData"

const Following = () => {
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFollowings = async () => {
    try {
      const response = await loadFollowing();
      setFollowings(response);
    } catch (error) {
      console.error("Error fetching following:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowings();
  }, []);

  if (loading) return <MySpinner />;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Người bạn đang theo dõi</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {followings.map((following) => (
          <Col key={following.id}>
            <UserCard user={following} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Following;
