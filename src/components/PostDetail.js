import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import MySpinner from "./layout/MySpinner";
import { getPostDetail } from "../configs/LoadData";
import { MyUserContext } from "../configs/Contexts";
import PostContent from "./PostContent";
import PostComment from "./PostComment";
import { useQuery } from "@tanstack/react-query";

const PostDetail = () => {
  const { postId } = useParams();
  const [user] = useContext(MyUserContext);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostDetail(postId),
  });

  if (isLoading) return <MySpinner />;
  if (isError || !data) return <div className="text-center mt-5">Bài viết không tồn tại hoặc đã bị xóa.</div>;

  const { post, comments } = data;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <PostContent post={post} user={user} reload={refetch} />
        </Col>
        <Col md={4}>
          <PostComment
            postId={postId}
            comments={comments}
            currentUserId={user.id}
            postAuthorId={post.authorId}
            isLocked={post.isLocked}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail;