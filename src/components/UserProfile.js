import { useEffect, useState } from "react";
import Profile from "../components/Profile";
import PostCard from "../components/PostCard";
import SurveyCard from "../components/SurveyCard";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { userProfile } from "../configs/LoadData";

const UserProfile = () => {
  const [data, setData] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await userProfile(userId);
        setData(res);
        setRole(res.role);
      } catch (err) {
        console.error("Lỗi khi tải hồ sơ:", err);
        console.error("Chi tiết lỗi:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải hồ sơ...</p>
      </div>
    );
  }

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
