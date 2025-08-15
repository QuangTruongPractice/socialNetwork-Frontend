import { useState } from "react";
import { Form, Button, Card, Alert, Modal } from "react-bootstrap";
import { authApis, endpoints } from "../configs/Apis";
import MySpinner from "./layout/MySpinner";
import Avatar from "./layout/Avatar";

const PostComment = ({
  postId,
  comments,
  setComments,
  currentUserId,
  postAuthorId,
  isLocked,
  setIsLocked,
}) => {
  const [newComment, setNewComment] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setMsg("Bình luận không được để trống.");
      return;
    }
    try {
      setLoading(true);
      const res = await authApis().post(endpoints["post-comments"](postId), {
        content: newComment,
      });
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
      setMsg(null);
    } catch (err) {
      setMsg("Đăng bình luận thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comment) => {
    setEditComment(comment);
    setEditContent(comment.content);
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) {
      setMsg("Nội dung sửa không được để trống.");
      return;
    }
    try {
      await authApis().put(
        endpoints["post-comments-detail"](postId, editComment.id),
        { content: editContent }
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === editComment.id
            ? { ...c, content: editContent, updatedDate: new Date() }
            : c
        )
      );
      setEditComment(null);
      setEditContent("");
      setMsg(null);
    } catch (err) {
      setMsg("Cập nhật bình luận thất bại.");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;
    try {
      await authApis().delete(
        endpoints["comment-detail"](commentId)
      );
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setMsg("Xóa bình luận thất bại.");
    }
  };

  const handleLockComments = async () => {
    try {
      const formData = new FormData();
      formData.append("isLocked", !isLocked);
      await authApis().put(endpoints["edit-post-detail"](postId), formData);
      setIsLocked(!isLocked);
    } catch (err) {
      setMsg("Lỗi khi thay đổi trạng thái khóa bình luận.");
    }
  };

  const isPostOwner = currentUserId === postAuthorId;

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Bình luận</h5>
          {isPostOwner && (
            <Button
              variant={isLocked ? "success" : "warning"}
              size="sm"
              onClick={handleLockComments}
            >
              {isLocked ? "Mở khóa" : "Khóa bình luận"}
            </Button>
          )}
        </div>

        {msg && <Alert variant="danger">{msg}</Alert>}

        {isLocked ? (
          <Alert variant="info" className="text-center">
            Bài viết đã khóa bình luận
          </Alert>
        ) : (
          <>
            <Form onSubmit={handleCommentSubmit} className="mb-3">
              <Form.Group className="mb-2">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Viết bình luận..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Form.Group>
              <Button type="submit" variant="primary" size="sm" disabled={loading}>
                {loading ? <MySpinner /> : "Gửi"}
              </Button>
            </Form>

            <div style={{ maxHeight: "600px" }}>
              {comments.map((cmt) => {
                const canEdit = currentUserId === cmt.userId;
                const canDelete = canEdit || isPostOwner;

                return (
                  <div key={cmt.id} className="d-flex mb-3">
                    <Avatar src={cmt.avatar} size={50} className="me-2" />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <strong>{cmt.fullname}</strong>
                        {canDelete && (
                          <div className="position-relative">
                            <Button
                              variant="link"
                              className="text-dark p-0"
                              onClick={() =>
                                setShowMenuId(showMenuId === cmt.id ? null : cmt.id)
                              }
                            >
                              &#8942;
                            </Button>
                            {showMenuId === cmt.id && (
                              <div
                                className="position-absolute bg-white border rounded shadow-sm py-1"
                                style={{ right: 0, top: "100%", zIndex: 10, minWidth: "80px" }}
                              >
                                {canEdit && (
                                  <Button
                                    variant="link"
                                    className="dropdown-item text-start p-2"
                                    onClick={() => handleEdit(cmt)}
                                  >
                                    Sửa
                                  </Button>
                                )}
                                <Button
                                  variant="link"
                                  className="dropdown-item text-danger text-start p-2"
                                  onClick={() => handleDelete(cmt.id)}
                                >
                                  Xóa
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="mb-1">{cmt.content}</p>
                      <small className="text-muted">
                        {new Date(cmt.createdDate).toLocaleString()}
                        {cmt.updatedDate && " (Đã chỉnh sửa)"}
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card.Body>

      <Modal show={!!editComment} onHide={() => setEditComment(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa bình luận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditComment(null)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default PostComment;