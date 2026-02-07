import { useEffect, useState } from "react";
import Profile from "../components/Profile";
import PostCard from "../components/PostCard";
import SurveyCard from "../components/SurveyCard";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { checkProfile } from "../configs/LoadData";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [data, setData] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const loadData = async () => {
    try {
      const res = await checkProfile();
      setData(res);
      setRole(res.role);
    } catch (err) {
      console.error("Lỗi khi tải hồ sơ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

      <Button className="mt-4 me-3" variant="warning" onClick={() => nav("/edit-profile")}>
        Chỉnh sửa
      </Button>
      <Button className="mt-4 me-3" variant="warning" onClick={() => nav("/change-password")}>
        Đổi mật khẩu
      </Button>

      <h3 className="mt-3">Bài viết của bạn</h3>
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

export default MyProfile;
