import { useState } from "react";
import {
  Card,
  ProgressBar,
  Button,
  Form,
  Stack,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { authApis, endpoints } from "../configs/Apis";
import { REACTIONS, addReaction } from "../configs/LoadData";
import PostHeader from "./layout/PostHeader";
import PostMiddle from "./layout/PostMiddle";
import ReactionButton from "./layout/ReactionButton";

const SurveyCard = ({ post, totalReacts }) => {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [voted, setVoted] = useState(false);
  const [surveyOptions, setSurveyOptions] = useState(post.surveyOptions);

  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(post.userReaction);
  const [reactionCount, setReactionCount] = useState(totalReacts);

  const handleVote = async () => {
    if (!selectedOptionId) return;
    try {
      await authApis().post(endpoints["vote"], {
        optionId: selectedOptionId,
      });

      const updatedOptions = surveyOptions.map((opt) => {
        if (opt.id === selectedOptionId) {
          return {
            ...opt,
            voteCount: opt.voteCount + 1,
          };
        }
        return opt;
      });
      setSurveyOptions(updatedOptions);
      setVoted(true);
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

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

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <PostHeader
          authorId={post.authorId}
          avatar={post.authorAvatar}
          name={post.authorFullname}
          time={post.createdAt}
        />

        <PostMiddle id={post.id} content={post.content} image={post.image} />

        <Form>
          {surveyOptions.map((opt) => { 
            const newTotalVotes = surveyOptions.reduce( (sum, o) => sum + o.voteCount, 0 ); //tính tổng vote
            const percent = newTotalVotes === 0 ? 0 : Math.round((opt.voteCount / newTotalVotes) * 100); //tính %

            return (
              <div key={opt.id} className="mb-3">
                <Stack
                  direction="horizontal"
                  gap={2}
                  className="justify-content-between align-items-center"
                >
                  <Form.Check
                    type="radio"
                    name={`vote-${post.id}`}
                    label={opt.text}
                    value={opt.id}
                    checked={selectedOptionId === opt.id}
                    disabled={voted}
                    onChange={() => setSelectedOptionId(opt.id)}
                  />
                  <small className="text-muted">{percent}%</small>
                </Stack>
                <ProgressBar now={percent} variant="info" />
              </div>
            );
          })}

          {!voted ? (
            <Button
              variant="primary"
              size="sm"
              disabled={!selectedOptionId}
              onClick={handleVote}
            >
              Bình chọn
            </Button>
          ) : (
            <div className="text-success fw-bold">Bạn đã bình chọn</div>
          )}
        </Form>

        <small className="text-muted">
          Kết quả hiện tại (
          {surveyOptions.reduce((sum, o) => sum + o.voteCount, 0)} phiếu)
        </small>

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
                  onClick={() => setShowReactions((prev) => !prev)}
                >
                  {selectedReaction
                    ? REACTIONS.find((r) => r.type === selectedReaction)?.icon
                    : "Thích"}
                </Button>

                {showReactions && (
                  <ReactionButton onSelect={handleReaction} />
                )}
              </div>

              <Link
                to={`/post/${post.id}`}
                className="text-decoration-none text-dark"
              >
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

export default SurveyCard;
