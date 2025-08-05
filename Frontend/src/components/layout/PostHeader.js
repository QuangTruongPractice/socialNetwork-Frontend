import { Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

export default function PostHeader({ authorId, avatar, name, time }) {
  return (
    <Link to={`/user-profile/${authorId}`} className="text-decoration-none text-dark">
      <Stack direction="horizontal" gap={2} className="mb-2 align-items-center">
        <Avatar src={avatar} size={50} className="me-2" />
        <div>
          <div className="fw-bold">{name}</div>
          <small className="text-muted">{time}</small>
        </div>
      </Stack>
    </Link>
  );
}