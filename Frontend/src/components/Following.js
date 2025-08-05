import { useEffect, useState } from "react";
import { authApis, endpoints } from "../configs/Apis";
import MySpinner from "./layout/MySpinner";
import UserCard from "./layout/UserCard";
import { Row, Col, Container } from "react-bootstrap";

const Following = () => {
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFollowing = async () => {
    try {
      const response = await authApis().get(endpoints["get-following"]);
      setFollowings(response.data);
    } catch (error) {
      console.error("Error fetching following:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowing();
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
