import { useQuery } from "@tanstack/react-query";
import MySpinner from "./layout/MySpinner";
import { Container, Row, Col } from "react-bootstrap";
import UserCard from "./layout/UserCard";
import { loadFollower } from "../configs/LoadData"

const Follower = () => {
  const { data: followers, isLoading, isError } = useQuery({
    queryKey: ["followers"],
    queryFn: loadFollower,
  });

  if (isLoading) return <MySpinner />;
  if (isError) return <div className="text-center mt-5">Lỗi tải danh sách người theo dõi.</div>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Người theo dõi bạn</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {followers && followers.map((follower) => (
          <Col key={follower.id}>
            <UserCard user={follower} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Follower;