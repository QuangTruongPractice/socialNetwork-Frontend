import { useEffect, useState } from "react";
import MySpinner from "./layout/MySpinner";
import { Container, Row, Col } from "react-bootstrap";
import UserCard from "./layout/UserCard";
import { loadFollower } from "../configs/LoadData"

const Follower = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFollowers = async () => {
      try {
        const response = await loadFollower();
        setFollowers(response);
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadFollowers();
  }, []);

  if (loading) return <MySpinner />;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Người theo dõi bạn</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {followers.map((follower) => (
          <Col key={follower.id}>
            <UserCard user={follower} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Follower;