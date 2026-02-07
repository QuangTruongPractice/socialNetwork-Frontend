import { useState } from "react";
import { Form, Button, Card, Modal } from "react-bootstrap";
import { authApis, endpoints } from "../configs/Apis";
import { useNavigate } from "react-router-dom";
import MySpinner from "./layout/MySpinner";
import Avatar from "./layout/Avatar";
import PostMediaGrid from "./layout/PostMediaGrid";
import UploadImage from "./layout/UploadImage";

const PostContent = ({ post, user, reload }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedFiles, setEditedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleEdit = () => {
    setShowEditModal(true);
    setEditedContent(post.content);
    setEditedFiles([]);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", editedContent);
      if (editedFiles.length > 0) {
        editedFiles.forEach(item => {
          formData.append("image", item.file);
        });
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
          <Avatar src={post.authorAvatar} size={40} />
          <strong className="ms-2">{post.authorFullname}</strong>
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

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa bài viết</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <MySpinner />
            ) : (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nội dung</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <UploadImage files={editedFiles} setFiles={setEditedFiles} />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSaveEdit} disabled={loading}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Header>

      <Card.Body>
        <Card.Text>{post.content}</Card.Text>

        <PostMediaGrid medias={post.medias} fallbackImage={post.image} fallbackVideo={post.video} />

        {post.surveyOptions && post.surveyOptions.length > 0 && (
          <div className="mt-3 p-3 bg-light rounded border">
            <strong className="d-block mb-2">Khảo sát:</strong>
            <ul className="list-unstyled">
              {post.surveyOptions.map((option) => (
                <li key={option.id} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span>{option.text}</span>
                    <span className="text-primary">{option.voteCount} bình chọn</span>
                  </div>
                  <div className="progress mt-1" style={{ height: "10px" }}>
                    <div className="progress-bar" style={{ width: `${Math.min(100, option.voteCount * 10)}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-muted mt-3 pt-3 border-top">
          <small>Ngày đăng: {post.createdAt}</small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostContent;
