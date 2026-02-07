import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PostMediaGrid from "./PostMediaGrid";

export default function PostMiddle({ id, content, image, video, medias }) {
  const nav = useNavigate();

  const handleMediaClick = () => {
    nav(`/post/${id}`);
  };

  return (
    <div className="post-middle">
      <Link to={`/post/${id}`} className="text-decoration-none text-dark">
        <Card.Text>{content}</Card.Text>
      </Link>

      <PostMediaGrid medias={medias} fallbackImage={image} fallbackVideo={video} onMediaClick={handleMediaClick} />
    </div>
  );
}
