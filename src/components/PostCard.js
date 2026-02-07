import { Card, Button, Row, Col, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { REACTIONS, addReaction } from "../configs/LoadData";
import PostHeader from "./layout/PostHeader";
import PostMiddle from "./layout/PostMiddle";
import ReactionButton from "./layout/ReactionButton";

const PostCard = ({ post, totalReacts }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(post.userReaction);
  const [reactionCount, setReactionCount] = useState(totalReacts);

  const handleReaction = async (reactionType) => {
    if (selectedReaction === reactionType) {
      setSelectedReaction(null);
      await addReaction("NONE", post.id);
      setReactionCount((prev) => prev - 1);
    } else {
      if (!selectedReaction) {
        setReactionCount((prev) => prev + 1);
      }
      setSelectedReaction(reactionType);
      await addReaction(reactionType, post.id);
    }
    setShowReactions(false);
  };

  const toggleReactions = () => {
    setShowReactions(!showReactions);
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <PostHeader
          authorId={post.authorId}
          avatar={post.authorAvatar}
          name={post.authorFullname}
          time={post.createdAt}
        />

        <PostMiddle
          id={post.id}
          content={post.content}
          image={post.image}
          video={post.video}
          medias={post.medias}
        />
        <Row className="mt-3 pt-2 border-top text-muted small align-items-center">
          <Col>
            <span>❤️ {reactionCount}</span>
          </Col>
          <Col className="text-end">
            <Stack
              direction="horizontal"
              gap={2}
              className="justify-content-end"
            >
              <div className="position-relative">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={toggleReactions}
                >
                  {selectedReaction
                    ? REACTIONS.find((r) => r.type === selectedReaction)?.icon
                    : "Thích"}
                </Button>

                {showReactions && (
                  <ReactionButton onSelect={handleReaction} />
                )}
              </div>

              <Link to={`/post/${post.id}`} className="text-decoration-none">
                <Button variant="outline-secondary" size="sm">
                  Bình luận
                </Button>
              </Link>
            </Stack>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PostCard;
