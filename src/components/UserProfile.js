import { useQuery } from "@tanstack/react-query";
import Profile from "../components/Profile";
import PostCard from "../components/PostCard";
import SurveyCard from "../components/SurveyCard";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { userProfile } from "../configs/LoadData";

const UserProfile = () => {
  const { userId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => userProfile(userId),
  });

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-5 alert alert-danger">Lỗi khi tải hồ sơ: {error.message}</div>;
  }

  const role = data?.role;



  return (
    <Container className="mt-4">
      <Profile profile={data.profile} role={role} user={data.user} />

      <Row className="mt-3">
        {!data?.posts || data.posts.length === 0 ? (
          <p className="text-muted">Bạn chưa có bài viết nào.</p>
        ) : (
          data.posts.map((p) => (
            <Col md={6} className="mb-4" key={p.id}>
              {p.surveyOptions && p.surveyOptions.length > 0 ? (
                <SurveyCard post={p} totalReacts={p.totalReacts} />
              ) : (
                <PostCard post={p} totalReacts={p.totalReacts} />
              )}
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default UserProfile;
