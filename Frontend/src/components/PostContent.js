import { useState } from "react";
import { Form, Button, Card, Image, Modal } from "react-bootstrap";
import { authApis, endpoints } from "../configs/Apis";
import { useNavigate } from "react-router-dom";
import MySpinner from "./layout/MySpinner";

const PostContent = ({ post, user, reload }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImage, setEditedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;
    try {
      setLoading(true);
      const formData = new FormData();
      if (editedContent) {
        formData.append("content", editedContent);
      }
      if (editedImage) {
        formData.append("image", editedImage);
      }
      await authApis().put(endpoints["edit-post-detail"](post.id), formData);
      setShowEditModal(false);
      reload();
    } catch (err) {
      console.error("Edit post failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn chắc chắn muốn xoá bài viết?")) return;
    try {
      await authApis().delete(endpoints["post-detail"](post.id));
      nav("/home");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Image
            src={post.authorAvatar}
            roundedCircle
            width={40}
            height={40}
            className="me-2"
            style={{ objectFit: "cover" }}
          />
          <strong>{post.authorFullname}</strong>
        </div>

        {user.id === post.authorId && (
          <div>
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={handleEdit}
            >
              Sửa
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleDelete}>
              Xoá
            </Button>
          </div>
        )}

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa bài viết</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <MySpinner />
            ) : (
              <Form>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ảnh</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditedImage(e.target.files[0])}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Header>

      <Card.Body>
        <Card.Text>{post.content}</Card.Text>

        {post.image && (
          <div className="text-center mb-3">
            <img src={post.image} alt="Post" className="img-fluid" />
          </div>
        )}

        {post.surveyOptions && post.surveyOptions.length > 0 && (
          <div className="mt-3">
            <strong>Khảo sát:</strong>
            <ul>
              {post.surveyOptions.map((option, index) => (
                <div key={option.id}>
                  <p>
                    {option.text} ({option.voteCount} bình chọn)
                  </p>
                </div>
              ))}
            </ul>
          </div>
        )}

        <div className="text-muted">
          <small>Ngày đăng: {post.createdAt}</small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostContent;
