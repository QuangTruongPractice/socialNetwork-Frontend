import { useQuery } from "@tanstack/react-query";
import MySpinner from "./layout/MySpinner";
import UserCard from "./layout/UserCard";
import { Row, Col, Container } from "react-bootstrap";
import { loadFollowing } from "../configs/LoadData"

const Following = () => {
  const { data: followings, isLoading, isError } = useQuery({
    queryKey: ["following"],
    queryFn: loadFollowing,
  });

  if (isLoading) return <MySpinner />;
  if (isError) return <div className="text-center mt-5">Lỗi tải danh sách đang theo dõi.</div>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Người bạn đang theo dõi</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {followings && followings.map((following) => (
          <Col key={following.id}>
            <UserCard user={following} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Following;
