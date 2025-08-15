import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import MySpinner from "./layout/MySpinner";
import { getPostDetail } from "../configs/LoadData";
import { MyUserContext } from "../configs/Contexts";
import PostContent from "./PostContent";
import PostComment from "./PostComment";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useContext(MyUserContext);

  const loadPostDetail = async () => {
    try {
      const res = await getPostDetail(postId);
      setPost(res.post);
      setComments(res.comments);
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostDetail();
  }, [postId]);

  if (loading || !post) return <MySpinner />;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <PostContent post={post} user={user} reload={loadPostDetail} />
        </Col>
        <Col md={4}>
          <PostComment
            postId={postId}
            comments={comments}
            setComments={setComments}
            currentUserId={user.id}
            postAuthorId={post.authorId}
            isLocked={post.isLocked}
            setIsLocked={(locked) => setPost(prev => ({ ...prev, isLocked: locked }))}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail;